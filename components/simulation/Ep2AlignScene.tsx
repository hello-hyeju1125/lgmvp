"use client";

import { useStore } from "@/store/useStore";
import { ep2AlignScene, ep2AlignOptions } from "@/content/episode2Align";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { AnimationEvent, ReactNode } from "react";

const EP1_SEQ_FADE_ANIM_NAME = "ep1-dialogue-seq-fade";

function isEp1SeqFadeAnimation(e: AnimationEvent<HTMLElement>) {
  return String(e.animationName ?? "").includes(EP1_SEQ_FADE_ANIM_NAME);
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function renderDialogueBold(paragraph: string): ReactNode {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-[#059669]">
        {p}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function stripOuterQuotes(s: string) {
  let t = s.trim();
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1);
  return t;
}

const EP2_KIM_JIHUN_SPEAKING = "/LG_MVP_kim-jihun_speaking.jpg";
const EP2_PARK_SOJIN_ANGRY = "/LG_MVP_park-sojin_upset.jpg";

/** Ep1 최성민 상무 말풍선과 동일: 아바타 + 네온 그린 테두리 말풍선(`.ep1-supervisor-bubble`) */
function Ep2SpeakerBubble({
  name,
  imageSrc,
  imageAlt,
  text,
}: {
  name: string;
  imageSrc: string;
  imageAlt: string;
  text: string;
}) {
  const body = stripOuterQuotes(text);
  return (
    <div className="flex items-start gap-0">
      <div className="relative z-20 h-[168px] w-[168px] shrink-0 sm:h-48 sm:w-48">
        <div className="absolute inset-0 rounded-full border-4 border-[#64e87a] bg-white p-1.5">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-contain object-center"
              sizes="(max-width: 640px) 168px, 192px"
            />
          </div>
        </div>
      </div>
      <div className="ep1-supervisor-bubble relative z-10 -ml-10 min-w-0 flex-1 rounded-2xl py-5 pl-[4.25rem] pr-5 sm:-ml-14 sm:py-6 sm:pl-[5.5rem] sm:pr-6">
        <p className="mb-2.5 font-sans text-[15px] font-black leading-tight text-[#111] sm:text-[16px]">{name}</p>
        <p className="text-left font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
          {renderDialogueBold(body)}
        </p>
      </div>
    </div>
  );
}

/** E1 Q 블록과 동일한 action 마지막 질문 문장 */
const EP2_ACTION_QUESTION = "리더인 당신은 이 팽팽한 기싸움을 어떻게 조율하시겠습니까?";

interface Ep2AlignSceneProps {
  userName: string;
}

export function Ep2AlignScene({ userName: _userName }: Ep2AlignSceneProps) {
  const { episode2AlignChoice, setEpisode2AlignChoice } = useStore();
  const [d0, d1, d2, d3] = ep2AlignScene.dialogue;
  const reducedMotion = usePrefersReducedMotion();

  const actionFull = ep2AlignScene.action;
  const qIdx = actionFull.indexOf(EP2_ACTION_QUESTION);
  const actionLead = qIdx >= 0 ? actionFull.slice(0, qIdx).trim() : actionFull;
  const showQuestionBlock = qIdx > 0 && actionLead.length > 0;

  const maxSections = 7 + (showQuestionBlock ? 1 : 0) + ep2AlignOptions.length;
  const [visibleCount, setVisibleCount] = useState(1);

  const bumpFadeSection = useCallback(
    (e: AnimationEvent<HTMLElement>) => {
      if (reducedMotion) return;
      if (!isEp1SeqFadeAnimation(e)) return;
      setVisibleCount((c) => Math.min(c + 1, maxSections));
    },
    [reducedMotion, maxSections],
  );

  useLayoutEffect(() => {
    if (reducedMotion) setVisibleCount(maxSections);
  }, [reducedMotion, maxSections]);

  const showOption = (optIdx: number) => {
    if (showQuestionBlock) return visibleCount >= 9 + optIdx;
    return visibleCount >= 8 + optIdx;
  };

  return (
    <section className="ep1-scene-layout w-full min-w-0 max-w-none space-y-10 sm:space-y-12">
      {visibleCount >= 1 && (
        <div className="initiation-action-page mb-8 w-full sm:mb-10">
          <div className="flex justify-center px-2">
            <p
              className="ep1-dialogue-seq-fade initiation-brief-badge w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
              onAnimationEnd={bumpFadeSection}
            >
              {ep2AlignScene.title}
            </p>
          </div>
        </div>
      )}

      {visibleCount >= 2 && (
        <div className="space-y-2 px-2 text-center">
          <p
            className="ep1-dialogue-seq-fade whitespace-pre-line font-sans text-[19px] font-bold leading-relaxed text-[#111] sm:text-[21px]"
            onAnimationEnd={bumpFadeSection}
          >
            {renderDialogueBold(ep2AlignScene.situation)}
          </p>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {visibleCount >= 3 && (
          <div
            className="ep1-dialogue-seq-fade rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
            onAnimationEnd={bumpFadeSection}
          >
            <p className="font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
              {renderDialogueBold(d0)}
            </p>
          </div>
        )}

        {visibleCount >= 4 && (
          <div className="ep1-dialogue-seq-fade" onAnimationEnd={bumpFadeSection}>
            <Ep2SpeakerBubble
              name="김지훈 선임 (IT)"
              imageSrc={EP2_KIM_JIHUN_SPEAKING}
              imageAlt="김지훈 선임"
              text={d1}
            />
          </div>
        )}

        {visibleCount >= 5 && (
          <div
            className="ep1-dialogue-seq-fade rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
            onAnimationEnd={bumpFadeSection}
          >
            <p className="font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
              {renderDialogueBold(d2)}
            </p>
          </div>
        )}

        {visibleCount >= 6 && (
          <div className="ep1-dialogue-seq-fade" onAnimationEnd={bumpFadeSection}>
            <Ep2SpeakerBubble
              name="박소진 책임 (마케팅)"
              imageSrc={EP2_PARK_SOJIN_ANGRY}
              imageAlt="박소진 책임"
              text={d3}
            />
          </div>
        )}
      </div>

      <div className="space-y-10 sm:space-y-12">
        {visibleCount >= 7 && (
          <div
            className="ep1-dialogue-seq-fade rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
            onAnimationEnd={bumpFadeSection}
          >
            <p className="font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
              {renderDialogueBold(showQuestionBlock ? actionLead : actionFull)}
            </p>
          </div>
        )}
      </div>

      {showQuestionBlock && visibleCount >= 8 && (
        <div
          className="ep1-dialogue-seq-fade space-y-4 px-1 pt-4 text-center !mt-20 sm:!mt-24 mb-[3.75rem] sm:mb-[4.5rem]"
          onAnimationEnd={bumpFadeSection}
        >
          <p className="m-0 font-sans text-[56px] font-black leading-none text-black sm:text-[72px]">Q.</p>
          <p className="m-0 mx-auto max-w-[min(100%,40rem)] font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
            <span className="font-bold text-[#059669]">{EP2_ACTION_QUESTION}</span>
          </p>
        </div>
      )}

      {/* md+: 한 행 높이 = 가장 긴 카드 기준(items-stretch), 본문은 잘림 없이 세로 확장 */}
      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:gap-5 md:items-stretch lg:gap-6">
        {ep2AlignOptions.map((opt, optIdx) => {
          if (!showOption(optIdx)) return null;
          const selected = episode2AlignChoice === opt.id;
          return (
            <div
              key={opt.id}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`Option ${opt.id}: ${opt.title}`}
              onClick={() => setEpisode2AlignChoice(opt.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setEpisode2AlignChoice(opt.id);
                }
              }}
              onAnimationEnd={bumpFadeSection}
              className={`ep1-dialogue-seq-fade ep1-option-card flex h-full w-full min-w-0 cursor-pointer flex-col overflow-visible rounded-2xl border-2 text-center outline-offset-2 transition-[border-color,box-shadow,background-color,transform] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-black ${
                selected
                  ? "ep1-option-card--selected"
                  : "border-black bg-white shadow-[4px_4px_0_0_#111111] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_0_#111111]"
              }`}
            >
              <div className="-mt-px flex shrink-0 justify-center">
                <div
                  className={`ep1-option-pill pointer-events-none inline-flex items-center gap-2 rounded-b-xl px-5 py-2 font-sans text-[15px] font-bold tracking-wide transition-colors duration-300 sm:text-[16px] ${
                    selected ? "ep1-option-pill--selected" : "bg-[#111111]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-[22px] sm:w-[22px] ${
                      selected
                        ? "border-2 border-[#14532d]/25 bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
                        : "border-2 border-white/35 bg-transparent"
                    }`}
                    aria-hidden
                  >
                    {selected && (
                      <svg width="12" height="10" viewBox="0 0 11 9" fill="none" aria-hidden>
                        <path
                          d="M1 4.5L3.5 7L9.5 1"
                          stroke="#14532d"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="font-sans font-bold">Option {opt.id}</span>
                </div>
              </div>

              <div className="flex min-h-min min-w-0 flex-1 flex-col gap-6 overflow-visible px-5 pb-6 pt-4 text-left sm:gap-7 sm:px-6 sm:pb-6">
                <h2 className="shrink-0 text-center font-sans text-[19px] font-extrabold leading-snug tracking-tight text-[#111111] sm:text-[21px]">
                  {opt.title}
                </h2>
                <div className="min-h-min min-w-0 w-full flex-1 space-y-6 break-words text-center [overflow-wrap:anywhere] sm:space-y-7">
                  {opt.blocks.map((block, i) =>
                    block.type === "text" ? (
                      <p
                        key={`${opt.id}-b-${i}`}
                        className="font-sans text-[15px] font-medium leading-[1.7] text-[#444444] sm:text-[16px]"
                      >
                        {renderDialogueBold(block.text)}
                      </p>
                    ) : (
                      <div
                        key={`${opt.id}-b-${i}`}
                        data-ep1-opt={opt.id}
                        className="ep1-option-quote shrink-0 rounded-xl px-4 py-4 sm:px-4 sm:py-[18px]"
                      >
                        <p className="ep1-option-quote-text font-sans text-[14px] font-medium leading-[1.75] sm:text-[15px] [overflow-wrap:anywhere] [word-break:keep-all]">
                          {"\u201c"}
                          {renderDialogueBold(block.text)}
                          {"\u201d"}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
