"use client";

import { useStore } from "@/store/useStore";
import { initiationActions, initiationScreenCopy, INITIATION_STEP_HOURS } from "@/content/initiationActions";
import type { KpiState } from "@/store/useStore";
import { Check, Calendar, FileText, Sparkles, Users, UsersRound } from "lucide-react";
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

const KPI_TRANSITION_MS = 1400;
const KPI_APPEAR_DELAY_MS = 600;
const KPI_STAGGER_MS = 320;

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

function D1KpiBar({
  label,
  value,
  beforeValue,
  Icon,
  delayMs,
  play,
}: {
  label: string;
  value: number;
  beforeValue: number;
  Icon: LucideIcon;
  delayMs: number;
  play: boolean;
}) {
  const afterPct = Math.max(0, Math.min(100, value));
  const beforePct = Math.max(0, Math.min(100, beforeValue));
  const delta = afterPct - beforePct;
  const went_up = delta > 0;
  const went_down = delta < 0;

  const [barWidth, setBarWidth] = useState(beforePct);
  const [displayPct, setDisplayPct] = useState(beforePct);
  const [appeared, setAppeared] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showDelta, setShowDelta] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!play) return;

    const appearTimer = window.setTimeout(() => {
      setAppeared(true);
    }, delayMs);

    const transitionTimer = window.setTimeout(() => {
      setTransitioning(true);
      setBarWidth(afterPct);

      const duration = KPI_TRANSITION_MS;
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayPct(Math.round(beforePct + (afterPct - beforePct) * eased));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setShowDelta(true);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delayMs + 800);

    return () => {
      window.clearTimeout(appearTimer);
      window.clearTimeout(transitionTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [play, afterPct, beforePct, delayMs]);

  const deltaLabel = delta !== 0 ? (went_up ? `▲${delta}` : `▼${Math.abs(delta)}`) : null;

  return (
    <div
      className="flex items-center gap-3"
      style={{
        opacity: appeared ? 1 : 0,
        transform: appeared ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <div className="flex w-[130px] shrink-0 items-center gap-2 sm:w-[150px]">
        <Icon className="h-5 w-5 shrink-0 text-[#6b7280]" />
        <span className="text-[15px] font-extrabold text-[#333] sm:text-[16px]">{label}</span>
      </div>
      <div className="d1-kpi-bar-track relative h-[14px] flex-1 overflow-hidden rounded-full bg-[#e5e7eb]">
        <div
          className="d1-kpi-bar-fill absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${barWidth}%`,
            transition: transitioning ? `width ${KPI_TRANSITION_MS}ms cubic-bezier(0.33, 1, 0.68, 1)` : "none",
            backgroundColor: went_down && transitioning ? "#ef4444" : "#64e87a",
          }}
        />
      </div>
      <span
        className="w-[48px] shrink-0 text-right text-[16px] font-extrabold tabular-nums sm:text-[18px]"
        style={{ color: went_down && transitioning ? "#ef4444" : "#22c55e" }}
      >
        {displayPct}%
      </span>
      <span
        className={`w-[44px] shrink-0 text-right text-[11px] font-bold tabular-nums sm:w-[48px] sm:text-[12px] ${
          deltaLabel
            ? went_up
              ? "recap-kpi-delta--up"
              : "recap-kpi-delta--down"
            : "opacity-0"
        }`}
        style={{
          opacity: showDelta && deltaLabel ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {deltaLabel ?? "—"}
      </span>
    </div>
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
            D-1
          </span>
        </p>
        <div className="space-y-5 sm:space-y-6">
          <p
            id="initiation-d1-title"
            className="initiation-action-reveal initiation-brief-copy initiation-scenario-copy"
            style={d1RevealDelay(1)}
          >
            {initiationScreenCopy.popupTitle}
          </p>
          <p
            className="initiation-action-reveal initiation-brief-copy initiation-scenario-copy"
            style={d1RevealDelay(2)}
          >
            {renderGreenEmphasis(introLine)}
          </p>
          <p
            className="initiation-action-reveal initiation-brief-copy initiation-scenario-copy"
            style={d1RevealDelay(3)}
          >
            {initiationScreenCopy.popupOutro}
          </p>
        </div>
      </div>

      <div className="mb-9 flex w-full justify-center sm:mb-10">
        <div
          className="initiation-action-reveal action-card-idle action-card-wrap w-full max-w-xl sm:max-w-2xl"
          style={d1RevealDelay(4)}
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
          style={d1RevealDelay(5)}
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
                  Icon={Icon}
                  play={kpiInView}
                  delayMs={KPI_APPEAR_DELAY_MS + i * KPI_STAGGER_MS}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
