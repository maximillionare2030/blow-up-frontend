import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ConnectPage from "@/app/(onboarding)/connect/page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}><ConnectPage /></QueryClientProvider>
  );
}

afterEach(() => vi.unstubAllEnvs());

describe("S01 connect via OAuth", () => {
  it("primary action links to the TikTok OAuth start route", () => {
    renderPage();
    const link = screen.getByRole("link", { name: /connect tiktok account/i });
    expect(link).toHaveAttribute("href", "/api/v1/accounts/connect/start");
  });
  it("dev handle form is hidden without NEXT_PUBLIC_DEV_CONNECT", () => {
    renderPage();
    expect(screen.queryByPlaceholderText("@handle")).toBeNull();
  });
});
