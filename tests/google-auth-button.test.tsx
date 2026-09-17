import { render, screen } from "@testing-library/react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

test("renders an anchor to the backend google start endpoint", () => {
  render(<GoogleAuthButton label="Continue with Google" />);
  const link = screen.getByRole("link", { name: "Continue with Google" });
  expect(link).toHaveAttribute("href", "/api/v1/auth/google/start");
});
