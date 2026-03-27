"use client";

import { useStore } from "@/store/useStore";

export function KpiGauges() {
  const { kpi } = useStore();

  const items = [
    {
      label: "산출물 품질",
      value: kpi.quality,
      kind: "kpi" as const,
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
          <path d="M8.5 12l2.2 2.2L15.5 9.5" />
        </svg>
      ),
      help: "산출물의 완성도와 실효성을 나타내며 높을수록 현업 적용 가능성이 커집니다.",
    },
    {
      label: "일정 준수",
      value: kpi.delivery,
      kind: "kpi" as const,
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      ),
      help: "계획된 마일스톤을 제때 달성하고 있는지를 보여주는 일정 진행 지표입니다.",
    },
    {
      label: "팀 몰입도",
      value: kpi.teamEngagement,
      kind: "kpi" as const,
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="9" cy="9" r="3" />
          <circle cx="16" cy="10" r="2.5" />
          <path d="M4.5 18c.7-2.4 2.6-4 4.5-4s3.8 1.6 4.5 4" />
          <path d="M13 18c.4-1.5 1.6-2.5 3-2.5 1.4 0 2.6 1 3 2.5" />
        </svg>
      ),
      help: "팀원들이 목표에 얼마나 자발적으로 참여하고 협업에 몰입하는지를 의미합니다.",
    },
    {
      label: "이해관계자 조율",
      value: kpi.stakeholderAlignment,
      kind: "kpi" as const,
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 7h12" />
          <path d="M13 4l3 3-3 3" />
          <path d="M20 17H8" />
          <path d="M11 14l-3 3 3 3" />
        </svg>
      ),
      help: "유관부서와 임원진의 협조 수준 및 프로젝트 지지도를 나타내는 지표입니다.",
    },
    {
      label: "리더 에너지",
      value: kpi.leaderEnergy,
      kind: "energy" as const,
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M13.4 2.2c.6 0 1 .55.88 1.13l-1.04 5.1h6.12c.82 0 1.2 1.01.58 1.55L10.7 21.7c-.55.65-1.6.1-1.45-.73l1.03-5.16H4.1c-.82 0-1.2-1.01-.58-1.55L12.8 2.5c.17-.2.4-.3.6-.3Z" />
        </svg>
      ),
      help: "리더가 의사결정과 실행을 지속할 수 있는 시간·체력 자원의 잔량을 뜻합니다.",
    },
  ] as const;

  return (
    <div className="bg-white px-6 py-3">
      <div className="mx-auto w-full max-w-4xl">
        <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-5">
          {items.map(({ label, value, kind, icon, help }) => {
            const clamped = Math.max(0, Math.min(100, value));
            const isEnergy = kind === "energy";
            return (
              <div key={label} className="group relative min-w-0" aria-label={`${label}: ${help}`}>
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      isEnergy ? "bg-[#E4003F]/12 text-[#E4003F]" : "bg-[#89E586]/20 text-[#3F9C3C]"
                    }`}
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                  <span className="truncate text-[12px] font-extrabold text-black/80">
                    {label}
                  </span>
                </div>
                <div className="kpi-bar-track mt-2 h-2.5 w-full overflow-hidden rounded-full">
                  <div
                    className={`kpi-bar-fill h-full rounded-full transition-[width] duration-500 ${isEnergy ? "kpi-bar-fill-energy" : "kpi-bar-fill-kpi"}`}
                    style={{ width: `${clamped}%` }}
                  />
                </div>

                <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-[240px] -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <div className="rounded-[0.35rem] border border-black/10 bg-white px-3 py-2 text-[12px] font-semibold leading-relaxed text-black/85 shadow-[0_14px_40px_rgba(0,0,0,0.15)]">
                    <span
                      className="font-extrabold"
                      style={{ color: isEnergy ? "#000000" : "#89E586", backgroundColor: "transparent" }}
                    >
                      {label}
                    </span>
                    <span className="text-black/45"> · </span>
                    <span className="font-extrabold">{Math.round(value)}%</span>
                    <br />
                    {help}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
