"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { getEp6Result, ep6Scene } from "@/content/episode6";
import { KpiTrendPill, sortKpiLabels } from "@/components/shared/KpiTrendPill";

interface Ep6PingpongResultProps {
  userName: string;
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
      <span key={i} className="font-bold" style={{ color: "var(--sim-accent)" }}>{p}</span>
    ) : (
      p
    ),
  );
}

function FeedbackPanel({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="ep1-result-feedback-panel border-0 bg-[#F7FBFF] px-6 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8">
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="ep1-result-feedback-avatar h-14 w-14 shrink-0 overflow-hidden rounded-full border-0 bg-white sm:h-16 sm:w-16">
          <Image src="/LG_MVP_chatbot.jpg" alt="챗봇 선배 PM" width={64} height={64} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <span className="ep1-result-feedback-label inline-flex items-center rounded-none bg-[#FF7A00] px-4 py-1.5 text-[14px] font-extrabold tracking-wide sm:text-[15px]">챗봇 선배 PM의 피드백</span>
        </div>
      </div>
      <div className="ep1-result-feedback-bubble relative rounded-2xl bg-white px-5 py-5 sm:px-6 sm:py-6">
        <div className="ep1-result-feedback-notch absolute -top-2 left-10 h-4 w-4 rotate-45 bg-white" aria-hidden />
        <div className="relative space-y-3 text-left text-[15px] leading-[1.9] text-[#333] sm:text-[16px]">
          {paragraphs.map((p, i) => (
            <p key={i} className="m-0">{renderFeedbackMarkdown(p)}</p>
          ))}
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

export function Ep6PingpongResult({ userName: _userName }: Ep6PingpongResultProps) {
  const { episode6Blocks } = useStore();
  const b = episode6Blocks ?? { block1: "B", block2: "E", block3: "D", block4: "" };
  const result = getEp6Result(b.block1, b.block2, b.block3);
  const episodeTitle = ep6Scene.title;

  return (
    <section
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-transparent px-5 pb-16 pt-10 font-sans sm:px-8 sm:pb-20 sm:pt-12"
      aria-label={`${episodeTitle} 결과`}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* 스탬프 헤더 */}
        <div className="initiation-action-page mb-5 w-full sm:mb-6">
          <div className="flex justify-center px-2">
            <p
              className="ep1-scene-reveal ep1-result-page-stamp initiation-brief-badge m-0 w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
              style={{ animationDelay: "0ms" }}
              role="status"
              aria-label="의사결정에 따른 결과"
            >
              의사결정에 따른 결과
            </p>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="mb-9 mt-10 space-y-0 text-center leading-[2] sm:mt-12">
          <p className="m-0 text-[19px] font-medium text-[#374151] sm:text-[20px]">선택이 반영되었습니다.</p>
          <p className="m-0 text-[19px] font-bold text-[#111] sm:text-[20px]">
            당신의 커뮤니케이션 전략이 만든 결과를 확인해 보십시오.
          </p>
        </div>

        {/* 메인 결과 카드 */}
        <div className="ep1-result-card-root relative z-[1] mt-8 rounded-none border-[3px] border-black bg-white sm:mt-10">
          <div className="ep1-result-card-headline-bar border-b-0 px-6 pb-3 pt-7 sm:px-8 sm:pb-4 sm:pt-8">
            <h2 className="ep1-result-heading-title m-0 text-center text-[28px] font-extrabold leading-tight tracking-[-0.3px] sm:text-[34px]">
              {result.endingTitle}
            </h2>
          </div>

          <div className="flex flex-col gap-6 bg-white px-6 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-9">
            <NarrationBox markdown={result.text} />
          </div>

          {result.kpiLabels.length ? (
            <div className="flex flex-wrap justify-center gap-3 border-t-0 bg-white px-6 pb-6 pt-4 sm:px-8">
              {sortKpiLabels(result.kpiLabels).map((label) => (
                <KpiTrendPill key={label} label={label} />
              ))}
            </div>
          ) : null}

          <FeedbackPanel paragraphs={result.adviceParagraphs} />
        </div>
      </div>
    </section>
  );
}
