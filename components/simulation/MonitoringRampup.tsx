"use client";

import { monitoringRampupCopy } from "@/content/monitoringRecap";
import PhaseRampup from "@/components/shared/PhaseRampup";

interface MonitoringRampupProps {
  userName: string;
}

export function MonitoringRampup({ userName }: MonitoringRampupProps) {
  const phases = monitoringRampupCopy.phases.map((phase) => ({
    label: phase.label,
    text: phase.text,
    state: ("isCurrent" in phase && phase.isCurrent ? "next" : "upcoming") as "done" | "next" | "upcoming",
  }));

  return (
    <PhaseRampup
      title={monitoringRampupCopy.title}
      intro={`${monitoringRampupCopy.intro}\n${monitoringRampupCopy.body1}\n${monitoringRampupCopy.body2}`}
      phases={phases}
      outro={monitoringRampupCopy.outro}
      userName={userName}
    />
  );
}
