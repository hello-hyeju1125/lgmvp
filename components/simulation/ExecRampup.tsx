"use client";

import { executionRampupCopy } from "@/content/executionRecap";
import PhaseRampup from "@/components/shared/PhaseRampup";

interface ExecRampupProps {
  userName: string;
}

export function ExecRampup({ userName }: ExecRampupProps) {
  const intro = `${executionRampupCopy.intro}\n${executionRampupCopy.body1}\n${executionRampupCopy.body2}`;
  const phases = executionRampupCopy.phases.map((phase, i) => ({
    label: phase.label,
    text: phase.text,
    state: (i <= 2 ? "done" : i === 3 ? "next" : "upcoming") as "done" | "next" | "upcoming",
  }));

  return (
    <PhaseRampup
      title="Ramp-up"
      intro={intro}
      phases={phases}
      outro={executionRampupCopy.outro}
      userName={userName}
    />
  );
}
