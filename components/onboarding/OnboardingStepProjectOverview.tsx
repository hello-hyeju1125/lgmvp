"use client";

import { useStore } from "@/store/useStore";

interface OnboardingStepProjectOverviewProps {
  onNext: () => void;
}

function RevealChip({
  text,
  index,
  revealed,
  onReveal,
}: {
  text: string;
  index: number;
  revealed: Record<number, boolean>;
  onReveal: (i: number) => void;
}) {
  const isRevealed = revealed[index];
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => onReveal(index)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onReveal(index);
        }
      }}
      aria-label="클릭하여 내용 보기"
      className={`inline-flex items-center justify-center align-baseline rounded-md px-2 py-0.5 mx-0.5 select-none outline-none transition ${
        isRevealed
          ? "bg-black/5 text-black font-extrabold border border-black/10"
          : "cursor-pointer border border-[#BBBBBB]/80 bg-white text-[#6b6b6b] shadow-[0_0_0_1px_rgba(165,0,52,0.12)] hover:border-[#a50034] hover:text-black hover:bg-white/90 focus:border-[#a50034] focus:ring-4 focus:ring-[#a50034]/20 animate-pulse"
      }`}
    >
      {isRevealed ? text : "클릭하여 내용 보기"}
    </span>
  );
}

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path
        d="M12 2.2c.4 0 .75.27.85.65l1.23 4.52 4.68 1.35c.38.11.64.46.64.86 0 .4-.26.75-.64.86l-4.68 1.35-1.23 4.52a.88.88 0 0 1-1.7 0l-1.23-4.52-4.68-1.35a.9.9 0 0 1 0-1.72l4.68-1.35 1.23-4.52c.1-.38.45-.65.85-.65Z"
        opacity="0.95"
      />
      <path
        d="M4.6 13.9c.35 0 .66.24.75.58l.54 2.04 2.04.54c.34.09.58.4.58.75 0 .35-.24.66-.58.75l-2.04.54-.54 2.04a.78.78 0 0 1-1.5 0l-.54-2.04-2.04-.54A.78.78 0 0 1 1.1 18c0-.35.24-.66.58-.75l2.04-.54.54-2.04c.09-.34.4-.58.75-.58Z"
        opacity="0.55"
      />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M13.4 2.2c.6 0 1 .55.88 1.13l-1.04 5.1h6.12c.82 0 1.2 1.01.58 1.55L10.7 21.7c-.55.65-1.6.1-1.45-.73l1.03-5.16H4.1c-.82 0-1.2-1.01-.58-1.55L12.8 2.5c.17-.2.4-.3.6-.3Z" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M11.53 2.27a1.2 1.2 0 0 1 .94 0l8.6 3.57c.78.33.78 1.45 0 1.78l-8.6 3.57a1.2 1.2 0 0 1-.94 0L2.93 7.62c-.78-.33-.78-1.45 0-1.78l8.6-3.57Z" opacity="0.95" />
      <path d="M3.3 11.55a.9.9 0 0 1 1.17-.48L12 14.18l7.53-3.11a.9.9 0 0 1 .69 1.66l-7.75 3.2a1.2 1.2 0 0 1-.94 0l-7.75-3.2a.9.9 0 0 1-.48-1.18Z" opacity="0.75" />
      <path d="M3.3 16.35a.9.9 0 0 1 1.17-.48L12 18.98l7.53-3.11a.9.9 0 1 1 .69 1.66l-7.75 3.2a1.2 1.2 0 0 1-.94 0l-7.75-3.2a.9.9 0 0 1-.48-1.18Z" opacity="0.55" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12 2.4a9.6 9.6 0 1 1 0 19.2 9.6 9.6 0 0 1 0-19.2Zm0 2.1a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z" opacity="0.9" />
      <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.1a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z" opacity="0.65" />
      <path d="M12 10.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
    </svg>
  );
}

