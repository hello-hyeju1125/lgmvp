"use client";

import Image from "next/image";
import {
  ep8Scene,
  ep8SituationLines,
  ep8ActionLead,
  EP8_ACTION_QUESTION,
} from "@/content/episode8";
import { useStore } from "@/store/useStore";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { AnimationEvent, CSSProperties, ReactNode } from "react";
import {
  TypingBody,
  usePrefersReducedMotion,
  isSeqFadeAnimation,
  revealDelay,
  renderDialogueBold,
  REVEAL_STAGGER_MS,
  TYPING_PAUSE_MS,
} from "./shared-animation";

const ACCENT = "#FF7A00";

const EP8_LEE_MINSOO_BASIC_SRC = "/LG_MVP_lee-minsoo_speaking_basic.jpg";
const EP8_LEE_MINSOO_UPSET_SRC = "/LG_MVP_lee-minsoo_upset.jpg";

function LeeMinsooBubble({
  text,
  imageSrc,
  typingStartDelayMs,
  canStart,
  onTypingComplete,
}: {
  text: string;
  imageSrc: string;
  typingStartDelayMs: number;
  canStart?: boolean;
  onTypingComplete?: () => void;
}) {
  return (
    <div className="flex items-start gap-0">
      <div className="relative z-20 h-[168px] w-[168px] shrink-0 sm:h-48 sm:w-48">
        <div className="absolute inset-0 rounded-full border-4 border-[#FF7A00] bg-white p-1.5">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
            <Image
              src={imageSrc}
              alt="이민수 책임"
              fill
              className="object-contain object-center"
              sizes="(max-width: 640px) 168px, 192px"
            />
          </div>
        </div>
      </div>
      <div className="ep1-supervisor-bubble relative z-10 -ml-10 min-w-0 flex-1 rounded-2xl py-5 pl-[4.25rem] pr-5 sm:-ml-14 sm:py-6 sm:pl-[5.5rem] sm:pr-6">
        <p className="mb-2.5 font-sans text-[15px] font-black leading-tight text-[#111] sm:text-[16px]">이민수 책임 (고객가치혁신)</p>
        <TypingBody
          body={text}
          accentColor={ACCENT}
          typingStartDelayMs={typingStartDelayMs}
          canStart={canStart}
          onTypingComplete={onTypingComplete}
        />
      </div>
    </div>
  );
}

interface Ep8WritingCardProps {
  pillText: string;
  title?: string;
  children: ReactNode;
}

