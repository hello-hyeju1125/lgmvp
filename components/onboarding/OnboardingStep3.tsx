"use client";

import { tutorialContent } from "@/content/tutorial";

interface OnboardingStep3Props {
  onNext: () => void;
  userName: string;
}

function replaceUserName(text: string, name: string) {
  return text.replace(/\{User_Name\}/g, name);
}

export function OnboardingStep3({ userName }: OnboardingStep3Props) {
  const intro = replaceUserName(tutorialContent.intro, userName);
  const cta = replaceUserName(tutorialContent.cta, userName);
  const kpiGauges = tutorialContent.gauges.filter((g) => !g.title.includes("에너지"));
  const energyGauge = tutorialContent.gauges.find((g) => g.title.includes("에너지"));

  return (
    <div className="flex flex-col bg-transparent">
      <header className="flex-shrink-0 border-b border-white/10 bg-black/45 px-5 py-3 backdrop-blur-md">
        <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)]">
          시뮬레이션 튜토리얼
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          {/* Intro */}
          <section className="rounded-3xl border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black/90">
                시작하기 전에, 한 번만 확인하세요
              </h2>
              <p className="mt-4 text-[15px] leading-[1.85] text-black/75">
                {intro}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {tutorialContent.tools.map((t, i) => (
                <div key={i} className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                  <p className="text-[13px] font-extrabold text-black/85">{t.name}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/70">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Dashboard */}
          <section className="rounded-3xl border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
            <h2 className="text-center text-xl sm:text-2xl font-extrabold tracking-tight text-[#E4003F]">
              상단 대시보드 상태창
            </h2>
            <p className="mt-3 text-[15px] leading-[1.85] text-black/75">
              {tutorialContent.dashboardIntro}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {kpiGauges.map((g, i) => (
                <div key={i} className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                  <p className="text-[14px] font-extrabold text-black/85">
                    {g.title}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                    {g.desc}
                  </p>
                </div>
              ))}
            </div>

            {energyGauge && (
              <>
                <hr className="my-6 border-0 border-t border-black/10" />
                <div className="rounded-2xl border border-black/10 bg-[#f8f9fa] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                  <p className="text-[14px] font-extrabold text-black/85">
                    {energyGauge.title}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                    {energyGauge.desc}
                  </p>
                </div>
              </>
            )}
          </section>

          {/* Closing */}
          <section className="rounded-3xl border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
            <h2 className="text-center text-xl sm:text-2xl font-extrabold tracking-tight text-[#E4003F]">
              {tutorialContent.closingTitle}
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-[1.85] text-black/75">
              {tutorialContent.closingParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
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
