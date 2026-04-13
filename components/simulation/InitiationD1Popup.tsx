"use client";

import { useStore } from "@/store/useStore";
import { initiationActions, initiationScreenCopy, INITIATION_STEP_HOURS } from "@/content/initiationActions";
import type { KpiState } from "@/store/useStore";
import { Check, Calendar, FileText, Sparkles, Users, UsersRound } from "lucide-react";
import { D1KpiBar, D1_KPI_APPEAR_DELAY_MS, D1_KPI_STAGGER_MS } from "@/components/simulation/D1KpiBar";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

const D1_REVEAL_STAGGER_MS = 120;
function d1RevealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * D1_REVEAL_STAGGER_MS}ms` };
}

interface InitiationD1PopupProps {
  userName: string;
}

const BADGE_NAMES: Record<string, string> = {
  champion_1on1: "프로젝트 헌장 개발",
  mentoring: "전문가 판단 및 OPA",
  pmbok_study: "프로젝트 관리 프레임워크",
  stakeholder_interview: "이해관계자 식별",
  team_profile: "EEF 인적 자원",
};

const KPI_META: {
  field: keyof KpiState;
  label: string;
  Icon: LucideIcon;
}[] = [
  { field: "quality", label: "산출물 품질", Icon: FileText },
  { field: "delivery", label: "일정 준수", Icon: Calendar },
  { field: "teamEngagement", label: "팀 몰입도", Icon: Users },
  { field: "stakeholderAlignment", label: "이해관계자 조율", Icon: UsersRound },
  { field: "leaderEnergy", label: "리더 에너지", Icon: Sparkles },
];

function renderGreenEmphasis(line: string): ReactNode {
  const parts = line.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, idx) =>
    idx % 2 === 1 ? (
      <strong key={`${part}-${idx}`} className="initiation-brief-em">
        {part}
      </strong>
    ) : (
      <span key={`${part}-${idx}`}>{part}</span>
    ),
  );
}

export function InitiationD1Popup({ userName }: InitiationD1PopupProps) {
  const { initiationActionHours, kpi, kpiBeforeInitiation } = useStore();

  const badges = initiationActions
    .filter((a) => (initiationActionHours[a.id] ?? 0) >= INITIATION_STEP_HOURS[0])
    .map((a) => BADGE_NAMES[a.id] ?? a.title);

  const [capturedBefore] = useState<KpiState>(() =>
    kpiBeforeInitiation ? { ...kpiBeforeInitiation } : { ...kpi },
  );

  const introLine = initiationScreenCopy.popupIntro.replace("{User_Name}", userName);

  const kpiCardRef = useRef<HTMLDivElement>(null);
  const [kpiInView, setKpiInView] = useState(false);
  useEffect(() => {
    const el = kpiCardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setKpiInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className="initiation-action-page initiation-d1-page initiation-v0-main flex w-full flex-col"
      aria-labelledby="initiation-d1-title"
    >
      <div className="initiation-scenario-block mb-8 text-center sm:mb-10">
        <p
          className="initiation-action-reveal mb-5 flex flex-wrap items-center justify-center px-2 text-center sm:mb-6"
          style={d1RevealDelay(0)}
        >
          <span
            id="initiation-d1-title"
            className="initiation-d1-hero-core initiation-d1-hero-core--animated inline-block max-w-full font-sans text-[clamp(1.65rem,5.2vw,3rem)] font-black leading-[1.08] text-black sm:text-[clamp(1.85rem,4.2vw,3.5rem)]"
          >
            본격 업무 시작 D-1
          </span>
        </p>
        <div className="space-y-5 sm:space-y-6">
          <p
            className="initiation-action-reveal initiation-brief-copy initiation-scenario-copy"
            style={d1RevealDelay(1)}
          >
            {renderGreenEmphasis(introLine)}
          </p>
          <p
            className="initiation-action-reveal initiation-brief-copy initiation-scenario-copy"
            style={d1RevealDelay(2)}
          >
            {initiationScreenCopy.popupOutro}
          </p>
        </div>
      </div>

      <div className="mb-9 flex w-full justify-center sm:mb-10">
        <div
          className="initiation-action-reveal action-card-idle action-card-wrap w-full max-w-xl sm:max-w-2xl"
          style={d1RevealDelay(3)}
        >
          <div className="action-card-body w-full min-w-0">
            <span className="impact-tag inline-flex w-fit font-sans">
              {initiationScreenCopy.popupBadgesLabel.replace(/:\s*$/, "")}
            </span>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {badges.length > 0 ? (
                badges.map((b) => (
                  <span
                    key={b}
                    className="initiation-d1-chip initiation-footer-chip-green inline-flex max-w-[min(100%,240px)] items-center gap-1.5 rounded-[10px] border-2 border-black bg-[#64e87a] px-3 py-2 font-sans text-[12px] font-extrabold text-black shadow-[2px_2px_0_#111111] sm:text-[13px]"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={3} aria-hidden />
                    <span className="min-w-0 truncate">{b}</span>
                  </span>
                ))
              ) : (
                <span className="font-sans text-[18px] font-medium leading-relaxed text-black/50">선택한 액션이 없습니다.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={kpiCardRef} className="mb-9 flex w-full justify-center sm:mb-10">
        <div
          className="initiation-action-reveal action-card-idle action-card-wrap w-full max-w-xl sm:max-w-2xl"
          style={d1RevealDelay(4)}
        >
          <div className="action-card-body w-full min-w-0">
            <span className="impact-tag inline-flex w-fit font-sans">{initiationScreenCopy.popupKpiLabel}</span>
            <div className="mt-5 flex flex-col gap-4">
              {KPI_META.map(({ field, label, Icon }, i) => (
                <D1KpiBar
                  key={field}
                  label={label}
                  value={kpi[field]}
                  beforeValue={capturedBefore[field]}
                  field={field}
                  Icon={Icon}
                  play={kpiInView}
                  delayMs={D1_KPI_APPEAR_DELAY_MS + i * D1_KPI_STAGGER_MS}
                  positiveBarColor="#64e87a"
                  positiveValueColor="#22c55e"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
