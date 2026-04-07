"use client";

import { useStore } from "@/store/useStore";
import { ep1OptionCardBlocks, ep1Options, ep1Scene } from "@/content/episode1";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { AnimationEvent, CSSProperties, ReactNode } from "react";

/** 착수 화면과 유사한 순차 delay(ms) */
const EP1_REVEAL_STAGGER_MS = 110;
function ep1RevealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * EP1_REVEAL_STAGGER_MS}ms` };
}

function replaceUserName(text: string, name: string) {
  return text.replace(/\{User_Name\}/g, name);
}

type BoldSegment = { bold: boolean; text: string };

/** 대화문 `**키워드**` → 세그먼트 (타이핑·볼드 공용) */
function parseBoldSegments(paragraph: string): BoldSegment[] {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts
    .filter((p) => p.length > 0)
    .map((p, i) => ({ bold: i % 2 === 1, text: p }));
}

function sliceSegmentsByCharCount(segments: BoldSegment[], count: number): BoldSegment[] {
  let remaining = Math.max(0, count);
  const out: BoldSegment[] = [];
  for (const seg of segments) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, seg.text.length);
    if (take > 0) out.push({ bold: seg.bold, text: seg.text.slice(0, take) });
    remaining -= take;
  }
  return out;
}

function charAtGlobalIndex(segments: BoldSegment[], index: number): string | undefined {
  let pos = 0;
  for (const seg of segments) {
    for (let j = 0; j < seg.text.length; j++) {
      if (pos === index) return seg.text[j];
      pos++;
    }
  }
  return undefined;
}

/** 방금 드러난 글자 뒤 대기 시간 — 구두점에서 말 끊김 느낌 */
function delayMsAfterChar(ch: string): number {
  const base = 22;
  if (".!?…".includes(ch)) return base + 220;
  if (",，、;:".includes(ch)) return base + 95;
  return base;
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

/** 대화문 `**키워드**` → bold; 상무 말풍선 내 강조색은 globals에서 네온 그린 */
function renderDialogueBold(paragraph: string): ReactNode {
  return parseBoldSegments(paragraph).map((seg, i) =>
    seg.bold ? (
      <strong key={i} className="font-bold text-[#059669]">
        {seg.text}
      </strong>
    ) : (
      <span key={i}>{seg.text}</span>
    ),
  );
}

function renderSegmentsNodes(segments: BoldSegment[]): ReactNode {
  return segments.map((seg, i) =>
    seg.bold ? (
      <strong key={i} className="font-bold text-[#059669]">
        {seg.text}
      </strong>
    ) : (
      <span key={i}>{seg.text}</span>
    ),
  );
}

function stripOuterQuotes(s: string) {
  let t = s.trim();
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1);
  return t;
}

interface Ep1SceneProps {
  userName: string;
}

function SupervisorTypingBody({
  body,
  typingStartDelayMs,
  canStart = true,
  onTypingComplete,
}: {
  body: string;
  typingStartDelayMs: number;
  /** false이면 타이핑 대기(빈 본문), true가 된 뒤 `typingStartDelayMs` 뒤 시작 */
  canStart?: boolean;
  onTypingComplete?: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const segments = useMemo(() => parseBoldSegments(body), [body]);
  const totalChars = useMemo(() => segments.reduce((n, s) => n + s.text.length, 0), [segments]);
  const [visibleCount, setVisibleCount] = useState(0);
  const typingComplete = totalChars === 0 || visibleCount >= totalChars;
  const completeOnceRef = useRef(false);

  useEffect(() => {
    completeOnceRef.current = false;
  }, [body, canStart]);

  useLayoutEffect(() => {
    if (!reducedMotion) return;
    if (canStart) setVisibleCount(totalChars);
    else setVisibleCount(0);
  }, [reducedMotion, totalChars, canStart]);

  useEffect(() => {
    if (typingComplete && totalChars > 0 && !completeOnceRef.current) {
      completeOnceRef.current = true;
      onTypingComplete?.();
    }
  }, [typingComplete, totalChars, onTypingComplete]);

  useEffect(() => {
    if (reducedMotion) {
      if (canStart) setVisibleCount(totalChars);
      else setVisibleCount(0);
      return;
    }
    if (!canStart) {
      setVisibleCount(0);
      return;
    }
    setVisibleCount(0);
    if (totalChars === 0) return;

    let cancelled = false;
    let visible = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      if (visible >= totalChars) return;
      visible += 1;
      setVisibleCount(visible);
      if (visible >= totalChars) return;
      const last = charAtGlobalIndex(segments, visible - 1);
      const wait = last ? delayMsAfterChar(last) : 22;
      timeoutId = setTimeout(tick, wait);
    };

    timeoutId = setTimeout(tick, typingStartDelayMs);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [body, reducedMotion, canStart, segments, totalChars, typingStartDelayMs]);

  const shown = useMemo(
    () => sliceSegmentsByCharCount(segments, visibleCount),
    [segments, visibleCount],
  );

  const showCursor =
    canStart && !reducedMotion && !typingComplete && visibleCount > 0;

  return (
    <p className="text-left font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
      {renderSegmentsNodes(shown)}
      {showCursor && (
        <span
          className="ep1-supervisor-typing-cursor ml-0.5 inline-block h-[1.15em] w-[2px] translate-y-[0.08em] bg-[#059669] align-[-0.05em] motion-safe:animate-pulse"
          aria-hidden
        />
      )}
    </p>
  );
}

const EP1_SUPERVISOR_AVATAR_SPEAKING = "/choi-seongmin_speaking.jpg";
const EP1_SUPERVISOR_AVATAR_ANGRY = "/choi-seongmin_angry.jpg";

function SupervisorBubble({
  text,
  userName,
  typingStartDelayMs,
  canStart = true,
  onTypingComplete,
  avatarSrc = EP1_SUPERVISOR_AVATAR_SPEAKING,
}: {
  text: string;
  userName: string;
  typingStartDelayMs: number;
  canStart?: boolean;
  onTypingComplete?: () => void;
  /** 첫 대사: speaking / 둘째 대사: angry 등 */
  avatarSrc?: string;
}) {
  const body = stripOuterQuotes(replaceUserName(text, userName));
  return (
    <div className="flex items-start gap-0">
      {/* 아바타가 말풍선 위에 살짝 겹침(z-20) — 음수 마진으로 박스를 왼쪽으로 당김 */}
      <div className="relative z-20 h-[168px] w-[168px] shrink-0 sm:h-48 sm:w-48">
        <div className="absolute inset-0 rounded-full border-4 border-[#64e87a] bg-white p-1.5">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
            <Image
              src={avatarSrc}
              alt="최성민 상무"
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 640px) 168px, 192px"
            />
          </div>
        </div>
      </div>
      <div className="ep1-supervisor-bubble relative z-10 -ml-10 min-w-0 flex-1 rounded-2xl py-5 pl-[4.25rem] pr-5 sm:-ml-14 sm:py-6 sm:pl-[5.5rem] sm:pr-6">
        <p className="mb-2.5 font-sans text-[15px] font-black leading-tight text-[#111] sm:text-[16px]">최성민 상무</p>
        <SupervisorTypingBody
          body={body}
          typingStartDelayMs={typingStartDelayMs}
          canStart={canStart}
          onTypingComplete={onTypingComplete}
        />
      </div>
    </div>
  );
}

/** 둘째 말풍선 페이드가 끝난 뒤 타이핑 시작까지 짧은 간격 */
const EP1_SECOND_TYPING_PAUSE_MS = 380;

const EP1_SEQ_FADE_ANIM_NAME = "ep1-dialogue-seq-fade";

function isEp1SeqFadeAnimation(e: AnimationEvent<HTMLDivElement>) {
  return String(e.animationName ?? "").includes(EP1_SEQ_FADE_ANIM_NAME);
}

export function Ep1Scene({ userName }: Ep1SceneProps) {
  const { episode1Choice, setEpisode1Choice } = useStore();
  const [firstQuote, narration, secondQuote] = ep1Scene.dialogue;
  const lines = ep1Scene.situationLines;
  const reducedMotion = usePrefersReducedMotion();

  /** 1) 첫 말풍선 타이핑 끝 → true */
  const [showNarrationBlock, setShowNarrationBlock] = useState(false);
  /** 2) 나레이션 박스 페이드 끝 → true */
  const [showSecondSupervisorBlock, setShowSecondSupervisorBlock] = useState(false);
  /** 3) 둘째 말풍선(아바타+박스) 페이드 끝 → true, 이때부터 타이핑 */
  const [secondTypingUnlocked, setSecondTypingUnlocked] = useState(false);

  /** 둘째 말풍선 타이핑 완료 → Q·워딩·옵션 순차 공개 */
  const [secondDialogueTypingDone, setSecondDialogueTypingDone] = useState(false);
  const [showQuestionLine, setShowQuestionLine] = useState(false);
  const [showQuestionWording, setShowQuestionWording] = useState(false);
  /** 0이면 옵션 없음, 1이면 A만 … 3이면 A+B+C */
  const [optionsVisibleCount, setOptionsVisibleCount] = useState(0);

  const handleFirstTypingComplete = useCallback(() => {
    setShowNarrationBlock(true);
  }, []);

  const handleNarrationFadeEnd = useCallback(
    (e: AnimationEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      if (!isEp1SeqFadeAnimation(e)) return;
      setShowSecondSupervisorBlock(true);
    },
    [reducedMotion],
  );

  const handleSecondShellFadeEnd = useCallback(
    (e: AnimationEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      if (!isEp1SeqFadeAnimation(e)) return;
      setSecondTypingUnlocked(true);
    },
    [reducedMotion],
  );

  useEffect(() => {
    if (!reducedMotion || !showNarrationBlock) return;
    setShowSecondSupervisorBlock(true);
  }, [reducedMotion, showNarrationBlock]);

  useEffect(() => {
    if (!reducedMotion || !showSecondSupervisorBlock) return;
    setSecondTypingUnlocked(true);
  }, [reducedMotion, showSecondSupervisorBlock]);

  const handleSecondDialogueTypingComplete = useCallback(() => {
    setSecondDialogueTypingDone(true);
    if (!reducedMotion) setShowQuestionLine(true);
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (!secondDialogueTypingDone || !reducedMotion) return;
    setShowQuestionLine(true);
  }, [secondDialogueTypingDone, reducedMotion]);

  useEffect(() => {
    if (!secondDialogueTypingDone || !reducedMotion) return;
    const t1 = setTimeout(() => setShowQuestionWording(true), 65);
    const t2 = setTimeout(() => setOptionsVisibleCount(1), 130);
    const t3 = setTimeout(() => setOptionsVisibleCount(2), 195);
    const t4 = setTimeout(() => setOptionsVisibleCount(3), 260);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [secondDialogueTypingDone, reducedMotion]);

  const handleQFadeEnd = useCallback(
    (e: AnimationEvent<HTMLParagraphElement>) => {
      if (reducedMotion) return;
      if (!isEp1SeqFadeAnimation(e)) return;
      setShowQuestionWording(true);
    },
    [reducedMotion],
  );

  const handleWordingFadeEnd = useCallback(
    (e: AnimationEvent<HTMLParagraphElement>) => {
      if (reducedMotion) return;
      if (!isEp1SeqFadeAnimation(e)) return;
      setOptionsVisibleCount(1);
    },
    [reducedMotion],
  );

  const ep1OptionCount = ep1Options.length;

  const handleOptionFadeEnd = useCallback(
    (optIdx: number) => (e: AnimationEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      if (!isEp1SeqFadeAnimation(e)) return;
      if (optIdx < ep1OptionCount - 1) setOptionsVisibleCount(optIdx + 2);
    },
    [reducedMotion, ep1OptionCount],
  );

  return (
    <section className="ep1-scene-layout w-full min-w-0 max-w-none space-y-10 sm:space-y-12">
      {/* E1 에피소드 제목 — InitiationAction `initiation-brief-badge`와 동일 */}
      <div className="initiation-action-page mb-8 w-full sm:mb-10">
        <div className="flex justify-center px-2">
          <p
            className="ep1-scene-reveal initiation-brief-badge w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
            style={ep1RevealDelay(0)}
          >
            {ep1Scene.title}
          </p>
        </div>
      </div>

      {/* 상황 3줄 */}
      <div className="space-y-2 px-2 text-center">
        <p
          className="ep1-scene-reveal font-sans text-[19px] font-bold leading-snug text-[#059669] sm:text-[21px]"
          style={ep1RevealDelay(1)}
        >
          {lines.line1Green}
        </p>
        <p
          className="ep1-scene-reveal font-sans text-[19px] font-bold leading-relaxed text-[#111] sm:text-[21px]"
          style={ep1RevealDelay(2)}
        >
          {lines.line2Bold}
        </p>
        <p
          className="ep1-scene-reveal font-sans text-[18px] font-normal leading-relaxed text-[#6b7280] sm:text-[20px]"
          style={ep1RevealDelay(3)}
        >
          {lines.line3Muted}
        </p>
      </div>

      {/* 대화 블록: 박스 간 여백 넓게 */}
      <div className="space-y-10 sm:space-y-12">
        <div className="ep1-scene-reveal" style={ep1RevealDelay(4)}>
          <SupervisorBubble
            text={firstQuote}
            userName={userName}
            typingStartDelayMs={4 * EP1_REVEAL_STAGGER_MS + 520}
            avatarSrc={EP1_SUPERVISOR_AVATAR_SPEAKING}
            onTypingComplete={handleFirstTypingComplete}
          />
        </div>
        {showNarrationBlock && (
          <div
            className="ep1-dialogue-seq-fade rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
            onAnimationEnd={handleNarrationFadeEnd}
          >
            <p className="font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
              {renderDialogueBold(replaceUserName(narration, userName))}
            </p>
          </div>
        )}
        {showSecondSupervisorBlock && (
          <div className="ep1-dialogue-seq-fade" onAnimationEnd={handleSecondShellFadeEnd}>
            <SupervisorBubble
              text={secondQuote}
              userName={userName}
              canStart={secondTypingUnlocked}
              typingStartDelayMs={EP1_SECOND_TYPING_PAUSE_MS}
              avatarSrc={EP1_SUPERVISOR_AVATAR_ANGRY}
              onTypingComplete={handleSecondDialogueTypingComplete}
            />
          </div>
        )}
      </div>

      {secondDialogueTypingDone && (
        <>
          {/* Q + 워딩 — 둘째 말풍선 타이핑 종료 후 순차 페이드 */}
          <div className="space-y-4 px-1 pt-4 text-center !mt-20 sm:!mt-24 mb-[3.75rem] sm:mb-[4.5rem]">
            {showQuestionLine && (
              <p
                className="ep1-dialogue-seq-fade font-sans text-[56px] font-black leading-none text-black sm:text-[72px]"
                onAnimationEnd={handleQFadeEnd}
              >
                Q.
              </p>
            )}
            {showQuestionWording && (
              <p
                className="ep1-dialogue-seq-fade mx-auto max-w-[min(100%,40rem)] font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]"
                onAnimationEnd={handleWordingFadeEnd}
              >
                무리한 탑다운(Top-down) 지시와 상무의 타협안 앞에서,
                <br />
                <span className="font-bold text-[#059669]">리더인 당신은 이 위기를 어떻게 돌파하시겠습니까?</span>
              </p>
            )}
          </div>

          {/* 옵션 3열 — 한 행 높이 = 가장 긴 카드 기준, 나머지는 같은 높이로 늘어남 (md+) */}
          <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:gap-5 md:items-stretch lg:gap-6">
            {ep1Options.map((opt, optIdx) => {
              if (optionsVisibleCount <= optIdx) return null;
              const block = ep1OptionCardBlocks[opt.id];
              const selected = episode1Choice === opt.id;
              return (
                <div
                  key={opt.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  aria-label={`Option ${opt.id}: ${opt.title}`}
                  onClick={() => setEpisode1Choice(opt.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setEpisode1Choice(opt.id);
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

              <div
                id={`ep1-option-detail-${opt.id}`}
                className="flex min-h-min min-w-0 flex-1 flex-col gap-6 overflow-visible px-5 pb-6 pt-4 text-left sm:gap-7 sm:px-6 sm:pb-6"
              >
                <h2
                  id={`ep1-option-heading-${opt.id}`}
                  className="shrink-0 text-center font-sans text-[19px] font-extrabold leading-snug tracking-tight text-[#111111] sm:text-[21px]"
                >
                  {opt.title}
                </h2>
                <div className="min-h-min min-w-0 flex-1 space-y-4 break-words text-center [overflow-wrap:anywhere] sm:space-y-5">
                  {block.bodyParagraphs.map((para, idx) => (
                    <p
                      key={`${opt.id}-p-${idx}`}
                      className="font-sans text-[15px] font-medium leading-[1.7] text-[#444444] sm:text-[16px]"
                    >
                      {renderDialogueBold(para)}
                    </p>
                  ))}
                </div>
                <div
                  data-ep1-opt={opt.id}
                  className="ep1-option-quote mt-auto shrink-0 rounded-xl px-4 py-4 sm:px-4 sm:py-[18px]"
                >
                  <p className="ep1-option-quote-text font-sans text-[14px] font-medium leading-[1.75] sm:text-[15px] [overflow-wrap:anywhere] [word-break:keep-all]">
                    &ldquo;{block.quote}&rdquo;
                  </p>
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
