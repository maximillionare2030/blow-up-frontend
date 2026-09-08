import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: push }),
  useParams: () => ({ id: "v1" }),
  usePathname: () => "/library",
}));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VideoDetailPage from "@/app/(app)/videos/[id]/page";
import LibraryPage from "@/app/(app)/library/page";

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

function makeRow(id: string) {
  return {
    id, caption: `caption ${id}`, handle: "@one", post_state: "live",
    provenance: "published", lever_tags: {}, views: 100, baseline_multiple: 1.1,
    published_at: "2026-06-01T00:00:00Z",
  };
}

test("library shows server total and offers load-more when truncated", async () => {
  const fetchMock = vi.fn(async (url: string) => {
    if (url.includes("/accounts")) return new Response(JSON.stringify([]), { status: 200 });
    return new Response(JSON.stringify({
      rows: [makeRow("v1"), makeRow("v2"), makeRow("v3")],
      total: 7,
    }), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);
  wrap(<LibraryPage />);
  expect(await screen.findByText(/3 of 7 videos/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /load more/i })).toBeInTheDocument();
});

test("load more fetches the next offset", async () => {
  const fetchMock = vi.fn(async (url: string) => {
    if (url.includes("/accounts")) return new Response(JSON.stringify([]), { status: 200 });
    if (url.includes("offset=200")) {
      return new Response(JSON.stringify({
        rows: [makeRow("v4")],
        total: 7,
      }), { status: 200 });
    }
    return new Response(JSON.stringify({
      rows: [makeRow("v1"), makeRow("v2"), makeRow("v3")],
      total: 7,
    }), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);
  wrap(<LibraryPage />);
  const loadMore = await screen.findByRole("button", { name: /load more/i });
  await userEvent.click(loadMore);
  expect(await screen.findByText(/4 of 7 videos/)).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining("offset=200"),
    expect.anything()
  );
});
