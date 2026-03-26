/** Screen 11. 기획 단계 40시간 액션 배분 */
export const PLANNING_TOTAL_HOURS = 40;
export const PLANNING_MIN_PER_ACTION = 3;
export const PLANNING_MAX_PER_ACTION = 15;

/** 1~5단계 = 3, 6, 9, 12, 15시간 */
export const PLANNING_STEP_HOURS = [3, 6, 9, 12, 15] as const;

export const planningScreenCopy = {
  intro1:
    "폭풍 같았던 착수 단계가 지나고, 프로젝트의 목표와 범위가 어느 정도 합의되었습니다. 하지만 진정한 위기는 이제부터입니다. \"어떻게(How)\" 만들 것인지에 대한 촘촘한 WBS(Work Breakdown Structure, 작업 분류 구조도)와 리스크 대비책이 없다면, 실행 단계에서 팀은 곧바로 좌초하게 됩니다.",
  intro2:
    "본격적인 실행에 들어가기 전, 당신에게 허락된 기획을 고도화 할 수 있는 시간은 총 40시간(5일)입니다. 아래 제시된 '기획 단계 핵심 액션'들을 확인하고, 한정된 시간을 어디에 집중적으로 배분할지 결정하십시오. 당신의 기획 전략에 따라 상단의 5가지 상태 지표가 변화하며, 앞으로 다가올 실행 단계의 난이도가 결정됩니다.",
  popupTitle: "기획 및 설계 완료 (본격 실행 D-1)",
  popupIntro: "리더님의 치밀했던 기획 주간이 지났습니다. 선택하신 액션에 따라 아래와 같은 항해 지도를 완성했습니다.",
  popupBadgesLabel: "획득한 PMBOK 뱃지:",
  popupKpiLabel: "지표의 변화:",
  popupKpiRise: "상승 ▲",
  popupOutro:
    "액션 아이템 에너지 배분을 토대로,\n이제 프로젝트의 실행력을 확보하는 기획 단계에 접어들었습니다.\n프로젝트의 전체적인 로드맵을 그려나가는 중요한 시점,\n정태영 책임이 다소 무거운 표정으로 회의에 참석합니다",
};

export interface PlanningActionItem {
  id: string;
  title: string;
  description: string;
  pmbok: string;
  effect: string[];
}

