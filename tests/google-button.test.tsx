import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "@/app/(auth)/login/page";
import SignupPage from "@/app/(auth)/signup/page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Continue with Google", () => {
  it("login page links to the OAuth start route", () => {
    render(<LoginPage />);
    const link = screen.getByRole("link", { name: /continue with google/i });
    expect(link).toHaveAttribute("href", "/api/v1/auth/google/start");
  });
  it("signup page links to the OAuth start route", () => {
    render(<SignupPage />);
    const link = screen.getByRole("link", { name: /continue with google/i });
    expect(link).toHaveAttribute("href", "/api/v1/auth/google/start");
  });
});
