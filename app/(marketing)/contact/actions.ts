"use server";

import { createHash } from "node:crypto";
import { Resend } from "resend";
import { contactTopics, isContactTopic, type ContactState, type ContactTopic } from "@/lib/contact";

const success: ContactState = { status: "success", message: "Your request has been received. We’ll reply to the email address you provided." };
const failure: ContactState = { status: "error", message: "We couldn’t send your request. Please try again shortly." };
const busy: ContactState = { status: "error", message: "We’re receiving a lot of requests right now. Please try again later." };

type Inquiry = { submissionId: string; name: string; email: string; topic: ContactTopic; message: string };

// The backend's contact_inquiries table is the record. Called server-to-server,
// so the request never depends on the browser-facing /api rewrite.
async function saveInquiry({ submissionId, ...inquiry }: Inquiry): Promise<ContactState | null> {
  const base = process.env.API_BASE_URL ?? "http://localhost:8000";
  try {
    const response = await fetch(`${base}/api/v1/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission_id: submissionId, ...inquiry }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (response.ok) return null;
    console.error(`Contact inquiry save failed (${response.status})`);
    return response.status === 429 ? busy : failure;
  } catch {
    console.error("Contact inquiry save failed (unreachable)");
    return failure;
  }
}

// Best-effort heads-up to the owner. The inquiry is already stored, so a
// delivery problem is logged and never shown to the sender.
async function notifyOwner({ submissionId, name, email, topic, message }: Inquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("Contact notification skipped: email is not configured");
    return;
  }

  const text = `Name: ${name}\nEmail: ${email}\nRequest: ${contactTopics[topic]}\n\n${message}`;
  const escaped = text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
  // Keep retries of unchanged content identical, but allow edits after a failure.
  const digest = createHash("sha256").update(JSON.stringify([from, to, text])).digest("hex");
  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from, to, replyTo: email,
      subject: `BlowUp contact: ${contactTopics[topic]}`,
      text, html: `<pre style="white-space:pre-wrap;font-family:inherit">${escaped}</pre>`,
    }, { idempotencyKey: `contact/${submissionId}/${digest}` });
    if (error || !data?.id) console.error("Contact notification delivery failed");
  } catch {
    console.error("Contact notification delivery failed");
  }
}

export async function submitContact(_previous: ContactState, form: FormData): Promise<ContactState> {
  const field = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  if (field("website")) return success;

  const name = field("name");
  const email = field("email");
  const topic = field("topic");
  const message = field("message");
  const submissionId = field("submissionId");
  if (!name || name.length > 100 || /[\r\n]/.test(name) ||
      email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
      !isContactTopic(topic) || !message || message.length > 5000 ||
      !/^[a-f0-9-]{36}$/i.test(submissionId)) {
    return { status: "error", message: "Check your name, email, request type, and message. Messages must be 5,000 characters or fewer." };
  }

  const inquiry = { submissionId, name, email, topic, message };
  const saveError = await saveInquiry(inquiry);
  if (saveError) return saveError;
  await notifyOwner(inquiry);
  return success;
}
