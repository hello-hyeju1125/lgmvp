"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const COLUMNS = [
  { id: "todo", label: "할 일", labelEn: "To Do", tooltip: "아직 시작하지 않고 대기 중인 업무입니다." },
  { id: "in_progress", label: "진행 중", labelEn: "In Progress", tooltip: "현재 담당자가 작업하고 있는 업무입니다." },
  { id: "done", label: "완료", labelEn: "Done", tooltip: "작업과 검수가 모두 끝나 최종 완료된 업무입니다." },
  { id: "blocker", label: "이슈 발생", labelEn: "Blocker", tooltip: "타 부서 협조 지연, 버그, 권한 문제 등으로 작업이 멈춘 '빨간불' 상태입니다. 리더가 가장 먼저 뛰어들어 해결해야 할 최우선 과제입니다." },
] as const;

type ColumnId = (typeof COLUMNS)[number]["id"];
const POOL = "pool" as const;
type PlacementId = ColumnId | typeof POOL;

interface Ticket {
  id: string;
  text: string;
  correctColumn: ColumnId;
}

const TICKETS: Ticket[] = [
  { id: "t1", text: "[기획] 1차 마일스톤 WBS 및 일정표 확정 (어제 킥오프에서 픽스됨)", correctColumn: "done" },
  { id: "t2", text: "[보안] 전사 데이터 보안 가이드라인 검토 (정태영 책임이 금요일에 확정함)", correctColumn: "done" },
  { id: "t3", text: "[데이터] 1만 건 VOC 정제용 파이썬 자동화 스크립트 개발 (최유라 선임이 땀 흘리며 코딩 중)", correctColumn: "in_progress" },
  { id: "t4", text: "[디자인] AI 대시보드 메인 UI 프로토타입 스케치 (박소진 책임이 피그마로 뼈대 잡는 중)", correctColumn: "in_progress" },
  { id: "t5", text: "[개발] VOC 감성 분석 AI 모델 초안 설계 (김지훈 선임이 앞선 작업 끝나면 하려고 대기 중)", correctColumn: "todo" },
  { id: "t6", text: "[마케팅] 현업 대상 대시보드 베타테스트(CBT) 모집안 작성 (박소진 책임 대기 중)", correctColumn: "todo" },
  { id: "t7", text: "[IT 인프라] 개발용 클라우드 서버 증설 요청 (예산 초과로 재무팀 승인 반려됨! 대기 중)", correctColumn: "blocker" },
  { id: "t8", text: "[개발] 북미 지역 데이터 연동 API 구축 (Sarah 매니저의 권한 승인이 안 나서 작업 멈춤!)", correctColumn: "blocker" },
];

const INTRO_GUIDE_PARAGRAPHS = [
  "환영합니다, 리더님! 드디어 계획을 현실로 만드는 [실행 단계]의 막이 올랐습니다. 지금부터 리더님의 가장 강력한 무기가 될 '프로젝트 매니지먼트 보드'를 소개합니다.",
  "이 보드는 우리 팀의 모든 업무 현황을 투명하게 보여주는 상황판입니다. 티켓이 왼쪽에서 오른쪽으로 무사히 흘러가도록 만드는 것이 PM의 역할이죠. 본격적인 스프린트 시작 전, 하단에 흩어진 티켓들을 상태에 맞게 알맞은 칸(Column)으로 드래그 앤 드롭(Drag & Drop)하여 보드를 직접 세팅해 보세요.",
  "여기서 '티켓'이란 전체 프로젝트를 달성하기 위해 잘게 쪼개놓은 '최소 단위의 실행 과제(Task)'를 뜻합니다. 각 티켓에 적힌 담당자와 진행 상태를 파악하며, 이 티켓들이 왼쪽에서 오른쪽 끝(완료)까지 막힘없이 흘러가도록 길을 터주는 것이 바로 PM의 역할입니다!",
];

function getIssueKey(tid: string): string {
  const n = tid.replace("t", "");
  return `PM-${n}`;
}

function getLabelFromText(text: string): string | null {
  const m = text.match(/^\[([^\]]+)\]/);
  return m ? m[1] : null;
}

interface ExecBoardProps {
  userName: string;
}

