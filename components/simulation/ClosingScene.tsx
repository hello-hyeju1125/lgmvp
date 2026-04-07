"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { closingDDayCopy, closingResultCopy } from "@/content/closingScene";
import type { KpiState } from "@/store/useStore";
import type { CSSProperties } from "react";

function Hl({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ backgroundColor: "#64e87a", padding: "1px 4px", borderRadius: "3px", fontWeight: 800 }}>
      {children}
    </span>
  );
}

function renderHighlighted(text: string) {
  const parts = text.split(/(\[.*?\])/g);
  return parts.map((part, i) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      return <Hl key={i}>{part.slice(1, -1)}</Hl>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

const KPI_KEYS: (keyof KpiState)[] = [
  "stakeholderAlignment",
  "delivery",
  "teamEngagement",
  "quality",
  "leaderEnergy",
];

const KPI_LABELS: Record<keyof KpiState, string> = {
  quality: "산출물 품질",
  delivery: "일정 준수",
  teamEngagement: "팀 몰입도",
  stakeholderAlignment: "이해관계자 조율",
  leaderEnergy: "리더의 에너지",
};

function getGrade(avg: number): { grade: string; color: string; message: string } {
  if (avg >= 85) return { grade: "S", color: "#64e87a", message: "탁월한 리더십을 보여주셨습니다!" };
  if (avg >= 70) return { grade: "A", color: "#FFD600", message: "훌륭한 프로젝트 운영이었습니다." };
  if (avg >= 55) return { grade: "B", color: "#FFD600", message: "안정적인 프로젝트 운영이었습니다." };
  return { grade: "C", color: "#ff6b6b", message: "더 성장할 수 있는 가능성이 있습니다." };
}

function revealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * 150}ms` };
}

interface ClosingSceneProps {
  userName: string;
}

export function ClosingScene({ userName: _userName }: ClosingSceneProps) {
  const router = useRouter();
  const { kpi } = useStore();
  const [showResult, setShowResult] = useState(false);

  const avg = Math.round(KPI_KEYS.reduce((s, k) => s + kpi[k], 0) / KPI_KEYS.length);
  const { grade, color, message } = getGrade(avg);

  const [animatedValues, setAnimatedValues] = useState<Record<keyof KpiState, number>>({
    quality: 0, delivery: 0, teamEngagement: 0, stakeholderAlignment: 0, leaderEnergy: 0,
  });

  useEffect(() => {
    if (!showResult) return;
    const start = performance.now();
    const duration = 1200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) * (1 - t);
      setAnimatedValues({
        quality: Math.round(kpi.quality * eased),
        delivery: Math.round(kpi.delivery * eased),
        teamEngagement: Math.round(kpi.teamEngagement * eased),
        stakeholderAlignment: Math.round(kpi.stakeholderAlignment * eased),
        leaderEnergy: Math.round(kpi.leaderEnergy * eased),
      });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [showResult, kpi]);

  return (
    <section className="ep1-scene-layout w-full min-w-0 max-w-none space-y-10 sm:space-y-12">
      {/* Title */}
      <div className="initiation-action-page mb-2 w-full">
        <div className="flex justify-center px-2">
          <p
            className="ep1-scene-reveal initiation-brief-badge closing-badge shadow-[6px_6px_0_#111111]"
            style={revealDelay(0)}
          >
            {closingDDayCopy.title}
          </p>
        </div>
      </div>

      {/* Chatbot guide */}
      <div
        className="ep1-scene-reveal mx-auto max-w-5xl rounded-md px-10 py-7 text-center sm:px-14 sm:py-8"
        style={{ ...revealDelay(1), backgroundColor: "#ffffff", border: "2px solid #111", borderRadius: "6px", boxShadow: "4px 4px 0 #111" }}
      >
        <div className="space-y-4 text-[17px] leading-relaxed text-[#222] sm:text-[19px]">
          {closingDDayCopy.chatbotGuide.map((line, i) => (
            <p key={i}>{renderHighlighted(line)}</p>
          ))}
        </div>
      </div>

      {/* CTA to reveal result */}
      {!showResult && (
        <div className="ep1-scene-reveal flex justify-center" style={revealDelay(3)}>
          <button
            type="button"
            onClick={() => setShowResult(true)}
            className="closing-cta-btn group relative text-[18px] font-extrabold transition-all sm:text-[20px]"
            style={{ backgroundColor: "#f9a8d4", color: "#111", border: "2.5px solid #111", borderRadius: "8px", boxShadow: "5px 5px 0 #111", padding: "16px 44px" }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "translate(4px,4px)"; e.currentTarget.style.boxShadow = "1px 1px 0 #111"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "5px 5px 0 #111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "5px 5px 0 #111"; }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {closingDDayCopy.cta}
              <span className="inline-block transition-transform group-hover:translate-y-1" aria-hidden>↓</span>
            </span>
          </button>
        </div>
      )}

      {/* Result section — revealed after CTA click */}
      {showResult && (
        <div className="space-y-8">
          {/* Grade banner */}
          <div
            className="po-anim mx-auto flex max-w-md flex-col items-center gap-3 rounded-md px-8 py-8 text-center"
            style={{ ...revealDelay(0), border: "2px solid #111", boxShadow: "6px 6px 0 #111", backgroundColor: "#ffffff" }}
          >
            <p className="text-[14px] font-extrabold tracking-[0.15em] text-[#111]">{closingResultCopy.title}</p>
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full text-[48px] font-black sm:h-28 sm:w-28 sm:text-[56px]"
              style={{ backgroundColor: color, border: "3px solid #111", color: "#111" }}
            >
              {grade}
            </div>
            <p className="text-[13px] font-bold text-[#111]">종합 평균 {avg}점</p>
            <p className="text-[16px] font-extrabold text-[#111]">{message}</p>
          </div>

          {/* KPI breakdown */}
          <div className="po-anim mx-auto max-w-lg space-y-4" style={revealDelay(1)}>
            <p className="text-center text-[13px] font-extrabold tracking-[0.12em] text-[#111]">{closingResultCopy.intro}</p>
            <div className="space-y-3">
              {KPI_KEYS.map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-[110px] shrink-0 text-right text-[14px] font-extrabold text-[#111] sm:w-[130px]">
                    {KPI_LABELS[key]}
                  </span>
                  <div className="h-6 flex-1 overflow-hidden rounded-md" style={{ backgroundColor: "#e8e8e8", border: "1.5px solid #111" }}>
                    <div
                      className="h-full rounded-sm transition-all duration-1000 ease-out"
                      style={{ width: `${animatedValues[key]}%`, backgroundColor: animatedValues[key] >= 70 ? "#64e87a" : animatedValues[key] >= 40 ? "#FFD600" : "#ff6b6b" }}
                    />
                  </div>
                  <span className="w-[42px] shrink-0 font-mono text-[14px] font-extrabold tabular-nums text-[#111]">
                    {animatedValues[key]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Outro */}
          <div className="po-anim mx-auto max-w-lg text-center" style={revealDelay(2)}>
            <p className="text-[16px] font-bold leading-relaxed text-[#111]">{closingResultCopy.outro}</p>
          </div>

          {/* Home button */}
          <div className="po-anim flex flex-col items-center gap-3 pb-4" style={revealDelay(3)}>
            <button
              type="button"
              onClick={() => router.push("/report")}
              className="closing-cta-btn group relative text-[18px] font-extrabold transition-all sm:text-[20px]"
              style={{ backgroundColor: "#f9a8d4", color: "#111", border: "2.5px solid #111", borderRadius: "8px", boxShadow: "5px 5px 0 #111", padding: "16px 44px" }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "translate(4px,4px)"; e.currentTarget.style.boxShadow = "1px 1px 0 #111"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "5px 5px 0 #111"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "5px 5px 0 #111"; }}
            >
              <span className="relative z-10 flex items-center gap-2">
                나의 PM 여정 보고서 보기
                <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>→</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                useStore.getState().resetSimulation();
                router.push("/simulation?phase=initiation-action");
              }}
              className="text-[14px] font-semibold text-black/50 underline underline-offset-4 transition-colors hover:text-black/80"
            >
              처음부터 다시 시작하기
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
