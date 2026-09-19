import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { submitContact } from "@/app/(marketing)/contact/actions";
import { ContactForm } from "@/app/(marketing)/contact/ContactForm";
import Privacy from "@/app/(marketing)/privacy/page";
import Terms from "@/app/(marketing)/terms/page";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));
const initial = { status: "idle" as const, message: "" };
const id = "12345678-1234-1234-1234-123456789abc";
function form() {
  const data = new FormData();
  Object.entries({ name: "Alex <test>", email: "alex@example.com", topic: "privacy", message: "Please explain <script>alert(1)</script>", submissionId: id }).forEach(([k, v]) => data.set(k, v));
  return data;
}
const save = vi.fn();
const saved = () => Promise.resolve(new Response(JSON.stringify({ id: "inquiry-1" }), { status: 201 }));
beforeEach(() => {
  send.mockReset().mockResolvedValue({ data: { id: "email-1" }, error: null });
  save.mockReset().mockImplementation(saved);
  vi.stubGlobal("fetch", save);
  vi.stubEnv("API_BASE_URL", "http://backend.test");
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("CONTACT_TO_EMAIL", "private@example.com");
  vi.stubEnv("CONTACT_FROM_EMAIL", "BlowUp <contact@example.com>");
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

it("saves the inquiry to the backend before notifying", async () => {
  const data = form();
  data.set("to", "attacker@example.com");
  expect((await submitContact(initial, data)).status).toBe("success");
  const [url, request] = save.mock.calls[0];
  expect(url).toBe("http://backend.test/api/v1/contact");
  expect(request.method).toBe("POST");
  expect(JSON.parse(request.body)).toEqual({ submission_id: id, name: "Alex <test>", email: "alex@example.com", topic: "privacy", message: "Please explain <script>alert(1)</script>" });
  expect(save.mock.invocationCallOrder[0]).toBeLessThan(send.mock.invocationCallOrder[0]);
});

it("notifies only the configured recipient, escapes HTML, and keeps retry keys stable", async () => {
  const data = form();
  data.set("to", "attacker@example.com");
  expect((await submitContact(initial, data)).status).toBe("success");
  const [email, options] = send.mock.calls[0];
  expect(email).toMatchObject({ to: "private@example.com", replyTo: "alex@example.com" });
  expect(email.html).not.toContain("<script>");
  expect(email.html).toContain("&lt;script&gt;");
  await submitContact(initial, data);
  expect(send.mock.calls[1][1]).toEqual(options);
  data.set("message", "A corrected request");
  await submitContact(initial, data);
  expect(send.mock.calls[2][1]).not.toEqual(options);
});

it.each([["email", "bad\r\nBcc: victim@example.com"], ["topic", "toString"], ["message", "x".repeat(5001)], ["name", ""], ["submissionId", "bad"]])("rejects invalid %s without saving or sending", async (key, value) => {
  const data = form(); data.set(key, value);
  expect((await submitContact(initial, data)).status).toBe("error");
  expect(save).not.toHaveBeenCalled();
  expect(send).not.toHaveBeenCalled();
});
it("discards honeypot submissions", async () => {
  const data = form(); data.set("website", "spam");
  expect((await submitContact(initial, data)).status).toBe("success");
  expect(save).not.toHaveBeenCalled();
  expect(send).not.toHaveBeenCalled();
});
it.each([
  ["a server error", () => Promise.resolve(new Response("db password leaked", { status: 500 }))],
  ["an unreachable backend", () => Promise.reject(new Error("connect ECONNREFUSED http://backend.test"))],
])("reports failure and sends nothing after %s", async (_label, outcome) => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  save.mockImplementation(outcome);
  const result = await submitContact(initial, form());
  expect(result.status).toBe("error");
  expect(JSON.stringify(result)).not.toMatch(/leaked|backend\.test/);
  expect(send).not.toHaveBeenCalled();
});
it("asks the sender to come back later when the backend is rate limiting", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  save.mockImplementation(() => Promise.resolve(new Response("{}", { status: 429 })));
  const result = await submitContact(initial, form());
  expect(result).toMatchObject({ status: "error", message: expect.stringContaining("later") });
  expect(send).not.toHaveBeenCalled();
});
it("treats a saved inquiry as received even when the notification fails", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  send.mockRejectedValue(new Error("private@example.com test-key"));
  const result = await submitContact(initial, form());
  expect(result.status).toBe("success");
  expect(JSON.stringify([result, log.mock.calls])).not.toMatch(/private@example|test-key|Please explain/);
  send.mockReset().mockResolvedValue({ data: null, error: { message: "failure" } });
  expect((await submitContact(initial, form())).status).toBe("success");
  vi.stubEnv("RESEND_API_KEY", "");
  send.mockClear();
  expect((await submitContact(initial, form())).status).toBe("success");
  expect(send).not.toHaveBeenCalled();
});
it("preserves inputs after failure and confirms a successful retry", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  save.mockImplementationOnce(() => Promise.resolve(new Response("{}", { status: 503 })));
  const user = userEvent.setup();
  render(<ContactForm topic="deletion" submissionId={id} />);
  expect(screen.getByLabelText("Request type")).toHaveValue("deletion");
  await user.type(screen.getByLabelText("Name"), "Alex");
  await user.type(screen.getByLabelText("Email"), "alex@example.com");
  await user.type(screen.getByLabelText("Message"), "Delete my account");
  await user.click(screen.getByRole("button", { name: "Send request" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("couldn’t send");
  expect(screen.getByLabelText("Message")).toHaveValue("Delete my account");
  await user.click(screen.getByRole("button", { name: "Send request" }));
  expect(await screen.findByRole("status")).toHaveTextContent("has been received");
});
it("replaces legal-page mail links with contextual contact links", () => {
  const { container } = render(<><Terms /><Privacy /></>);
  expect(container.innerHTML).not.toContain("mailto:");
  expect(container.innerHTML).not.toMatch(/[\w.+-]+@[\w-]+\.\w+/);
  expect(container.querySelector('a[href="/contact?topic=deletion"]')).toBeTruthy();
  expect(container.querySelector('a[href="/contact?topic=privacy"]')).toBeTruthy();
});
