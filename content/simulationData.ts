import type { KpiState } from "@/store/useStore";

export interface SimEffects {
  quality: number;
  schedule: number;
  engagement: number;
  stakeholder: number;
  energy: number;
}

export interface SimChoice {
  id: string;
  text: string;
  effects: SimEffects;
}

export interface SimStep {
  type: "action_item" | "event";
  stage: string;
  title: string;
  maxSelect?: number;
  choices: SimChoice[];
}

export function toKpiDelta(
  effects: SimEffects,
): Partial<Record<keyof KpiState, number>> {
  return {
    quality: effects.quality,
    delivery: effects.schedule,
    teamEngagement: effects.engagement,
    stakeholderAlignment: effects.stakeholder,
    leaderEnergy: effects.energy,
  };
}

export const initialStats: SimEffects = {
  quality: 70,
  schedule: 70,
  engagement: 70,
  stakeholder: 70,
  energy: 100,
};

export const initialKpi: KpiState = {
  quality: initialStats.quality,
  delivery: initialStats.schedule,
  teamEngagement: initialStats.engagement,
  stakeholderAlignment: initialStats.stakeholder,
  leaderEnergy: initialStats.energy,
};

export const scenarioSteps: SimStep[] = [
  // ──── 1. 착수 단계 ────
  {
    type: "action_item",
    stage: "착수",
    title: "Action Items (2개 선택)",
    maxSelect: 2,
    choices: [
      { id: "i1", text: "1) 프로젝트 챔피언과의 1-on-1 미팅", effects: { quality: 3, schedule: 0, engagement: 0, stakeholder: 3, energy: -2 } },
      { id: "i2", text: "2) 선배 PM에게 노하우 전수받기", effects: { quality: 0, schedule: 3, engagement: 3, stakeholder: 0, energy: -2 } },
      { id: "i3", text: "3) PMBOK 및 PM 실무 방법론 속성 스터디", effects: { quality: 3, schedule: 3, engagement: 0, stakeholder: 0, energy: -2 } },
      { id: "i4", text: "4) 핵심 이해관계자(현업) 사전 인터뷰", effects: { quality: 0, schedule: 0, engagement: 0, stakeholder: 3, energy: -2 } },
      { id: "i5", text: "5) 상주 팀원 프로필 확인 및 티타임 갖기", effects: { quality: 0, schedule: 0, engagement: 3, stakeholder: 0, energy: -2 } },
    ],
  },
  {
    type: "event",
    stage: "착수",
    title: "E1. 위에서 떨어진 폭탄",
    choices: [
      { id: "e1_a", text: "A. 리더의 역할은 완벽한 방패막", effects: { quality: 0, schedule: 0, engagement: 2, stakeholder: -5, energy: -7 } },
      { id: "e1_b", text: "B. 데이터로 무장한 논리적 방어", effects: { quality: 0, schedule: 0, engagement: -3, stakeholder: -5, energy: -9 } },
      { id: "e1_c", text: "C. 근본적 질문을 통한 사고의 확장", effects: { quality: 2, schedule: 5, engagement: 2, stakeholder: 0, energy: -6 } },
    ],
  },
  {
    type: "event",
    stage: "착수",
    title: "E2. 유관부서와의 동상이몽",
    choices: [
      { id: "e2_a", text: "A. High Level 질문 던지기", effects: { quality: 3, schedule: 0, engagement: 2, stakeholder: 0, energy: -6 } },
      { id: "e2_b", text: "B. 타협안을 도출하기", effects: { quality: -3, schedule: 0, engagement: -3, stakeholder: 0, energy: -7 } },
      { id: "e2_c", text: "C. 요구사항 정리하기", effects: { quality: -3, schedule: 3, engagement: -5, stakeholder: 0, energy: -7 } },
    ],
  },

  // ──── 2. 기획 단계 ────
  {
    type: "action_item",
    stage: "기획",
    title: "Action Items (2개 선택)",
    maxSelect: 2,
    choices: [
      { id: "p1", text: "1) 6개월 마일스톤 및 WBS 초안 수립", effects: { quality: 3, schedule: 3, engagement: 0, stakeholder: 0, energy: -2 } },
      { id: "p2", text: "2) 비상주 핵심 인원 리소스 공식 할당받기", effects: { quality: 0, schedule: 3, engagement: 0, stakeholder: 3, energy: -2 } },
      { id: "p3", text: "3) IT 아키텍처 및 데이터 보안 규정 사전 스터디", effects: { quality: 3, schedule: 3, engagement: 0, stakeholder: 0, energy: -2 } },
      { id: "p4", text: "4) 비상주 팀원 커뮤니케이션 룰 세팅", effects: { quality: 0, schedule: 0, engagement: 3, stakeholder: 3, energy: -2 } },
      { id: "p5", text: "5) 과거 실패 사례 및 리스크 체크리스트 분석", effects: { quality: 3, schedule: 3, engagement: 0, stakeholder: 0, energy: -2 } },
    ],
  },
  {
    type: "event",
    stage: "기획",
    title: "E3. 소속 팀 업무가 먼저 아닙니까?",
    choices: [
      { id: "e3_a", text: "A. 결과로 말하기", effects: { quality: 4, schedule: 0, engagement: 4, stakeholder: 0, energy: -5 } },
      { id: "e3_b", text: "B. 공감하고 일단 지켜보기", effects: { quality: -3, schedule: 0, engagement: 2, stakeholder: 0, energy: -10 } },
      { id: "e3_c", text: "C. 해야할 일을 꼼꼼하게 짚어주기", effects: { quality: 2, schedule: 5, engagement: -3, stakeholder: 0, energy: -8 } },
      { id: "e3_d", text: "D. 소속 부서 팀장을 통해 해결하기", effects: { quality: -3, schedule: 3, engagement: -8, stakeholder: -3, energy: -9 } },
    ],
  },
  {
    type: "event",
    stage: "기획",
    title: "E4. 이게 왜 제 일입니까?",
    choices: [
      { id: "e4_a", text: "A. 논리를 토대로 설득하기", effects: { quality: -3, schedule: 0, engagement: -3, stakeholder: 0, energy: -7 } },
      { id: "e4_b", text: "B. 일정 부분 같이 나눠 하기", effects: { quality: 0, schedule: 0, engagement: -3, stakeholder: 0, energy: -12 } },
      { id: "e4_c", text: "C. 관점을 다르게 하기", effects: { quality: 3, schedule: -3, engagement: 4, stakeholder: 0, energy: -6 } },
      { id: "e4_d", text: "D. 공평하게 분배하기", effects: { quality: -8, schedule: -5, engagement: 0, stakeholder: 0, energy: -9 } },
      { id: "e4_e", text: "E. 업무 여력이 있어 보이는 타 팀원에게 배분하기", effects: { quality: 0, schedule: -5, engagement: 0, stakeholder: 0, energy: -5 } },
    ],
  },
  {
    type: "event",
    stage: "기획",
    title: "E5. 우리의 청사진, 어떻게 그릴 것인가?",
    choices: [
      { id: "e5_a", text: "A. 속전속결로 진행하기", effects: { quality: 0, schedule: 5, engagement: -8, stakeholder: -3, energy: -8 } },
      { id: "e5_b", text: "B. 모두 함께 결정하기", effects: { quality: -8, schedule: -3, engagement: 2, stakeholder: 0, energy: -9 } },
      { id: "e5_c", text: "C. 리더가 먼저 고민하기", effects: { quality: -3, schedule: 2, engagement: -5, stakeholder: 0, energy: -10 } },
      { id: "e5_d", text: "D. 끝장 토론하기", effects: { quality: 4, schedule: -2, engagement: 3, stakeholder: 0, energy: -9 } },
    ],
  },

  // ──── 3. 실행 단계 ────
  {
    type: "action_item",
    stage: "실행",
    title: "Action Items (4개 선택)",
    maxSelect: 4,
    choices: [
      { id: "ex1", text: "1) VOC Raw Data 직접 뜯어보기", effects: { quality: 3, schedule: 0, engagement: 0, stakeholder: 3, energy: -2 } },
      { id: "ex2", text: "2) 타사 AI 대시보드 벤치마킹 조사", effects: { quality: 3, schedule: 0, engagement: 0, stakeholder: 0, energy: -2 } },
      { id: "ex3", text: "3) AI 비전공자 PM을 위한 AI 속성 스터디", effects: { quality: 0, schedule: 3, engagement: 0, stakeholder: 0, energy: -2 } },
      { id: "ex4", text: "4) 데일리 스크럼 운영 룰 도입", effects: { quality: 0, schedule: 3, engagement: 3, stakeholder: 0, energy: -2 } },
      { id: "ex5", text: "5) 상주 팀원 1on1 티타임", effects: { quality: 0, schedule: 0, engagement: 3, stakeholder: 0, energy: -2 } },
      { id: "ex6", text: "6) 초임 리더의 압박감 덜어내기", effects: { quality: 0, schedule: 0, engagement: 3, stakeholder: 0, energy: -2 } },
      { id: "ex7", text: "7) 임원진1장짜리 주간 보고 체계 수립", effects: { quality: 0, schedule: 0, engagement: 0, stakeholder: 3, energy: -2 } },
      { id: "ex8", text: "8) 회의 운영 방식 셋팅", effects: { quality: 3, schedule: 0, engagement: 3, stakeholder: 0, energy: -2 } },
      { id: "ex9", text: "9) 산출물 교차 검수 룰 셋팅", effects: { quality: 3, schedule: 3, engagement: 0, stakeholder: 0, energy: -2 } },
      { id: "ex10", text: "10) 병목(Bottleneck) 핫라인 구축", effects: { quality: 0, schedule: 3, engagement: 0, stakeholder: 3, energy: -2 } },
    ],
  },
  {
    type: "event",
    stage: "실행",
    title: "E6. 핑퐁 게임을 멈춰라!",
    choices: [
      { id: "e6_1", text: "엔딩 1: '장애물 제거자'", effects: { quality: 0, schedule: 7, engagement: 3, stakeholder: 6, energy: -7 } },
      { id: "e6_2", text: "엔딩 2: '권위주의자'", effects: { quality: 0, schedule: -5, engagement: -3, stakeholder: -8, energy: -9 } },
      { id: "e6_3", text: "엔딩 3: '서류형 관리자'", effects: { quality: 0, schedule: -3, engagement: 0, stakeholder: 2, energy: -7 } },
      { id: "e6_4", text: "엔딩 4: '핑퐁 연장자'", effects: { quality: 0, schedule: -5, engagement: -3, stakeholder: -5, energy: -9 } },
    ],
  },
  {
    type: "event",
    stage: "실행",
    title: "E7. 길 잃은 열정, 어떻게 이끌 것인가?",
    choices: [
      { id: "e7_a", text: "A. 내 경험과 정답 공유하기", effects: { quality: -5, schedule: 3, engagement: -3, stakeholder: 0, energy: -5 } },
      { id: "e7_b", text: "B. 질문으로 생각 정리 돕기", effects: { quality: 6, schedule: 0, engagement: 7, stakeholder: 0, energy: -6 } },
      { id: "e7_c", text: "C. 자신감 북돋기", effects: { quality: -5, schedule: 0, engagement: 2, stakeholder: 0, energy: -4 } },
      { id: "e7_d", text: "D. 도전과제 제시하기", effects: { quality: 6, schedule: 3, engagement: 6, stakeholder: 0, energy: -6 } },
    ],
  },

  // ──── 4. 감시 및 통제 단계 ────
  {
    type: "event",
    stage: "감시 및 통제",
    title: "E10. 치명적인 결함, 실패를 다루는 리더의 방식",
    choices: [
      { id: "e10_a", text: "A. 결과의 엄중함 상기", effects: { quality: 0, schedule: -5, engagement: -5, stakeholder: 0, energy: -11 } },
      { id: "e10_b", text: "B. 책임 공방을 방지하고 근본 원인을 찾기", effects: { quality: 3, schedule: -3, engagement: 3, stakeholder: 0, energy: -8 } },
      { id: "e10_c", text: "C. 심리적 안전감을 제공하기", effects: { quality: 3, schedule: 0, engagement: 4, stakeholder: 0, energy: -10 } },
    ],
  },
];
