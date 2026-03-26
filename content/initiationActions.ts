/** Screen 5. 착수 단계 40시간 액션 배분 */
export const INITIATION_TOTAL_HOURS = 40;
export const INITIATION_MIN_PER_ACTION = 3;
export const INITIATION_MAX_PER_ACTION = 15;

/** 1~5단계 = 3, 6, 9, 12, 15시간 (3의 배수) */
export const INITIATION_STEP_HOURS = [3, 6, 9, 12, 15] as const;

export const initiationScreenCopy = {
  scenarioIntro:
    "리더 발령 소식을 듣고 불과 **1주일 뒤**, 프로젝트 킥오프 회의가 잡혔습니다. 당신은 **AI 전문가가 아니며**, 심지어 C-level 김혁기 본부장은 당초 예상보다 더 **파격적인 목표 달성**을 기대한다는 소문이 들립니다. 킥오프 전, 당신은 제한된 시간 동안 무엇에 가장 집중하겠습니까?",
  timeRule:
    "킥오프까지 당신에게 허락된 준비 시간은 총 **40시간(5일)**입니다. 아래 제시된 '**착수 단계 핵심 액션**'들을 확인하고, 당신의 전략에 맞춰 시간을 배분해 보십시오. 각 액션에 투입할 시간은 **최소 1단계(3시간)**부터 **최대 5단계(15시간)**까지 자유롭게 설정할 수 있습니다. 어떤 액션에 집중하느냐에 따라 **PMBOK 기반의 실무 지식**을 습득하게 되며, 당신의 선택은 화면 상단의 **5가지 상태 지표**에 즉각적으로 반영됩니다.",
  pmbokExplanation:
    "**PMBOK**이란, 미국 프로젝트관리협회(PMI)에서 발행하는 '프로젝트 관리의 글로벌 표준 가이드'(Project Management Body of Knowledge)입니다. 전 세계 수많은 프로젝트의 성공과 실패 사례를 분석하여, 리더가 프로젝트를 성공적으로 이끌기 위해 반드시 알아야 할 지식과 프로세스를 체계적으로 정리한 '**PM들의 바이블(정석)**'이라고 할 수 있습니다. 본 시뮬레이션에서 액션을 통해 **PMBOK 지식**을 습득하면, 불확실한 상황에서 더 정확한 의사결정을 내릴 수 있는 **리더십 역량**이 강화됩니다.",
  popupTitle: "착수 준비 완료 (D-1)",
  popupIntro: "리더님의 치열했던 일주일이 지났습니다. 선택하신 액션에 따라 아래와 같은 준비를 마쳤습니다.",
  popupBadgesLabel: "획득한 PMBOK 뱃지:",
  popupKpiLabel: "지표의 변화:",
  popupKpiRise: "상승 ▲",
  popupOutro: "자, 치열했던 준비 시간을 끝으로, 상무님께서 잠깐 보자고 하십니다.",
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
    title: "챔피언인 최성민 상무와의 1on1",
    description: "직속 상사이자 프로젝트 챔피언인 최성민 상무와 티타임을 잡고, C-level이 기대하는 '파격적인 목표'의 실체와 성과 달성에 대한 의중을 파악합니다.",
    pmbok: "[프로젝트 헌장(Project Charter) 개발] 프로젝트의 목적, 고수준의 요구사항, 스폰서의 기대를 공식화하는 착수 단계의 핵심 과정을 이해했습니다.",
    effect: ["이해관계자 조율 상승", "산출물 품질 상승"],
  },
  {
    id: "mentoring",
    title: "선배 PM에게 노하우 전수받기 (사내 멘토링)",
    description: "과거 유사한 전사 프로젝트를 성공적으로 이끌었던 타 부서 선배 PM을 찾아가 밥을 사며, 초기 팀 빌딩 노하우와 프로젝트 추진 시 예상되는 잠재적 리스크 및 유의사항에 대해 조언을 구합니다.",
    pmbok: "[전문가 판단 (Expert Judgment) 및 OPA(Organizational Process Assets, 조직 프로세스 자산화) 활용] OPA와 경험자의 통찰력을 활용하여 초기 불확실성을 줄이는 기법을 체득했습니다.",
    effect: ["일정 준수 상승"],
  },
  {
    id: "pmbok_study",
    title: "PMBOK 및 PM 실무 방법론 속성 스터디",
    description: "비전문가라는 불안감을 없애기 위해, 주말을 반납하고 'PMBOK 가이드'와 '애자일/워터폴 프로젝트 관리' 서적을 탐독하며 리더로서의 관리 프레임워크를 머릿속에 세웁니다.",
    pmbok: "[프로젝트 관리 프레임워크 (PM Framework)] 프로젝트 5단계 프로세스와 10대 지식 영역의 뼈대를 이해하여 6개월간의 로드맵을 그릴 수 있게 되었습니다.",
    effect: ["일정 준수 상승", "산출물 품질 상승"],
  },
  {
    id: "stakeholder_interview",
    title: "핵심 이해관계자(현업) 사전 인터뷰",
    description: "대시보드를 실제로 사용하게 될 마케팅/CS 실무진 중 영향력이 큰 구성원들을 찾아가, 현재 수작업의 가장 큰 고충이 무엇인지 인터뷰합니다.",
    pmbok: "[이해관계자 식별 (Identify Stakeholders)] 프로젝트에 영향을 미치거나 영향을 받는 사람들을 조기에 파악하고, 그들의 기대치와 영향력을 분석하는 방법을 습득했습니다.",
    effect: ["이해관계자 조율 대폭 상승"],
  },
  {
    id: "team_profile",
    title: "상주 팀원 프로필 분석 및 가벼운 티타임",
    description: "나를 도와줄 팀원 4명의 업무적 특성 및 강점에 대한 대내외 피드백을 수집하고, 킥오프 전 가벼운 커피챗을 통해 그들의 커리어적 기대치와 성향을 미리 파악합니다.",
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
