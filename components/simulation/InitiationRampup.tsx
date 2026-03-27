"use client";

import { initiationRampupCopy } from "@/content/initiationRecap";
import PhaseRampup from "@/components/shared/PhaseRampup";

interface InitiationRampupProps {
  userName: string;
}

export function InitiationRampup({ userName }: InitiationRampupProps) {
  const phases = initiationRampupCopy.phases.map((text, i) => ({
    label: text,
    text: "",
    state: (i === 1 ? "next" : i === 0 ? "done" : "upcoming") as "done" | "next" | "upcoming",
  }));

  return (
    <PhaseRampup
      title={initiationRampupCopy.title}
      intro={`${initiationRampupCopy.intro}\n${initiationRampupCopy.body}`}
      phases={phases}
      outro={initiationRampupCopy.outro}
      userName={userName}
    />
  );
}
