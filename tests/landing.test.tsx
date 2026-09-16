import { render, screen } from "@testing-library/react";
import MarketingLayout from "@/app/(marketing)/layout";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

describe("marketing layout", () => {
  it("wraps children and applies the display font scope", () => {
    render(<MarketingLayout><p>content</p></MarketingLayout>);
    const child = screen.getByText("content");
    expect(child.closest("div")?.className).toMatch(/font-display/);
  });
});

describe("marketing header", () => {
  it("links Sign In to /login and Deploy Fleet to /signup", () => {
    render(<MarketingHeader />);
    expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Deploy Fleet" })).toHaveAttribute("href", "/signup");
  });
  it("has anchor nav for Features, Hook Telemetry, Pricing", () => {
    render(<MarketingHeader />);
    expect(screen.getByRole("link", { name: "Features" })).toHaveAttribute("href", "#features");
    expect(screen.getByRole("link", { name: "Hook Telemetry" })).toHaveAttribute("href", "#telemetry");
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "#pricing");
  });
});

describe("marketing footer", () => {
  it("links Privacy and Terms", () => {
    render(<MarketingFooter />);
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });
});
