import { render, screen } from "@testing-library/react";
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
