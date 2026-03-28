"use client";

import Link from "next/link";

type Props = {
  prevHref: string;
  nextHref: string;
  nextDisabled?: boolean;
  onNextClick?: () => void;
  hideNext?: boolean;
};

export function PrevNextNav({ prevHref, nextHref, nextDisabled, onNextClick, hideNext }: Props) {
  return (
    <footer className="force-bg-transparent relative z-30 w-full px-6 py-6">
      <div className="force-bg-transparent relative z-30 mx-auto w-full max-w-4xl px-0">
        <div className="force-bg-transparent flex w-full items-center justify-between gap-6">
          <Link
            href={prevHref}
            className="neo-btn-secondary inline-flex min-w-[140px] items-center justify-center px-8 py-3 text-[16px] font-bold shadow-[4px_4px_0px_#111111] transition duration-150 ease-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#111111] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#111111]"
          >
            이전
          </Link>
          {hideNext ? (
            <div />
          ) : onNextClick ? (
            <button
              type="button"
              onClick={onNextClick}
              disabled={!!nextDisabled}
              className={`inline-flex min-w-[140px] items-center justify-center px-8 py-3 text-[16px] font-bold transition duration-150 ease-out ${
                nextDisabled
                  ? "neo-btn-disabled cursor-not-allowed shadow-none"
                  : "neo-btn-primary shadow-[4px_4px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#111111] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#111111]"
              }`}
            >
              다음
            </button>
          ) : (
            <Link
              href={nextHref}
              className="neo-btn-primary inline-flex min-w-[140px] items-center justify-center px-8 py-3 text-[16px] font-bold shadow-[4px_4px_0px_#111111] transition duration-150 ease-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#111111] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#111111]"
            >
              다음
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}

