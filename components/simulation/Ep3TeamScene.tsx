"use client";

import { useStore } from "@/store/useStore";
import { ep3Scene, ep3Options } from "@/content/episode3";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { AnimationEvent, CSSProperties, ReactNode } from "react";
import {
  TypingBody,
  usePrefersReducedMotion,
  isSeqFadeAnimation,
  stripOuterQuotes,
  revealDelay,
  renderDialogueBold,
  REVEAL_STAGGER_MS,
  TYPING_PAUSE_MS,
} from "./shared-animation";

const ACCENT = "var(--sim-accent)";

function Ep3SpeakerBubble({
  name,
  imageSrc,
  imageAlt,
  text,
  avatarRevealStyle,
  bubbleRevealStyle,
  typingStartDelayMs,
  canStart,
  onTypingComplete,
}: {
  name: string;
  imageSrc: string;
  imageAlt: string;
  text: string;
  avatarRevealStyle: CSSProperties;
  bubbleRevealStyle: CSSProperties;
  typingStartDelayMs: number;
  canStart?: boolean;
  onTypingComplete?: () => void;
}) {
  const body = stripOuterQuotes(text);
  return (
    <div className="flex items-start gap-0">
      <div
        className="ep1-scene-reveal relative z-20 h-[168px] w-[168px] shrink-0 sm:h-48 sm:w-48"
        style={avatarRevealStyle}
      >
        <div className="absolute inset-0 rounded-full border-4 border-[color:var(--sim-accent)] bg-white p-1.5">
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
      <div
        className="ep1-scene-reveal ep1-supervisor-bubble ep3-speaker-bubble relative z-10 -ml-10 min-w-0 flex-1 rounded-2xl py-5 pl-[4.25rem] pr-5 sm:-ml-14 sm:py-6 sm:pl-[5.5rem] sm:pr-6"
        style={bubbleRevealStyle}
      >
        <p className="mb-2.5 font-sans text-[15px] font-black leading-tight text-[#111] sm:text-[16px]">{name}</p>
        <TypingBody
          body={body}
          accentColor={ACCENT}
          typingStartDelayMs={typingStartDelayMs}
          canStart={canStart}
          onTypingComplete={onTypingComplete}
        />
      </div>
    </div>
  );
}

const EP3_ACTION_QUESTION = "리더인 당신은 이 상황을 어떻게 해결하시겠습니까?";

interface Ep3TeamSceneProps {
  userName: string;
}

