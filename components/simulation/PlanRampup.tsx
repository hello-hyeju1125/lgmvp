"use client";
import PhaseRampup from "@/components/shared/PhaseRampup";

const INTRO =
  "실제 사례를 기반으로 만든 에피소드들과 선배 PM들의 꿀팁까지, 깊이 와닿으셨나요?\n빈틈없는 항해 지도를 그리는 '기획(Planning)' 단계를 훌륭하게 완수하셨습니다.\n하지만 지금부터 본격 시작입니다.\n현장에서는 예기치 못한 돌발 변수들이 늘 존재하니까요.";

const PHASES = [
  {
    label: "[착수 단계]",
    text: "프로젝트의 존재 이유(목적)를 정의하고 든든한 후원자(스폰서)를 확보하여 첫 단추를 꿰는 시간입니다.",
  },
  {
    label: "[기획 단계]",
    text: "완벽한 항해 지도를 그리고 자원과 R&R을 분배하는 시간입니다. 리더님께서 방금 무사히 통과하신 바로 그 관문입니다.",
  },
  {
    label: "[실행 단계]",
    text: "팀원들이 현장에서 본격적으로 아웃풋을 만들어냅니다. 잦은 야근, 유관부서의 이기주의, 그리고 실무진의 번아웃에 시달리게 됩니다.",
  },
  {
    label: "[감시 및 통제 단계]",
    text: "완벽했던 계획이 틀어지는 순간입니다. 수시로 터지는 리스크를 매니지하는 리더의 역량이 시험대에 오릅니다.",
  },
  {
    label: "[종료 단계]",
    text: "마침내 성과를 입증하고, 팀원들의 노고를 공정하게 평가하여 '성공적인 피날레(혹은 다음을 위한 자산)'를 만들어내는 마지막 관문입니다.",
  },
];

const OUTRO =
  "자, 이제 계획을 현실로 바꾸기 위해 팀원들이 업무에 집중하여\n아웃풋을 산출해 내는 [실행 단계]로 진입해 봅시다.";

interface PlanRampupProps {
  userName: string;
}

export function PlanRampup({ userName }: PlanRampupProps) {
  const phases = PHASES.map((p, i) => ({
    label: p.label,
    text: p.text,
    state: (i <= 1 ? "done" : i === 2 ? "next" : "upcoming") as "done" | "next" | "upcoming",
  }));

  return (
    <PhaseRampup
      title="Ramp-up"
      intro={`${INTRO}\n앞으로 당신은 프로젝트의 다음 여정을 통과하게 됩니다.`}
      phases={phases}
      outro={OUTRO}
      userName={userName}
    />
  );
}
