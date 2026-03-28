"use client";

import { useStore } from "@/store/useStore";
import type { KpiState } from "@/store/useStore";
import { Calendar, Handshake, Target, Users, Zap } from "lucide-react";

const KPI_ROWS: {
  field: keyof Pick<KpiState, "quality" | "delivery" | "teamEngagement" | "stakeholderAlignment" | "leaderEnergy">;
  label: string;
  Icon: typeof Target;
  help: string;
}[] = [
  {
    field: "quality",
    label: "산출물 품질",
    Icon: Target,
    help: "결과물의 완성도와 실효성을 나타내는 품질 지표입니다.",
  },
  {
    field: "delivery",
    label: "일정 준수",
    Icon: Calendar,
    help: "계획한 마일스톤을 제때 달성하고 있는지를 보여줍니다.",
  },
  {
    field: "teamEngagement",
    label: "팀 몰입도",
    Icon: Users,
    help: "팀원들이 목표에 자발적으로 참여하고 협업에 몰입하는 수준입니다.",
  },
  {
    field: "stakeholderAlignment",
    label: "이해관계자 조율",
    Icon: Handshake,
    help: "유관부서·임원진의 협조와 프로젝트 지지도 수준을 의미합니다.",
  },
  {
    field: "leaderEnergy",
    label: "리더 에너지",
    Icon: Zap,
    help: "리더가 의사결정과 실행을 지속할 수 있는 한정 자원입니다.",
  },
];

export function KpiGauges() {
  const { kpi } = useStore();

  return (
    <div className="border-b border-black/20 bg-white px-4 py-2.5 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-5 items-center gap-2">
          {KPI_ROWS.map(({ field, label, Icon, help }) => {
            const value = Math.max(0, Math.min(100, kpi[field]));
            const isEnergy = field === "leaderEnergy";
            return (
              <div key={field} className="group relative min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-[#111]" aria-hidden>
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <div className="kpi-bar-track h-2 w-full overflow-hidden rounded-none border-2 border-black">
                    <div
                      className={`h-full transition-[width] duration-1000 ease-out ${isEnergy ? "kpi-bar-fill-energy" : "kpi-bar-fill-kpi"}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-max min-w-[120px] -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <div className="sim-hud-tooltip min-w-[220px] max-w-[260px] px-2.5 py-2 text-left font-sans text-[11px] font-semibold text-white">
                    <span className="font-black text-[#89E586]">{label}</span>
                    <span className="sim-hud-tooltip-muted"> · </span>
                    <span className="font-black">{Math.round(value)}%</span>
                    <p className="mt-1 leading-relaxed">{help}</p>
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
