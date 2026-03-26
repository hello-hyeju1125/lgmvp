"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import {
  executionActions,
  executionScreenCopy,
  EXECUTION_TOTAL_HOURS,
  EXECUTION_STEP_HOURS,
} from "@/content/executionActions";

interface ExecActionProps {
  userName: string;
  stage?: "intro" | "alloc";
}

function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

const SECTION_BREAKS = [{ afterIndex: 3, label: executionScreenCopy.section2 }, { afterIndex: 6, label: executionScreenCopy.section3 }];

export function ExecAction({ userName, stage = "alloc" }: ExecActionProps) {
  const { executionActionHours, setExecutionActionHours } = useStore();
  const [openPmbokById, setOpenPmbokById] = useState<Record<string, boolean>>({});
  const [openImpactById, setOpenImpactById] = useState<Record<string, boolean>>({});

  const getHours = (id: string) => {
    const v = executionActionHours[id];
    if (typeof v === "number" && (EXECUTION_STEP_HOURS as readonly number[]).includes(v)) return v;
    return 5;
  };
  const setStep = (id: string, stepIndex: number) => {
    const h = EXECUTION_STEP_HOURS[stepIndex];
    setExecutionActionHours({ ...executionActionHours, [id]: h });
  };
  const total = executionActions.reduce((s, a) => s + getHours(a.id), 0);
  const isValid = total === EXECUTION_TOTAL_HOURS;
  const progressPct = Math.min(100, Math.max(0, (total / EXECUTION_TOTAL_HOURS) * 100));
  const isOver = total > EXECUTION_TOTAL_HOURS;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-6">
      {stage === "intro" && (
        <section className="rounded-[0.735rem] border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
          <h1 className="text-center text-xl sm:text-2xl font-extrabold tracking-tight text-[#E4003F]">실행의 첫 스프린트를 시작합니다.</h1>
          <p className="mt-4 text-[15px] leading-[1.85] text-black/75">{renderWithBold(executionScreenCopy.intro1)}</p>
          <p className="mt-3 text-[15px] leading-[1.85] text-black/75">{renderWithBold(executionScreenCopy.intro2)}</p>
          <p className="mt-3 text-[15px] leading-[1.85] text-black/75">{renderWithBold(executionScreenCopy.intro3)}</p>

          <div className="mt-6 overflow-hidden rounded-[0.49rem] border border-black/10 bg-[#f8f9fa] shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3 border-b border-black/10 bg-white/60 px-5 py-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#E4003F]/15 text-[#E4003F] ring-1 ring-black/10">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a7 7 0 0 0-4 12.75V18a2 2 0 0 0 2 2h.2l.3 1.2A1 1 0 0 0 11.47 22h1.06a1 1 0 0 0 .97-.8L13.8 20H14a2 2 0 0 0 2-2v-3.25A7 7 0 0 0 12 2Zm2 16h-4v-.9h4V18Zm0-2.4h-4v-.93h4v.93Zm.64-2.87-.64.42V12a1 1 0 0 0-1-1h-2a1 1 0 1 0 0 2h1v.77l-.86.57A1 1 0 1 0 12.28 16l1.66-1.1A2 2 0 0 0 14.64 12.73Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-extrabold tracking-[0.18em] text-[#E4003F]">TIP</p>
                <p className="mt-0.5 text-[13px] font-extrabold text-black/85">스프린트란 무엇일까요?</p>
              </div>
            </div>
            <div className="border-l-4 border-[#E4003F] px-5 py-4">
              <p className="text-[14px] leading-[1.85] text-black/75">{executionScreenCopy.sprintGlossary}</p>
            </div>
          </div>
        </section>
      )}

      {stage === "alloc" && (
        <>
          <h2 className="text-center text-xl sm:text-2xl font-extrabold tracking-tight text-[#E4003F]">액션 아이템 시간 배분</h2>

          <div className={`rounded-2xl border border-white/15 bg-white/95 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md ${isOver ? "animate-ui-shake" : ""}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[13px] font-extrabold text-black/70">총 배분 시간</p>
                <p className={`mt-1 text-[16px] font-extrabold ${isValid ? "text-[#E4003F]" : isOver ? "text-[#E4003F]" : "text-black/85"}`}>
                  {total}시간 / {EXECUTION_TOTAL_HOURS}시간
                  {!isValid && !isOver && <span className="ml-2 text-[13px] font-semibold text-black/60">(80시간 미만이면 '다음' 가능)</span>}
                  {isOver && <span className="ml-2 text-[13px] font-semibold text-[#E4003F]">(초과)</span>}
                </p>
              </div>
              <div className="w-full sm:w-[420px]">
                <div className="h-3 w-full overflow-hidden rounded-full bg-black/10">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ${isValid ? "bg-[#E4003F]" : isOver ? "bg-[#E4003F]" : "bg-black/40"}`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {executionActions.map((action, idx) => {
              const pmbok = action.pmbok;
              const bStart = pmbok.indexOf("[");
              const bEnd = pmbok.indexOf("]");
              const pmbokTitle = bStart >= 0 && bEnd > bStart ? pmbok.slice(bStart, bEnd + 1) : "PMBOK 지식";
              const pmbokBody = bStart >= 0 && bEnd > bStart ? pmbok.slice(bEnd + 1).trim() : pmbok;
              const isPmbokOpen = !!openPmbokById[action.id];
              const isImpactOpen = !!openImpactById[action.id];
              const showSection2 = SECTION_BREAKS[0].afterIndex === idx;
              const showSection3 = SECTION_BREAKS[1].afterIndex === idx;
              return (
                <div key={action.id}>
                  {showSection2 && <p className="mb-2 mt-6 text-sm font-semibold text-[#4A4A4A]">{SECTION_BREAKS[0].label}</p>}
                  {showSection3 && <p className="mb-2 mt-6 text-sm font-semibold text-[#4A4A4A]">{SECTION_BREAKS[1].label}</p>}

                  <div className="rounded-2xl border border-white/15 bg-white/95 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md">
                    <div className="flex flex-col gap-2">
                      <div className="min-w-0">
                        <p className="text-[18px] sm:text-[20px] font-extrabold tracking-tight text-black/90">
                          ({idx + 1}) {action.title}
                        </p>
                        <p className="mt-2 text-[15px] leading-[1.85] text-black/75">{action.description}</p>
                        {action.glossary && <p className="mt-2 text-[13px] leading-[1.75] text-black/55 italic">{action.glossary}</p>}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 items-start gap-3">
                      <div className="rounded-xl border border-black/10 bg-[#f8f9fa] p-4">
                        <button
                          type="button"
                          onClick={() => setOpenPmbokById((cur) => ({ ...cur, [action.id]: !cur[action.id] }))}
                          className="flex w-full items-center justify-between gap-3 text-left"
                          aria-expanded={isPmbokOpen}
                          aria-controls={`pmbok-${action.id}`}
                        >
                          <span className="text-[13px] font-extrabold text-black/85">PMBOK 지식</span>
                          <span className={`shrink-0 text-[12px] font-extrabold ${isPmbokOpen ? "text-black/45" : "text-[#E4003F]"}`} aria-hidden="true">
                            {isPmbokOpen ? "−" : "+"}
                          </span>
                        </button>
                        <div id={`pmbok-${action.id}`} className={isPmbokOpen ? "mt-3" : "hidden"} aria-hidden={!isPmbokOpen}>
                          <p className="text-[13px] leading-relaxed text-black/70">
                            <span className="font-extrabold text-[#1E3A5F]">{pmbokTitle}</span>
                            <span className="ml-2">{pmbokBody}</span>
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-black/10 bg-[#f8f9fa] p-4">
                        <button
                          type="button"
                          onClick={() => setOpenImpactById((cur) => ({ ...cur, [action.id]: !cur[action.id] }))}
                          className="flex w-full items-center justify-between gap-3 text-left"
                          aria-expanded={isImpactOpen}
                          aria-controls={`impact-${action.id}`}
                        >
                          <span className="text-[13px] font-extrabold text-black/85">Impact</span>
                          <span className={`shrink-0 text-[12px] font-extrabold ${isImpactOpen ? "text-black/45" : "text-[#E4003F]"}`} aria-hidden="true">
                            {isImpactOpen ? "−" : "+"}
                          </span>
                        </button>
                        <div id={`impact-${action.id}`} className={isImpactOpen ? "mt-3" : "hidden"} aria-hidden={!isImpactOpen}>
                          <div className="flex flex-wrap content-start gap-2">
                            {action.effect.map((e) => (
                              <span
                                key={e}
                                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-extrabold text-emerald-700 ring-1 ring-emerald-200"
                              >
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">▲</span>
                                {e.replace("대폭", "").replace("상승", "").trim()} <span className="text-emerald-600">상승</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-[13px] font-extrabold text-black/85">투입 시간 선택</p>
                      <div className="mt-3 inline-flex w-full flex-wrap rounded-xl border border-gray-200 bg-white p-1">
                        {EXECUTION_STEP_HOURS.map((h, i) => {
                          const selected = getHours(action.id) === h;
                          return (
                            <button
                              key={h}
                              type="button"
                              onClick={() => setStep(action.id, i)}
                              className={`flex-1 rounded-lg px-3 py-2 text-[13px] font-extrabold transition ${
                                selected ? "bg-[#E4003F] text-white shadow-[0_10px_30px_rgba(228,0,63,0.22)]" : "text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {i + 1}단계 · {h}시간
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
