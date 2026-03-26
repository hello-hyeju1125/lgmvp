/** Screen 20. 실행 단계 80시간 액션 배분 */
export const EXECUTION_TOTAL_HOURS = 80;
export const EXECUTION_MIN_PER_ACTION = 3;
export const EXECUTION_MAX_PER_ACTION = 15;
export const EXECUTION_STEP_HOURS = [3, 6, 9, 12, 15] as const;

export interface ExecutionActionItem {
  id: string;
  title: string;
  description: string;
  pmbok: string;
  effect: string[];
  /** [용어 사전] 등 추가 설명 (선택) */
  glossary?: string;
}

export const executionScreenCopy = {
  intro1:
    "치밀한 기획을 마쳤으니, 실제 업무가 본격적으로 시작됩니다. 실행 단계는 전체 6개월의 프로젝트 중 가장 길고 험난한 마라톤 구간이 될 것입니다.",
  intro2:
    "지금부터 본격적인 '첫 2주간의 개발 스프린트(Sprint)'가 시작됩니다. 당신에게 주어진 총 80시간(10일)의 리더십 에너지를 아래 10가지 액션 중 어디에 집중적으로 배분하시겠습니까?",
  intro3: "(각 액션은 최소 5시간부터 최대 25시간까지 자유롭게 배분할 수 있습니다. 80시간을 모두 소진하여 팀의 실행력을 극대화하십시오!)",
  sprintGlossary:
    "스프린트(Sprint)란, 규모가 큰 프로젝트를 1~2주 단위의 짧은 주기로 쪼개어 구체적인 산출물을 집중적으로 개발하고, 수시로 방향을 점검하여 리스크를 최소화하는 애자일(Agile) 핵심 업무 방식입니다.",
  section1: "[도메인 지식 및 실무 밀착 지원]",
  section2: "[팀원 멘탈 케어 및 조직 문화]",
  section3: "[이해관계자 소통 및 병목 예방]",
  popupTitle: "실행 완료",
  popupIntro:
    "리더님의 실행 단계 액션 선택이 1차 스프린트 시작 직전 팀 상태에 반영되었습니다.\n아래에서 확보한 실행 역량과 지표 변화를 확인하세요.",
  popupBadgesLabel: "확보한 실행 배지",
  popupKpiLabel: "상승한 KPI 지표",
  popupKpiRise: "상승",
  popupOutro: "이제 PM 보드에서\n실행 흐름을 직접 운영해 봅시다.",
};

