"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle } from "lucide-react";

const KPI_CRITICAL_THRESHOLD = 40;
const ENERGY_CRITICAL_THRESHOLD = 20;

function isCritical(field: string, value: number): boolean {
  return value <= (field === "leaderEnergy" ? ENERGY_CRITICAL_THRESHOLD : KPI_CRITICAL_THRESHOLD);
}

export const D1_KPI_TRANSITION_MS = 1400;
export const D1_KPI_APPEAR_DELAY_MS = 600;
export const D1_KPI_STAGGER_MS = 320;

export interface D1KpiBarProps {
  label: string;
  value: number;
  beforeValue: number;
  field: string;
  Icon: LucideIcon;
  delayMs: number;
  play: boolean;
  /** 막대·강조에 쓰는 색 (단계별 브랜드 톤) */
  positiveBarColor: string;
  /** “→” 오른쪽 현재 % 숫자 색 (착수 단계는 막대와 다른 그린 톤 사용) */
  positiveValueColor: string;
}

export function D1KpiBar({
  label,
  value,
  beforeValue,
  field,
  Icon,
  delayMs,
  play,
  positiveBarColor,
  positiveValueColor,
}: D1KpiBarProps) {
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

      const duration = D1_KPI_TRANSITION_MS;
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

  const deltaLabel = delta !== 0 ? (went_up ? `▲${delta}%` : `▼${Math.abs(delta)}%`) : null;
  const critical = isCritical(field, afterPct);

  const currentPctColor = critical ? undefined : went_down && transitioning ? "#ef4444" : positiveValueColor;

  return (
    <div
      className="flex items-center gap-2 sm:gap-3"
      style={{
        opacity: appeared ? 1 : 0,
        transform: appeared ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <div className="flex w-[118px] shrink-0 items-center gap-2 sm:w-[142px]">
        {critical ? (
          <AlertTriangle className="kpi-critical-icon h-5 w-5 shrink-0" strokeWidth={2.5} />
        ) : (
          <Icon className="h-5 w-5 shrink-0 text-[#6b7280]" />
        )}
        <span className={`text-[15px] font-extrabold sm:text-[16px] ${critical ? "kpi-critical-text" : "text-[#333]"}`}>{label}</span>
      </div>
      <div className={`d1-kpi-bar-track relative h-[14px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#e5e7eb] ${critical ? "kpi-critical-track" : ""}`}>
        <div
          className={`d1-kpi-bar-fill absolute inset-y-0 left-0 rounded-full ${critical ? "kpi-critical-bar" : ""}`}
          style={{
            width: `${barWidth}%`,
            transition: transitioning ? `width ${D1_KPI_TRANSITION_MS}ms cubic-bezier(0.33, 1, 0.68, 1)` : "none",
            ...(!critical ? { backgroundColor: went_down && transitioning ? "#ef4444" : positiveBarColor } : {}),
          }}
        />
      </div>
      {/* A안: 단계 시작 → 현재 % */}
      <div
        className="flex w-[min(100%,7.5rem)] shrink-0 items-baseline justify-end gap-0.5 tabular-nums sm:w-[8.25rem]"
        aria-label={`${label}, 단계 시작 ${beforePct}%, 현재 ${displayPct}%`}
      >
        <span className="text-[13px] font-bold tabular-nums text-[#6b7280] sm:text-[14px]">{beforePct}%</span>
        <span className="px-0.5 text-[12px] font-semibold text-[#9ca3af] sm:text-[13px]" aria-hidden>
          →
        </span>
        <span
          className={`whitespace-nowrap text-[15px] font-extrabold tabular-nums sm:text-[17px] ${critical ? "kpi-critical-text" : ""}`}
          style={critical ? undefined : { color: currentPctColor }}
        >
          {displayPct}%
        </span>
      </div>
      <span
        className={`min-w-[3.75rem] shrink-0 text-right text-[17px] font-black tabular-nums sm:min-w-[4.25rem] sm:text-[19px] ${
          deltaLabel ? (went_up ? "d1-kpi-delta--up" : "d1-kpi-delta--down") : "opacity-0"
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