export function ExecBoard({ userName }: ExecBoardProps) {
  const router = useRouter();
  const [placement, setPlacement] = useState<Record<string, PlacementId>>(() => {
    const init: Record<string, PlacementId> = {};
    TICKETS.forEach((t) => (init[t.id] = POOL));
    return init;
  });
  const [draggingTicketId, setDraggingTicketId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<PlacementId | null>(null);
  const [boardComplete, setBoardComplete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [checkAttempted, setCheckAttempted] = useState(false);

  const allCorrect = TICKETS.every((t) => placement[t.id] === t.correctColumn);

  const moveTicket = useCallback((ticketId: string, toColumn: PlacementId) => {
    setPlacement((prev) => ({ ...prev, [ticketId]: toColumn }));
  }, []);

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    setDraggingTicketId(ticketId);
    e.dataTransfer.setData("text/plain", ticketId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: PlacementId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumnId(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumnId(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: PlacementId) => {
    e.preventDefault();
    setDragOverColumnId(null);
    setDraggingTicketId(null);
    const ticketId = e.dataTransfer.getData("text/plain");
    if (ticketId) moveTicket(ticketId, columnId);
  };

  const handleDragEnd = () => {
    setDraggingTicketId(null);
    setDragOverColumnId(null);
  };

  const checkComplete = useCallback(() => {
    setCheckAttempted(true);
    if (!allCorrect) return;
    setBoardComplete(true);
    setShowSuccessModal(true);
  }, [allCorrect]);

  const goToE6 = useCallback(() => {
    router.push("/simulation?phase=ep6-scene");
  }, [router]);

  const ticketsByColumn = [...COLUMNS, { id: POOL, label: "미배치 티켓" }].reduce((acc, col) => {
    acc[col.id] = TICKETS.filter((t) => placement[t.id] === col.id);
    return acc;
  }, {} as Record<PlacementId, Ticket[]>);

  const canCheck = TICKETS.every((t) => placement[t.id] !== POOL) && !boardComplete;

  return (
    <div className="space-y-4">
      {/* 챗봇 선배 PM 가이드 팝업 */}
      {showIntroModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="board-intro-title"
        >
          <div
            className="bg-white rounded-2xl p-6 shadow-xl max-w-lg text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="board-intro-title" className="text-sm font-semibold text-[#172B4D] mb-3">챗봇 선배 PM의 가이드</p>
            <div className="space-y-3 text-sm text-[#6B778C] leading-relaxed">
              {INTRO_GUIDE_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#6B778C]">
              보드 칸(Column)에 마우스를 올리면 설명을 볼 수 있습니다.
            </p>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowIntroModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0052CC" }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 지라 스타일 헤더 */}
      <div className="rounded-lg border border-[#DFE1E6] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-[#6B778C] mb-1">
          <span>프로젝트</span>
          <span>/</span>
          <span>매니지먼트 시뮬레이션</span>
          <span>/</span>
          <span className="text-[#172B4D] font-medium">보드</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-[#172B4D]">
            {boardComplete ? "프로젝트 매니지먼트 보드 (Timeline 흐름)" : "튜토리얼: 프로젝트 매니지먼트 보드 세팅"}
          </h2>
          <div className="flex items-center gap-2">
            {canCheck && (
              <button
                type="button"
                onClick={checkComplete}
                className="rounded px-3 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0052CC" }}
              >
                보드 세팅 확인
              </button>
            )}
          </div>
        </div>
        <hr className="mt-4 border-0 border-t border-[#DFE1E6]" />
        {!boardComplete && (
          <p className="mt-2 text-sm text-[#6B778C]">
            위쪽: 4개의 칸 [할 일(To Do)] [진행 중(In Progress)] [완료(Done)] [이슈 발생(Blocker)] · 아래쪽: 널브러진 업무 포스트잇을 알맞은 칸으로 드래그 앤 드롭하세요.
          </p>
        )}
      </div>

      {/* 칸반 컬럼 (가로 스크롤 없이 4등분) */}
      {boardComplete && (
        <p className="text-sm font-medium text-[#4A4A4A]">셋팅 된 보드를 Timeline에 따라 볼 수 있도록 확인하세요.</p>
      )}
      <div className="grid w-full min-w-0 grid-cols-4 gap-2">
        {COLUMNS.map((col) => {
          const count = ticketsByColumn[col.id]?.length ?? 0;
          return (
            <div
              key={col.id}
              data-column={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex min-w-0 flex-col rounded-lg border transition-colors ${
                dragOverColumnId === col.id
                  ? "border-[#0052CC] bg-[#DEEBFF]/50"
                  : "border-[#DFE1E6] bg-[#F4F5F7]"
              }`}
            >
              <div
                className="flex items-center justify-between border-b border-[#DFE1E6] px-2 py-1.5"
                title={col.tooltip}
              >
                <span className="truncate text-xs font-semibold text-[#172B4D]">
                  {col.label} ({col.labelEn})
                </span>
                <span className="flex h-5 min-w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-[#DFE1E6] px-1.5 text-xs font-medium text-[#6B778C]">
                  {count}
                </span>
              </div>
              <div className="flex min-h-[80px] flex-col gap-2 p-2">
                {ticketsByColumn[col.id]?.map((t) => {
                  const isBlinkingBlocker = t.id === "t8" && boardComplete;
                  return (
                    <div
                      key={t.id}
                      draggable={!isBlinkingBlocker}
                      onDragStart={isBlinkingBlocker ? undefined : (e) => handleDragStart(e, t.id)}
                      onDragEnd={handleDragEnd}
                      role={isBlinkingBlocker ? "button" : undefined}
                      tabIndex={isBlinkingBlocker ? 0 : undefined}
                      onClick={isBlinkingBlocker ? goToE6 : undefined}
                      onKeyDown={isBlinkingBlocker ? (e) => e.key === "Enter" && goToE6() : undefined}
                      className={`rounded border border-[#DFE1E6] bg-white p-2 shadow-sm transition-shadow ${
                        isBlinkingBlocker
                          ? "cursor-pointer ring-2 ring-[#DE350B] animate-pulse hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                          : `cursor-grab active:cursor-grabbing hover:shadow-md active:opacity-90 ${draggingTicketId === t.id ? "opacity-50" : ""}`
                      }`}
                    >
                    <div className="flex items-start gap-1.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium leading-snug text-[#172B4D] line-clamp-3">{t.text}</p>
                        {getLabelFromText(t.text) && (
                          <span className="mt-1.5 inline-block rounded bg-[#EAE6FF] px-1.5 py-0.5 text-xs font-medium text-[#403294]">
                            {getLabelFromText(t.text)}
                          </span>
                        )}
                        <div className="mt-1.5 flex items-center justify-end">
                          <span className="text-xs text-[#6B778C]">{getIssueKey(t.id)}</span>
                        </div>
                      </div>
                      {col.id === "blocker" && (
                        <span className="flex-shrink-0 text-[#DE350B]" title="Blocker">
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 미배치 티켓 (백로그 스타일) */}
      {!boardComplete && (
      <div
        onDragOver={(e) => handleDragOver(e, POOL)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, POOL)}
        className={`rounded-lg border-2 border-dashed p-3 transition-colors ${
          dragOverColumnId === POOL ? "border-[#0052CC] bg-[#DEEBFF]/30" : "border-[#DFE1E6] bg-[#FAFBFC]"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#6B778C]">미배치 티켓</p>
          <span className="rounded-full bg-[#DFE1E6] px-2 py-0.5 text-xs text-[#6B778C]">
            {ticketsByColumn[POOL]?.length ?? 0}개
          </span>
        </div>
        <p className="mb-2 text-xs text-[#6B778C]">드래그하여 위 칸반 칸에 배치하세요.</p>
        <div className="flex flex-wrap gap-2">
          {ticketsByColumn[POOL]?.map((t) => (
            <div
              key={t.id}
              draggable
              onDragStart={(e) => handleDragStart(e, t.id)}
              onDragEnd={handleDragEnd}
              className={`flex cursor-grab active:cursor-grabbing items-center gap-2 rounded border border-[#DFE1E6] bg-white p-2 shadow-sm transition-shadow hover:shadow-md active:opacity-90 ${
                draggingTicketId === t.id ? "opacity-50" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-[#172B4D]">{t.text}</p>
                <div className="mt-1 flex items-center gap-2">
                  {getLabelFromText(t.text) && (
                    <span className="inline-block rounded bg-[#EAE6FF] px-1.5 py-0.5 text-xs font-medium text-[#403294]">
                      {getLabelFromText(t.text)}
                    </span>
                  )}
                  <span className="text-xs text-[#6B778C]">{getIssueKey(t.id)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {checkAttempted && !allCorrect && canCheck && (
        <div className="rounded-lg border border-[#FFAB00] bg-[#FFF4E6] px-4 py-3 text-sm text-[#7A4E00]">
          일부 티켓이 잘못된 칸에 있습니다. 티켓 문구의 힌트를 보고 다시 배치해 보세요.
        </div>
      )}

      {boardComplete && (
        <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F0FDF4] text-sm text-[#6B6B6B]">
          <p className="font-medium text-[#4A4A4A] mb-2">훌륭합니다! 이제 프로젝트의 흐름이 한눈에 들어오네요.</p>
          <p className="mb-2">
            팀원들은 각자의 티켓을 붙잡고 실무에 돌입했습니다. 리더님은 전체 보드를 조망하며 티켓이 멈추지 않도록 장애물(Blocker)을 치워주시면 됩니다.
          </p>
          <p className="text-red-600 font-medium mb-2">
            [삐빅- 🚨] 앗, 방금 세팅을 마치자마자 [Blocker] 칸에 있던 티켓(북미 지역 데이터 연동)에서 긴급 알림이 울리기 시작했습니다! 담당자인 IT 김지훈 선임과 유관부서 간의 댓글 핑퐁이 심상치 않습니다.
          </p>
          <p className="text-red-600 font-medium">
            빨리 붉게 깜빡이는 티켓을 클릭하여 상황을 해결하십시오!
          </p>
        </div>
      )}

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 shadow-xl max-w-sm text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xl font-bold text-[#4A4A4A] mb-6">보드 세팅 완료!</p>
            <p className="text-sm text-[#6B6B6B] mb-6">
              셋팅 된 보드를 Timeline에 따라 볼 수 있도록 확인한 뒤, 아래 안내를 읽어 주세요.
            </p>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
