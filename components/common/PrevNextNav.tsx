"use client";

import { SIM_COLUMN_GUTTER, SIM_COLUMN_MAX_INNER } from "@/lib/simulationLayout";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  prevHref: string;
  nextHref: string;
  nextDisabled?: boolean;
  onNextClick?: () => void;
  hideNext?: boolean;
  /** 기본 "다음" 대신 표시 (예: initiation-d1) */
  nextLabel?: string;
  /** 중앙 영역 (착수 액션: 선택 칩 등). 있으면 풀폭 바 — 문서 하단에 배치(스크롤 끝에서 노출) */
  centerSlot?: ReactNode;
  /** initiation-action / initiation-d1: SIM_COLUMN 정렬 풀폭 푸터 (centerSlot 없을 때도 동일 레이아웃) */
  simHudFooterLayout?: boolean;
};

/** 네오 브루탈 단일 버튼 — 이전 흰색; 다음은 의사결정 완료 시 네온 그린(#64e87a), 미완료 시 흰색(disabled) */
export function PrevNextNav({
  prevHref,
  nextHref,
  nextDisabled,
  onNextClick,
  hideNext,
  nextLabel,
  centerSlot,
  simHudFooterLayout,
}: Props) {
  const nextText = nextLabel ?? "다음";
  const prevEl = (
    <Link href={prevHref} className="neo-footer-nav-btn neo-footer-nav-btn--prev">
      <span className="neo-no-bg text-[20px] leading-none" aria-hidden>
        ←
      </span>
      <span className="neo-no-bg">이전</span>
    </Link>
  );

  const nextSpacer = <div className="min-h-[52px] min-w-[148px] flex-none sm:min-w-[160px]" aria-hidden />;

  const nextEl = hideNext ? (
    nextSpacer
  ) : onNextClick ? (
    <button
      type="button"
      onClick={onNextClick}
      disabled={!!nextDisabled}
      className={`neo-footer-nav-btn ${
        nextDisabled ? "neo-footer-nav-btn--next-pending" : "neo-footer-nav-btn--next"
      } ${nextLabel ? "min-h-[52px] max-w-[min(100%,280px)] px-3 text-center leading-snug sm:max-w-[320px]" : ""}`}
    >
      <span className="neo-no-bg">{nextText}</span>
      <span className="neo-no-bg shrink-0 text-[20px] leading-none" aria-hidden>
        →
      </span>
    </button>
  ) : (
    <Link
      href={nextHref}
      className={`neo-footer-nav-btn neo-footer-nav-btn--next ${nextLabel ? "max-w-[min(100%,340px)] gap-2 px-3 py-2.5 text-[14px] leading-snug sm:text-[16px]" : ""}`}
    >
      <span className="neo-no-bg">{nextText}</span>
      <span className="neo-no-bg shrink-0 text-[20px] leading-none" aria-hidden>
        →
      </span>
    </Link>
  );

  if (centerSlot || simHudFooterLayout) {
    return (
      <footer className={`initiation-nav-footer onboarding-footer-surface relative z-30 mt-auto w-full shrink-0 border-t border-black/10 bg-transparent py-6 sm:py-6 ${SIM_COLUMN_GUTTER}`}>
        <div className={`flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${SIM_COLUMN_MAX_INNER}`}>
          <div className="flex shrink-0 justify-center sm:justify-start">{prevEl}</div>
          <div className="flex min-h-[52px] min-w-0 flex-1 flex-wrap items-center justify-center gap-2 sm:px-4">
            {centerSlot}
          </div>
          <div className="flex shrink-0 justify-center sm:justify-end">{nextEl}</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="onboarding-footer-surface relative z-30 w-full bg-transparent px-6 py-6 sm:px-10 sm:py-8">
      <div className="relative z-30 mx-auto flex w-full max-w-6xl items-center justify-between gap-6">
        {prevEl}
        {nextEl}
      </div>
    </footer>
  );
}
