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
