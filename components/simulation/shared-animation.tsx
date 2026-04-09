"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { AnimationEvent, CSSProperties, ReactNode } from "react";

export type BoldSegment = { bold: boolean; text: string };

export function parseBoldSegments(paragraph: string): BoldSegment[] {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts
    .filter((p) => p.length > 0)
    .map((p, i) => ({ bold: i % 2 === 1, text: p }));
}

export function sliceSegmentsByCharCount(segments: BoldSegment[], count: number): BoldSegment[] {
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

function delayMsAfterChar(ch: string): number {
  const base = 22;
  if (".!?…".includes(ch)) return base + 220;
  if (",，、;:".includes(ch)) return base + 95;
  return base;
}

export function usePrefersReducedMotion(): boolean {
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

export const REVEAL_STAGGER_MS = 110;

export function revealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * REVEAL_STAGGER_MS}ms` };
}

export const SEQ_FADE_ANIM_NAME = "ep1-dialogue-seq-fade";

export function isSeqFadeAnimation(e: AnimationEvent<HTMLElement>): boolean {
  return String(e.animationName ?? "").includes(SEQ_FADE_ANIM_NAME);
}

export function stripOuterQuotes(s: string): string {
  let t = s.trim();
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1);
  if (t.startsWith("\u201C") && t.endsWith("\u201D")) t = t.slice(1, -1);
  return t;
}

export function renderBoldNodes(segments: BoldSegment[], accentColor: string): ReactNode {
  return segments.map((seg, i) =>
    seg.bold ? (
      <strong key={i} className="font-bold" style={{ color: accentColor }}>
        {seg.text}
      </strong>
    ) : (
      <span key={i}>{seg.text}</span>
    ),
  );
}

export function renderDialogueBold(paragraph: string, accentColor = "#059669"): ReactNode {
  return renderBoldNodes(parseBoldSegments(paragraph), accentColor);
}

export const TYPING_PAUSE_MS = 380;

interface TypingBodyProps {
  body: string;
  typingStartDelayMs: number;
  canStart?: boolean;
  onTypingComplete?: () => void;
  accentColor?: string;
  className?: string;
}

export function TypingBody({
  body,
  typingStartDelayMs,
  canStart = true,
  onTypingComplete,
  accentColor = "#059669",
  className = "text-left font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]",
}: TypingBodyProps) {
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

  const showCursor = canStart && !reducedMotion && !typingComplete && visibleCount > 0;

  return (
    <p className={className}>
      {renderBoldNodes(shown, accentColor)}
      {showCursor && (
        <span
          className="ml-0.5 inline-block h-[1.15em] w-[2px] translate-y-[0.08em] align-[-0.05em] motion-safe:animate-pulse"
          style={{ backgroundColor: accentColor }}
          aria-hidden
        />
      )}
    </p>
  );
}
