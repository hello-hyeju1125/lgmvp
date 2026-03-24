"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  planningActions,
  planningScreenCopy,
  PLANNING_BADGE_NAMES,
} from "@/content/planningActions";
import type { KpiState } from "@/store/useStore";

interface PlanningD1PopupProps {
  userName: string;
}

const KPI_LABELS: Record<keyof KpiState, string> = {
  quality: "산출물 품질",
  delivery: "일정 준수",
  teamEngagement: "팀 몰입도",
  stakeholderAlignment: "이해관계자 조율",
  leaderEnergy: "리더의 에너지",
};

export function PlanningD1Popup({ userName }: PlanningD1PopupProps) {
  const router = useRouter();
  const { planningActionHours, kpi, kpiBeforePlanning } = useStore();

  const badges = planningActions
    .filter((a) => (planningActionHours[a.id] ?? 0) >= 5)
    .map((a) => PLANNING_BADGE_NAMES[a.id] ?? a.title);

  const before = kpiBeforePlanning ?? kpi;
  const kpiKeys: (keyof KpiState)[] = [
    "quality",
    "delivery",
    "teamEngagement",
    "stakeholderAlignment",
    "leaderEnergy",
  ];
  const increased = kpiKeys.filter((key) => kpi[key] > before[key]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="planning-d1-title"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-6 rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
        <h2 id="planning-d1-title" className="text-lg font-bold text-[#252423]">
          🎯 기획 및 설계 완료 (본격 실행 D-1)
        </h2>
        <p className="text-sm text-[#4A4A4A]">{planningScreenCopy.popupIntro}</p>

        <div className="rounded-xl border border-[#E5E5E5] bg-[#F9FAFB] p-4">
          <p className="mb-2 text-sm font-medium text-[#252423]">{planningScreenCopy.popupBadgesLabel}</p>
          <div className="flex flex-wrap gap-2">
            {badges.length > 0 ? (
              badges.map((b) => (
                <span key={b} className="rounded bg-[#E8EBFA] px-2 py-1 text-xs font-medium text-[#464775]">
                  [{b}]
                </span>
              ))
            ) : (
              <span className="text-xs text-[#6B6B6B]">선택한 액션이 없습니다.</span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E5E5] p-4">
          <p className="mb-2 text-sm font-medium text-[#252423]">{planningScreenCopy.popupKpiLabel}</p>
          {increased.length > 0 ? (
            <ul className="space-y-1 text-sm text-[#6B6B6B]">
              {increased.map((key) => (
                <li key={key}>
                  {KPI_LABELS[key]} {before[key]}점 ➔ {kpi[key]}점 ({planningScreenCopy.popupKpiRise})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#6B6B6B]">변동된 지표가 없습니다.</p>
          )}
        </div>

        <p className="text-sm text-[#4A4A4A]">{planningScreenCopy.popupOutro}</p>

      </div>
    </div>
  );
}
