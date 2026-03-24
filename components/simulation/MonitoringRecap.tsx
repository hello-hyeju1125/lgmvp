"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { monitoringRecapCopy } from "@/content/monitoringRecap";
import { ep10Options } from "@/content/episode10";
import type { KpiState } from "@/store/useStore";

interface MonitoringRecapProps {
  userName: string;
}

const KPI_KEYS: (keyof KpiState)[] = [
  "quality",
  "delivery",
  "teamEngagement",
  "stakeholderAlignment",
  "leaderEnergy",
];

export function MonitoringRecap({ userName }: MonitoringRecapProps) {
  const router = useRouter();
  const { kpi, episode10Choice } = useStore();
  const ep10Opt = episode10Choice ? ep10Options.find((o) => o.id === episode10Choice) : null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">{monitoringRecapCopy.title}</h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{monitoringRecapCopy.intro}&quot;</p>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="font-medium text-[#4A4A4A] text-sm mb-3">{monitoringRecapCopy.summaryTitle}</p>
        <ul className="space-y-4">
          {monitoringRecapCopy.summaryItems.map((item, i) => (
            <li key={i} className="text-sm text-[#6B6B6B]">
              <span className="font-medium text-[#4A4A4A]">• {item.title}</span>
              <p className="mt-1 leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="font-medium text-[#4A4A4A] text-sm mb-3">{monitoringRecapCopy.myDecisionsTitle}</p>
        <ul className="space-y-2 text-sm text-[#6B6B6B]">
          <li>
            <span className="font-medium text-[#4A4A4A]">• {monitoringRecapCopy.e9Label}</span>
            <span className="ml-1">{monitoringRecapCopy.e9Value}</span>
          </li>
          <li>
            <span className="font-medium text-[#4A4A4A]">• {monitoringRecapCopy.e10Label}</span>
            <span className="ml-1">
              {ep10Opt ? `[옵션 ${ep10Opt.id}: ${ep10Opt.title}]` : "—"}
            </span>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="font-medium text-[#4A4A4A] text-sm mb-2">{monitoringRecapCopy.dashboardTitle}</p>
        <ul className="text-sm text-[#6B6B6B] space-y-1">
          {KPI_KEYS.map((key) => (
            <li key={key}>
              • {monitoringRecapCopy.kpiLabels[key]}: {kpi[key]}점
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
