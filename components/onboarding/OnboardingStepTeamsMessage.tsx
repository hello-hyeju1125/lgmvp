"use client";

import Image from "next/image";
import type { ReactNode } from "react";

interface OnboardingStepTeamsMessageProps {
  onNext: () => void;
  userName: string;
}

function replaceUserName(text: string, name: string) {
  return text.replace(/\{User_Name\}/g, name);
}

function highlightPhrases(text: string, phrases: string[]): ReactNode[] {
  let nodes: ReactNode[] = [text];

  for (const phrase of phrases) {
    nodes = nodes.flatMap((node) => {
      if (typeof node !== "string") return [node];
      if (!node.includes(phrase)) return [node];

      const parts = node.split(phrase);
      const out: ReactNode[] = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) out.push(parts[i]);
        if (i !== parts.length - 1) {
          out.push(
            <strong key={`${phrase}-${i}`} className="font-extrabold text-black">
              {phrase}
            </strong>,
          );
        }
      }
      return out;
    });
  }

  return nodes;
}

export function OnboardingStepTeamsMessage({ userName }: OnboardingStepTeamsMessageProps) {
  const messageText = replaceUserName(
    `반갑습니다, {User_Name} 책임님.

이번 글로벌 VOC 프로젝트의 챔피언을 맡게 된 최성민 상무입니다.

잘 아시겠지만, 현재 우리 회사의 데이터 관리는 여전히 수작업 위주의 과거 방식에 머물러 있습니다. 고객의 숨은 니즈를 조기에 감지하고 선제적으로 대응하려면 AI를 활용한 데이터 기반 의사결정 체계 도입이 그 어느 때보다 시급합니다.

제가 리더님께 기대하는 것은 단순한 시스템 구축이 아닙니다. 우리 조직이 일하는 방식 그 자체의 혁신입니다. 특히 이번 프로젝트에 대한 최고 경영진의 관심과 기대치가 굉장히 높습니다. 그만큼 어깨가 무거우시겠지만, 저는 {User_Name} 리더님이 이 중책을 훌륭히 해내리라 굳게 믿고 있습니다.

실행 가능한 현실적인 목표에만 머물지 마십시오. 도전적인 목표가 진짜 혁신을 만듭니다. 안 되면 되게 만들 방법을 치열하게 찾고, 팀을 하나로 조율해 이끌어내는 것이 바로 리더의 역할 아니겠습니까.

리더님의 과감한 결단과 리더십을 통해, 우리 회사가 AX 시대의 혁신을 주도해 나갈 수 있기를 고대하겠습니다. 

잘 부탁합니다.
`,
    userName,
  );

  const emphasized = highlightPhrases(messageText, [
    "고객의 숨은 니즈를 조기에 감지하고 선제적으로 대응하려면 AI를 활용한 데이터 기반 의사결정 체계 도입이 그 어느 때보다 시급합니다.",
    "제가 리더님께 기대하는 것은 단순한 시스템 구축이 아닙니다. 우리 조직이 일하는 방식 그 자체의 혁신입니다.",
    "안 되면 되게 만들 방법을 치열하게 찾고, 팀을 하나로 조율해 이끌어내는 것이 바로 리더의 역할 아니겠습니까.",
  ]);

  return (
    <div className="relative min-h-[calc(100vh-64px)] px-6 py-10 sm:py-14">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        {/* Centered speaker */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 blur-2xl">
              <div className="h-full w-full rounded-[36px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(228,0,63,0.22),transparent_60%)]" />
            </div>
            <div className="relative h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-[36px] border border-white/22 bg-white/10 shadow-[0_34px_110px_rgba(0,0,0,0.7)] ring-1 ring-white/12">
              <Image src="/choi-seongmin.svg" alt="최성민 상무" fill className="object-cover" priority />
            </div>
          </div>

          <p className="mt-5 text-[13px] font-semibold tracking-wide text-white/65">Project Champion</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_14px_40px_rgba(0,0,0,0.6)]">
            최성민 상무
          </h1>
        </div>

        {/* Speech bubble */}
        <section className="relative mt-8 w-full rounded-[28px] border border-black/10 bg-white/95 p-6 sm:p-9 shadow-[0_26px_100px_rgba(0,0,0,0.65)]">
          {/* Bubble tail */}
          <div className="pointer-events-none absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 rounded-[6px] border border-black/10 bg-[#E4003F]" />

          {/* Inner highlight layer for readability */}
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(900px_420px_at_50%_0%,rgba(228,0,63,0.06),transparent_62%)]" />

          <div className="relative">
            <p className="whitespace-pre-line text-[15px] sm:text-[16px] leading-[1.95] text-black/85">
              {emphasized}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
