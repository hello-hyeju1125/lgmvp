"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  ep1Results,
  ep1Scene,
  type Ep1ResultCardBlock,
} from "@/content/episode1";
import { KpiTrendPill } from "@/components/shared/KpiTrendPill";

interface Ep1ResultProps {
  userName: string;
}

type ChoiceKey = "A" | "B" | "C";

const EP1_CHOI_AVATAR_DEFAULT = "/choi-seongmin.jpg";
const EP1_CHOI_AVATAR_ANGRY = "/choi-seongmin_angry.jpg";

function renderBoldMarkdown(paragraph: string): ReactNode {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-[#333]">
        {p}
      </strong>
    ) : (
      p
    ),
  );
}

/** 나레이션 안의 ASCII `"..."` 구간을 E1 옵션 카드 하단 인용(ep1-option-quote)과 동일한 노란 박스로 표시 */
function renderNarrationWithQuoteBoxes(markdown: string): ReactNode {
  if (!/"[^"]*"/.test(markdown)) {
    return renderBoldMarkdown(markdown);
  }

  const re = /"([^"]*)"/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(markdown)) !== null) {
    if (m.index > last) {
      const before = markdown.slice(last, m.index);
      if (before) {
        nodes.push(
          <div key={`txt-${k++}`} className="block text-center">
            {renderBoldMarkdown(before)}
          </div>,
        );
      }
    }
    nodes.push(
      <div
        key={`quote-${k++}`}
        className="ep1-option-quote ep1-result-quote-box mx-auto inline-block max-w-full shrink-0 rounded-xl px-6 py-4 text-center sm:px-8 sm:py-[18px]"
      >
        <p className="ep1-option-quote-text m-0 font-sans text-[16px] font-bold leading-[1.75] sm:text-[17px] [overflow-wrap:anywhere] [word-break:keep-all]">
          <span aria-hidden>&ldquo;</span>
          {renderBoldMarkdown(m[1])}
          <span aria-hidden>&rdquo;</span>
        </p>
      </div>,
    );
    last = m.index + m[0].length;
  }
  if (last < markdown.length) {
    const tail = markdown.slice(last);
    if (tail) {
      nodes.push(
        <div key={`txt-${k++}`} className="block text-center">
          {renderBoldMarkdown(tail)}
        </div>,
      );
    }
  }
  return <div className="flex flex-col items-center gap-4">{nodes}</div>;
}

/** 피드백 블록: **구간**을 파란 강조 */
function renderFeedbackMarkdown(paragraph: string): ReactNode {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-bold text-[#1A73E8]">
        {p}
      </span>
    ) : (
      p
    ),
  );
}

function renderDialogueWithAccents(text: string, accents?: string[]): ReactNode {
  if (!accents?.length) return text;
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length > 0) {
    let nextIdx = -1;
    let nextPhrase = "";
    for (const ph of accents) {
      const i = rest.indexOf(ph);
      if (i !== -1 && (nextIdx === -1 || i < nextIdx)) {
        nextIdx = i;
        nextPhrase = ph;
      }
    }
    if (nextIdx === -1) {
      nodes.push(rest);
      break;
    }
    if (nextIdx > 0) nodes.push(rest.slice(0, nextIdx));
    nodes.push(
      <span key={key++} className="font-bold text-[#E65100]">
        {nextPhrase}
      </span>,
    );
    rest = rest.slice(nextIdx + nextPhrase.length);
  }
  return <>{nodes}</>;
}

