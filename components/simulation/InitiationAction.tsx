"use client";

import { useStore } from "@/store/useStore";
import { initiationActions, initiationScreenCopy } from "@/content/initiationActions";
import ActionAllocation from "@/components/shared/ActionAllocation";

interface InitiationActionProps {
  userName: string;
  stage?: "intro" | "alloc";
}

export function InitiationAction({ userName, stage = "alloc" }: InitiationActionProps) {
  const { initiationActionHours, setInitiationActionHours } = useStore();

  if (stage === "intro") {
    return (
      <ActionAllocation
        phaseTitle="착수 액션 배분"
        totalHours={16}
        actions={initiationActions.map((a) => ({ id: a.id, title: a.title, description: a.description, pmbok: a.pmbok, min: 0, max: 8 }))}
        allocations={initiationActionHours}
        onAllocate={(id, hours) => setInitiationActionHours({ ...initiationActionHours, [id]: hours })}
        introTitle="일주일 뒤, 당장 투입입니다."
        introLines={[initiationScreenCopy.scenarioIntro, initiationScreenCopy.timeRule, initiationScreenCopy.pmbokExplanation]}
      />
    );
  }

  return (
    <ActionAllocation
      phaseTitle="착수 액션 배분"
      totalHours={16}
      actions={initiationActions.map((a) => ({ id: a.id, title: a.title, description: a.description, pmbok: a.pmbok, min: 0, max: 8 }))}
      allocations={initiationActionHours}
      onAllocate={(id, hours) => setInitiationActionHours({ ...initiationActionHours, [id]: hours })}
    />
  );
}
