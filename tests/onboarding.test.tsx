import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, replace: push }) }));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConnectPage from "@/app/(onboarding)/connect/page";

function wrap(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

test("continue is disabled with zero accounts and enables after connect", async () => {
  let accounts: any[] = [];
  vi.stubGlobal("fetch", vi.fn(async (url: any, init?: any) => {
    if (String(url).includes("connect-dev")) {
      accounts = [{ id: "a1", handle: "@one", connection_state: "connected", videos_tracked: 0 }];
      return new Response(JSON.stringify(accounts[0]), { status: 200 });
    }
    return new Response(JSON.stringify(accounts), { status: 200 });
  }));
  wrap(<ConnectPage />);
  expect(await screen.findByRole("button", { name: /continue/i })).toBeDisabled();
  await userEvent.type(screen.getByPlaceholderText(/@handle/i), "@one");
  await userEvent.click(screen.getByRole("button", { name: /connect tiktok account/i }));
  await waitFor(() => expect(screen.getByRole("button", { name: /continue/i })).toBeEnabled());
});

test("connect page shows the no-account-provisioning footnote", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })));
  wrap(<ConnectPage />);
  expect(await screen.findByText(/never creates or supplies accounts/i)).toBeInTheDocument();
});
