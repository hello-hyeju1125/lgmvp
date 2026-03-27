"use client";

import { useStore } from "@/store/useStore";
import { initiationRecapCopy } from "@/content/initiationRecap";
import { initiationActions } from "@/content/initiationActions";
import { ep1Options } from "@/content/episode1";
import { ep2AlignOptions } from "@/content/episode2Align";
import PhaseRecap from "@/components/shared/PhaseRecap";

interface InitiationRecapProps {
  userName: string;
}

const KPI_KEYS = [
  "quality",
  "delivery",
  "teamEngagement",
  "stakeholderAlignment",
  "leaderEnergy",
] as const;

export function InitiationRecap({ userName }: InitiationRecapProps) {
  const { initiationActionHours, episode1Choice, episode2AlignChoice, kpi } = useStore();

  const e1Items = initiationActions
    .filter((a) => (initiationActionHours[a.id] ?? 0) > 0)
    .map((a) => `${a.title} (${initiationActionHours[a.id] ?? 0}H)`);

  const e2Label =
    episode1Choice != null
      ? `[옵션 ${episode1Choice}: ${ep1Options.find((o) => o.id === episode1Choice)?.title ?? ""}] 선택`
      : "—";

  const e3Label =
    episode2AlignChoice != null
      ? `[옵션 ${episode2AlignChoice}: ${ep2AlignOptions.find((o) => o.id === episode2AlignChoice)?.title ?? ""}] 선택`
      : "—";

  return (
    <PhaseRecap
      title={initiationRecapCopy.title}
      intro={initiationRecapCopy.intro}
      summaryTitle={initiationRecapCopy.summaryTitle}
      summaryItems={initiationRecapCopy.summaryItems}
      decisionsTitle={initiationRecapCopy.myDecisionsTitle}
      decisions={[
        { label: initiationRecapCopy.e1Label, value: e1Items.join(", ") || "—" },
        { label: initiationRecapCopy.e2Label, value: e2Label },
        { label: initiationRecapCopy.e3Label, value: e3Label },
      ]}
      dashboardTitle={initiationRecapCopy.dashboardTitle}
      kpis={KPI_KEYS.map((key) => ({ label: initiationRecapCopy.kpiLabels[key], value: kpi[key] }))}
      footer={initiationRecapCopy.recapFooterNote}
    />
  );
}
