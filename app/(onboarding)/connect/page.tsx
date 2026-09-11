"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";
import { Button } from "@/components/ui/Button";

export default function ConnectPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [handle, setHandle] = useState("");
  const accounts = useQuery({ queryKey: keys.accounts(), queryFn: () => api<any[]>("/api/v1/accounts") });
  const connect = useMutation({
    mutationFn: () => api("/api/v1/accounts/connect-dev", {
      method: "POST",
      body: JSON.stringify({ platform_account_id: handle.replace(/^@/, ""), handle }),
    }),
    onSuccess: () => { setHandle(""); qc.invalidateQueries({ queryKey: keys.accounts() }); },
  });
  const list = accounts.data ?? [];
  return (
    <div>
      <h1 className="text-2xl font-semibold">Connect your TikTok accounts.</h1>
      <p className="mt-2 text-[13px] text-neutral">
        Connect more than one. Comparing accounts is how BlowUp tells you what&rsquo;s working — a single account can&rsquo;t.
      </p>
      <div className="mt-6 flex flex-col gap-2 rounded-[10px] border border-dashed border-hairline p-4">
        <a href="/api/v1/accounts/connect/start"
          className="rounded-[6px] bg-accent px-3 py-1.5 text-center text-[13px] font-medium text-ink hover:brightness-95">
          Connect TikTok account
        </a>
        {process.env.NEXT_PUBLIC_DEV_CONNECT === "1" && (
          <div className="flex gap-2">
            <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@handle"
              className="flex-1 rounded-[6px] border border-hairline px-3 py-2 text-[13px]" />
            <Button variant="secondary" onClick={() => connect.mutate()} disabled={!handle || connect.isPending}>
              Connect (dev)
            </Button>
          </div>
        )}
      </div>
      {connect.error && (
        <p className="mt-2 text-[13px] text-negative">
          {connect.error instanceof ApiError ? connect.error.detail : "Couldn't connect that account."}
        </p>
      )}
      <div className="mt-4 flex flex-col gap-2">
        {[0, 1, 2].map((i) => {
          const a = list[i];
          return a ? (
            <div key={a.id} className="flex items-center gap-3 rounded-[10px] border border-hairline p-3">
              <span className="h-8 w-8 rounded-full bg-surface-2" />
              <span className="text-[13px] font-medium">{a.handle}</span>
              <span className="ml-auto rounded-full bg-positive/15 px-2 py-0.5 text-[11px] text-positive">Connected</span>
            </div>
          ) : (
            <div key={i} className="flex items-center gap-3 rounded-[10px] border border-dashed border-hairline p-3 text-neutral">
              <span className="h-8 w-8 rounded-full border border-dashed border-hairline" />
              <span className="text-[13px]">Empty slot</span>
            </div>
          );
        })}
      </div>
      <p className="label-11 mt-4">BlowUp never creates or supplies accounts. You connect accounts you already own.</p>
      <div className="mt-8 flex justify-end">
        <Button disabled={list.length === 0} onClick={() => router.push("/ingest")}>Continue</Button>
      </div>
      {list.length === 0 && <p className="mt-1 text-right text-[11px] text-neutral">Connect at least one account.</p>}
    </div>
  );
}
