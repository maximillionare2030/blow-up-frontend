import { render, screen } from "@testing-library/react";
import MarketingLayout from "@/app/(marketing)/layout";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Hero } from "@/components/marketing/Hero";

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

describe("hero", () => {
  it("renders the headline and CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Turn high-velocity hooks into algorithmic reach.");
    expect(screen.getByRole("link", { name: /Start Free Trial/ })).toHaveAttribute("href", "/signup");
    expect(screen.getByRole("link", { name: /Explore Live Sandbox/ })).toHaveAttribute("href", "#telemetry");
  });
  it("renders six fleet nodes with mono metrics and no images", () => {
    const { container } = render(<Hero />);
    expect(screen.getByText("61% @ 2s")).toBeInTheDocument();
    expect(screen.getByText("1.4M Reach")).toBeInTheDocument();
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });
});

describe("marketing footer", () => {
  it("links Privacy and Terms", () => {
    render(<MarketingFooter />);
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });
});