export function Ep3TeamScene({ userName: _userName }: Ep3TeamSceneProps) {
  const { episode3Choice, setEpisode3Choice } = useStore();
  const reducedMotion = usePrefersReducedMotion();

  const actionFull = ep3Scene.action;
  const qIdx = actionFull.indexOf(EP3_ACTION_QUESTION);
  const actionLead = qIdx >= 0 ? actionFull.slice(0, qIdx).trim() : actionFull;
  const showQuestionBlock = qIdx > 0 && actionLead.length > 0;

  const [typingDone, setTypingDone] = useState(false);
  const [showPostNarration, setShowPostNarration] = useState(false);
  const [showQuestionWording, setShowQuestionWording] = useState(false);
  const [optionsVisibleCount, setOptionsVisibleCount] = useState(0);

  const handleTypingComplete = useCallback(() => {
    setTypingDone(true);
  }, []);

  const handleNarrationFadeEnd = useCallback(
    (e: AnimationEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      setShowPostNarration(true);
    },
    [reducedMotion],
  );

  const handleQFadeEnd = useCallback(
    (e: AnimationEvent<HTMLElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      setShowQuestionWording(true);
    },
    [reducedMotion],
  );

  const handleWordingFadeEnd = useCallback(
    (e: AnimationEvent<HTMLElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      setOptionsVisibleCount(1);
    },
    [reducedMotion],
  );

  const handleActionFadeEnd = useCallback(
    (e: AnimationEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      setOptionsVisibleCount(1);
    },
    [reducedMotion],
  );

  const ep3OptionCount = ep3Options.length;

  const handleOptionFadeEnd = useCallback(
    (optIdx: number) => (e: AnimationEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      if (optIdx < ep3OptionCount - 1) setOptionsVisibleCount(optIdx + 2);
    },
    [reducedMotion, ep3OptionCount],
  );

  useLayoutEffect(() => {
    if (!reducedMotion) return;
    setTypingDone(true);
    setShowPostNarration(true);
    setShowQuestionWording(true);
    setOptionsVisibleCount(ep3OptionCount);
  }, [reducedMotion, ep3OptionCount]);

  useEffect(() => {
    if (!reducedMotion || !typingDone) return;
    setShowPostNarration(true);
  }, [reducedMotion, typingDone]);

  return (
    <section className="ep1-scene-layout w-full min-w-0 max-w-none space-y-10 sm:space-y-12">
      <div className="initiation-action-page mb-8 w-full sm:mb-10">
        <div className="flex justify-center px-2">
          <p
            className="ep1-scene-reveal initiation-brief-badge w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
            style={revealDelay(0)}
          >
            {ep3Scene.title}
          </p>
        </div>
      </div>

      <div className="space-y-2 px-2 text-center">
        <p
          className="ep1-scene-reveal whitespace-pre-line font-sans text-[19px] font-bold leading-relaxed text-[#111] sm:text-[21px]"
          style={revealDelay(1)}
        >
          {renderDialogueBold(ep3Scene.situation, ACCENT)}
        </p>
      </div>

      <div className="space-y-10 sm:space-y-12">
        <Ep3SpeakerBubble
          name="정태영 책임 (인프라보안)"
          imageSrc="/jeong-taeyoung.jpg"
          imageAlt="정태영 책임"
          text={ep3Scene.dialogue[0]}
          avatarRevealStyle={revealDelay(2)}
          bubbleRevealStyle={revealDelay(3)}
          typingStartDelayMs={3 * REVEAL_STAGGER_MS + 520}
          canStart
          onTypingComplete={handleTypingComplete}
        />

        {typingDone && (
          <div
            className="ep1-dialogue-seq-fade rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
            onAnimationEnd={handleNarrationFadeEnd}
          >
            <p className="whitespace-pre-line font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
              {renderDialogueBold(ep3Scene.dialogue[1], ACCENT)}
            </p>
          </div>
        )}
      </div>

      {showPostNarration && (
        <>
          {showQuestionBlock ? (
            <div className="space-y-4 px-1 pt-4 text-center !mt-20 sm:!mt-24 mb-[3.75rem] sm:mb-[4.5rem]">
              <p
                className="ep1-dialogue-seq-fade font-sans text-[56px] font-black leading-none text-black sm:text-[72px]"
                onAnimationEnd={handleQFadeEnd}
              >
                Q.
              </p>
              {showQuestionWording && (
                <div
                  className="ep1-dialogue-seq-fade mx-auto max-w-[min(100%,56rem)] space-y-4 text-center font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]"
                  onAnimationEnd={handleWordingFadeEnd}
                >
                  <p>{renderDialogueBold(actionLead, ACCENT)}</p>
                  <p>
                    <span className="font-bold" style={{ color: ACCENT }}>{EP3_ACTION_QUESTION}</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-10 sm:space-y-12">
              <div
                className="ep1-dialogue-seq-fade rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
                onAnimationEnd={handleActionFadeEnd}
              >
                <p className="font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
                  {renderDialogueBold(actionFull, ACCENT)}
                </p>
              </div>
            </div>
          )}

          <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:gap-5 md:items-stretch lg:gap-6">
            {ep3Options.map((opt, optIdx) => {
              if (optionsVisibleCount <= optIdx) return null;
              const selected = episode3Choice === opt.id;
              return (
                <div
                  key={opt.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  aria-label={`Option ${opt.id}: ${opt.title}`}
                  onClick={() => setEpisode3Choice(opt.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setEpisode3Choice(opt.id);
                    }
                  }}
                  onAnimationEnd={handleOptionFadeEnd(optIdx)}
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
                        className={`ep1-option-check-ring flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-[22px] sm:w-[22px] ${
                          selected
                            ? "border-2 border-[#14532d]/25 bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
                            : "border-2 border-white/35 bg-transparent"
                        }`}
                        aria-hidden
                      >
                        {selected && (
                          <svg width="12" height="10" viewBox="0 0 11 9" fill="none" aria-hidden>
                            <path
                              className="ep1-option-check-mark"
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
                            {renderDialogueBold(block.text, ACCENT)}
                          </p>
                        ) : (
                          <div
                            key={`${opt.id}-b-${i}`}
                            data-ep1-opt={opt.id}
                            className="ep1-option-quote shrink-0 rounded-xl px-4 py-4 sm:px-4 sm:py-[18px]"
                          >
                            <p className="ep1-option-quote-text font-sans text-[14px] font-medium leading-[1.75] sm:text-[15px] [overflow-wrap:anywhere] [word-break:keep-all]">
                              {"\u201c"}
                              {renderDialogueBold(block.text, ACCENT)}
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
        </>
      )}
    </section>
  );
}
