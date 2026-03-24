"use client";

import { useStore } from "@/store/useStore";

export function KpiGauges() {
  const { kpi } = useStore();

  const items = [
    { label: "산출물 품질", value: kpi.quality, kind: "kpi" as const },
    { label: "일정 준수", value: kpi.delivery, kind: "kpi" as const },
    { label: "팀 몰입도", value: kpi.teamEngagement, kind: "kpi" as const },
    { label: "이해관계자 조율", value: kpi.stakeholderAlignment, kind: "kpi" as const },
    { label: "리더 에너지", value: kpi.leaderEnergy, kind: "energy" as const },
  ] as const;

  return (
    <div className="bg-[#0B0F19] px-6 py-3">
      <div className="mx-auto w-full max-w-4xl">
        <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-5">
          {items.map(({ label, value, kind }) => {
            const clamped = Math.max(0, Math.min(100, value));
            const isEnergy = kind === "energy";
            return (
              <div
                key={label}
                className={`flex min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-3 ${
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
                    className={`${isEnergy ? "text-white/90" : "truncate text-white/80"} text-[11px] font-extrabold sm:text-[12px]`}
                  >
                    {label}
                  </span>
                </div>

                <span className={`shrink-0 text-[12px] font-extrabold ${isEnergy ? "text-[#E4003F]" : "text-white/75"}`}>
                  {Math.round(value)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
