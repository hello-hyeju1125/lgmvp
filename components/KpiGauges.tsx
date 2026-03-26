"use client";

import { useStore } from "@/store/useStore";

export function KpiGauges() {
  const { kpi } = useStore();

  const items = [
    {
      label: "산출물 품질",
      value: kpi.quality,
      kind: "kpi" as const,
      help: "산출물의 완성도와 실효성을 나타내며 높을수록 현업 적용 가능성이 커집니다.",
    },
    {
      label: "일정 준수",
      value: kpi.delivery,
      kind: "kpi" as const,
      help: "계획된 마일스톤을 제때 달성하고 있는지를 보여주는 일정 진행 지표입니다.",
    },
    {
      label: "팀 몰입도",
      value: kpi.teamEngagement,
      kind: "kpi" as const,
      help: "팀원들이 목표에 얼마나 자발적으로 참여하고 협업에 몰입하는지를 의미합니다.",
    },
    {
      label: "이해관계자 조율",
      value: kpi.stakeholderAlignment,
      kind: "kpi" as const,
      help: "유관부서와 임원진의 협조 수준 및 프로젝트 지지도를 나타내는 지표입니다.",
    },
    {
      label: "리더 에너지",
      value: kpi.leaderEnergy,
      kind: "energy" as const,
      help: "리더가 의사결정과 실행을 지속할 수 있는 시간·체력 자원의 잔량을 뜻합니다.",
    },
  ] as const;

  return (
    <div className="bg-[#0B0F19] px-6 py-3">
      <div className="mx-auto w-full max-w-4xl">
        <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-5">
          {items.map(({ label, value, kind, help }) => {
            const clamped = Math.max(0, Math.min(100, value));
            const isEnergy = kind === "energy";
            return (
              <div key={label} className="relative group">
                <div
                  aria-label={`${label}: ${help}`}
                  className={`flex h-12 min-w-0 items-center justify-between gap-2 rounded-[0.35rem] border px-3 ${
                    isEnergy ? "border-white/20 bg-white/5" : "border-white/10 bg-white/0"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-1.5">
                    {isEnergy && (
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E4003F]/15 text-[#E4003F] ring-1 ring-white/10">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                          <path d="M13.4 2.2c.6 0 1 .55.88 1.13l-1.04 5.1h6.12c.82 0 1.2 1.01.58 1.55L10.7 21.7c-.55.65-1.6.1-1.45-.73l1.03-5.16H4.1c-.82 0-1.2-1.01-.58-1.55L12.8 2.5c.17-.2.4-.3.6-.3Z" />
                        </svg>
                      </span>
                    )}
                    <span
                      className={`${isEnergy ? "truncate text-white/90" : "truncate text-white/80"} text-[11px] font-extrabold sm:text-[12px]`}
                    >
                      {label}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 text-[12px] font-extrabold ${isEnergy ? "text-[#E4003F]" : "text-white/75"}`}
                  >
                    {Math.round(value)}%
                  </span>
                </div>

                <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-[240px] -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <div className="rounded-[0.35rem] border border-white/10 bg-black/85 px-3 py-2 text-[12px] font-semibold leading-relaxed text-white/90 shadow-[0_14px_40px_rgba(0,0,0,0.45)] backdrop-blur">
                    <span className="font-extrabold text-[#E4003F]">{label}</span>
                    <span className="text-white/70"> · </span>
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
