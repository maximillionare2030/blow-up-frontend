import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: push }),
  useParams: () => ({ id: "v1" }),
  usePathname: () => "/library",
}));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VideoDetailPage from "@/app/(app)/videos/[id]/page";

function wrap(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const detail = {
  id: "v1", provenance: "ingested", caption: "old video", handle: "@one",
  post_state: "live", published_at: "2026-06-01T00:00:00Z", views: 2400,
  baseline_multiple: 0.9, lever_tags: {}, failure_reason: null, failure_action: null,
  snapshots: [{ captured_at: "2026-06-01T00:00:00Z", views: 2400, likes: 100, comments: 10, shares: 20 }],
  siblings: [], notes: [],
};

test("ingested video shows the no-locked-levers block, not tag chips", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(detail), { status: 200 })));
  wrap(<VideoDetailPage />);
  expect(await screen.findByText(/No locked levers/)).toBeInTheDocument();
  expect(screen.getByText("Ingested")).toBeInTheDocument();
});

test("metrics derive from the latest snapshot", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(detail), { status: 200 })));
  wrap(<VideoDetailPage />);
  expect(await screen.findByText("2,400")).toBeInTheDocument();
  expect(screen.getByText("0.8%")).toBeInTheDocument();  // shares 20 / views 2400
  expect(screen.getByText("5.4%")).toBeInTheDocument();  // (100+10+20)/2400
});
