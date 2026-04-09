"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronRight, Info, Menu, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type HudMenuAction = "simulationProgress" | "projectOverview" | "characters" | "pmInfo";

const MENU_ITEMS: {
  action: HudMenuAction;
  label: string;
  description: string;
  Icon: LucideIcon;
}[] = [
  {
    action: "projectOverview",
    label: "프로젝트 개요",
    description: "배경·목적·성공 요건(KPI)",
    Icon: BookOpen,
  },
  {
    action: "characters",
    label: "주요 인물 정보",
    description: "팀·이해관계자 프로필",
    Icon: Users,
  },
  {
    action: "pmInfo",
    label: "튜토리얼",
    description: "시뮬레이션 소개·여정 미리보기",
    Icon: Info,
  },
];

type Props = {
  onSelect: (action: HudMenuAction) => void;
  progressPercent: number;
};

export function SimulationHudMenu({ onSelect, progressPercent }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pct = Math.min(100, Math.max(0, Math.round(progressPercent)));

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        className="sim-hud-menu-btn inline-flex h-10 w-10 items-center justify-center rounded-[10px] border-none bg-transparent text-black transition hover:bg-black/5 active:bg-black/10"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label="메뉴 열기"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <Menu className="h-5 w-5" strokeWidth={2.5} aria-hidden />
      </button>
      {menuOpen ? (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full z-[60] mt-2 w-[min(calc(100vw-1.5rem),320px)] overflow-hidden rounded-xl border-2 border-black bg-[#F6F7F9] shadow-[8px_8px_0_#111111]"
        >
          {/* Progress inline */}
          <div className="border-b border-black/10 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[13px] font-extrabold text-black">시뮬레이션 진행률</span>
              <span className="font-mono text-[14px] font-extrabold text-black">{pct}%</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full border border-black/15 bg-[#e8e8e8]">
              <div
                className="sim-hud-menu-accent-fill h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <ul className="space-y-2 p-2">
            {MENU_ITEMS.map(({ action, label, description, Icon }, index) => (
              <li key={action}>
                <button
                  type="button"
                  role="menuitem"
                  className="neo-no-bg flex w-full items-center gap-3 rounded-lg border-2 border-transparent bg-white px-3 py-3 text-left transition hover:border-black hover:shadow-[3px_3px_0_#111111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  onClick={() => {
                    onSelect(action);
                    setMenuOpen(false);
                  }}
                >
                  <span className="sim-hud-menu-accent-fill flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black text-[color:var(--sim-accent-cta-text)]">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.4} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-black/35">{String(index + 1).padStart(2, "0")}</span>
                      <span className="font-sans text-[14px] font-extrabold leading-snug text-black">{label}</span>
                    </span>
                    <span className="mt-0.5 block font-sans text-[12px] font-medium leading-snug text-black/50">{description}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-black/35" strokeWidth={2.25} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
