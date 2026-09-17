import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, replace: push }) }));
import SignupPage from "@/app/(auth)/signup/page";
import LoginPage from "@/app/(auth)/login/page";

test("signup posts credentials and routes to /connect", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ id: "u1" }), { status: 200 })));
  render(<SignupPage />);
  await userEvent.type(screen.getByLabelText(/email/i), "max@x.com");
  await userEvent.type(screen.getByLabelText(/password/i), "hunter22");
  await userEvent.click(screen.getByRole("button", { name: /create account/i }));
  await waitFor(() => expect(push).toHaveBeenCalledWith("/connect"));
});

test("login failure shows the exact S17 error copy and clears password", async () => {
  vi.stubGlobal("fetch", vi.fn(async () =>
    new Response(JSON.stringify({ detail: "Email or password is incorrect." }), { status: 401 })));
  render(<LoginPage />);
  await userEvent.type(screen.getByLabelText(/email/i), "max@x.com");
  await userEvent.type(screen.getByLabelText(/password/i), "wrong");
  await userEvent.click(screen.getByRole("button", { name: /log in/i }));
  expect(await screen.findByText("Email or password is incorrect.")).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toHaveValue("");
});

test("login page offers Continue with Google linking to the OAuth start endpoint", () => {
  render(<LoginPage />);
  const link = screen.getByRole("link", { name: /continue with google/i });
  expect(link).toHaveAttribute("href", "/api/v1/auth/google/start");
});

test("signup page offers Continue with Google linking to the OAuth start endpoint", () => {
  render(<SignupPage />);
  const link = screen.getByRole("link", { name: /continue with google/i });
  expect(link).toHaveAttribute("href", "/api/v1/auth/google/start");
});