function FeedbackPanel({
  paragraphs,
  embedded = false,
}: {
  paragraphs: string[];
  embedded?: boolean;
}) {
  return (
    <div
      className={
        embedded
          ? "ep1-result-feedback-panel border-0 bg-[#F7FBFF] px-6 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8"
          : "ep1-result-feedback-panel mt-6 rounded-none border-0 bg-[#F7FBFF] px-6 py-6 pt-7 sm:px-8"
      }
    >
      {/* 챗봇 선배 PM 헤더 */}
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="ep1-result-feedback-avatar h-14 w-14 shrink-0 overflow-hidden rounded-full border-0 bg-white sm:h-16 sm:w-16">
          <Image
            src="/LG_MVP_chatbot.jpg"
            alt="챗봇 선배 PM"
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <span className="ep1-result-feedback-label inline-flex items-center rounded-none bg-[#1A73E8] px-4 py-1.5 text-[14px] font-extrabold tracking-wide sm:text-[15px]">
            챗봇 선배 PM의 피드백
          </span>
        </div>
      </div>

      {/* 말풍선 본문 */}
      <div className="ep1-result-feedback-bubble relative rounded-2xl bg-white px-5 py-5 sm:px-6 sm:py-6">
        <div className="ep1-result-feedback-notch absolute -top-2 left-10 h-4 w-4 rotate-45 bg-white" aria-hidden />
        <div className="relative space-y-3 text-left text-[15px] leading-[1.9] text-[#333] sm:text-[16px]">
          {paragraphs.map((para, i) => (
            <p key={i} className="m-0">
              {renderFeedbackMarkdown(para)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function DialogueRow({
  speaker,
  text,
  accentPhrases,
  avatarSrc = EP1_CHOI_AVATAR_DEFAULT,
}: {
  speaker: string;
  text: string;
  accentPhrases?: string[];
  /** 옵션 B 결과(최성민 역정) 등 */
  avatarSrc?: string;
}) {
  return (
    <div className="ep1-result-dialogue-row relative flex items-center px-1">
      {/* 아바타 — 말풍선 왼쪽에 겹침 */}
      <div className="relative z-10 h-[76px] w-[76px] shrink-0 overflow-hidden rounded-full border-0 bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] sm:h-[88px] sm:w-[88px]">
        <Image
          src={avatarSrc}
          alt={speaker}
          fill
          className="object-cover object-top"
          sizes="88px"
        />
      </div>
      {/* 노란 말풍선 — 왼쪽으로 당겨서 아바타와 겹침 */}
      <div className="ep1-result-dialogue-bubble relative -ml-5 min-w-0 flex-1 rounded-2xl bg-[#FFF9DB] py-4 pl-8 pr-5 sm:-ml-6 sm:py-5 sm:pl-10 sm:pr-7">
        <p className="m-0 mb-1.5 text-[15px] font-extrabold text-[#333] sm:text-[16px]">{speaker}</p>
        <p className="m-0 text-[15px] leading-[1.85] text-[#444] sm:text-[16px]">
          {renderDialogueWithAccents(text, accentPhrases)}
        </p>
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

function ResultCardBody({
  blocks,
  resultChoice,
}: {
  blocks: Ep1ResultCardBlock[];
  /** E1 옵션 B 대사 행은 angry 포트레이트 */
  resultChoice: ChoiceKey;
}) {
  const choiDialogueAvatar =
    resultChoice === "B" ? EP1_CHOI_AVATAR_ANGRY : EP1_CHOI_AVATAR_DEFAULT;

  return (
    <div className="flex flex-col gap-6 bg-white px-6 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-9">
      {blocks.map((block, idx) => {
        if (block.type === "narration") {
          return (
            <NarrationBox key={idx} markdown={block.markdown} />
          );
        }
        return (
          <DialogueRow
            key={idx}
            speaker={block.speaker}
            text={block.text}
            accentPhrases={block.accentPhrases}
            avatarSrc={block.speaker === "최성민 상무" ? choiDialogueAvatar : EP1_CHOI_AVATAR_DEFAULT}
          />
        );
      })}
    </div>
  );
}

export function Ep1Result({ userName: _userName }: Ep1ResultProps) {
  const router = useRouter();
  const { episode1Choice } = useStore();
  const [showOthers, setShowOthers] = useState(false);

  const choice = episode1Choice as ChoiceKey | null;
  const valid = choice === "A" || choice === "B" || choice === "C";

  if (!valid) {
    return (
      <section
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-transparent px-5 py-12 text-center sm:px-8"
        aria-label="E1 결과"
      >
        <p className="text-sm text-[#374151]">선택 정보가 없습니다.</p>
        <button
          type="button"
          onClick={() => router.push("/simulation?phase=ep1-scene")}
          className="mt-4 rounded-xl border-2 border-black bg-[#64e87a] px-5 py-2.5 text-sm font-bold text-[#111]"
        >
          옵션 선택으로 돌아가기
        </button>
      </section>
    );
  }

  const selected = ep1Results[choice];
  const blocks: Ep1ResultCardBlock[] =
    selected.cardBlocks ?? [{ type: "narration", markdown: selected.text }];

  const others = (["A", "B", "C"] as const).filter((id) => id !== choice);

  const episodeTitle = ep1Scene.title;

  return (
    <section
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-transparent px-5 pb-16 pt-10 font-sans sm:px-8 sm:pb-20 sm:pt-12"
      aria-label={`${episodeTitle} 결과`}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* E1 씬 에피소드 제목 배지와 동일 구조·클래스, 배경만 노란색(ep1-result-page-stamp + globals) */}
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

        {/* 안내 문구 — 스탬프와의 간격 확보 */}
        <div className="mb-9 mt-10 space-y-0 text-center leading-[2] sm:mt-12">
          <p className="m-0 text-[19px] font-medium text-[#374151] sm:text-[20px]">선택이 반영되었습니다.</p>
          <p className="m-0 text-[19px] font-bold text-[#111] sm:text-[20px]">
            완벽하게 모든 것을 지켜내는 정답은 존재하지 않습니다.
          </p>
          <p className="m-0 text-[19px] font-medium text-[#374151] sm:text-[20px]">
            당신의 선택이 만든 Trade-off와 KPI 변화를 확인해 보십시오.
          </p>
        </div>

        {/* 메인 카드: 「나의 선택」칩이 검은 대제목 바와 겹쳐 보이도록 배치 + 네온 그린 테두리 */}
        <div className="ep1-result-card-root relative z-[1] mt-8 rounded-none border-[3px] border-black bg-white sm:mt-10">
          <div className="relative">
            <div
              className="ep1-result-my-choice-chip absolute left-4 top-0 z-20 flex -translate-y-1/2 items-center gap-2 rounded-none border-0 bg-[#64e87a] px-4 py-2.5 text-[16px] font-extrabold text-[#111] sm:left-7 sm:text-[17px]"
              role="status"
              aria-label="나의 선택"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-0 bg-white">
                <svg width="14" height="11" viewBox="0 0 12 10" fill="none" aria-hidden>
                  <path
                    d="M1 5L4 8L11 1"
                    stroke="#64e87a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              나의 선택
            </div>
            <div className="ep1-result-card-headline-bar border-b-0 px-6 pb-3 pt-7 sm:px-8 sm:pb-4 sm:pt-8">
              <h2 className="ep1-result-heading-title m-0 text-center text-[28px] font-extrabold leading-tight tracking-[-0.3px] sm:text-[34px]">
                결과 {choice}. {selected.optionTitle}
              </h2>
            </div>
          </div>
          <ResultCardBody blocks={blocks} resultChoice={choice} />
          {selected.kpiLabels?.length ? (
            <div className="flex flex-wrap justify-center gap-3 border-t-0 bg-white px-6 pb-6 pt-4 sm:px-8">
              {selected.kpiLabels.map((label) => (
                <KpiTrendPill key={label} label={label} />
              ))}
            </div>
          ) : null}
          <FeedbackPanel paragraphs={selected.adviceParagraphs} embedded />
        </div>

        {/* 다른 선택 안내 문구 + 더보기 */}
        <div className="mt-10 text-center sm:mt-12">
          <p className="m-0 text-[22px] font-extrabold text-[#333] sm:text-[24px]">
            다른 선택의 결과도 아래를 통해 참고해 보세요!
          </p>

          {!showOthers && (
            <button
              type="button"
              onClick={() => setShowOthers(true)}
              className="ep1-result-show-others-btn mt-5 inline-flex items-center gap-2 rounded-none border-2 border-black bg-white px-7 py-3 text-[15px] font-bold text-[#111] transition hover:bg-[#f5f5f5] active:translate-y-px sm:text-[16px]"
            >
              더보기
              <span className="text-xl" aria-hidden>∨</span>
            </button>
          )}
        </div>

        {showOthers && (
          <div className="mt-6 space-y-5">
            {others.map((id) => {
              const r = ep1Results[id];
              const otherBlocks: Ep1ResultCardBlock[] =
                r.cardBlocks ?? [{ type: "narration", markdown: r.text }];
              return (
                <div key={id} className="ep1-result-accordion-card overflow-hidden rounded-none border-2 border-black bg-white">
                  <div className="ep1-result-card-headline-bar border-b-0 px-6 pb-3 pt-5 sm:px-8 sm:pb-4 sm:pt-6">
                    <h3 className="ep1-result-heading-title m-0 text-center text-[24px] font-extrabold leading-tight sm:text-[28px]">
                      결과 {id}. {r.optionTitle}
                    </h3>
                  </div>
                  <ResultCardBody blocks={otherBlocks} resultChoice={id} />
                  {r.kpiLabels?.length ? (
                    <div className="flex flex-wrap justify-center gap-3 border-t-0 bg-white px-6 pb-6 pt-4 sm:px-8">
                      {r.kpiLabels.map((label) => (
                        <KpiTrendPill key={label} label={label} />
                      ))}
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
