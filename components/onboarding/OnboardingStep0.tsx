"use client";

import { guideScript } from "@/content/onboarding";

interface OnboardingStep0Props {
  onNext: () => void;
}

/** **텍스트** → <strong>텍스트</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export function OnboardingStep0({}: OnboardingStep0Props) {
  const paragraphs = guideScript
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col bg-transparent">
      {/* Header (centered, cinematic tone) */}
      <header className="flex-shrink-0 border-b border-white/10 bg-black/45 px-6 backdrop-blur-md">
        <div className="mx-auto w-full max-w-4xl py-4">
          <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)]">
            Welcome to the Simulation!
          </h1>
        </div>
      </header>

      {/* 본문: 카드 영역 */}
      <div className="overflow-y-auto px-5 pt-10 pb-3">
        <article className="mx-auto max-w-3xl rounded-2xl border border-white/12 bg-black/55 p-4 sm:p-5 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="space-y-4">
            {paragraphs.map((para, i) => (
              <p key={i} className="break-keep text-[16px] sm:text-[17px] leading-[1.9] text-white/90">
                {renderWithBold(para)}
              </p>
            ))}
          </div>
        </article>
      </div>

    </div>
  );
}
