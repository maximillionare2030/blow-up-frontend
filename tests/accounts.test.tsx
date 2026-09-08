import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, replace: push }) }));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AccountsPage from "@/app/(app)/accounts/page";

function wrap(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

test("accounts page renders connected and revoked accounts with correct states and footnote", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([
    { id: "a1", handle: "@demoone", connection_state: "connected", baseline_median_views: 5000, baseline_n: 10, videos_tracked: 15 },
    { id: "a2", handle: "@demotwo", connection_state: "revoked", baseline_median_views: 3000, baseline_n: 8, videos_tracked: 12 },
  ]), { status: 200 })));
  wrap(<AccountsPage />);
  expect(await screen.findByText("@demoone")).toBeInTheDocument();
  expect(await screen.findByText("@demotwo")).toBeInTheDocument();
  expect(await screen.findByText("Revoked")).toBeInTheDocument();
  expect(screen.getByText(/never creates or supplies accounts/i)).toBeInTheDocument();
});