export const planningActions: PlanningActionItem[] = [
  {
    id: "wbs",
    title: "6개월 마일스톤 및 WBS 초안 수립",
    description:
      "6개월간의 굵직한 마일스톤을 세우고, 각 팀원이 언제 무엇을 해야 하는지 엑셀로 촘촘하게 WBS 초안을 스케치합니다. 이후 실무진의 피드백을 받아 빈틈없는 일정표의 뼈대를 완성합니다.",
    pmbok:
      "[일정 관리 (Schedule Management)] 프로젝트 활동을 정의하고, 순서를 배열하며, 기간을 산정하여 현실적인 프로젝트 일정을 개발하는 기법을 체득했습니다.",
    effect: ["일정 준수 상승", "산출물 품질 상승"],
  },
  {
    id: "resource_assign",
    title: "비상주 핵심 인원(인프라보안) 리소스 공식 할당받기",
    description:
      "일주일에 한두 번만 참여하는 비상주 인원(정태영 책임)의 소속 부서 팀장에게 공식 메일을 보내고 찾아갑니다. 우리 프로젝트의 전사적 중요성을 어필하고, 매주 특정 요일만큼은 반드시 우리 업무에 리소스를 할당하겠다는 확답을 받아냅니다.",
    pmbok:
      "[자원 관리 (Resource Management)] 매트릭스 조직에서 타 부서의 인적 자원을 확보(Acquire Resources)하고 협상을 통해 물리적 리소스 제약을 돌파하는 스킬을 습득했습니다.",
    effect: ["이해관계자 조율 상승", "일정 준수 대폭 상승"],
  },
  {
    id: "it_security_study",
    title: "IT 아키텍처 및 데이터 보안 규정(Blocker) 사전 스터디",
    description:
      "사내 IT 아키텍처 가이드라인 및 데이터 보안 규정 문서를 정독합니다. 클라우드 연동이나 외부 망 반출 시 실행 단계에서 개발의 발목을 잡을 수 있는 치명적인 '블로커' 요인들을 사전에 식별하고 우회로를 고민합니다.",
    pmbok:
      "[리스크 관리 (Risk Management)] 프로젝트에 부정적 영향을 미칠 수 있는 기술적/규제적 리스크를 조기에 식별(Identify Risks)하고, 대응 전략을 수립하는 프레임워크를 장착했습니다.",
    effect: ["산출물 품질 상승"],
  },
  {
    id: "comm_rule",
    title: "비상주 팀원 커뮤니케이션 룰(Rule) 셋팅",
    description:
      "물리적 시차가 있는 Sarah Lee(북미 마케팅) 및 타 부서 상주 인원들과 화상 미팅을 잡습니다. 업무 지시는 이메일로, 긴급 논의는 사내 메신저로 하는 등 툴 사용 목적을 통일하고, 명확한 응답 기준 시간을 사전에 합의하여 사일로를 방지합니다.",
    pmbok:
      "[의사소통 관리 (Communications Management)] 다양한 이해관계자의 정보 요구사항을 분석하고, 가장 효과적인 소통 채널과 주기를 설계하는 의사소통 계획 수립 능력을 길렀습니다.",
    effect: ["팀 몰입도 상승", "이해관계자 조율 상승"],
  },
  {
    id: "lessons_learned",
    title: "과거 실패 사례(Lessons Learned) 및 리스크 체크리스트 분석",
    description:
      "과거 사내에서 실패했던 유사한 DX 프로젝트의 사후 분석 보고서를 찾아 실패의 근본 원인을 파악합니다. 본인이 과거에 썼던 '비행 전 체크리스트'를 이번 프로젝트 버전에 맞게 수정하여 돌발 변수에 대비합니다.",
    pmbok:
      "[OPA(Organizational Process Assets, 조직 프로세스 자산화) 활용 및 지식 관리] 과거의 실패와 성공 경험(Lessons Learned)을 현재 프로젝트의 자산으로 통합하여, 반복되는 실수를 방지하는 관리 역량을 강화했습니다.",
    effect: ["산출물 품질 상승"],
  },
];

/** 팝업용 뱃지 표시명 (PMBOK 짧은 이름) */
export const PLANNING_BADGE_NAMES: Record<string, string> = {
  wbs: "일정 관리",
  resource_assign: "자원 관리",
  it_security_study: "리스크 관리",
  comm_rule: "의사소통 관리",
  lessons_learned: "OPA 및 지식 관리",
};

export function getPlanningKpiDelta(
  hoursByAction: Record<string, number>
): Partial<Record<"quality" | "delivery" | "teamEngagement" | "stakeholderAlignment" | "leaderEnergy", number>> {
  const delta = { quality: 0, delivery: 0, teamEngagement: 0, stakeholderAlignment: 0, leaderEnergy: 0 };
  const h = (id: string) => Math.min(25, Math.max(0, hoursByAction[id] ?? 0));
  delta.delivery += Math.round(h("wbs") * 0.6);
  delta.quality += Math.round(h("wbs") * 0.4);
  delta.stakeholderAlignment += Math.round(h("resource_assign") * 0.6);
  delta.delivery += Math.round(h("resource_assign") * 1.0);
  delta.quality += Math.round(h("it_security_study") * 0.8);
  delta.teamEngagement += Math.round(h("comm_rule") * 0.5);
  delta.stakeholderAlignment += Math.round(h("comm_rule") * 0.5);
  delta.quality += Math.round(h("lessons_learned") * 0.6);
  return delta;
}
