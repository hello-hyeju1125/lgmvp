"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  COLUMNS,
  EXEC_BOARD_TICKETS,
  POOL,
  getIssueKey,
  getLabelFromText,
  type PlacementId,
} from "@/content/execBoard";

const TICKETS = EXEC_BOARD_TICKETS;

function Hl({ children }: { children: React.ReactNode }) {
  return <span style={{ backgroundColor: "#FFD600", fontWeight: 800, padding: "1px 4px", borderRadius: "3px" }}>{children}</span>;
}

function IntroGuideContent() {
  return (
    <>
      <p>환영합니다, 리더님!</p>
      <p>드디어 계획을 현실로 만드는 <Hl>[실행 단계]</Hl>의 막이 올랐습니다. 지금부터 리더님의 가장 강력한 무기가 될 <Hl>&lsquo;프로젝트 매니지먼트 보드&rsquo;</Hl>를 소개합니다.</p>
      <p>이 보드는 우리 팀의 <Hl>모든 업무 현황을 투명하게 보여주는 상황판</Hl>입니다. 티켓이 왼쪽에서 오른쪽으로 무사히 흘러가도록 만드는 것이 PM의 역할이죠. 본격적인 스프린트 시작 전, 하단에 흩어진 티켓들을 상태에 맞게 알맞은 칸(Column)으로 <Hl>드래그 앤 드롭(Drag &amp; Drop)</Hl>하여 보드를 직접 세팅해 보세요.</p>
      <p>여기서 <Hl>&lsquo;티켓&rsquo;</Hl>이란 전체 프로젝트를 달성하기 위해 잘게 쪼개놓은 <Hl>&lsquo;최소 단위의 실행 과제(Task)&rsquo;</Hl>를 뜻합니다. 각 티켓에 적힌 담당자와 진행 상태를 파악하며, 이 티켓들이 왼쪽에서 오른쪽 끝(완료)까지 막힘없이 흘러가도록 <Hl>길을 터주는 것이 바로 PM의 역할</Hl>입니다!</p>
    </>
  );
}

interface ExecBoardProps {
  userName: string;
  /** 푸터 WBS 모달 등에서 최신 배치를 읽기 위해 동기화 */
  onPlacementChange?: (placement: Record<string, PlacementId>) => void;
}

