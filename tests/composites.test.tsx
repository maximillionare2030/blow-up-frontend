import { render, screen } from "@testing-library/react";
import { VideoRow } from "@/components/video/VideoRow";

const row = {
  id: "v1", provenance: "ingested", caption: "stub video 3 #fyp",
  account_id: "a1", handle: "@one", post_state: "live",
  published_at: "2026-06-04T00:00:00Z", views: 2400, baseline_multiple: 0.9,
  lever_tags: {},
} as any;

test("video row links to the video detail hub and shows provenance", () => {
  render(<VideoRow row={row} />);
  expect(screen.getByRole("link")).toHaveAttribute("href", "/videos/v1");
  expect(screen.getByText("2,400")).toBeInTheDocument(); // mono formatted views
});

test("ingested rows show a grey dash where levers would be", () => {
  render(<VideoRow row={row} />);
  expect(screen.getByText("—")).toBeInTheDocument();
});
