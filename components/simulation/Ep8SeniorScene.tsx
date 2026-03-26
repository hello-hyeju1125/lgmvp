"use client";

import { useState } from "react";
import { ep8Scene } from "@/content/episode8";
import { useStore } from "@/store/useStore";

interface Ep8SeniorSceneProps {
  userName: string;
}

/** **text** -> <strong>text</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export function Ep8SeniorScene({ userName }: Ep8SeniorSceneProps) {
  const { episode8CoachingText, setEpisode8CoachingText } = useStore();
  const [isDialogueRevealed, setIsDialogueRevealed] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black/90">
        {ep8Scene.title} – {ep8Scene.screenSubtitle}
      </h2>

      <section className="space-y-3">
        <p className="text-[18px] font-extrabold leading-[1.85] text-black/90">
          <span className="text-black/90">[Situation]</span> {renderWithBold(ep8Scene.situation)}
        </p>
        <p className="text-[18px] font-extrabold leading-[1.85] text-black/90">{renderWithBold(ep8Scene.afterSituation)}</p>
      </section>

      <div className="rounded-2xl border border-black/10 bg-gray-50 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div className="border-l-4 border-[#E4003F] pl-4">
          <p className="text-[13px] font-extrabold text-black/85">{ep8Scene.meetingRequestLabel}</p>
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
                      {ep8Scene.dialogue[0] ?? ""}
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
            ep8Scene.dialogue.map((line, i) => (
              <p key={i} className="mt-2 text-[16px] leading-[1.85] text-black/80">
                &ldquo;{line}&rdquo;
              </p>
            ))
          )}
        </div>
      </div>

      <div className="py-[1.8rem] flex items-center" aria-hidden="true">
        <div className="h-px w-full bg-black/10" />
      </div>

      <p className="text-[18px] font-extrabold leading-[1.85] text-black/90">
        <span className="text-black/90">[Action]</span> {renderWithBold(ep8Scene.action)}
      </p>

      <section className="mt-8 space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-extrabold text-black/85">이민수 책임에게 건넬 코칭</h3>
          <span className="inline-flex rounded-full bg-[#E4003F]/12 px-2.5 py-0.5 text-[12px] font-extrabold text-[#E4003F] ring-1 ring-[#E4003F]/20">
            직접 작성 필수
          </span>
        </div>
        <p className="text-[13px] font-medium text-black/55">아래 입력칸에 리더님의 코칭 메시지를 직접 작성해 주세요.</p>
        <textarea
          value={episode8CoachingText}
          onChange={(e) => setEpisode8CoachingText(e.target.value)}
          placeholder="예: 민수 책임님의 현장 VOC 경험은 우리 프로젝트에 없어서는 안 될 자산입니다. 기술 용어보다 '고객이 무엇에 불만을 갖는지'를 데이터에서 짚어내는 역할을 맡아 주시면, 개발팀이 그걸 기준으로 AI 로직을 설계할 수 있습니다..."
          className="w-full min-h-[220px] rounded-2xl border-2 border-[#E4003F]/35 bg-[#FFF9FB] p-4 text-[15px] leading-[1.75] text-[#4A4A4A] placeholder:text-[#9CA3AF] focus:border-[#E4003F] focus:outline-none focus:ring-4 focus:ring-[#E4003F]/10"
        />
      </section>

    </div>
  );
}