export const executionActions: ExecutionActionItem[] = [
  {
    id: "voc_data",
    title: "VOC Raw Data(엑셀) 직접 뜯어보기",
    description:
      "글로벌CS팀과 마케팅팀이 기존에 취합하던 지저분한 VOC 엑셀 샘플을 직접 열어보고, 실무진이 겪는 데이터 정제의 고충을 뼈저리게 체감합니다.",
    pmbok:
      "🏅 [프로젝트 지식 관리 (Manage Project Knowledge)] - 현장의 암묵지를 명시적 데이터로 변환하는 감각을 익혔습니다.",
    effect: ["산출물 품질 상승", "이해관계자 조율 상승"],
  },
  {
    id: "ref_benchmark",
    title: "타사 AI 대시보드 UI/UX 레퍼런스/벤치마킹 조사",
    description:
      "경쟁사나 선도 기업들이 구축한 데이터 분석 대시보드 화면들을 스크랩하여, 마케팅/디자인 파트가 참고할 수 있는 시각적 가이드라인과 목표치를 제시합니다.",
    pmbok:
      "🏅 [품질 관리 (Manage Quality)] - 요구사항을 충족하기 위한 구체적인 품질 기준(디자인 스탠다드)을 설정했습니다.",
    effect: ["산출물 품질 대폭 상승"],
  },
  {
    id: "ai_study",
    title: "AI 비전공자 PM을 위한 AI 속성 스터디",
    description:
      "사내 러닝 플랫폼에서 'AI 비전공자 리더를 위한 프로젝트 관리' 강의를 속성 수강하여, AI 실무진 및 전문가와 대화할 수 있는 최소한의 기술 언어를 장착합니다.",
    pmbok:
      "🏅 [자원 역량 개발 (Develop Resource)] - 리더 본인의 기술적 역량을 끌어올려 팀 내 의사소통의 병목을 줄였습니다.",
    effect: ["일정 준수 상승"],
  },
  {
    id: "daily_scrum",
    title: "데일리 스크럼(Daily Scrum) 운영 룰 도입",
    description:
      "매일 아침 짧은 시간 동안 스탠드업 미팅을 열어, 어제 한 일과 오늘 할 일, 그리고 막혀있는 이슈를 투명하고 짧게 공유하는 문화를 만듭니다.",
    pmbok:
      "🏅 [프로젝트 작업 지시 및 관리 (Direct and Manage Project Work)] - 애자일 프랙티스를 적용하여 실시간으로 업무 진척도를 동기화했습니다.",
    effect: ["일정 준수 상승", "팀 몰입도 상승"],
    glossary:
      "[용어 사전] 스크럼이란? 길고 지루한 보고 형식의 회의 대신, 실무 현황과 병목 현상만 빠르게 파악해 프로젝트의 속도를 높이는 대표적인 애자일(Agile) 업무 기법입니다.",
  },
  {
    id: "team_1on1",
    title: "상주 팀원 1on1 티타임",
    description:
      "4명의 팀원과 1:1 커피챗을 하며 프로젝트에 대한 심리적 압박감을 들어주고 노고를 인정해 줍니다.",
    pmbok:
      "🏅 [팀 개발 (Develop Team)] - 팀원들의 동기를 부여하고 긍정적인 협업 환경을 조성했습니다.",
    effect: ["팀 몰입도 상승"],
  },
  {
    id: "leader_relief",
    title: "초임 리더의 압박감 덜어내기",
    description:
      "출퇴근길에 HBR(하버드 비즈니스 리뷰) 등에서 초임 리더의 고충을 다룬 아티클을 읽으며, '모든 것을 다 알아야 한다'는 만물박사 콤플렉스를 버리고 심리적 안정감을 찾습니다.",
    pmbok:
      "🏅 [리더십 및 감성 지능 (Emotional Intelligence)] - PM의 핵심 역량인 자기 인식과 스트레스 관리 능력을 강화했습니다.",
    effect: ["팀 몰입도 상승"],
  },
  {
    id: "exec_report",
    title: "임원진1장짜리 주간 보고 체계 수립",
    description:
      "C-level의 갑작스러운 개입을 막기 위해, 매주 금요일 오후 핵심 진척도만 시각화한 '1장짜리 대시보드'를 선제적으로 발송하는 프로세스를 만듭니다.",
    pmbok:
      "🏅 [의사소통 관리 (Manage Communications)] – 핵심 이해관계자의 정보 요구사항을 선제적으로 충족하여, 신뢰를 구축하고 프로젝트 팀의 업무 자율성을 확보했습니다.",
    effect: ["이해관계자 조율 상승"],
  },
  {
    id: "meeting_setting",
    title: "회의 운영 방식 셋팅",
    description:
      "실무 회의에서 누가 발언을 독점하고 누가 소외되는지 관찰하며, 갈등 상황에서 리더가 개입할 타이밍과 질문법을 미리 시뮬레이션해 봅니다.",
    pmbok:
      "🏅 [이해관계자 참여 관리 (Manage Stakeholder Engagement)] - 회의 내 역학 관계를 조율하여 생산적인 합의를 이끌어내는 스킬을 체득했습니다.",
    effect: ["팀 몰입도 상승", "산출물 품질 상승"],
  },
  {
    id: "peer_review",
    title: "산출물 교차 검수(Peer Review) 룰 세팅",
    description:
      "개발이 완전히 끝난 후 테스트하는 대신, 중간 결과물이 나올 때마다 마케팅/CS 현업 실무진이 교차 검수하도록 리뷰 일정을 설정합니다.",
    pmbok:
      "🏅 [품질 통제 (Control Quality)] - 결과물의 결함을 조기에 발견하고 수정하는 프로세스를 구축했습니다.",
    effect: ["산출물 품질 상승", "일정 준수 하락"],
  },
  {
    id: "bottleneck_hotline",
    title: "비상주/유관부서 병목(Bottleneck) 핫라인 구축",
    description:
      "보안 검수나 데이터 권한 등 타 부서 인력의 협조가 지연될 때를 대비해, 즉시 에스컬레이션하거나 우회할 수 있는 비상 연락망을 설정합니다.",
    pmbok:
      "🏅 [자원 통제 (Control Resources)] - 외부 리소스의 가용성을 지속적으로 모니터링하고 이슈 발생 시 즉각 대처할 기반을 마련했습니다.",
    effect: ["일정 준수 상승"],
  },
];

export function getExecutionKpiDelta(
  hoursByAction: Record<string, number>
): Partial<Record<"quality" | "delivery" | "teamEngagement" | "stakeholderAlignment" | "leaderEnergy", number>> {
  const delta = { quality: 0, delivery: 0, teamEngagement: 0, stakeholderAlignment: 0, leaderEnergy: 0 };
  const h = (id: string) => Math.min(25, Math.max(0, hoursByAction[id] ?? 0));
  delta.quality += Math.round(h("voc_data") * 0.4);
  delta.stakeholderAlignment += Math.round(h("voc_data") * 0.4);
  delta.quality += Math.round(h("ref_benchmark") * 0.8);
  delta.delivery += Math.round(h("ai_study") * 0.5);
  delta.delivery += Math.round(h("daily_scrum") * 0.3);
  delta.teamEngagement += Math.round(h("daily_scrum") * 0.3);
  delta.teamEngagement += Math.round(h("team_1on1") * 0.5);
  delta.teamEngagement += Math.round(h("leader_relief") * 0.3);
  delta.stakeholderAlignment += Math.round(h("exec_report") * 0.5);
  delta.teamEngagement += Math.round(h("meeting_setting") * 0.3);
  delta.quality += Math.round(h("meeting_setting") * 0.2);
  delta.quality += Math.round(h("peer_review") * 0.4);
  delta.delivery -= Math.round(h("peer_review") * 0.2);
  delta.delivery += Math.round(h("bottleneck_hotline") * 0.5);
  return delta;
}
