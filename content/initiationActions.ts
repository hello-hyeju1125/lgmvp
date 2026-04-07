/** Screen 5. 착수 단계 40시간 액션 배분 */
export const INITIATION_TOTAL_HOURS = 40;
export const INITIATION_MIN_PER_ACTION = 3;
export const INITIATION_MAX_PER_ACTION = 15;

/** 1~5단계 = 3, 6, 9, 12, 15시간 (3의 배수) */
export const INITIATION_STEP_HOURS = [3, 6, 9, 12, 15] as const;

export const initiationScreenCopy = {
  briefingBadge: "일주일 뒤, 당장 투입입니다.",
  scenarioLines: [
    "리더 발령 소식을 듣고 불과 **1주일 뒤**,\n프로젝트 킥오프 회의가 잡혔습니다.",
    "당신은 **AI 전문가가 아니며**, 김혁기 부사장은\n당초 예상보다 더 **파격적인 목표 달성**을 기대하고 있습니다.",
    "제한된 준비 기회 안에서, 당신은 무엇을 가장 먼저 선택하겠습니까?",
  ],
  selectionInstruction:
    "아래 5개의 액션 카드를 검토하고, 그 중 2개를 선택해 주세요.",
  /** 안내 문장 (첫 줄 + 줄바꿈 + 둘째 줄) */
  instructionLine: {
    line1Prefix: "아래 ",
    highlight: "5개의 액션 카드",
    line1Suffix: "를 검토하고,",
    line2: "그 중 2개를 선택해 주세요.",
  },
  tipBullets: [
    "선택하신 액션 카드는 화면 상단의 5가지 지표와 향후 의사결정 흐름에 영향을 미칩니다.",
    "각 액션 카드는 특정 PMBOK* 지식영역과 연결되어 있습니다.\n\n* PMBOK(Project Management Body of Knowledge): 미국의 프로젝트 관리 전문 단체인 PMI(Project Management Institute)가 정리한, 프로젝트 관리의 글로벌 표준입니다.",
  ],
  popupIntro:
    "리더님의 치열했던 일주일이 지났습니다.\n선택하신 액션에 따라 아래와 같은 준비를 마쳤습니다.",
  popupBadgesLabel: "획득한 PMBOK 뱃지:",
  popupKpiLabel: "지표의 변화:",
  popupKpiRise: "상승 ▲",
  popupOutro: "일주일 간의 준비 기간이 끝나자, 상무님께서 잠깐 보자고 하십니다.",
};

export interface InitiationActionItem {
  id: string;
  title: string;
  description: string;
  pmbok: string;
  effect: string[];
}

export const initiationActions: InitiationActionItem[] = [
  {
    id: "champion_1on1",
    title: "프로젝트 챔피언과의 1-on-1 미팅",
    description: "직속 상사이자 프로젝트 챔피언인 최성민 상무와 티타임을 잡고, C-level이 기대하는 '파격적인 목표'의 실체와 성과 달성에 대한 의중을 파악합니다.",
    pmbok: "[프로젝트 헌장(Project Charter) 개발] 프로젝트의 목적, 고수준의 요구사항, 스폰서의 기대를 공식화하는 착수 단계의 핵심 과정을 이해했습니다.",
    effect: ["산출물 품질 상승", "이해관계자 조율 상승"],
  },
  {
    id: "mentoring",
    title: "선배 PM에게 노하우 전수받기 (사내 멘토링)",
    description: "과거 유사한 전사 프로젝트를 성공적으로 이끌었던 타 부서 선배 PM을 찾아가 밥을 사며, 초기 팀 빌딩 노하우와 프로젝트 추진 시 예상되는 잠재적 리스크 및 유의사항에 대해 조언을 구합니다.",
    pmbok: "[전문가 판단 (Expert Judgment) 및 OPA(Organizational Process Assets, 조직 프로세스 자산화) 활용] 경험자의 통찰력과 OPA를 활용하여 초기 불확실성을 줄이는 기법을 체득했습니다.",
    effect: ["일정 준수 상승"],
  },
  {
    id: "pmbok_study",
    title: "PMBOK 및 PM 실무 방법론 속성 스터디",
    description: "프로젝트 리더로서의 시작을 철저히 준비하고자, 'PMBOK 가이드'와 '애자일/워터폴 프로젝트 관리' 서적을 탐독하며 리더로서의 관리 프레임워크를 머릿속에 세웁니다.",
    pmbok: "[프로젝트 관리 프레임워크 (PM Framework)] 프로젝트 5단계 프로세스와 10대 지식 영역의 뼈대를 이해하여 6개월간의 로드맵을 그릴 수 있게 되었습니다.",
    effect: ["일정 준수 상승", "산출물 품질 상승"],
  },
  {
    id: "stakeholder_interview",
    title: "핵심 이해관계자(현업) 사전 인터뷰",
    description: "마케팅/CS 구성원들 중 대시보드를 실제로 자주 사용하게 될 실무 담당자들을 찾아가, 현재 가장 큰 고충이 무엇인지 인터뷰합니다.",
    pmbok: "[이해관계자 식별 (Identify Stakeholders)] 프로젝트에 영향을 미치거나 영향을 받는 사람들을 조기에 파악하고, 그들의 기대치와 영향력을 분석하는 방법을 습득했습니다.",
    effect: ["이해관계자 조율 대폭 상승"],
  },
  {
    id: "team_profile",
    title: "상주 팀원 프로필 확인 및 티타임 갖기",
    description: "상주 팀원 4명의 업무 스타일과 강점에 대한 대내외 피드백을 수집하고, 각 팀원과의 티타임을 통해 본 프로젝트에 대한 그들의 기대 및 우려 사항을 파악합니다.",
    pmbok: "[EEF(Enterprise Environmental Factors, 기업 환경 요인) 분석 - 인적 자원] 조직 내 가용한 인적 자원의 역량과 제약 조건을 선제적으로 파악하여 팀 빌딩의 기초를 다졌습니다.",
    effect: ["팀 몰입도 대폭 상승"],
  },
];

export type InitiationActionId = typeof initiationActions[number]["id"];

/** 액션별 KPI 델타 (투자 시간 5~25에 비례, 단순 선형) */
export function getInitiationKpiDelta(hoursByAction: Record<string, number>): Partial<Record<"quality" | "delivery" | "teamEngagement" | "stakeholderAlignment" | "leaderEnergy", number>> {
  const delta = { quality: 0, delivery: 0, teamEngagement: 0, stakeholderAlignment: 0, leaderEnergy: 0 };
  const h = (id: string) => Math.min(25, Math.max(0, hoursByAction[id] ?? 0));
  // 챔피언 1on1
  const c = h("champion_1on1");
  delta.stakeholderAlignment += Math.round(c * 0.8);
  delta.quality += Math.round(c * 0.4);
  // 멘토링
  delta.delivery += Math.round(h("mentoring") * 0.6);
  // PMBOK 스터디
  const p = h("pmbok_study");
  delta.delivery += Math.round(p * 0.4);
  delta.quality += Math.round(p * 0.4);
  // 이해관계자 인터뷰
  delta.stakeholderAlignment += Math.round(h("stakeholder_interview") * 1.2);
  // 팀원 프로필
  delta.teamEngagement += Math.round(h("team_profile") * 1.0);
  return delta;
}
