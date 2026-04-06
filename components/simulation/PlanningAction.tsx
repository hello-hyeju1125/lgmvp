"use client";

import { useStore } from "@/store/useStore";
import { planningActions, planningScreenCopy } from "@/content/planningActions";
import { HOURS_PER_TOGGLE, InitiationStyleActionPhase } from "@/components/simulation/InitiationStyleActionPhase";

interface PlanningActionProps {
  userName: string;
}

export function PlanningAction({ userName }: PlanningActionProps) {
  const { planningActionHours, setPlanningActionHours } = useStore();

  const toggle = (actionId: string) => {
    const cur = planningActionHours[actionId] ?? 0;
    setPlanningActionHours({
      ...planningActionHours,
      [actionId]: cur > 0 ? 0 : HOURS_PER_TOGGLE,
    });
  };

  const tipBullets = [
    "폭풍 같았던 착수 단계가 지나고, 프로젝트의 목표와 범위가 어느 정도 합의되었습니다. 하지만 진정한 위기는 이제부터입니다.",
    "당신의 기획 전략에 따라 상단의 5가지 상태 지표가 변화하며, 앞으로 다가올 실행 단계의 난이도가 결정됩니다.",
  ];

  return (
    <InitiationStyleActionPhase
      userName={userName}
      briefingBadge="항해 지도를 그릴 시간입니다."
      scenarioLines={[planningScreenCopy.intro1]}
      instructionLine={null}
      tipBullets={tipBullets}
      actions={planningActions}
      hoursByAction={planningActionHours}
      onToggleAction={toggle}
      maxSelected={2}
      showActionCards
    />
  );
}
