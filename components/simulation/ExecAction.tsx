"use client";

import { useStore } from "@/store/useStore";
import { executionActions, executionScreenCopy } from "@/content/executionActions";
import ActionAllocation from "@/components/shared/ActionAllocation";

interface ExecActionProps {
  userName: string;
  stage?: "intro" | "alloc";
}

export function ExecAction({ userName, stage = "alloc" }: ExecActionProps) {
  const { executionActionHours, setExecutionActionHours } = useStore();
  return (
    <ActionAllocation
      phaseTitle="실행 액션 배분"
      totalHours={16}
      actions={executionActions.map((a) => ({
        id: a.id,
        title: a.title,
        description: `${a.description}${a.glossary ? ` (${a.glossary})` : ""}`,
        pmbok: a.pmbok,
        min: 0,
        max: 8,
      }))}
      allocations={executionActionHours}
      onAllocate={(id, hours) => setExecutionActionHours({ ...executionActionHours, [id]: hours })}
      introTitle={stage === "intro" ? "실행의 첫 스프린트를 시작합니다." : undefined}
      introLines={stage === "intro" ? [executionScreenCopy.intro1, executionScreenCopy.intro2, executionScreenCopy.intro3, executionScreenCopy.sprintGlossary] : undefined}
    />
  );
}
