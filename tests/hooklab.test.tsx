import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: push }),
  useSearchParams: () => new URLSearchParams("value=question_form"),
}));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HookLabPage from "@/app/(app)/hook-lab/page";

function wrap(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

test("continuity line shows when arriving with a winning value", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })));
  wrap(<HookLabPage />);
  expect(await screen.findByText(/is your default — it won your last round/)).toBeInTheDocument();
});

test("no tag input affordance exists anywhere", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })));
  const { container } = wrap(<HookLabPage />);
  // tag chips are display-only: no input may carry a name/aria-label mentioning tag/lever
  expect(container.querySelector('input[name*="tag" i], input[aria-label*="tag" i], input[aria-label*="lever" i]')).toBeNull();
  expect(screen.queryByText(/add tag/i)).toBeNull();
});

test("the AI button is disabled until the Analyzer exists", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })));
  wrap(<HookLabPage />);
  expect(await screen.findByRole("button", { name: /generate more with ai/i })).toBeDisabled();
});

test("failed upload surfaces an error and returns to the picker", async () => {
  const fetchMock = vi.fn(async (url: string) => {
    if (url.includes("/uploads/presign")) {
      return new Response(JSON.stringify({ detail: "nope" }), { status: 500 });
    }
    return new Response(JSON.stringify([]), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);
  const { container } = wrap(<HookLabPage />);

  const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(fileInput, {
    target: { files: [new File(["x"], "a.mp4", { type: "video/mp4" })] },
  });

  expect(await screen.findByText(/nope|Upload failed/)).toBeInTheDocument();
  expect(screen.getByText("Drop a video or click to pick")).toBeInTheDocument();
});
