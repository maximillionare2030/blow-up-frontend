import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// next/font requires the Next.js SWC transform, which vitest doesn't run.
vi.mock("next/font/google", () => ({
  Plus_Jakarta_Sans: () => ({ variable: "--font-jakarta", className: "font-jakarta" }),
  Inter: () => ({ variable: "--font-inter", className: "font-inter" }),
  JetBrains_Mono: () => ({ variable: "--font-jetbrains-mono", className: "font-jetbrains-mono" }),
}));
