"use client";
import { useEffect, useState } from "react";

export function Filmstrip({ src }: { src: string }) {
  const [frames, setFrames] = useState<string[]>([]);
  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.addEventListener("loadeddata", async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 90; canvas.height = 160;
      const ctx = canvas.getContext("2d")!;
      const out: string[] = [];
      for (let i = 0; i < 10; i++) {
        video.currentTime = (i * 5) / 9;
        await new Promise((r) => video.addEventListener("seeked", r, { once: true }));
        ctx.drawImage(video, 0, 0, 90, 160);
        out.push(canvas.toDataURL("image/jpeg", 0.6));
      }
      setFrames(out);
    });
  }, [src]);
  return (
    <div>
      <p className="label-11 mb-2">The first five seconds. Everything after this is a re-upload, not an edit.</p>
      <div className="flex gap-1 overflow-x-auto">
        {frames.length === 0
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-[160px] w-[90px] shrink-0 animate-pulse rounded-[6px] bg-surface-2" />))
          : frames.map((f, i) => (
              <figure key={i} className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f} alt="" className="h-[160px] w-[90px] rounded-[6px]" />
                <figcaption className="mt-0.5 text-center font-mono text-[10px] text-neutral">
                  {(((i * 5) / 9)).toFixed(1)}s
                </figcaption>
              </figure>))}
      </div>
    </div>
  );
}
