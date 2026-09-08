import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, replace: push }) }));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PublishReviewPage from "@/app/(app)/publish-review/page";

const draft = {
  source_asset_id: "as1", lever: "text_overlay",
  variants: [
    { value: "q1", account_id: "a1", caption: "one?", scheduled_at: null },
    { value: "q2", account_id: "a1", caption: "two?", scheduled_at: null },
  ],
};

function wrap(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => sessionStorage.setItem("blowup-draft", JSON.stringify(draft)));

test("publish stays disabled until every cell is confirmed", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })));
  wrap(<PublishReviewPage />);
  const publish = await screen.findByRole("button", { name: /publish 2 posts/i });
  expect(publish).toBeDisabled();
  for (const cb of screen.getAllByRole("checkbox")) await userEvent.click(cb);
  expect(publish).toBeEnabled();
});

test("publishing posts the draft and routes to the dashboard", async () => {
  const calls: any[] = [];
  vi.stubGlobal("fetch", vi.fn(async (url: any, init?: any) => {
    calls.push([String(url), init]);
    return new Response(JSON.stringify({ posts: [] }), { status: 200 });
  }));
  wrap(<PublishReviewPage />);
  for (const cb of await screen.findAllByRole("checkbox")) await userEvent.click(cb);
  await userEvent.click(screen.getByRole("button", { name: /publish 2 posts/i }));
  await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
  const publishCall = calls.find(([u]) => u.includes("/rounds/publish"));
  expect(JSON.parse(publishCall[1].body).variants).toHaveLength(2);
});
