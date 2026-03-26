"use client";

import { useStore } from "@/store/useStore";
import { executionActions, executionScreenCopy, EXECUTION_STEP_HOURS } from "@/content/executionActions";
import type { KpiState } from "@/store/useStore";

interface ExecD1PopupProps {
  userName: string;
}

const KPI_LABELS: Record<keyof KpiState, string> = {
  quality: "산출물 품질",
  delivery: "일정 준수",
  teamEngagement: "팀 몰입도",
  stakeholderAlignment: "이해관계자 조율",
  leaderEnergy: "리더의 에너지",
};

export function ExecD1Popup({ userName }: ExecD1PopupProps) {
  const { executionActionHours, kpi, kpiBeforeExecution } = useStore();

  const badges = executionActions
    .filter((a) => (executionActionHours[a.id] ?? 0) >= EXECUTION_STEP_HOURS[0])
    .map((a) => a.title);

  const before = kpiBeforeExecution ?? kpi;
  const kpiKeys: (keyof KpiState)[] = ["quality", "delivery", "teamEngagement", "stakeholderAlignment", "leaderEnergy"];
  const increased = kpiKeys.filter((key) => kpi[key] > before[key]);

  return (
    <section aria-labelledby="exec-d1-title">
      <div className="rounded-3xl border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
        <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-[#E4003F]">D-1 RECAP</p>
        <h2 id="exec-d1-title" className="mt-2 text-center text-xl sm:text-2xl font-extrabold tracking-tight text-black/90">
          {executionScreenCopy.popupTitle}
        </h2>
        <p className="mt-4 whitespace-pre-line text-center text-[15px] leading-[1.85] text-black/75">{executionScreenCopy.popupIntro}</p>

        <div className="mt-6 rounded-2xl border border-black/10 bg-[#f8f9fa] p-5">
          <p className="text-[13px] font-extrabold text-black/85">{executionScreenCopy.popupBadgesLabel}</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {badges.length > 0 ? (
              badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center justify-center rounded-full bg-[#1E3A5F]/10 px-3 py-1 text-[13px] font-extrabold text-[#1E3A5F] ring-1 ring-black/10"
                >
                  🏅 [{b}]
                </span>
              ))
            ) : (
              <span className="text-[13px] font-semibold text-black/55">선택한 액션이 없습니다.</span>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-black/10 bg-[#f8f9fa] p-5">
          <p className="text-[13px] font-extrabold text-black/85">{executionScreenCopy.popupKpiLabel}</p>
          {increased.length > 0 ? (
            <ul className="mt-3 space-y-2 text-[14px] leading-[1.85] text-black/75">
              {increased.map((key) => (
                <li key={key}>
                  <span className="font-extrabold text-black/90">{KPI_LABELS[key]}</span> {before[key]}점 ➔{" "}
                  <span className="font-extrabold text-black/90">{kpi[key]}점</span>{" "}
                  <span className="font-extrabold text-emerald-700">({executionScreenCopy.popupKpiRise})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[13px] font-semibold text-black/55">변동된 지표가 없습니다.</p>
          )}
        </div>

        <p className="mt-6 whitespace-pre-line text-center text-[17px] font-extrabold leading-[1.85] text-black/85">
          {executionScreenCopy.popupOutro}
        </p>
      </div>
    </section>
  );
}