export function OnboardingStepProjectOverview({}: OnboardingStepProjectOverviewProps) {
  const revealed = useStore((s) => s.onboardingStep3Revealed);
  const revealOnce = useStore((s) => s.revealOnboardingStep3);

  return (
    <div className="flex flex-col bg-transparent">
      {/* 상단: onboarding 공통 menu bar 스타일 */}
      <header className="flex-shrink-0 border-b border-white/10 bg-black/45 px-5 py-3 backdrop-blur-md">
        <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)]">
          프로젝트 개요
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <article className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-white/95 shadow-[0_28px_110px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="border-b border-white/10 bg-[#0B0F19] bg-[radial-gradient(900px_380px_at_20%_0%,rgba(228,0,63,0.35),transparent_65%),radial-gradient(900px_380px_at_85%_40%,rgba(255,255,255,0.10),transparent_70%),linear-gradient(120deg,rgba(0,0,0,0.0),rgba(0,0,0,0.35))] px-6 py-7 text-center sm:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
              글로벌 VOC 통합 분석 AI 도입
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/85">
              아래 내용은 이번 시뮬레이션에서 다루는 프로젝트의 배경, 목적, 그리고 성공 기준(KPI)입니다.
              <br />
              핵심 포인트를 빠르게 읽고, 이후 의사결정의 기준으로 삼아주세요.
            </p>
          </div>

          <div className="px-6 py-7 sm:px-8 sm:py-9">
            {/* 1. 프로젝트 배경 */}
            <section>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E4003F]/10 text-[#E4003F] ring-1 ring-black/10">
                  <IconLayers />
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#E4003F]">프로젝트 배경</h3>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                  <div className="text-[13px] font-extrabold text-black/80">
                    <RevealChip index={0} revealed={revealed} onReveal={revealOnce} text="파편화된 고객 데이터" />
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                    전 세계 다양한 채널에서 수집되는 글로벌 VOC 데이터가 CS팀과 마케팅팀 등 각 부서에 산재되어 있어 전사적인 통합 관리가 부재한 상황입니다.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                  <div className="text-[13px] font-extrabold text-black/80">
                    <RevealChip index={1} revealed={revealed} onReveal={revealOnce} text="비효율적인 수작업 프로세스" />
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                    실무진이 방대한 양의 데이터를 일일이 수작업으로 취합하고 분류하느라 불필요한 리소스 낭비와 병목 현상이 발생하고 있습니다.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                  <div className="text-[13px] font-extrabold text-black/80">
                    <RevealChip index={2} revealed={revealed} onReveal={revealOnce} text="시장 대응력 약화" />
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                    데이터 분석 지연으로 인해 급변하는 고객의 숨은 니즈를 파악하지 못하고, 글로벌 시장 트렌드 변화에 기민하게 대응하지 못하고 있습니다.
                  </p>
                </div>
              </div>
            </section>

            <hr className="my-8 border-0 border-t border-black/10" />

            {/* 2. 프로젝트 목적 */}
            <section>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E4003F]/10 text-[#E4003F] ring-1 ring-black/10">
                  <IconSpark />
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#E4003F]">프로젝트 목적</h3>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                  <div className="text-[13px] font-extrabold text-black/80">
                    <RevealChip index={3} revealed={revealed} onReveal={revealOnce} text="AI 기반 VOC 통합 분석 체계 구축" />
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                    최신 AI 기술을 도입하여 전 세계에 흩어진 고객의 목소리를 자동으로 수집, 분류, 감성 분석하는 통합 시스템을 마련합니다.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                  <div className="text-[13px] font-extrabold text-black/80">
                    <RevealChip index={4} revealed={revealed} onReveal={revealOnce} text="데이터 처리 효율성 극대화" />
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                    기존의 수작업 위주 프로세스를 자동화하여, 현업 부서(CS/마케팅 등)의 데이터 처리 공수를 획기적으로 단축합니다.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                  <div className="text-[13px] font-extrabold text-black/80">
                    <RevealChip index={5} revealed={revealed} onReveal={revealOnce} text="실시간 비즈니스 인사이트 창출" />
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                    분석된 데이터를 바탕으로 실시간 인사이트를 도출하여, 데이터 기반의 신속하고 정확한 의사결정 체계를 지원합니다.
                  </p>
                </div>
              </div>
            </section>

            <hr className="my-8 border-0 border-t border-black/10" />

            {/* 3. 프로젝트 성공 요건(KPI) */}
            <section>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E4003F]/10 text-[#E4003F] ring-1 ring-black/10">
                  <IconTarget />
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#E4003F]">프로젝트 성공 요건 (KPI)</h3>
                </div>
              </div>

              <p className="mt-4 text-[14px] leading-relaxed text-black/70">
                프로젝트 리더로서 당신은 <span className="font-extrabold text-black/80">일(Work)</span>과{" "}
                <span className="font-extrabold text-black/80">사람(People)</span>을 동시에 관리하며 아래 4가지 핵심 KPI를 달성해야 합니다.
              </p>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {/* Work */}
                <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.07)]">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-[15px] font-extrabold text-black/85">일 관리 (Work Management)</h4>
                    <span className="rounded-full bg-black/5 px-3 py-1 text-[12px] font-semibold text-black/60 ring-1 ring-black/10">
                      Work
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-black/10 bg-white p-4">
                      <p className="text-[13px] font-extrabold text-black/80">
                        산출물 품질 (Quality)
                      </p>
                      <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                        “현업이 즉시 활용하며 만족할 수 있는 실효성 높고 완성도 있는 AI 대시보드를 구축하였는가?”{" "}
                        현업(CS/마케팅)의 데이터 처리 공수를 <span className="font-extrabold text-black/80">30% 이상</span> 단축할 수 있는{" "}
                        ‘AI VOC 대시보드’ 프로토타입의 정상 구동 및 아웃풋의 완성도를 평가합니다.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white p-4">
                      <p className="text-[13px] font-extrabold text-black/80">
                        일정 준수 (Delivery)
                      </p>
                      <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                        “주어진 제한 시간 내에 지연 없이 프로젝트 마일스톤을 달성하고 결과물을 적기에 납품하였는가?”{" "}
                        프로젝트 착수부터 대시보드 프로토타입 오픈까지의 전체 일정을 체계적으로 관리하여,{" "}
                        <span className="font-extrabold text-black/80">‘6개월’</span>이라는 기한 내에 목표를 완수하는 진척도 관리 역량을 평가합니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* People */}
                <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.07)]">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-[15px] font-extrabold text-black/85">사람 관리 (People Management)</h4>
                    <span className="rounded-full bg-black/5 px-3 py-1 text-[12px] font-semibold text-black/60 ring-1 ring-black/10">
                      People
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-black/10 bg-white p-4">
                      <p className="text-[13px] font-extrabold text-black/80">
                        팀 몰입도 (Team Engagement)
                      </p>
                      <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                        “팀원들의 잠재력을 발굴하고, 하나의 목표를 향해 자발적으로 몰입하는 팀 문화를 만들었는가?”{" "}
                        People Manager로서 프로젝트 팀원 개개인의 동기를 부여하고 역량을 끌어올려,{" "}
                        <span className="font-extrabold text-black/80">‘팀 몰입도 70% 이상’</span>의 주도적이고 건강한 조직 문화를 조성하는 것을 목표로 합니다.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white p-4">
                      <p className="text-[13px] font-extrabold text-black/80">
                        이해관계자 조율 (Stakeholder Alignment)
                      </p>
                      <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                        “이해관계가 얽힌 유관부서 및 상위 조직과의 갈등을 해결하고, 적극적인 협조와 지원을 이끌어냈는가?”{" "}
                        CS, 마케팅 등 타 부서와의 원활한 소통 및 이해관계 조율을 통해{" "}
                        <span className="font-extrabold text-black/80">‘유관부서 협조율 80% 이상’</span>을 달성하며,
                        프로젝트의 강력한 추진 동력을 확보하는 능력을 평가합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/20 bg-[#6b6b6b] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
                <div className="flex items-start gap-3 text-white">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25">
                    <IconBolt />
                  </span>
                  <p className="text-[14px] leading-relaxed text-white">
                    당신의 의사결정에 따라 프로젝트 성공 요건의 KPI가 변화됩니다. 또한, 당신이 보유한 리더의 에너지는 유한한 자원으로, 업무의 복잡성과 중요성에 따라 투입량이 달라집니다.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>

    </div>
  );
}
