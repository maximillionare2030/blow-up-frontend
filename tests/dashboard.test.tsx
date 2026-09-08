import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, replace: push }), usePathname: () => "/dashboard" }));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "@/app/(app)/dashboard/page";

function wrap(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

test("empty state reads calm, not broken", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
    items: [], stats: { accounts_connected: 2, videos_published_this_week: 4, videos_above_baseline: 3, rounds_run: 1 },
  }), { status: 200 })));
  wrap(<DashboardPage />);
  expect(await screen.findByText("Nothing needs you.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /open hook lab/i })).toHaveAttribute("href", "/hook-lab");
});

test("failed post item shows reason and verb", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
    items: [{ type: "failed_post", severity: "red", message: "File rejected: video under 3 seconds.",
              action: "reupload", post_id: "p1", video_id: "v1" }],
    stats: { accounts_connected: 1, videos_published_this_week: 0, videos_above_baseline: 0, rounds_run: 0 },
  }), { status: 200 })));
  wrap(<DashboardPage />);
  expect(await screen.findByText(/File rejected/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /re-upload/i })).toBeInTheDocument();
});

test("retry fires the retry endpoint and refreshes", async () => {
  const fetchMock = vi.fn(async (url: string, opts?: any) => {
    if (opts?.method === "POST" && url.includes("/posts/p1/retry")) {
      return new Response(JSON.stringify({}), { status: 200 });
    }
    return new Response(JSON.stringify({
      items: [{ type: "failed_post", severity: "red", message: "Upload failed.",
                action: "retry", post_id: "p1", video_id: "v1" }],
      stats: { accounts_connected: 1, videos_published_this_week: 0, videos_above_baseline: 0, rounds_run: 0 },
    }), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);
  wrap(<DashboardPage />);
  expect(await screen.findByText(/Upload failed/)).toBeInTheDocument();
  const retryBtn = screen.getByRole("button", { name: /retry/i });
  await userEvent.click(retryBtn);
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining("/posts/p1/retry"),
    expect.objectContaining({ method: "POST" })
  );
});

test("error state offers retry, not a blank page", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 500 })));
  wrap(<DashboardPage />);
  expect(await screen.findByText(/Couldn/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
});
