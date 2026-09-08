import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";
const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: push }),
  useParams: () => ({ id: "r1" }),
  usePathname: () => "/rounds",
}));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoundResultPage from "@/app/(app)/rounds/[id]/page";
import RoundsPage from "@/app/(app)/rounds/page";

function wrap(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const separated = {
  id: "r1", lever: "text_overlay", verdict: "separated", is_exploratory: false,
  scorer_version: "scorer-v1", video_ids: Array(34).fill("v"), created_at: "2026-09-08T00:00:00Z",
  entries: [
    { lever_value: "question_form", n: 18, median_multiple: 1.9, is_winner: true, mean_share_rate: null, mean_engage_rate: null },
    { lever_value: "statement_form", n: 16, median_multiple: 0.8, is_winner: false, mean_share_rate: null, mean_engage_rate: null },
  ],
};

test("separated verdict names the winner and routes to hook lab with the value", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(separated), { status: 200 })));
  wrap(<RoundResultPage />);
  expect(await screen.findByText("SEPARATED")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /set as default/i }))
    .toHaveAttribute("href", "/hook-lab?value=question_form");
});

test("inconclusive is a first-class verdict with a forward action", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
    ...separated, verdict: "inconclusive",
    entries: separated.entries.map((e) => ({ ...e, is_winner: false })),
  }), { status: 200 })));
  wrap(<RoundResultPage />);
  expect(await screen.findByText("INCONCLUSIVE")).toBeInTheDocument();
  expect(screen.getByText(/This spread is what noise looks like/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /open hook lab/i })).toHaveAttribute("href", "/hook-lab");
});

test("empty entries show 'not enough tagged videos' message", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
    ...separated, verdict: "inconclusive", entries: []
  }), { status: 200 })));
  wrap(<RoundResultPage />);
  expect(await screen.findByText("Not enough tagged videos yet to compare.")).toBeInTheDocument();
});

test("date_to is inclusive (23:59:59.999Z)", async () => {
  const user = userEvent.setup();
  let capturedBody: any = null;
  const fetchMock = vi.fn(async (url: string, options?: any) => {
    if (url.includes("/api/v1/rounds") && options?.method === "POST") {
      capturedBody = JSON.parse(options.body);
      return new Response(JSON.stringify({ id: "r-new" }), { status: 200 });
    }
    return new Response(JSON.stringify([]), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);

  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={qc}>
      <RoundsPage />
    </QueryClientProvider>
  );

  const dateFromInput = screen.getByLabelText("Date from") as HTMLInputElement;
  const dateToInput = screen.getByLabelText("Date to") as HTMLInputElement;
  await user.type(dateFromInput, "2026-09-01");
  await user.type(dateToInput, "2026-09-07");

  const runBtn = screen.getByRole("button", { name: /run round/i });
  await user.click(runBtn);

  expect(capturedBody.date_from).toBe("2026-09-01T00:00:00.000Z");
  expect(capturedBody.date_to).toMatch(/23:59:59\.999Z$/);
});
