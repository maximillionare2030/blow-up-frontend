"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api/client";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/v1/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) });
      router.push("/connect");
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <AuthPanel>
      <h1 className="mb-6 text-2xl font-semibold">Create your account</h1>
      {error && <p className="mb-3 rounded-[6px] border border-negative px-3 py-2 text-[13px] text-negative">{error}</p>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="label-11" htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="rounded-[6px] border border-hairline px-3 py-2 text-[13px]" required />
        <label className="label-11" htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="rounded-[6px] border border-hairline px-3 py-2 text-[13px]" required minLength={8} />
        <Button type="submit" disabled={busy}>Create account</Button>
      </form>
      <p className="mt-4 text-[13px] text-neutral">
        Already have an account? <Link className="underline" href="/login">Log in</Link>
      </p>
    </AuthPanel>
  );
}
