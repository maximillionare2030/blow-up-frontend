import { api } from "@/lib/api/client";

export async function uploadSource(file: File): Promise<{ source_asset_id: string; objectUrl: string }> {
  const { url, r2_key } = await api<{ url: string; r2_key: string }>("/api/v1/uploads/presign", {
    method: "POST", body: JSON.stringify({ filename: file.name }),
  });
  const put = await fetch(url, { method: "PUT", body: file });
  if (!put.ok) throw new Error(`upload failed: ${put.status}`);
  const asset = await api<{ id: string }>("/api/v1/source-assets", {
    method: "POST", body: JSON.stringify({ r2_key }),
  });
  return { source_asset_id: asset.id, objectUrl: URL.createObjectURL(file) };
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40) || "variant";
