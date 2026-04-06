"use client";

import { planSurvivalCopy } from "@/content/planRecap";
import SeniorTipsPanel from "@/components/shared/SeniorTipsPanel";

interface PlanSurvivalProps {
  userName: string;
}

export function PlanSurvival({ userName }: PlanSurvivalProps) {
  return (
    <SeniorTipsPanel
      title={planSurvivalCopy.title}
      intro={planSurvivalCopy.intro}
      stories={planSurvivalCopy.stories}
      prompt={planSurvivalCopy.prompt}
      placeholder={planSurvivalCopy.placeholder}
      userName={userName}
      postItNotes={planSurvivalCopy.postItNotes}
    />
  );
}