export function ExecBoard({ userName: _userName, onPlacementChange }: ExecBoardProps) {
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
  const [lastCheckedSignature, setLastCheckedSignature] = useState<string | null>(null);

  const allCorrect = TICKETS.every((t) => placement[t.id] === t.correctColumn);

  const moveTicket = useCallback((ticketId: string, toColumn: PlacementId) => {
    setPlacement((prev) => ({ ...prev, [ticketId]: toColumn }));
    setCheckAttempted(false);
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
    const signature = TICKETS.map((t) => `${t.id}:${placement[t.id] ?? POOL}`).join("|");
    setLastCheckedSignature(signature);
    if (!allCorrect) return;
    setBoardComplete(true);
    setShowSuccessModal(true);
  }, [allCorrect, placement]);

  const goToE6 = useCallback(() => {
    router.push("/simulation?phase=ep6-scene");
  }, [router]);

  const ticketsByColumn = [...COLUMNS, { id: POOL, label: "미배치 티켓" }].reduce((acc, col) => {
    acc[col.id] = TICKETS.filter((t) => placement[t.id] === col.id);
    return acc;
  }, {} as Record<PlacementId, (typeof TICKETS)[number][]>);

  useEffect(() => {
    onPlacementChange?.(placement);
  }, [placement, onPlacementChange]);

  const canCheck = TICKETS.every((t) => placement[t.id] !== POOL) && !boardComplete;
  const placedCount = TICKETS.filter((t) => placement[t.id] !== POOL).length;
  const placementSignature = TICKETS.map((t) => `${t.id}:${placement[t.id] ?? POOL}`).join("|");
  const checkEnabled = canCheck && placementSignature !== lastCheckedSignature;

  return (
    <div className="exec-board-page font-sans text-[#172B4D]">
      {/* 챗봇 선배 PM 가이드 팝업 */}
      {showIntroModal && (
        <div
          className="exec-board-intro-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="board-intro-title"
          onClick={() => setShowIntroModal(false)}
        >
          <div
            className="exec-board-intro-frame relative w-full max-w-2xl overflow-hidden bg-white"
            style={{ border: "2px solid #111", borderRadius: "6px", boxShadow: "6px 6px 0 #111", animation: "ds-modal-enter 350ms ease-out both" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="ds-dark-header exec-board-intro-header flex items-center gap-3 px-6 py-4" style={{ backgroundColor: "#111", borderBottom: "2px solid #111" }}>
              <div className="min-w-0 flex-1">
                <p id="board-intro-title" className="ds-dark-header-sub exec-board-intro-kicker text-[12px] font-extrabold tracking-[0.2em]">
                  프로젝트 매니지먼트 보드
                </p>
                <h3 className="mt-1 text-[22px] font-extrabold tracking-tight sm:text-[24px]">
                  챗봇 선배 PM의 가이드
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="flex gap-5 px-6 pt-6 pb-3 items-start">
              <div className="shrink-0 flex flex-col items-center">
                <div className="h-[80px] w-[80px] overflow-hidden rounded-full sm:h-[100px] sm:w-[100px]">
                  <img src="/LG_MVP_chatbot.jpg" alt="챗봇 선배 PM" className="h-full w-full object-cover" />
                </div>
                <p className="mt-2 text-center text-[13px] font-extrabold text-[#111]">챗봇 선배 PM</p>
              </div>

              <div className="relative min-w-0 flex-1 p-5 text-left" style={{ border: "2px solid #d97706", borderRadius: "6px", backgroundColor: "#ffffff", position: "relative" }}>
                {/* Speech tail */}
                <div
                  className="absolute hidden sm:block"
                  style={{
                    top: "28px", left: "-10px", width: 0, height: 0,
                    borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "10px solid #d97706",
                  }}
                  aria-hidden
                />
                <div className="space-y-3 text-[15px] leading-relaxed text-[#333]">
                  <IntroGuideContent />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4">
              <button
                type="button"
                onClick={() => setShowIntroModal(false)}
                className="text-[15px] font-extrabold transition-all"
                style={{ backgroundColor: "#FFD600", color: "#111", border: "2px solid #111", borderRadius: "6px", boxShadow: "3px 3px 0 #111", padding: "10px 28px" }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "0 0 0 #111"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 #111"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 #111"; }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="exec-board-jira-shell overflow-hidden rounded-lg border border-[#DFE1E6]">
      {/* Jira / Jira Software 스타일 — 상단 앱 바 */}
      <header className="exec-board-jira-topbar flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span className="exec-board-jira-project-key inline-flex h-8 min-w-[2.5rem] items-center justify-center rounded px-2 text-[13px] font-extrabold tracking-tight">
            PM
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#5E6C84]">
              LGMVP · 실행 단계 · Kanban
            </p>
            <h2 className="truncate text-[18px] font-semibold leading-tight text-[#172B4D] sm:text-[20px]">
              {boardComplete ? "프로젝트 매니지먼트 보드 (Timeline 흐름)" : "프로젝트 매니지먼트 보드 세팅"}
            </h2>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <div
            className="exec-board-jira-search pointer-events-none hidden min-h-[32px] min-w-[140px] flex-1 rounded px-3 py-1.5 text-[13px] text-[#5E6C84] sm:flex sm:max-w-[220px]"
            aria-hidden
          >
            검색…
          </div>
          <span className="inline-flex items-center rounded-full border border-[#DFE1E6] bg-[#F4F5F7] px-2.5 py-1 text-[12px] font-bold text-[#42526E]">
            배치 {placedCount}/{TICKETS.length}
          </span>
        </div>
      </header>

      {/* 보드 캔버스 (Jira N20 배경) */}
      <div className="exec-board-jira-surface px-3 pb-5 pt-4 sm:px-4">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-[#DFE1E6] pb-3">
          <div>
            <p className="text-[12px] font-semibold text-[#5E6C84]">보드 · 총 {TICKETS.length}개 이슈</p>
          </div>
        </div>

        {boardComplete && (
          <p className="mb-3 text-[13px] font-medium text-[#5E6C84]">
            셋팅 된 보드를 Timeline에 따라 볼 수 있도록 확인하세요.
          </p>
        )}

        {!boardComplete && (
          <div className="exec-board-jira-banner-info mb-4 rounded-md px-4 py-3 text-[14px] font-medium leading-relaxed">
            <p>
              <span className="font-bold text-[#0747A6]">위쪽:</span> 4개의 칸 할 일(To Do), 진행 중(In Progress), 완료(Done), 이슈 발생(Blocker)
            </p>
            <p className="mt-1">
              <span className="font-bold text-[#0747A6]">아래쪽:</span> 업무 티켓을 알맞은 칸으로 드래그 앤 드롭하세요.
            </p>
          </div>
        )}

        <div className="flex w-full min-w-0 flex-col gap-3 xl:flex-row xl:overflow-x-auto xl:pb-2">
          {COLUMNS.map((col) => {
            const count = ticketsByColumn[col.id]?.length ?? 0;
            const colActive = dragOverColumnId === col.id;
            return (
              <div
                key={col.id}
                data-column={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`exec-board-jira-col flex min-h-[240px] min-w-0 w-full shrink-0 flex-col p-2 transition-colors xl:min-h-[min(52vh,480px)] xl:w-[min(100%,304px)] ${
                  colActive ? "exec-board-jira-col--active" : ""
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2 px-1">
                  <span className="group relative min-w-0 truncate text-[13px] font-bold text-[#5E6C84]">
                    {col.label}{" "}
                    <span className="font-normal text-[#5E6C84]/80">({col.labelEn})</span>
                    <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded border border-[#DFE1E6] bg-white px-3 py-2 text-[12px] font-semibold leading-relaxed text-[#172B4D] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                      {col.tooltip}
                    </span>
                  </span>
                  <span className="exec-board-jira-col-count inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums">
                    {count}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2">
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
                        className={`exec-board-jira-card relative rounded border-l-[3px] border-l-[#0C66E4] p-3 transition ${
                          isBlinkingBlocker
                            ? "exec-board-jira-ticket-urgent cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#DE350B]"
                            : `cursor-grab active:cursor-grabbing hover:-translate-y-px ${draggingTicketId === t.id ? "opacity-50" : ""}`
                        }`}
                        style={
                          isBlinkingBlocker
                            ? {
                                animation: "pulse 0.85s ease-in-out infinite, bounce 1.1s ease-in-out infinite",
                              }
                            : undefined
                        }
                      >
                        {isBlinkingBlocker && (
                          <span className="absolute -right-1 -top-1 inline-flex items-center gap-1 rounded border border-[#DE350B] bg-[#DE350B] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-md">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                            긴급
                          </span>
                        )}
                        <div className="flex items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="break-words text-[13px] font-normal leading-snug text-[#172B4D]">{t.text}</p>
                            {getLabelFromText(t.text) && (
                              <span className="exec-board-jira-label mt-2 inline-block rounded px-1.5 py-0.5 text-[11px] font-bold">
                                {getLabelFromText(t.text)}
                              </span>
                            )}
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <span className="exec-board-jira-key text-[12px] font-semibold">{getIssueKey(t.id)}</span>
                              {col.id === "blocker" && (
                                <span className="flex-shrink-0 text-[#DE350B]" title="Blocker">
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                                    <path
                                      fillRule="evenodd"
                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {!boardComplete && (
          <div className="mt-4 space-y-3">
            <div
              onDragOver={(e) => handleDragOver(e, POOL)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, POOL)}
              className={`exec-board-jira-backlog rounded-lg p-4 transition-colors ${
                dragOverColumnId === POOL ? "exec-board-jira-backlog--active" : ""
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[14px] font-bold text-[#172B4D]">미배치 티켓</p>
                <span className="exec-board-jira-col-count rounded-full px-2 py-0.5 text-[11px] font-bold">
                  {ticketsByColumn[POOL]?.length ?? 0}
                </span>
              </div>
              <p className="mb-3 text-[13px] text-[#5E6C84]">드래그하여 위 보드 칸에 배치하세요.</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ticketsByColumn[POOL]?.map((t) => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, t.id)}
                    onDragEnd={handleDragEnd}
                    className={`exec-board-jira-card exec-board-jira-pool-card flex cursor-grab items-start gap-2 rounded border-l-[3px] p-2.5 transition hover:-translate-y-px active:cursor-grabbing active:opacity-90 ${
                      draggingTicketId === t.id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-[13px] font-normal leading-snug text-[#172B4D]">{t.text}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {getLabelFromText(t.text) && (
                          <span className="exec-board-jira-label rounded px-1.5 py-0.5 text-[11px] font-bold">
                            {getLabelFromText(t.text)}
                          </span>
                        )}
                        <span className="exec-board-jira-key text-[12px] font-semibold">{getIssueKey(t.id)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {checkAttempted && !allCorrect && canCheck && (
          <div className="exec-board-jira-banner-warn mt-4 rounded-md px-4 py-3 text-[14px] font-semibold leading-relaxed">
            일부 티켓이 잘못된 칸에 있습니다. 티켓 문구의 힌트를 보고 다시 배치해 보세요.
          </div>
        )}

        {!boardComplete && canCheck && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={checkComplete}
              disabled={!checkEnabled}
              className="exec-board-jira-btn-primary inline-flex items-center gap-2 rounded px-4 py-2.5 text-[14px] font-semibold transition enabled:hover:-translate-y-px enabled:active:translate-y-0"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[12px]">✓</span>
              보드 세팅 확인
            </button>
          </div>
        )}

        {boardComplete && (
          <div className="exec-board-jira-banner-success mt-4 rounded-md p-5 text-[14px] leading-relaxed">
            <p className="mb-2 text-[15px] font-bold text-[#006644]">훌륭합니다! 이제 프로젝트의 흐름이 한눈에 들어오네요.</p>
            <p className="mb-2 text-[#172B4D]">
              팀원들은 각자의 티켓을 붙잡고 실무에 돌입했습니다. 리더님은 전체 보드를 조망하며 티켓이 멈추지 않도록 장애물(Blocker)을 치워주시면 됩니다.
            </p>
            <p className="mb-2 font-bold text-[#BF2600]">
              [삐빅- 🚨] 앗, 방금 세팅을 마치자마자 [Blocker] 칸에 있던 티켓(북미 지역 데이터 연동)에서 긴급 알림이 울리기 시작했습니다! 담당자인 IT 김지훈 선임과 유관부서 간의 댓글 핑퐁이 심상치 않습니다.
            </p>
            <p className="font-bold text-[#BF2600]">빨리 붉게 깜빡이는 티켓을 클릭하여 상황을 해결하십시오!</p>
          </div>
        )}
      </div>
      </div>

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#091E42]/60 px-4 backdrop-blur-[1px]"
          onClick={() => setShowSuccessModal(false)}
          role="presentation"
        >
          <div
            className="exec-board-jira-modal w-full max-w-sm rounded-lg p-8 text-center"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exec-board-success-title"
          >
            <p id="exec-board-success-title" className="mb-2 text-[18px] font-semibold text-[#172B4D]">
              보드 세팅 완료!
            </p>
            <p className="mb-6 text-[13px] leading-relaxed text-[#5E6C84]">
              셋팅 된 보드를 Timeline에 따라 볼 수 있도록 확인한 뒤, 아래 안내를 읽어 주세요.
            </p>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="exec-board-jira-modal-btn rounded px-5 py-2.5 text-[14px] font-semibold transition hover:brightness-105"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
