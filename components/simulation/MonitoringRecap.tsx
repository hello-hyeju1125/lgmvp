"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { monitoringRecapCopy } from "@/content/monitoringRecap";
import { ep10Options } from "@/content/episode10";
import PhaseRecap from "@/components/shared/PhaseRecap";

interface MonitoringRecapProps {
  userName: string;
}

const KPI_KEYS = ["quality", "delivery", "teamEngagement", "stakeholderAlignment", "leaderEnergy"] as const;

export function MonitoringRecap({ userName }: MonitoringRecapProps) {
  const { kpi, episode10Choice } = useStore();
  const ep10Opt = episode10Choice ? ep10Options.find((o) => o.id === episode10Choice) : null;

  return (
    <PhaseRecap
      title={monitoringRecapCopy.title}
      intro={monitoringRecapCopy.intro}
      summaryTitle={monitoringRecapCopy.summaryTitle}
      summaryItems={monitoringRecapCopy.summaryItems.map((i) => `${i.title} ${i.body}`)}
      decisionsTitle={monitoringRecapCopy.myDecisionsTitle}
      decisions={[
        { label: monitoringRecapCopy.e9Label, value: monitoringRecapCopy.e9Value },
        { label: monitoringRecapCopy.e10Label, value: ep10Opt ? `[옵션 ${ep10Opt.id}: ${ep10Opt.title}]` : "—" },
      ]}
      dashboardTitle={monitoringRecapCopy.dashboardTitle}
      kpis={KPI_KEYS.map((key) => ({ label: monitoringRecapCopy.kpiLabels[key], value: kpi[key] }))}
    />
  );
}
