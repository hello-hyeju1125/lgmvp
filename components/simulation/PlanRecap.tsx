"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { planningActions } from "@/content/planningActions";
import { ep3Options } from "@/content/episode3";
import { ep4Options } from "@/content/episode4";
import { ep5Options } from "@/content/episode5";

const RECAP_INTRO =
  "프로젝트의 밑그림을 그리는 기획 주간이 끝났습니다. 리더님의 결단으로 체계적인 프로젝트 플랜과 협업 프로세스가 정립되었습니다. 이제 팀원들은 혼선 없이 각자의 전문성을 발휘하며 목표를 향해 나아갈 것입니다.";

const SUMMARY_ITEMS = [
  {
    title: "자율성과 책임을 부여하는 사람 관리(People Management)",
    body: "본업이 바쁜 비상주 인력이나 전문가 집단에게 가장 필요한 것은 리더의 세세한 마이크로매니징이 아닙니다. 달성해야 할 명확한 결과물을 제시하고 과정의 자율성을 보장할 때, 그들은 오너십을 가지고 200%의 퍼포먼스를 발휘합니다.",
  },
  {
    title: "'Why'를 연결하는 업무 위임 (Delegation)",
    body: "누구나 기피하는 단순 반복 업무를 지시할 때, 조직의 논리로 읍소하거나 기계적인 1/N로 나누는 것은 하책입니다. 그 업무가 전체 프로젝트에서 가지는 핵심 가치를 재정의하고, 팀원의 개인적인 성장(커리어 니즈)과 연결해 주는 '의미 부여'가 자발적 몰입을 이끌어냅니다.",
  },
  {
    title: "집단 지성을 깨우는 안전한 충돌 (Debate Maker)",
    body: "팀원 간/부서 간의 입장 차이가 팽팽한 기획 회의에서, 갈등을 덮기 위한 적당한 타협이나 리더의 독단적인 결정은 프로젝트를 병들게 합니다. 리더는 구성원들이 각자의 입장을 넘어 전체의 목표를 위해 치열하게 논쟁하도록 판을 깔아주는 '퍼실리테이터(Facilitator)'가 되어야 합니다.",
  },
];

interface PlanRecapProps {
  userName: string;
}

export function PlanRecap({ userName }: PlanRecapProps) {
  const router = useRouter();
  const { kpi, planningActionHours, episode3Choice, episode4Choice, episode5Choice } = useStore();

  const actionItemsWithHours = planningActions
    .map((a) => ({ ...a, hours: planningActionHours[a.id] ?? 0 }))
    .filter((a) => a.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const ep3Opt = episode3Choice ? ep3Options.find((o) => o.id === episode3Choice) : null;
  const ep4Opt = episode4Choice ? ep4Options.find((o) => o.id === episode4Choice) : null;
  const ep5Opt = episode5Choice ? ep5Options.find((o) => o.id === episode5Choice) : null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">기획(Planning) 단계 완료!</h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{RECAP_INTRO}&quot;</p>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="font-medium text-[#4A4A4A] text-sm mb-3">[기획 단계 핵심 요약] 성공하는 프로젝트 리더의 뼈대 세우기</p>
        <ul className="space-y-4">
          {SUMMARY_ITEMS.map((item, i) => (
            <li key={i} className="text-sm text-[#6B6B6B]">
              <span className="font-medium text-[#4A4A4A]">• {item.title}</span>
              <p className="mt-1 leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="font-medium text-[#4A4A4A] text-sm mb-3">[나의 의사결정 기록]</p>
        <ul className="space-y-2 text-sm text-[#6B6B6B]">
          <li>
            <span className="font-medium text-[#4A4A4A]">• E4. Action Item 에너지 배분:</span>
            <ul className="mt-1 ml-4 list-disc list-inside space-y-0.5">
              {actionItemsWithHours.length > 0 ? (
                actionItemsWithHours.map((a) => (
                  <li key={a.id}>[{a.title} ({a.hours} H)]</li>
                ))
              ) : (
                <li>—</li>
              )}
            </ul>
          </li>
          <li>
            <span className="font-medium text-[#4A4A4A]">• E5. 비상주 팀원은 투명인간?:</span>
            <span className="ml-1">{ep3Opt ? `[옵션 ${ep3Opt.id}: ${ep3Opt.title}] 선택` : "—"}</span>
          </li>
          <li>
            <span className="font-medium text-[#4A4A4A]">• E6. &quot;이게 왜 제 일입니까?&quot;:</span>
            <span className="ml-1">{ep4Opt ? `[옵션 ${ep4Opt.id}: ${ep4Opt.title}] 선택` : "—"}</span>
          </li>
          <li>
            <span className="font-medium text-[#4A4A4A]">• E7. 충돌하는 요구사항: 핵심 전략의 뼈대 세우기:</span>
            <span className="ml-1">{ep5Opt ? `[옵션 ${ep5Opt.id}: ${ep5Opt.title}] 선택` : "—"}</span>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="font-medium text-[#4A4A4A] text-sm mb-2">[현재 대시보드 상태]</p>
        <ul className="text-sm text-[#6B6B6B] space-y-1">
          <li>• 산출물 품질: {kpi.quality}점</li>
          <li>• 일정 준수: {kpi.delivery}점</li>
          <li>• 팀 몰입도: {kpi.teamEngagement}점</li>
          <li>• 이해관계자 조율: {kpi.stakeholderAlignment}점</li>
          <li>• 리더의 에너지: {kpi.leaderEnergy}점</li>
        </ul>
      </div>

    </div>
  );
}
