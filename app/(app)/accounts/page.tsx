"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";
import { fmt } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function AccountsPage() {
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

  if (accounts.isPending) return <p className="text-[13px] text-neutral">Loading…</p>;
  if (accounts.isError || !accounts.data) {
    return (
      <div className="rounded-[10px] border border-hairline p-6 text-[13px]">
        <p>Couldn&rsquo;t load your accounts.</p>
        <button onClick={() => accounts.refetch()} className="mt-2 rounded-[6px] border border-hairline px-3 py-1 hover:border-ink">Try again</button>
      </div>
    );
  }

  const list = accounts.data ?? [];

  const getConnectionChipColor = (state: string) => {
    switch (state) {
      case "connected":
        return "bg-positive/15 text-positive";
      case "expiring":
        return "bg-warning/15 text-warning";
      case "revoked":
        return "bg-negative/15 text-negative";
      default:
        return "bg-neutral/15 text-neutral";
    }
  };

  const getConnectionChipLabel = (state: string) => {
    switch (state) {
      case "connected":
        return "Connected";
      case "expiring":
        return "Expiring";
      case "revoked":
        return "Revoked";
      default:
        return state;
    }
  };

  const getCardBorderClass = (state: string) => {
    switch (state) {
      case "expiring":
        return "border-l-2 border-l-warning";
      case "revoked":
        return "border-l-2 border-l-negative";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-[900px]">
      <h1 className="text-2xl font-semibold mb-6">Accounts</h1>
      <div className="mb-6 flex gap-2 rounded-[10px] border border-dashed border-hairline p-4">
        <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@handle"
          className="flex-1 rounded-[6px] border border-hairline px-3 py-2 text-[13px]" />
        <Button onClick={() => connect.mutate()} disabled={!handle || connect.isPending}>
          Connect another account
        </Button>
      </div>
      {connect.error && (
        <p className="mb-6 text-[13px] text-negative">
          {connect.error instanceof ApiError ? connect.error.detail : "Couldn't connect that account."}
        </p>
      )}
      <div className="mb-6 flex flex-col gap-3">
        {list.map((a: any) => {
          const isDimmed = a.connection_state === "revoked";
          return (
            <div key={a.id} className={`flex items-start gap-4 rounded-[10px] border border-hairline p-4 ${getCardBorderClass(a.connection_state)} ${isDimmed ? "opacity-50" : ""}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[15px] font-medium">{a.handle}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${getConnectionChipColor(a.connection_state)}`}>
                    {getConnectionChipLabel(a.connection_state)}
                  </span>
                  <a href="/api/v1/accounts/connect/start"
                    className="label-11 text-neutral underline hover:text-ink">
                    Reauthorize
                  </a>
                </div>
                <div className="text-[13px] text-neutral mb-2">{a.videos_tracked} videos tracked</div>
                <div className="font-mono text-[18px]">median {fmt.views(a.baseline_median_views)} views</div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="label-11">BlowUp never creates or supplies accounts.</p>
    </div>
  );
}
