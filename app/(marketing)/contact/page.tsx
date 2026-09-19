import { randomUUID } from "node:crypto";
import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { isContactTopic } from "@/lib/contact";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Contact — BlowUp" };
export const dynamic = "force-dynamic";

export default async function Contact({ searchParams }: { searchParams: Promise<{ topic?: string | string[] }> }) {
  const { topic } = await searchParams;
  const selectedTopic = typeof topic === "string" && isContactTopic(topic) ? topic : "support";
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 font-mono text-[15px] font-bold"><LogoMark size={28} />BlowUp</Link>
        <Link href="/login" className="text-[13px] text-neutral hover:text-ink">Log in</Link>
      </header>
      <h1 className="text-3xl font-semibold tracking-tight">Contact BlowUp</h1>
      <p className="mt-2 text-[13px] text-neutral">Send a question, privacy request, or account deletion request.</p>
      <ContactForm key={selectedTopic} topic={selectedTopic} submissionId={randomUUID()} />
    </div>
  );
}
