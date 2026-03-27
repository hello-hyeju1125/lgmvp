"use client";

import { useStore } from "@/store/useStore";
import { planningActions, planningScreenCopy } from "@/content/planningActions";
import ActionAllocation from "@/components/shared/ActionAllocation";

interface PlanningActionProps {
  userName: string;
  stage?: "intro" | "alloc";
}

export function PlanningAction({ userName, stage = "alloc" }: PlanningActionProps) {
  const { planningActionHours, setPlanningActionHours } = useStore();
  return (
    <ActionAllocation
      phaseTitle="기획 액션 배분"
      totalHours={16}
      actions={planningActions.map((a) => ({ id: a.id, title: a.title, description: a.description, pmbok: a.pmbok, min: 0, max: 8 }))}
      allocations={planningActionHours}
      onAllocate={(id, hours) => setPlanningActionHours({ ...planningActionHours, [id]: hours })}
      introTitle={stage === "intro" ? "항해 지도를 그릴 시간입니다." : undefined}
      introLines={stage === "intro" ? [planningScreenCopy.intro1, planningScreenCopy.intro2] : undefined}
    />
  );
}
