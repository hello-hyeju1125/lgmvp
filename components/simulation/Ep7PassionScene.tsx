"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { ep7Scene, ep7Options } from "@/content/episode7";
import { useEffect } from "react";

interface Ep7PassionSceneProps {
  userName: string;
}

/** **text** -> <strong>text</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export function Ep7PassionScene({ userName }: Ep7PassionSceneProps) {
  const { episode7Choice, setEpisode7Choice } = useStore();
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(episode7Choice);
  const [isDialogueRevealed, setIsDialogueRevealed] = useState(false);
  useEffect(() => {
    setEpisode7Choice(selected);
  }, [selected, setEpisode7Choice]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black/90">{ep7Scene.title}</h2>
      <p className="text-[18px] font-extrabold leading-[1.85] text-black/90">
        <span className="text-black/90">[Situation]</span> {renderWithBold(ep7Scene.situation)}
      </p>

      <div className="rounded-2xl border border-black/10 bg-gray-50 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div className="border-l-4 border-[#E4003F] pl-4">
          <p className="text-[13px] font-extrabold text-black/85">최유라 선임</p>
          {!isDialogueRevealed ? (
            <button
              type="button"
              onClick={() => setIsDialogueRevealed(true)}
              className="group relative mt-3 w-full text-left"
              aria-label="대화 펼치기"
            >
              <div className="relative overflow-hidden rounded-xl bg-white/60 px-4 py-3 ring-1 ring-black/10 transition-all group-hover:bg-white/80 group-hover:ring-[#E4003F]/35">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[14px] font-extrabold text-black/70 underline decoration-black/15 decoration-dotted underline-offset-4 group-hover:decoration-[#E4003F]/50">
                      대화 내용 펼치기
                    </p>
                    <p className="mt-1 line-clamp-2 text-[14px] leading-[1.75] text-black/40 blur-[0.6px]">
                      {renderWithBold(ep7Scene.dialogue[0] ?? "")}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#E4003F]/10 px-3 py-1 text-[12px] font-extrabold text-[#E4003F] ring-1 ring-black/10 transition group-hover:bg-[#E4003F]/15">
                    Click
                  </span>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(280px_120px_at_18%_35%,rgba(228,0,63,0.12),transparent_60%)] opacity-70" />
              </div>
            </button>
          ) : (
            ep7Scene.dialogue.map((line, i) => (
              <p key={i} className="mt-2 text-[16px] leading-[1.85] text-black/80">
                {renderWithBold(line)}
              </p>
            ))
          )}
        </div>
      </div>

      <div className="py-[1.8rem] flex items-center" aria-hidden="true">
        <div className="h-px w-full bg-black/10" />
      </div>

      <p className="text-[18px] font-extrabold leading-[1.85] text-black/90">
        <span className="text-black/90">[Action]</span> {renderWithBold(ep7Scene.action)}
      </p>

      <div className="space-y-3">
        {ep7Options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelected(opt.id)}
            className={`w-full text-left rounded-2xl border-2 bg-white p-5 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
              selected === opt.id
                ? "border-[#E4003F] shadow-[0_14px_50px_rgba(228,0,63,0.14)]"
                : "border-black/10 hover:border-[#E4003F]"
            }`}
          >
            <p className="text-[18px] font-bold leading-tight text-gray-900">
              옵션 {opt.id}. {opt.title}
            </p>
            <p className="mt-2 text-[16px] leading-[1.85] text-gray-600">{renderWithBold(opt.summary)}</p>
          </button>
        ))}
      </div>

    </div>
  );
}
