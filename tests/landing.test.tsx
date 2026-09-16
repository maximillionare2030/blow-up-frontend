import { render, screen } from "@testing-library/react";
import MarketingLayout from "@/app/(marketing)/layout";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Hero } from "@/components/marketing/Hero";
import { Pillars } from "@/components/marketing/Pillars";
import { Inspector } from "@/components/marketing/Inspector";
import { ProofRibbon } from "@/components/marketing/ProofRibbon";
import { Pricing } from "@/components/marketing/Pricing";
import { CtaBanner } from "@/components/marketing/CtaBanner";

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

describe("pillars", () => {
  it("renders three pillar cards under #features", () => {
    const { container } = render(<Pillars />);
    expect(container.querySelector("#features")).toBeTruthy();
    expect(screen.getByText("Surgical 0–2s Hook Diagnostics")).toBeInTheDocument();
    expect(screen.getByText("Fleet Ingestion & Dispatch")).toBeInTheDocument();
    expect(screen.getByText("Empirical Retention Telemetry")).toBeInTheDocument();
    expect(screen.getByText("65.4% Hold")).toBeInTheDocument();
    expect(screen.getByText("79% outlier")).toBeInTheDocument();
  });
});

describe("inspector", () => {
  it("renders phone HUD and three metric readouts without images", () => {
    const { container } = render(<Inspector />);
    expect(container.querySelector("#telemetry")).toBeTruthy();
    expect(screen.getByText("Track every frame, audio cue, and retention drop.")).toBeInTheDocument();
    expect(screen.getByText("91.4%")).toBeInTheDocument();
    expect(screen.getByText("73.8%")).toBeInTheDocument();
    expect(screen.getByText("89.1%")).toBeInTheDocument();
    expect(screen.getByText("4.8x")).toBeInTheDocument();
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });
});

describe("proof ribbon", () => {
  it("renders the three stat pills", () => {
    render(<ProofRibbon />);
    expect(screen.getByText("18,700+")).toBeInTheDocument();
    expect(screen.getByText("99.8%")).toBeInTheDocument();
    expect(screen.getByText("3.4x")).toBeInTheDocument();
  });
});

describe("pricing", () => {
  it("renders both tiers with signup links", () => {
    const { container } = render(<Pricing />);
    expect(container.querySelector("#pricing")).toBeTruthy();
    expect(screen.getByText("$89")).toBeInTheDocument();
    expect(screen.getByText("$240")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Deploy Solo Node" })).toHaveAttribute("href", "/signup");
    expect(screen.getByRole("link", { name: "Deploy Cluster Engine" })).toHaveAttribute("href", "/signup");
  });
});

describe("cta banner", () => {
  it("renders headline and CTA to signup", () => {
    render(<CtaBanner />);
    expect(screen.getByText("High-velocity creators spread. You scale.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Deploy Fleet" })).toHaveAttribute("href", "/signup");
  });
});

describe("marketing footer", () => {
  it("links Privacy and Terms", () => {
    render(<MarketingFooter />);
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });
});
