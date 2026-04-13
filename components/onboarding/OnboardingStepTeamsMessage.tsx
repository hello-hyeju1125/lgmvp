"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useStore } from "@/store/useStore";

interface OnboardingStepTeamsMessageProps {
  onNext: () => void;
  userName: string;
}

const SUMMARY_POINTS: string[] = [
  "데이터는 아직 수작업 중이므로, AI로 의사결정 체계를 바꿔야 합니다.",
  "단순히 시스템을 구축하는 것에 그치는 것이 아니라, 일하는 방식을 혁신해야 합니다.",
  "경영진의 관심이 큽니다. 도전적 목표로 팀을 이끌어 주세요.",
];

function Hl({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm px-0.5 font-extrabold" style={{ backgroundColor: "#FFD600" }}>
      {children}
    </span>
  );
}

function SpeechContent({ userName }: { userName: string }) {
  return (
    <>
      이번 글로벌 VOC 프로젝트의 챔피언을 맡게 된 최성민 상무입니다.
      {"\n\n"}
      현재 우리 회사의 데이터 관리는 여전히 수작업 위주의 과거 방식에 머물러 있습니다. 고객의 숨은 니즈를 조기에 감지하고 선제적으로 대응하려면, <Hl>AI를 활용한 데이터 기반 의사결정 체계 도입</Hl>이 그 어느 때보다 시급합니다.
      {"\n\n"}
      제가 {userName} 리더님께 기대하는 것은 단순한 시스템 구축이 아닙니다. <Hl>우리 조직이 일하는 방식 그 자체의 혁신</Hl>입니다. <Hl>도전적 목표</Hl>가 진짜 혁신을 만듭니다.
      {"\n\n"}
      리더님의 <Hl>과감한 결단과 리더십</Hl>을 통해, 우리 회사가 AX 시대의 혁신을 주도해 나갈 수 있기를 고대하겠습니다.
    </>
  );
}

export function OnboardingStepTeamsMessage({ onNext: _onNext, userName }: OnboardingStepTeamsMessageProps) {
  const router = useRouter();
  const { setOnboardingStep } = useStore();

  const goToOrientationDocument = useCallback(() => {
    setOnboardingStep(3);
    router.push("/onboarding?step=3");
  }, [router, setOnboardingStep]);

  return (
    <div
      className="step2-simple relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-28 pt-8 sm:px-6 sm:pb-32 sm:pt-10"
      style={{
        backgroundImage: "url('/bg_white1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div className="mx-auto w-full max-w-[820px]">
        {/* 1) 타이틀: 네온그린 박스 */}
        <div
          className="step2-anim mb-10 flex justify-center"
          style={{ animationDelay: "0ms" }}
        >
          <h1 className="step2-title-box inline-block border-2 border-black px-7 py-2.5 text-center font-sans text-[32px] font-extrabold text-black sm:px-10 sm:py-3 sm:text-[40px]">
            Project Champion의 기대사항
          </h1>
        </div>

        {/* 2) 캐릭터 + 말풍선 */}
        <div
          className="step2-anim mb-10 flex flex-col items-start gap-5 sm:flex-row sm:gap-6"
          style={{ animationDelay: "200ms" }}
        >
          {/* 동그란 프로필 */}
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <div className="step2-portrait relative h-[130px] w-[130px] overflow-hidden rounded-full border-[3px] border-black shadow-[3px_3px_0_#111] sm:h-[150px] sm:w-[150px]">
              <Image
                src="/choi-seongmin-speaking.png"
                alt="최성민 상무"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="font-sans text-[18px] font-extrabold text-[#111] sm:text-[20px]">
              최성민 상무
            </span>
            <span className="font-sans text-[12px] font-semibold tracking-wide text-[#888] sm:text-[13px]">
              Project Champion
            </span>
          </div>

          {/* 말풍선 박스 */}
          <div className="step2-speech-bubble relative flex-1 rounded-md border-2 border-[#64e87a] bg-white p-5 sm:p-6">
            <div className="step2-speech-tail" />
            <p className="whitespace-pre-line break-keep font-sans text-[16px] font-medium leading-[1.85] text-[#222] sm:text-[17px]">
              <SpeechContent userName={userName} />
            </p>
          </div>
        </div>

        {/* 3) Summary — 3포인트 */}
        <section
          className="step2-anim step2-summary rounded-md border-2 border-black bg-white p-5 shadow-[3px_3px_0_#111] sm:p-6"
          style={{ animationDelay: "450ms" }}
        >
          <div className="mb-4 flex items-center gap-2.5">
            <span className="inline-block rounded-sm border-2 border-black bg-[#111] px-3 py-1 font-sans text-[13px] font-extrabold tracking-wide text-white">
              Summary
            </span>
            <span className="font-sans text-[17px] font-extrabold text-[#111] sm:text-[18px]">
              프로젝트 진행을 위해 기억할 것
            </span>
          </div>
          <ul className="space-y-3 pl-4 sm:pl-6">
            {SUMMARY_POINTS.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#ffd600] font-sans text-[13px] font-extrabold text-black">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 break-keep pt-0.5 font-sans text-[16px] font-semibold leading-snug text-[#222] sm:text-[17px]">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div
          className="step2-anim mt-10 flex justify-center sm:justify-end"
          style={{ animationDelay: "700ms" }}
        >
          <button
            type="button"
            onClick={goToOrientationDocument}
            className="step2-cta group relative flex min-h-[48px] min-w-[220px] items-center justify-center gap-2 overflow-hidden rounded-md border-2 border-black px-8 py-3 font-sans text-[16px] font-extrabold text-[#111] shadow-[3px_3px_0_#111] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#111] sm:text-[17px]"
          >
            <span className="relative">오리엔테이션 문서 읽기</span>
            <span className="relative text-lg leading-none transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
