"use client";

import { useStore } from "@/store/useStore";
import { planningActions } from "@/content/planningActions";
import { ep3Options, getEp3Result } from "@/content/episode3";
import { ep4Options, getEp4Result } from "@/content/episode4";
import { ep5Options, getEp5Result } from "@/content/episode5";
import PhaseRecap from "@/components/shared/PhaseRecap";
const KPI_KEYS = ["quality", "delivery", "teamEngagement", "stakeholderAlignment", "leaderEnergy"] as const;
const KPI_LABELS = { quality: "산출물 품질", delivery: "일정 준수", teamEngagement: "팀 몰입도", stakeholderAlignment: "이해관계자 조율", leaderEnergy: "리더의 에너지" };

const SUMMARY_ITEMS = [
  "자율성과 책임을 부여하는 사람 관리(People Management): 본업이 바쁜 비상주 인력이나 전문가 집단에게 가장 필요한 것은 리더의 세세한 마이크로매니징이 아닙니다. 달성해야 할 명확한 결과물을 제시하고 과정의 자율성을 보장할 때, 그들은 오너십을 가지고 200%의 퍼포먼스를 발휘합니다.",
  "'Why'를 연결하는 업무 위임 (Delegation): 누구나 기피하는 단순 반복 업무를 지시할 때, 조직의 논리로 읍소하거나 기계적인 1/N로 나누는 것은 하책입니다. 그 업무가 전체 프로젝트에서 가지는 핵심 가치를 재정의하고, 팀원의 개인적인 성장(커리어 니즈)과 연결해 주는 '의미 부여'가 자발적 몰입을 이끌어냅니다.",
  "집단 지성을 깨우는 안전한 충돌 (Debate Maker): 팀원 간/부서 간의 입장 차이가 팽팽한 기획 회의에서, 갈등을 덮기 위한 적당한 타협이나 리더의 독단적인 결정은 프로젝트를 병들게 합니다. 리더는 구성원들이 각자의 입장을 넘어 전체의 목표를 위해 치열하게 논쟁하도록 판을 깔아주는 '퍼실리테이터(Facilitator)'가 되어야 합니다.",
];

interface PlanRecapProps {
  userName: string;
}

export function PlanRecap({ userName }: PlanRecapProps) {
  const { kpi, initiationActionHours, planningActionHours, episode3Choice, episode4Choice, episode5Choice } = useStore();

  const actionItemsWithHours = planningActions
    .map((a) => ({ ...a, hours: planningActionHours[a.id] ?? 0 }))
    .filter((a) => a.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const ep3Opt = episode3Choice ? ep3Options.find((o) => o.id === episode3Choice) : null;
  const ep4Opt = episode4Choice ? ep4Options.find((o) => o.id === episode4Choice) : null;
  const ep5Opt = episode5Choice ? ep5Options.find((o) => o.id === episode5Choice) : null;

  const ep3Result = episode3Choice ? getEp3Result(episode3Choice, planningActionHours["resource_assign"] ?? 0) : null;
  const ep4Result = episode4Choice ? getEp4Result(episode4Choice, initiationActionHours["team_profile"] ?? 0) : null;
  const ep5Result = episode5Choice ? getEp5Result(episode5Choice) : null;

  return (
    <PhaseRecap
      title="기획(Planning) 단계 완료!"
      intro="프로젝트의 밑그림을 그리는 기획 주간이 끝났습니다. 체계적인 프로젝트 플랜과 협업 프로세스가 정립되었습니다."
      summaryTitle="성공하는 프로젝트 리더의 뼈대 세우기"
      summaryItems={SUMMARY_ITEMS}
      decisionsTitle="나의 의사결정"
      decisions={[
        { label: "Action Item 에너지 배분", value: actionItemsWithHours.map((a) => `${a.title} (${a.hours}H)`).join(", ") || "—" },
        { label: "E3", value: episode3Choice && ep3Opt ? `[옵션 ${ep3Opt.id}: ${ep3Opt.title}]` : "—" },
        { label: "E4", value: episode4Choice && ep4Opt ? `[옵션 ${ep4Opt.id}: ${ep4Opt.title}]` : "—" },
        { label: "E5", value: episode5Choice && ep5Opt ? `[옵션 ${ep5Opt.id}: ${ep5Opt.title}]` : "—" },
      ]}
      dashboardTitle="현재 KPI 현황"
      kpis={KPI_KEYS.map((key) => ({ label: KPI_LABELS[key], value: kpi[key] }))}
      footer="의사결정을 수행하시느라 고생 많으셨습니다."
    />
  );
}
