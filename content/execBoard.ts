/** exec-board Kanban — 티켓 정의 + WBS/타임라인 메타 (시뮬레이션 교육용) */

export const COLUMNS = [
  { id: "todo" as const, label: "할 일", labelEn: "To Do", tooltip: "아직 시작 전인 대기 업무를 모아둔 칸입니다." },
  { id: "in_progress" as const, label: "진행 중", labelEn: "In Progress", tooltip: "담당자가 현재 작업 중인 업무를 보여주는 칸입니다." },
  { id: "done" as const, label: "완료", labelEn: "Done", tooltip: "작업과 검수가 끝나 완료된 업무를 확인하는 칸입니다." },
  { id: "blocker" as const, label: "이슈 발생", labelEn: "Blocker", tooltip: "진행이 막힌 이슈를 우선 해결하기 위해 모아둔 칸입니다." },
] as const;

export type ColumnId = (typeof COLUMNS)[number]["id"];
export const POOL = "pool" as const;
export type PlacementId = ColumnId | typeof POOL;

export interface ExecBoardTicketDef {
  id: string;
  text: string;
  correctColumn: ColumnId;
  /** 타임라인(시간 순) 정렬 — 작을수록 이른 단계 */
  timelineOrder: number;
  /** WBS 스타일 코드 */
  wbsCode: string;
  /** 타임라인 구간 제목 (그룹핑용) */
  timelinePhase: string;
  /** 일정 구간 라벨 */
  scheduleLabel: string;
  /** 관련 인물·역할 (교육용 한눈에 보기) */
  stakeholders: string[];
  /** 오답/정답 피드백 */
  feedback: {
    keyClue: string;
    keyClueDesc: string;
    reason: string;
  };
}

