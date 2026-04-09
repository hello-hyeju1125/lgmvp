"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getEp5Result, ep5Scene } from "@/content/episode5";
import type { Ep5Choice } from "@/content/episode5";
import { KpiTrendPill, sortKpiLabels } from "@/components/shared/KpiTrendPill";

interface Ep5BlueprintResultProps {
  userName: string;
}

const ALL_CHOICES: Ep5Choice[] = ["A", "B", "C", "D"];

const PLANNING_REVEAL_STAGGER_MS = 110;
function planningRevealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * PLANNING_REVEAL_STAGGER_MS}ms` };
}

function renderBoldMarkdown(paragraph: string): ReactNode {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-[#333]">{p}</strong>
    ) : (
      p
    ),
  );
}

function renderNarrationWithQuoteBoxes(markdown: string): ReactNode {
  if (!/"[^"]*"/.test(markdown)) return renderBoldMarkdown(markdown);
  const re = /"([^"]*)"/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(markdown)) !== null) {
    if (m.index > last) {
      const before = markdown.slice(last, m.index);
      if (before) nodes.push(<div key={`txt-${k++}`} className="block text-center">{renderBoldMarkdown(before)}</div>);
    }
    nodes.push(
      <div key={`quote-${k++}`} className="ep1-option-quote ep1-result-quote-box mx-auto inline-block max-w-full shrink-0 rounded-xl px-6 py-4 text-center sm:px-8 sm:py-[18px]">
        <p className="ep1-option-quote-text m-0 font-sans text-[16px] font-bold leading-[1.75] sm:text-[17px] [overflow-wrap:anywhere] [word-break:keep-all]">
          <span aria-hidden>&ldquo;</span>{renderBoldMarkdown(m[1])}<span aria-hidden>&rdquo;</span>
        </p>
      </div>,
    );
    last = m.index + m[0].length;
  }
  if (last < markdown.length) {
    const tail = markdown.slice(last);
    if (tail) nodes.push(<div key={`txt-${k++}`} className="block text-center">{renderBoldMarkdown(tail)}</div>);
  }
  return <div className="flex flex-col items-center gap-4">{nodes}</div>;
}

function renderFeedbackMarkdown(paragraph: string): ReactNode {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-bold text-[#1A73E8]">{p}</span>
    ) : (
      p
    ),
  );
}

function FeedbackPanel({ paragraphs, embedded = false }: { paragraphs: string[]; embedded?: boolean }) {
  return (
    <div className={embedded ? "ep1-result-feedback-panel planning-ep-feedback-panel border-0 bg-[#F7FBFF] px-6 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8" : "ep1-result-feedback-panel planning-ep-feedback-panel mt-6 rounded-none border-0 bg-[#F7FBFF] px-6 py-6 pt-7 sm:px-8"}>
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="ep1-result-feedback-avatar ep-result-feedback-chatbot-avatar h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-black bg-black sm:h-16 sm:w-16">
          <Image
            src="/LG_MVP_chatbot.jpg"
            alt="챗봇 선배 PM"
            width={64}
            height={64}
            className="h-full w-full origin-center object-cover object-center scale-[1.12]"
          />
        </div>
        <div className="min-w-0">
          <span className="ep1-result-feedback-label inline-flex items-center rounded-none bg-[#1A73E8] px-4 py-1.5 text-[14px] font-extrabold tracking-wide sm:text-[15px]">챗봇 선배 PM의 피드백</span>
        </div>
      </div>
      <div className="ep1-result-feedback-bubble relative rounded-2xl bg-white px-5 py-5 sm:px-6 sm:py-6">
        <div className="ep1-result-feedback-notch absolute -top-2 left-10 h-4 w-4 rotate-45 bg-white" aria-hidden />
        <div className="relative space-y-3 text-left text-[15px] leading-[1.9] text-[#333] sm:text-[16px]">
          {paragraphs.map((para, i) => (<p key={i} className="m-0">{renderFeedbackMarkdown(para)}</p>))}
        </div>
      </div>
    </div>
  );
}

function NarrationBox({ markdown }: { markdown: string }) {
  return (
    <div className="ep1-result-narration-box bg-[#F5F7FA] px-5 py-5 text-center sm:px-6 sm:py-6">
      <div className="text-[16px] leading-[1.85] text-[#333] sm:text-[17px]">{renderNarrationWithQuoteBoxes(markdown)}</div>
    </div>
  );
}

export function Ep5BlueprintResult({ userName: _userName }: Ep5BlueprintResultProps) {
  const router = useRouter();
  const { episode5Choice } = useStore();
  const [showOthers, setShowOthers] = useState(false);

  const choice = episode5Choice as Ep5Choice | null;
  const valid = ALL_CHOICES.includes(choice as Ep5Choice);

  if (!valid || !choice) {
    return (
      <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-transparent px-5 py-12 text-center sm:px-8" aria-label="E5 결과">
        <p className="text-sm text-[#374151]">선택 정보가 없습니다.</p>
        <button type="button" onClick={() => router.push("/simulation?phase=ep5-scene")} className="mt-4 rounded-xl border-2 border-black bg-[color:var(--sim-accent)] px-5 py-2.5 text-sm font-bold text-[color:var(--sim-accent-cta-text)]">옵션 선택으로 돌아가기</button>
      </section>
    );
  }

  const selected = getEp5Result(choice);
  const others = ALL_CHOICES.filter((id) => id !== choice);
  const episodeTitle = ep5Scene.title;
  const hasKpi = Boolean(selected.kpiLabels?.length);
  const feedbackStep = hasKpi ? 5 : 4;
  const ctaStep = feedbackStep + 1;
  const accordionBase = ctaStep + 1;

  return (
    <section
      className="ep1-scene-layout relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-transparent px-5 pb-16 pt-10 font-sans sm:px-8 sm:pb-20 sm:pt-12"
      aria-label={`${episodeTitle} 결과`}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="initiation-action-page mb-5 w-full sm:mb-6">
          <div className="flex justify-center px-2">
            <p
              className="ep1-scene-reveal ep1-result-page-stamp initiation-brief-badge m-0 w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
              style={planningRevealDelay(0)}
              role="status"
              aria-label="의사결정에 따른 결과"
            >
              의사결정에 따른 결과
            </p>
          </div>
        </div>

        <div
          className="ep1-scene-reveal mb-9 mt-10 space-y-0 text-center leading-[2] sm:mt-12"
          style={planningRevealDelay(1)}
        >
          <p className="m-0 text-[19px] font-medium text-[#374151] sm:text-[20px]">선택이 반영되었습니다.</p>
          <p className="m-0 text-[19px] font-bold text-[#111] sm:text-[20px]">완벽하게 모든 것을 지켜내는 정답은 존재하지 않습니다.</p>
          <p className="m-0 text-[19px] font-medium text-[#374151] sm:text-[20px]">당신의 선택이 만든 Trade-off와 KPI 변화를 확인해 보십시오.</p>
        </div>

        <div className="ep1-result-card-root relative z-[1] mt-8 rounded-none border-[3px] border-black bg-white sm:mt-10">
          <div className="ep1-scene-reveal relative" style={planningRevealDelay(2)}>
            <div className="ep1-result-my-choice-chip absolute left-4 top-0 z-20 flex -translate-y-1/2 items-center gap-2 rounded-none border-0 bg-[color:var(--sim-accent)] px-4 py-2.5 text-[16px] font-extrabold text-[color:var(--sim-accent-cta-text)] sm:left-7 sm:text-[17px]" role="status" aria-label="나의 선택">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-0 bg-white">
                <svg width="14" height="11" viewBox="0 0 12 10" fill="none" aria-hidden><path d="M1 5L4 8L11 1" stroke="var(--sim-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              나의 선택
            </div>
            <div className="ep1-result-card-headline-bar border-b-0 px-6 pb-3 pt-7 sm:px-8 sm:pb-4 sm:pt-8">
              <h2 className="ep1-result-heading-title m-0 text-center text-[28px] font-extrabold leading-tight tracking-[-0.3px] sm:text-[34px]">결과 {choice}. {selected.optionTitle}</h2>
            </div>
          </div>
          <div
            className="ep1-scene-reveal flex flex-col gap-6 bg-white px-6 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-9"
            style={planningRevealDelay(3)}
          >
            <NarrationBox markdown={selected.text} />
          </div>
          {selected.kpiLabels?.length ? (
            <div
              className="ep1-scene-reveal flex flex-wrap justify-center gap-3 border-t-0 bg-white px-6 pb-6 pt-4 sm:px-8"
              style={planningRevealDelay(4)}
            >
              {sortKpiLabels(selected.kpiLabels).map((label) => (<KpiTrendPill key={label} label={label} />))}
            </div>
          ) : null}
          <div className="ep1-scene-reveal" style={planningRevealDelay(feedbackStep)}>
            <FeedbackPanel paragraphs={selected.adviceParagraphs} embedded />
          </div>
        </div>

        <div className="ep1-scene-reveal mt-10 text-center sm:mt-12" style={planningRevealDelay(ctaStep)}>
          <p className="m-0 text-[22px] font-extrabold text-[#333] sm:text-[24px]">다른 선택의 결과도 아래를 통해 참고해보세요!</p>
          {!showOthers && (
            <button type="button" onClick={() => setShowOthers(true)} className="ep1-result-show-others-btn mt-5 inline-flex items-center gap-2 rounded-none border-2 border-black bg-white px-7 py-3 text-[15px] font-bold text-[#111] transition hover:bg-[#f5f5f5] active:translate-y-px sm:text-[16px]">
              더보기<span className="text-xl" aria-hidden>∨</span>
            </button>
          )}
        </div>

        {showOthers && (
          <div className="mt-6 space-y-5">
            {others.map((id, idx) => {
              const r = getEp5Result(id);
              return (
                <div
                  key={id}
                  className="ep1-scene-reveal ep1-result-accordion-card overflow-hidden rounded-none border-2 border-black bg-white"
                  style={planningRevealDelay(accordionBase + idx)}
                >
                  <div className="ep1-result-card-headline-bar border-b-0 px-6 pb-3 pt-5 sm:px-8 sm:pb-4 sm:pt-6">
                    <h3 className="ep1-result-heading-title m-0 text-center text-[24px] font-extrabold leading-tight sm:text-[28px]">결과 {id}. {r.optionTitle}</h3>
                  </div>
                  <div className="flex flex-col gap-6 bg-white px-6 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-9">
                    <NarrationBox markdown={r.text} />
                  </div>
                  {r.kpiLabels?.length ? (
                    <div className="flex flex-wrap justify-center gap-3 border-t-0 bg-white px-6 pb-6 pt-4 sm:px-8">
                      {sortKpiLabels(r.kpiLabels).map((label) => (<KpiTrendPill key={label} label={label} />))}
                    </div>
                  ) : null}
                  <FeedbackPanel paragraphs={r.adviceParagraphs} embedded />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
