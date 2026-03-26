"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const COLUMNS = [
  { id: "todo", label: "할 일", labelEn: "To Do", tooltip: "아직 시작 전인 대기 업무를 모아둔 칸입니다." },
  { id: "in_progress", label: "진행 중", labelEn: "In Progress", tooltip: "담당자가 현재 작업 중인 업무를 보여주는 칸입니다." },
  { id: "done", label: "완료", labelEn: "Done", tooltip: "작업과 검수가 끝나 완료된 업무를 확인하는 칸입니다." },
  { id: "blocker", label: "이슈 발생", labelEn: "Blocker", tooltip: "진행이 막힌 이슈를 우선 해결하기 위해 모아둔 칸입니다." },
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
  }, {} as Record<PlacementId, Ticket[]>);

  const canCheck = TICKETS.every((t) => placement[t.id] !== POOL) && !boardComplete;
  const placedCount = TICKETS.filter((t) => placement[t.id] !== POOL).length;
  const placementSignature = TICKETS.map((t) => `${t.id}:${placement[t.id] ?? POOL}`).join("|");
  const checkEnabled = canCheck && placementSignature !== lastCheckedSignature;

  return (
    <div className="space-y-5 rounded-2xl bg-[#F3F4F6] p-4 sm:p-6">
      {/* 챗봇 선배 PM 가이드 팝업 */}
      {showIntroModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="board-intro-title"
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-[0_28px_80px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[#E4003F]/15 bg-gradient-to-r from-[#E4003F] via-[#D1003B] to-[#B90034] px-6 py-4">
              <p id="board-intro-title" className="text-[13px] font-extrabold tracking-[0.14em] text-white/80">
                GUIDE
              </p>
              <h3 className="mt-1 text-xl font-extrabold tracking-tight text-white">챗봇 선배 PM의 가이드</h3>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-[130px_1fr] md:items-start">
              <div className="mx-auto w-full max-w-[130px]">
                <img
                  src="/chatbot.png"
                  alt="챗봇 선배 PM"
                  className="h-auto w-full rounded-xl"
                />
                <p className="mt-2 text-center text-xs font-bold text-[#A2002D]">챗봇 선배 PM</p>
              </div>

              <div className="relative rounded-2xl border border-[#E4003F]/20 bg-[#FFF9FB] p-4 text-left">
                <div className="absolute -left-2 top-8 hidden h-4 w-4 rotate-45 border-b border-l border-[#E4003F]/20 bg-[#FFF9FB] md:block" />
                <div className="space-y-3 text-[14px] leading-relaxed text-[#374151]">
                  {INTRO_GUIDE_PARAGRAPHS.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <p className="mt-4 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#6B7280] ring-1 ring-[#E5E7EB]">
                  보드 칸(Column)에 마우스를 올리면 설명을 볼 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-black/10 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowIntroModal(false)}
                className="rounded-xl bg-[#E4003F] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(228,0,63,0.28)] transition hover:bg-[#D1003B]"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jira-like board header */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-5 shadow-[0_10px_28px_rgba(17,24,39,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight text-[#111827]">
              {boardComplete ? "프로젝트 매니지먼트 보드 (Timeline 흐름)" : "프로젝트 매니지먼트 보드 세팅"}
            </h2>
            <p className="mt-1 text-[14px] font-medium text-[#4B5563]">보드 · 총 {TICKETS.length}개 티켓</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#FBCFE8] bg-[#FFF1F7] px-3 py-1.5 text-xs font-extrabold text-[#A2002D]">
              배치 진행 {placedCount}/{TICKETS.length}
            </span>
          </div>
        </div>
        <hr className="mt-4 border-0 border-t border-[#E5E7EB]" />
        {!boardComplete && (
          <div className="mt-3 rounded-lg border border-[#F3D0DC] bg-[#FFF8FB] px-4 py-3">
            <p className="text-[14px] font-semibold leading-relaxed text-[#374151]">
              <span className="font-extrabold text-[#A2002D]">위쪽:</span> 4개의 칸 할 일(To Do), 진행 중(In Progress), 완료(Done), 이슈 발생(Blocker)
            </p>
            <p className="mt-1 text-[14px] font-semibold leading-relaxed text-[#374151]">
              <span className="font-extrabold text-[#A2002D]">아래쪽:</span> 업무 티켓을 알맞은 칸으로 드래그 앤 드롭하세요.
            </p>
          </div>
        )}
      </div>

      {/* Board columns */}
      {boardComplete && (
        <p className="text-sm font-medium text-[#4A4A4A]">셋팅 된 보드를 Timeline에 따라 볼 수 있도록 확인하세요.</p>
      )}
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const count = ticketsByColumn[col.id]?.length ?? 0;
          return (
            <div
              key={col.id}
              data-column={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex min-w-0 flex-col rounded-xl border shadow-[0_3px_12px_rgba(17,24,39,0.04)] transition-colors ${
                dragOverColumnId === col.id
                  ? "border-[#E4003F] bg-[#FFF1F7]"
                  : "border-[#E5E7EB] bg-[#F8FAFC]"
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-3 py-2.5">
                <span className="group relative truncate text-[13px] font-extrabold tracking-wide text-[#1F2937]">
                  {col.label} ({col.labelEn})
                  <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-64 rounded-lg border border-[#F3D0DC] bg-white px-3 py-2 text-[12px] font-semibold leading-relaxed text-[#374151] opacity-0 shadow-[0_10px_24px_rgba(17,24,39,0.12)] transition-opacity duration-150 group-hover:opacity-100">
                    {col.tooltip}
                  </span>
                </span>
                <span className="flex h-5 min-w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-[#FCE7F3] px-1.5 text-xs font-bold text-[#A2002D]">
                  {count}
                </span>
              </div>
              <div className="flex min-h-[220px] flex-col gap-2.5 p-3">
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
                      className={`relative rounded-lg border border-[#E5E7EB] bg-white p-3 shadow-[0_2px_8px_rgba(17,24,39,0.08)] transition ${
                        isBlinkingBlocker
                          ? "cursor-pointer border-[#E4003F] bg-[#FFF1F7] ring-2 ring-[#E4003F] shadow-[0_0_0_2px_rgba(228,0,63,0.15),0_0_28px_rgba(228,0,63,0.45)] focus:outline-none focus:ring-2 focus:ring-[#E4003F]"
                          : `cursor-grab active:cursor-grabbing hover:-translate-y-[1px] hover:shadow-md active:opacity-90 ${draggingTicketId === t.id ? "opacity-50" : ""}`
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
                      <span className="absolute -right-2 -top-2 inline-flex items-center gap-1 rounded-full border border-red-200 bg-[#E4003F] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-[0_6px_16px_rgba(228,0,63,0.45)]">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                        긴급
                      </span>
                    )}
                    <div className="flex items-start gap-1.5">
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-[13px] font-semibold leading-5 text-[#111827]">{t.text}</p>
                        {getLabelFromText(t.text) && (
                          <span className="mt-2 inline-block rounded bg-[#FCE7F3] px-1.5 py-0.5 text-[11px] font-extrabold text-[#9D174D]">
                            {getLabelFromText(t.text)}
                          </span>
                        )}
                        <div className="mt-2 flex items-center justify-end">
                          <span className="text-[11px] font-semibold text-[#6B7280]">{getIssueKey(t.id)}</span>
                        </div>
                      </div>
                      {col.id === "blocker" && (
                        <span className="flex-shrink-0 text-[#E4003F]" title="Blocker">
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
        <div className="space-y-3">
          <div
            onDragOver={(e) => handleDragOver(e, POOL)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, POOL)}
            className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
              dragOverColumnId === POOL ? "border-[#E4003F] bg-[#FFF1F7]" : "border-[#E5E7EB] bg-white"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[15px] font-extrabold text-[#374151]">미배치 티켓</p>
              <span className="rounded-full bg-[#FCE7F3] px-2 py-0.5 text-xs font-bold text-[#A2002D]">
                {ticketsByColumn[POOL]?.length ?? 0}개
              </span>
            </div>
            <p className="mb-3 text-[13px] font-medium text-[#6B7280]">드래그하여 위 보드 칸에 배치하세요.</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ticketsByColumn[POOL]?.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, t.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex cursor-grab items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white p-2.5 shadow-[0_2px_8px_rgba(17,24,39,0.08)] transition hover:-translate-y-[1px] hover:shadow-md active:cursor-grabbing active:opacity-90 ${
                    draggingTicketId === t.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-[13px] font-semibold leading-5 text-[#111827]">{t.text}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {getLabelFromText(t.text) && (
                        <span className="inline-block rounded bg-[#FCE7F3] px-1.5 py-0.5 text-[11px] font-extrabold text-[#9D174D]">
                          {getLabelFromText(t.text)}
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-[#6B778C]">{getIssueKey(t.id)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {checkAttempted && !allCorrect && canCheck && (
        <div className="rounded-lg border border-[#FFCF66] bg-[#FFF8E8] px-4 py-3 text-[14px] font-semibold text-[#7A4E00]">
          일부 티켓이 잘못된 칸에 있습니다. 티켓 문구의 힌트를 보고 다시 배치해 보세요.
        </div>
      )}
      {!boardComplete && canCheck && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={checkComplete}
            disabled={!checkEnabled}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-extrabold transition ${
              checkEnabled
                ? "border-[#111827] bg-[#111827] text-white shadow-[0_10px_24px_rgba(17,24,39,0.22)] hover:-translate-y-[1px] hover:bg-[#1F2937]"
                : "cursor-not-allowed border-[#D1D5DB] bg-[#E5E7EB] text-[#9CA3AF]"
            }`}
          >
            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[12px] ${checkEnabled ? "bg-white/20" : "bg-white/70"}`}>✓</span>
            보드 세팅 확인
          </button>
        </div>
      )}

      {boardComplete && (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5 text-[14px] leading-relaxed text-[#374151]">
          <p className="mb-2 text-[15px] font-extrabold text-[#166534]">훌륭합니다! 이제 프로젝트의 흐름이 한눈에 들어오네요.</p>
          <p className="mb-2">
            팀원들은 각자의 티켓을 붙잡고 실무에 돌입했습니다. 리더님은 전체 보드를 조망하며 티켓이 멈추지 않도록 장애물(Blocker)을 치워주시면 됩니다.
          </p>
          <p className="mb-2 font-bold text-[#B91C1C]">
            [삐빅- 🚨] 앗, 방금 세팅을 마치자마자 [Blocker] 칸에 있던 티켓(북미 지역 데이터 연동)에서 긴급 알림이 울리기 시작했습니다! 담당자인 IT 김지훈 선임과 유관부서 간의 댓글 핑퐁이 심상치 않습니다.
          </p>
          <p className="font-bold text-[#B91C1C]">
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
