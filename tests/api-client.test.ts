import { api, ApiError } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";
import { vi } from "vitest";

test("api returns parsed json", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ ok: 1 }), { status: 200 })));
  await expect(api("/api/v1/health")).resolves.toEqual({ ok: 1 });
});

test("api throws ApiError with status and detail", async () => {
  vi.stubGlobal("fetch", vi.fn(async () =>
    new Response(JSON.stringify({ detail: "Email or password is incorrect." }), { status: 401 })));
  const err = await api("/api/v1/auth/login").catch((e: unknown) => e);
  expect(err).toBeInstanceOf(ApiError);
  expect((err as ApiError).status).toBe(401);
  expect((err as ApiError).detail).toBe("Email or password is incorrect.");
});

test("query keys match the contract", () => {
  expect(keys.videos({ lever: "text_overlay" })).toEqual(["videos", { lever: "text_overlay" }]);
  expect(keys.video("x")).toEqual(["video", "x"]);
  expect(keys.rounds()).toEqual(["rounds"]);
  expect(keys.round("r")).toEqual(["round", "r"]);
  expect(keys.accounts()).toEqual(["accounts"]);
  expect(keys.dashboard()).toEqual(["dashboard", "needs-attention"]);
});
