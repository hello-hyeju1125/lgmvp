"use client";

import { tutorialContent } from "@/content/tutorial";
import { useState } from "react";

interface OnboardingStep3Props {
  onNext: () => void;
  userName: string;
}

function replaceUserName(text: string, name: string) {
  return text.replace(/\{User_Name\}/g, name);
}

/** **텍스트** → <strong>텍스트</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export function OnboardingStep3({ userName }: OnboardingStep3Props) {
  const intro = replaceUserName(tutorialContent.intro, userName);
  const dashboardIntro = replaceUserName(tutorialContent.dashboardIntro, userName);
  const cta = replaceUserName(tutorialContent.cta, userName);
  const kpiGauges = tutorialContent.gauges.filter((g) => !g.title.includes("에너지"));
  const energyGauge = tutorialContent.gauges.find((g) => g.title.includes("에너지"));
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <div className="flex flex-col bg-transparent">
      <header className="flex-shrink-0 border-b border-white/10 bg-black/45 px-6 backdrop-blur-md">
        <div className="mx-auto w-full max-w-4xl py-4">
          <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)]">
            시뮬레이션 튜토리얼
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          {/* Dashboard */}
          <section className="rounded-[1.05rem] border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
            <h2 className="text-center text-xl sm:text-2xl font-extrabold tracking-tight text-[#E4003F]">
              시작하기 전에 확인해주세요.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.85] text-black/75">
              {dashboardIntro}
            </p>

            <div className="mt-5">
              {!isDashboardOpen ? (
                <button
                  type="button"
                  onClick={() => setIsDashboardOpen(true)}
                  className="group w-full rounded-[0.7rem] border-2 border-black/15 bg-white/45 px-5 py-10 text-center backdrop-blur-md transition hover:border-[#E4003F] hover:bg-white/55 active:scale-[0.99]"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-black/5 ring-1 ring-black/10 transition group-hover:bg-[#E4003F]/12 group-hover:ring-[#E4003F]/45">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7 text-black/40 transition group-hover:text-[#E4003F]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="8" y="2.5" width="8" height="13" rx="4" />
                        <path d="M12 6.2v2.2" />
                        <path d="M6 14.5v1.2a6 6 0 0 0 12 0v-1.2" />
                      </svg>
                    </div>
                    <p className="text-[16px] sm:text-[17px] font-extrabold tracking-tight text-black/45 transition group-hover:text-[#E4003F]">
                      마우스로 클릭하세요!
                    </p>
                  </div>
                </button>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {kpiGauges.map((g, i) => (
                      <div
                        key={i}
                        className="rounded-[0.7rem] border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                      >
                        <p className="text-[14px] font-extrabold text-black/85">{g.title}</p>
                        <p className="mt-2 text-[14px] leading-relaxed text-black/70">{g.desc}</p>
                      </div>
                    ))}
                  </div>

                  {energyGauge && (
                    <>
                      <hr className="my-6 border-0 border-t border-black/10" />
                      <div className="rounded-[0.7rem] border border-black/10 bg-[#f8f9fa] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                        <p className="text-[14px] font-extrabold text-black/85">{energyGauge.title}</p>
                        <p className="mt-2 text-[14px] leading-relaxed text-black/70">{energyGauge.desc}</p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Closing */}
          <section className="rounded-[1.05rem] border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
            <h2 className="text-center text-xl sm:text-2xl font-extrabold tracking-tight text-[#E4003F]">
              {tutorialContent.closingTitle}
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-[1.85] text-black/75">
              {tutorialContent.closingParagraphs.map((p, i) => (
                <p key={i}>{renderWithBold(p)}</p>
              ))}
            </div>

            <p className="mt-6 text-center text-[18px] sm:text-[20px] font-extrabold tracking-tight text-[#E4003F]">
              {cta}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
