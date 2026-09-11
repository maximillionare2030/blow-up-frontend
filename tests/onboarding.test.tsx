import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, replace: push }) }));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConnectPage from "@/app/(onboarding)/connect/page";

function wrap(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => vi.stubEnv("NEXT_PUBLIC_DEV_CONNECT", "1"));
afterEach(() => vi.unstubAllEnvs());

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
  await userEvent.click(screen.getByRole("button", { name: /connect \(dev\)/i }));
  await waitFor(() => expect(screen.getByRole("button", { name: /continue/i })).toBeEnabled());
});

test("connect page shows the no-account-provisioning footnote", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })));
  wrap(<ConnectPage />);
  expect(await screen.findByText(/never creates or supplies accounts/i)).toBeInTheDocument();
});

test("connect error is displayed when connect-dev returns 500", async () => {
  vi.stubGlobal("fetch", vi.fn(async (url: any) => {
    if (String(url).includes("connect-dev")) {
      return new Response(JSON.stringify({ detail: "boom" }), { status: 500 });
    }
    return new Response(JSON.stringify([]), { status: 200 });
  }));
  wrap(<ConnectPage />);
  await userEvent.type(screen.getByPlaceholderText(/@handle/i), "@test");
  await userEvent.click(screen.getByRole("button", { name: /connect \(dev\)/i }));
  expect(await screen.findByText("boom")).toBeInTheDocument();
});
