"use client";

import { useStore } from "@/store/useStore";
import { executionRecapCopy } from "@/content/executionRecap";
import { executionActions } from "@/content/executionActions";
import { ep6Block1Options, ep6Block2Options, ep6Block3Options, ep6Block4Options, getEp6Result } from "@/content/episode6";
import { ep7Options, getEp7Result } from "@/content/episode7";
import PhaseRecap from "@/components/shared/PhaseRecap";

const KPI_KEYS = [
  "quality",
  "delivery",
  "teamEngagement",
  "stakeholderAlignment",
  "leaderEnergy",
] as const;
const KPI_LABELS = executionRecapCopy.kpiLabels;

interface ExecRecapProps {
  userName: string;
}

export function ExecRecap({ userName }: ExecRecapProps) {
  const { kpi, executionActionHours, episode6Blocks, episode7Choice, episode8CoachingText } = useStore();

  const actionItemsWithHours = executionActions
    .map((a) => ({ ...a, hours: executionActionHours[a.id] ?? 0 }))
    .filter((a) => a.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const ep7Opt = episode7Choice ? ep7Options.find((o) => o.id === episode7Choice) : null;
  const ep7Result = episode7Choice ? getEp7Result(episode7Choice, executionActionHours["voc_data"] ?? 0, executionActionHours["ref_benchmark"] ?? 0) : null;

  const ep6Summary = (() => {
    if (!episode6Blocks) return "—";
    const b1 = ep6Block1Options.find((o) => o.id === episode6Blocks.block1)?.label ?? episode6Blocks.block1;
    const b2 = ep6Block2Options.find((o) => o.id === episode6Blocks.block2)?.label ?? episode6Blocks.block2;
    const b3 = ep6Block3Options.find((o) => o.id === episode6Blocks.block3)?.label ?? episode6Blocks.block3;
    const b4 = ep6Block4Options.find((o) => o.id === episode6Blocks.block4)?.label ?? episode6Blocks.block4;
    return `[${b1}]에게 [${b2}]을 통해 [${b3}], [${b4}]를 선택했습니다.`;
  })();
  const ep6Result = episode6Blocks ? getEp6Result(episode6Blocks.block4, episode6Blocks.block2) : null;

  return (
    <PhaseRecap
      title="실행(Execution) 단계 완료!"
      intro="실행 단계의 복잡한 이해관계와 현장 이슈를 통과했습니다. 다음 단계에서 리스크를 통제합니다."
      summaryTitle="성공하는 프로젝트 리더의 현장 관리법"
      summaryItems={executionRecapCopy.summaryItems.map((i) => `${i.title} ${i.body}`)}
      decisionsTitle="나의 의사결정"
      decisions={[
        { label: "Action Item 에너지 배분", value: actionItemsWithHours.map((a) => `${a.title} (${a.hours}H)`).join(", ") || "—" },
        { label: "E6", value: ep6Summary },
        { label: "E7", value: episode7Choice && ep7Opt ? `[옵션 ${ep7Opt.id}: ${ep7Opt.title}]` : "—" },
        { label: "E8", value: episode8CoachingText?.trim() || "—" },
      ]}
      dashboardTitle="현재 KPI 현황"
      kpis={KPI_KEYS.map((key) => ({ label: KPI_LABELS[key], value: kpi[key] }))}
      footer="실행 단계를 무사히 완주하셨습니다."
    />
  );
}
