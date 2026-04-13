"use client";

import { tutorialContent } from "@/content/tutorial";
import { PrevNextNav } from "@/components/common/PrevNextNav";

interface OnboardingStep3Props {
  onNext: () => void;
  userName: string;
  prevHref?: string;
  nextHref?: string;
}

function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>));
}

export function OnboardingStep3({ userName: _userName, onNext: _onNext, prevHref, nextHref }: OnboardingStep3Props) {
  const showFooterNav = prevHref && nextHref;

  return (
    <div className="s5-page-wrapper flex min-h-0 flex-1 flex-col">
      <div className="s5-page relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-12 sm:py-14">

          {/* Title */}
          <div className="s5-anim mb-12 flex justify-center" style={{ animationDelay: "0ms" }}>
            <h1 className="s5-title-box inline-block border-2 border-black px-9 py-3 text-center font-sans text-[28px] font-extrabold text-black sm:px-12 sm:py-4 sm:text-[36px]">
              {tutorialContent.closingTitle}
            </h1>
          </div>

          {/* Numbered paragraphs */}
          <div className="space-y-6">
            {tutorialContent.closingParagraphs.slice(0, 2).map((para, idx) => (
              <div
                key={idx}
                className="s5-anim s5-card flex gap-6"
                style={{ animationDelay: `${(idx + 1) * 150}ms` }}
              >
                <div className="s5-number-badge flex h-11 w-11 shrink-0 items-center justify-center font-sans text-[20px] font-black text-white">
                  {idx + 1}
                </div>
                <p className="min-w-0 flex-1 pt-0.5 font-sans text-[17px] font-medium leading-[1.9] text-[#222] sm:text-[19px]">
                  {renderWithBold(para)}
                </p>
              </div>
            ))}
          </div>

          {/* Side Quest */}
          <div className="s5-anim mt-10" style={{ animationDelay: "450ms" }}>
            <div className="s5-side-quest">
              <div className="s5-side-quest-label mb-4 flex items-center justify-center gap-2">
                <span className="s5-side-quest-tag font-mono text-[13px] font-black uppercase tracking-[0.15em] sm:text-[14px]">
                  기억해 주세요.
                </span>
              </div>
              <p className="font-sans text-[17px] font-medium leading-[1.9] text-[#222] sm:text-[18px]">
                {renderWithBold(tutorialContent.closingParagraphs[2] ?? "")}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="s5-anim mt-12" style={{ animationDelay: "600ms" }}>
            <div className="s5-cta-box text-center">
              <p className="font-sans text-[24px] font-black leading-snug text-[#111] sm:text-[28px]">
                {tutorialContent.cta}
              </p>
            </div>
          </div>

        </div>
      </div>

      {showFooterNav && (
        <div className="relative z-30 shrink-0">
          <PrevNextNav prevHref={prevHref!} nextHref={nextHref!} nextLabel="프로젝트 시작하기" />
        </div>
      )}
    </div>
  );
}
