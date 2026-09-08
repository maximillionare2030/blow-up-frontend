"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api/client";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
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
      await api("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong.");
      setPassword("");
      setBusy(false);
    }
  }

  return (
    <AuthPanel>
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
      {error && <p className="mb-3 rounded-[6px] border border-negative px-3 py-2 text-[13px] text-negative">{error}</p>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="label-11" htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="rounded-[6px] border border-hairline px-3 py-2 text-[13px]" required />
        <div className="flex items-center justify-between">
          <label className="label-11" htmlFor="password">Password</label>
          <span className="label-11 text-neutral" title="Coming later">Forgot password?</span>
        </div>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="rounded-[6px] border border-hairline px-3 py-2 text-[13px]" required  />
        <Button type="submit" disabled={busy}>Log in</Button>
      </form>
      <p className="mt-4 text-[13px] text-neutral">
        New here? <Link className="underline" href="/signup">Create an account</Link>
      </p>
    </AuthPanel>
  );
}
