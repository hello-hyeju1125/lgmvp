"use client";

import Link from "next/link";

type Props = {
  prevHref: string;
  nextHref: string;
  nextDisabled?: boolean;
  onNextClick?: () => void;
};

export function PrevNextNav({ prevHref, nextHref, nextDisabled, onNextClick }: Props) {
  return (
    <footer className="mt-auto sticky bottom-0 z-40 border-t border-white/10 bg-[#0B0F19] px-6">
      <div className="mx-auto w-full max-w-4xl px-0 py-2">
        <div className="flex w-full items-center justify-between">
          <Link
            href={prevHref}
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-[15px] font-semibold text-[#E4003F] shadow-[0_14px_40px_rgba(0,0,0,0.45)] transition hover:bg-white/90 active:scale-[0.99] min-w-[120px]"
          >
            이전
          </Link>
          {onNextClick ? (
            <button
              type="button"
              onClick={onNextClick}
              disabled={!!nextDisabled}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-[15px] font-semibold shadow-[0_14px_40px_rgba(0,0,0,0.45)] transition active:scale-[0.99] min-w-[120px] ${
                nextDisabled
                  ? "cursor-not-allowed bg-white/30 text-white/70"
                  : "bg-white text-[#E4003F] hover:bg-white/90"
              }`}
            >
              다음
            </button>
          ) : (
            <Link
              href={nextHref}
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-[15px] font-semibold text-[#E4003F] shadow-[0_14px_40px_rgba(0,0,0,0.45)] transition hover:bg-white/90 active:scale-[0.99] min-w-[120px]"
            >
              다음
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}