export const EXEC_BOARD_TICKETS: ExecBoardTicketDef[] = [
  {
    id: "t1",
    text: "[기획] 1차 마일스톤 WBS 및 일정표 확정 (어제 킥오프에서 픽스됨)",
    correctColumn: "done",
    timelineOrder: 10,
    wbsCode: "1.1",
    timelinePhase: "1. 기획 산출·일정 고정",
    scheduleLabel: "Week 1 · 킥오프 직후",
    stakeholders: ["기획팀", "PM"],
    feedback: {
      keyClue: "어제 킥오프에서 픽스됨",
      keyClueDesc: "'픽스됨'이라는 표현은 이미 확정·완료되었다는 뜻입니다. 킥오프 회의에서 WBS와 일정표가 최종 합의되어 더 이상 수정할 필요가 없는 상태입니다.",
      reason: "이미 완료된 산출물이므로 '완료(Done)' 칸에 배치합니다. Done 칸에는 작업과 검수가 모두 끝난 업무만 들어갑니다.",
    },
  },
  {
    id: "t2",
    text: "[보안] 전사 데이터 보안 가이드라인 검토 (정태영 책임이 금요일에 확정함)",
    correctColumn: "done",
    timelineOrder: 20,
    wbsCode: "1.2",
    timelinePhase: "1. 기획 산출·일정 고정",
    scheduleLabel: "Week 1",
    stakeholders: ["정태영 책임", "보안"],
    feedback: {
      keyClue: "금요일에 확정함",
      keyClueDesc: "'확정함'이라는 과거형 표현이 핵심입니다. 정태영 책임이 이미 검토를 마치고 최종 확정한 상태이므로, 현재 진행 중인 업무가 아닙니다.",
      reason: "검토가 완료되어 확정된 업무이므로 '완료(Done)' 칸에 배치합니다.",
    },
  },
  {
    id: "t4",
    text: "[디자인] AI 대시보드 메인 UI 프로토타입 스케치 (박소진 책임이 피그마로 뼈대 잡는 중)",
    correctColumn: "in_progress",
    timelineOrder: 30,
    wbsCode: "2.1",
    timelinePhase: "2. 스프린트 실행 (디자인·데이터)",
    scheduleLabel: "Week 2",
    stakeholders: ["박소진 책임", "디자인"],
    feedback: {
      keyClue: "뼈대 잡는 중",
      keyClueDesc: "'~하는 중'이라는 현재진행형 표현이 핵심입니다. 박소진 책임이 피그마에서 실제로 프로토타입을 설계하고 있는, 지금 이 순간 작업이 이루어지고 있는 상태입니다.",
      reason: "담당자가 현재 작업을 수행하고 있으므로 '진행 중(In Progress)' 칸에 배치합니다.",
    },
  },
  {
    id: "t3",
    text: "[데이터] 1만 건 VOC 정제용 파이썬 자동화 스크립트 개발 (최유라 선임이 땀 흘리며 코딩 중)",
    correctColumn: "in_progress",
    timelineOrder: 40,
    wbsCode: "2.2",
    timelinePhase: "2. 스프린트 실행 (디자인·데이터)",
    scheduleLabel: "Week 2",
    stakeholders: ["최유라 선임", "데이터"],
    feedback: {
      keyClue: "땀 흘리며 코딩 중",
      keyClueDesc: "'코딩 중'이라는 현재진행형 표현이 핵심입니다. 최유라 선임이 지금 이 순간 파이썬 스크립트를 개발하고 있는 상태입니다.",
      reason: "담당자가 현재 활발하게 작업 수행 중이므로 '진행 중(In Progress)' 칸에 배치합니다.",
    },
  },
  {
    id: "t6",
    text: "[마케팅] 현업 대상 대시보드 베타테스트(CBT) 모집안 작성 (박소진 책임 대기 중)",
    correctColumn: "todo",
    timelineOrder: 50,
    wbsCode: "3.1",
    timelinePhase: "3. 검증·모집 (예정)",
    scheduleLabel: "Week 3",
    stakeholders: ["박소진 책임", "마케팅"],
    feedback: {
      keyClue: "대기 중",
      keyClueDesc: "'대기 중'이라는 표현이 핵심입니다. 박소진 책임이 아직 이 업무에 착수하지 않았으며, 다른 작업(UI 프로토타입)을 먼저 처리한 뒤 시작할 예정인 상태입니다.",
      reason: "아직 시작되지 않은 대기 업무이므로 '할 일(To Do)' 칸에 배치합니다. To Do는 해야 하지만 아직 착수 전인 업무를 모아두는 칸입니다.",
    },
  },
  {
    id: "t5",
    text: "[개발] VOC 감성 분석 AI 모델 초안 설계 (김지훈 선임이 앞선 작업 끝나면 하려고 대기 중)",
    correctColumn: "todo",
    timelineOrder: 60,
    wbsCode: "3.2",
    timelinePhase: "3. 검증·모집 (예정)",
    scheduleLabel: "Week 3",
    stakeholders: ["김지훈 선임", "개발"],
    feedback: {
      keyClue: "앞선 작업 끝나면 하려고 대기 중",
      keyClueDesc: "'대기 중'이라는 표현과 '앞선 작업 끝나면'이라는 조건이 핵심입니다. 선행 작업에 대한 의존성(Dependency)이 있어 아직 착수할 수 없는 상태입니다.",
      reason: "선행 작업 완료 후 시작할 예정이므로 '할 일(To Do)' 칸에 배치합니다. 차단된 것(Blocker)이 아니라 순서상 아직 차례가 안 된 것입니다.",
    },
  },
  {
    id: "t7",
    text: "[IT 인프라] 개발용 클라우드 서버 증설 요청 (예산 초과로 재무팀 승인 반려됨! 대기 중)",
    correctColumn: "blocker",
    timelineOrder: 70,
    wbsCode: "4.1",
    timelinePhase: "4. 리스크·이슈 (Blocker)",
    scheduleLabel: "Week 4",
    stakeholders: ["IT 인프라", "재무", "PM"],
    feedback: {
      keyClue: "예산 초과로 재무팀 승인 반려됨!",
      keyClueDesc: "'승인 반려됨!'이라는 표현과 느낌표가 핵심입니다. 단순 대기가 아니라 재무팀이 예산 문제로 공식 반려한 상태이며, PM이 개입하여 해결하지 않으면 영원히 진행되지 않습니다.",
      reason: "외부 요인(재무팀 반려)에 의해 진행이 차단된 상태이므로 '이슈 발생(Blocker)' 칸에 배치합니다. 단순 '대기'와 '차단'은 다릅니다. 승인이 반려되어 PM의 적극적 개입이 필요한 상황입니다.",
    },
  },
  {
    id: "t8",
    text: "[개발] 북미 지역 데이터 연동 API 구축 (Sarah 매니저의 권한 승인이 안 나서 작업 멈춤!)",
    correctColumn: "blocker",
    timelineOrder: 80,
    wbsCode: "4.2",
    timelinePhase: "4. 리스크·이슈 (Blocker)",
    scheduleLabel: "Week 4",
    stakeholders: ["김지훈 선임", "Sarah 매니저", "개발"],
    feedback: {
      keyClue: "권한 승인이 안 나서 작업 멈춤!",
      keyClueDesc: "'작업 멈춤!'이라는 표현이 핵심입니다. 단순히 순서를 기다리는 것이 아니라, Sarah 매니저의 권한 승인이라는 외부 의존성 때문에 작업 자체가 중단된 상태입니다.",
      reason: "외부 승인 미비로 작업이 완전히 중단된 상태이므로 '이슈 발생(Blocker)' 칸에 배치합니다. PM이 Sarah 매니저와 직접 소통하여 권한 문제를 해결해야 합니다.",
    },
  },
];

export function getIssueKey(tid: string): string {
  const n = tid.replace("t", "");
  return `PM-${n}`;
}

export function getLabelFromText(text: string): string | null {
  const m = text.match(/^\[([^\]]+)\]/);
  return m ? m[1] : null;
}

const COLUMN_STATUS_LABEL: Record<ColumnId, string> = {
  done: "완료",
  in_progress: "진행 중",
  todo: "할 일",
  blocker: "이슈",
};

export function getColumnStatusLabel(column: ColumnId): string {
  return COLUMN_STATUS_LABEL[column];
}

/** 미배치(pool)는 타임라인에서 '미배치'로 표시 */
export function getPlacementStatusLabel(placement: PlacementId): string {
  if (placement === POOL) return "미배치";
  return getColumnStatusLabel(placement);
}

export function getTicketsSortedByTimeline(): ExecBoardTicketDef[] {
  return [...EXEC_BOARD_TICKETS].sort((a, b) => a.timelineOrder - b.timelineOrder);
}
