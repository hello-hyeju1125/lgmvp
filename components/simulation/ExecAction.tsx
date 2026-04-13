"use client";

import { useStore } from "@/store/useStore";
import { executionActions, executionScreenCopy, EXEC_ACTION_MAX_SELECTED } from "@/content/executionActions";
import { HOURS_PER_TOGGLE, InitiationStyleActionPhase } from "@/components/simulation/InitiationStyleActionPhase";

interface ExecActionProps {
  userName: string;
}

export function ExecAction({ userName }: ExecActionProps) {
  const { executionActionHours, setExecutionActionHours } = useStore();

  const toggle = (actionId: string) => {
    const cur = executionActionHours[actionId] ?? 0;
    setExecutionActionHours({
      ...executionActionHours,
      [actionId]: cur > 0 ? 0 : HOURS_PER_TOGGLE,
    });
  };

  return (
    <InitiationStyleActionPhase
      userName={userName}
      briefingBadge={executionScreenCopy.briefingBadge}
      scenarioLines={[executionScreenCopy.execScenarioIntro]}
      instructionLine={null}
      tipBullets={[]}
      actions={executionActions}
      hoursByAction={executionActionHours}
      onToggleAction={toggle}
      maxSelected={EXEC_ACTION_MAX_SELECTED}
      showActionCards
    />
  );
}