function Ep8WritingCard({ pillText, title, children }: Ep8WritingCardProps) {
  return (
    <div className="ep1-option-card flex h-full min-h-0 w-full min-w-0 flex-col overflow-visible rounded-2xl border-2 border-black bg-white text-center shadow-[4px_4px_0_0_#111111] outline-offset-2">
      <div className="-mt-px flex shrink-0 justify-center px-1">
        <div className="ep1-option-pill pointer-events-none inline-flex max-w-[min(100%,28rem)] items-center justify-center gap-2 rounded-b-xl bg-[#111111] px-4 py-2 text-center font-sans text-[13px] font-bold leading-snug tracking-wide !text-[#ffffff] sm:px-5 sm:text-[16px] sm:leading-normal">
          <span className="font-sans font-bold [word-break:keep-all]">{pillText}</span>
        </div>
      </div>
      <div
        className={`flex min-h-min min-w-0 flex-1 flex-col overflow-visible px-5 pb-6 text-left sm:px-6 sm:pb-6 ${
          title ? "gap-4 pt-4 sm:gap-5" : "pt-3 sm:pt-4"
        }`}
      >
        {title ? (
          <h2 className="shrink-0 text-center font-sans text-[19px] font-extrabold leading-snug tracking-tight text-[#111111] sm:text-[21px] [word-break:keep-all]">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}

interface Ep8SeniorSceneProps {
  userName: string;
}

export function Ep8SeniorScene({ userName }: Ep8SeniorSceneProps) {
  const { episode8CoachingText, setEpisode8CoachingText } = useStore();
  const reducedMotion = usePrefersReducedMotion();

  const [d0, d1] = ep8Scene.dialogue;

  const [firstTypingDone, setFirstTypingDone] = useState(false);
  const [showSecondBubble, setShowSecondBubble] = useState(false);
  const [secondBubbleUnlocked, setSecondBubbleUnlocked] = useState(false);
  const [secondTypingDone, setSecondTypingDone] = useState(false);
  const [showQ, setShowQ] = useState(false);
  const [showQWording, setShowQWording] = useState(false);
  const [showWritingCard, setShowWritingCard] = useState(false);

  const handleFirstTypingComplete = useCallback(() => {
    setFirstTypingDone(true);
    setShowSecondBubble(true);
  }, []);

  const handleSecondShellFadeEnd = useCallback(
    (e: AnimationEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      setSecondBubbleUnlocked(true);
    },
    [reducedMotion],
  );

  const handleSecondTypingComplete = useCallback(() => {
    setSecondTypingDone(true);
    setShowQ(true);
  }, []);

  const handleQFadeEnd = useCallback(
    (e: AnimationEvent<HTMLElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      setShowQWording(true);
    },
    [reducedMotion],
  );

  const handleWordingFadeEnd = useCallback(
    (e: AnimationEvent<HTMLElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      setShowWritingCard(true);
    },
    [reducedMotion],
  );

  useLayoutEffect(() => {
    if (!reducedMotion) return;
    setFirstTypingDone(true);
    setShowSecondBubble(true);
    setSecondBubbleUnlocked(true);
    setSecondTypingDone(true);
    setShowQ(true);
    setShowQWording(true);
    setShowWritingCard(true);
  }, [reducedMotion]);

  useEffect(() => {
    if (!reducedMotion || !firstTypingDone) return;
    setShowSecondBubble(true);
    setSecondBubbleUnlocked(true);
  }, [reducedMotion, firstTypingDone]);

  useEffect(() => {
    if (!reducedMotion || !secondTypingDone) return;
    setShowQ(true);
    setShowQWording(true);
    setShowWritingCard(true);
  }, [reducedMotion, secondTypingDone]);

  return (
    <section className="ep1-scene-layout w-full min-w-0 max-w-none space-y-10 sm:space-y-12">
      <div className="initiation-action-page mb-8 w-full sm:mb-10">
        <div className="flex flex-col items-center justify-center gap-2 px-2">
          <p
            className="ep1-scene-reveal initiation-brief-badge w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
            style={revealDelay(0)}
          >
            {ep8Scene.title}
          </p>
        </div>
      </div>

      <div className="space-y-2 px-2 text-center">
        <p
          className="ep1-scene-reveal font-sans text-[19px] font-bold leading-snug text-[#FF7A00] sm:text-[21px]"
          style={revealDelay(1)}
        >
          {ep8SituationLines.line1Green}
        </p>
        <p
          className="ep1-scene-reveal font-sans text-[19px] font-bold leading-relaxed text-[#111] sm:text-[21px]"
          style={revealDelay(2)}
        >
          {ep8SituationLines.line2Bold}
        </p>
        <p
          className="ep1-scene-reveal font-sans text-[18px] font-normal leading-relaxed text-[#6b7280] sm:text-[20px]"
          style={revealDelay(3)}
        >
          {ep8SituationLines.line3Muted}
        </p>
      </div>

      <div className="space-y-10 sm:space-y-12">
        <div className="ep1-scene-reveal" style={revealDelay(4)}>
          <LeeMinsooBubble
            text={d0}
            imageSrc={EP8_LEE_MINSOO_BASIC_SRC}
            typingStartDelayMs={4 * REVEAL_STAGGER_MS + 520}
            canStart
            onTypingComplete={handleFirstTypingComplete}
          />
        </div>

        {showSecondBubble && (
          <div className="ep1-dialogue-seq-fade" onAnimationEnd={handleSecondShellFadeEnd}>
            <LeeMinsooBubble
              text={d1}
              imageSrc={EP8_LEE_MINSOO_UPSET_SRC}
              typingStartDelayMs={TYPING_PAUSE_MS}
              canStart={secondBubbleUnlocked}
              onTypingComplete={handleSecondTypingComplete}
            />
          </div>
        )}
      </div>

      {showQ && (
        <div className="space-y-4 px-1 pt-4 text-center !mt-20 sm:!mt-24 mb-[3.75rem] sm:mb-[4.5rem]">
          <p
            className="ep1-dialogue-seq-fade font-sans text-[56px] font-black leading-none text-black sm:text-[72px]"
            onAnimationEnd={handleQFadeEnd}
          >
            Q.
          </p>
          {showQWording && (
            <div
              className="ep1-dialogue-seq-fade mx-auto max-w-[min(100%,40rem)] space-y-4 text-center font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]"
              onAnimationEnd={handleWordingFadeEnd}
            >
              <p className="whitespace-pre-line">{renderDialogueBold(ep8ActionLead, ACCENT)}</p>
              <p className="whitespace-pre-line">
                <span className="font-bold !text-[#FF7A00]">{EP8_ACTION_QUESTION}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {showWritingCard && (
        <div className="ep1-dialogue-seq-fade space-y-6">
          <div className="grid w-full min-w-0 grid-cols-1 gap-5 md:gap-5 lg:gap-6">
            <Ep8WritingCard pillText="이민수 책임에게 건넬 코칭 메시지">
              <textarea
                value={episode8CoachingText}
                onChange={(e) => setEpisode8CoachingText(e.target.value)}
                placeholder="예: 민수 책임님의 현장 VOC 경험은 우리 프로젝트에 없어서는 안 될 자산입니다. 기술 용어보다 '고객이 무엇에 불만을 갖는지'를 데이터에서 짚어내는 역할을 맡아 주시면…"
                rows={9}
                className="min-h-[220px] w-full resize-y rounded-xl border-2 border-black/10 bg-white px-4 py-3 font-sans text-[15px] font-medium leading-[1.75] text-[#111] placeholder:text-[#9ca3af] focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 sm:text-[16px]"
                aria-label="이민수 책임에게 건넸을 코칭 메시지"
              />
            </Ep8WritingCard>
          </div>
        </div>
      )}
    </section>
  );
}
