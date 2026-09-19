"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { contactTopics, type ContactTopic, type ContactState } from "@/lib/contact";
import { submitContact } from "./actions";

const initialState: ContactState = { status: "idle", message: "" };
const control = "mt-1 block w-full rounded-[6px] border border-hairline bg-white px-3 py-2 text-[13px] focus:outline-2 focus:outline-ink";

export function ContactForm({ topic, submissionId }: { topic: ContactTopic; submissionId: string }) {
  const [state, action, pending] = useActionState(submitContact, initialState);
  const [values, setValues] = useState({ name: "", email: "", topic, message: "" });
  if (state.status === "success") return <p role="status" className="mt-8 text-[13px]">{state.message}</p>;

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="submissionId" value={submissionId} />
      <div hidden aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <fieldset disabled={pending} className="space-y-5 disabled:opacity-60">
        <label className="block text-[13px] font-medium">Name
          <input className={control} name="name" autoComplete="name" required maxLength={100} value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
        </label>
        <label className="block text-[13px] font-medium">Email
          <input className={control} name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        </label>
        <label className="block text-[13px] font-medium">Request type
          <select className={control} name="topic" value={values.topic} onChange={(e) => setValues({ ...values, topic: e.target.value as ContactTopic })}>
            {Object.entries(contactTopics).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="block text-[13px] font-medium">Message
          <textarea className={control} name="message" required maxLength={5000} rows={7} value={values.message} onChange={(e) => setValues({ ...values, message: e.target.value })} aria-describedby="contact-help" />
        </label>
        <p id="contact-help" className="text-[13px] text-neutral">For account deletion, use your account email. We may need to verify ownership before acting. Please don’t include passwords or access tokens.</p>
        <p className="text-[13px] text-neutral">We use these details to respond to your request. See our <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
        <Button type="submit" disabled={pending}>{pending ? "Sending…" : "Send request"}</Button>
      </fieldset>
      {state.status === "error" && <p role="alert" className="text-[13px]">{state.message}</p>}
    </form>
  );
}
