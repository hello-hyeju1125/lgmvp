"use client";

import Image from "next/image";

interface OnboardingStepTeamsMessageProps {
  onNext: () => void;
  userName: string;
}

export function OnboardingStepTeamsMessage({ onNext, userName }: OnboardingStepTeamsMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10"
      style={{ background: "repeating-linear-gradient(45deg, #f0f0f0 0px, #f0f0f0 2px, #ffffff 2px, #ffffff 20px)" }}
    >
      {/* 만화책 패널 */}
      <div className="max-w-6xl mx-auto bg-white border-4 border-black shadow-[12px_12px_0px_#111111] grid grid-cols-[1fr,2fr] overflow-hidden w-full">

        {/* 왼쪽: 캐릭터 포트레이트 */}
        <div className="relative flex flex-col items-center justify-center bg-[#3374F6] border-r-4 border-black p-8">
          {/* 팝아트 배경 장식 */}
          <div className="absolute top-4 left-4 w-12 h-12 bg-[#89E586] border-2 border-black" style={{ transform: "rotate(15deg)" }} />
          <div className="absolute bottom-8 right-4 w-8 h-8 bg-[#FFD12A] border-2 border-black rounded-full" />
          <div className="absolute top-1/2 left-2 w-5 h-5 bg-[#FF4B4B] border-2 border-black" style={{ transform: "rotate(30deg) translateY(-50%)" }} />

          {/* 캐릭터 이미지 프레임 */}
          <div className="relative z-10 border-2 border-black shadow-[6px_6px_0px_#111111] overflow-hidden w-full aspect-square bg-white">
            <Image
              src="/images/characters/choi.png"
              alt="최성민 상무"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 말풍선 꼬리 - 오른쪽 방향 */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-20">
            <div
              className="w-0 h-0"
              style={{
                borderTop: "16px solid transparent",
                borderBottom: "16px solid transparent",
                borderLeft: "20px solid #111111",
              }}
            />
          </div>

          {/* 이름/역할 텍스트 (박스 제거) */}
          <div className="relative z-10 mt-6 text-center">
            <p className="font-black text-black text-[28px] leading-none tracking-wide">최성민 상무</p>
            <p className="font-bold text-black text-[20px] leading-none mt-2">Project Champion</p>
          </div>
        </div>

        {/* 오른쪽: 대화 및 본문 */}
        <div className="p-10 text-gray-900 text-[18px] font-sans flex flex-col">
          {/* 헤더 */}
          <div className="mb-6 border-b-2 border-black pb-4">
            <p className="text-xs font-bold tracking-widest text-[#3374F6] uppercase mb-1">Onboarding</p>
            <h1
              className="neo-display text-3xl sm:text-4xl font-extrabold text-black leading-tight"
              style={{ WebkitTextStroke: "1px #111111" }}
            >
              최성민 상무의 오리엔테이션
            </h1>
          </div>

          {/* 본문 */}
          <div className="leading-relaxed flex-1 text-[17px]">
            <p className="mt-6">반갑습니다, {userName} 책임님.</p>

            <p className="mt-6">
              이번 글로벌 VOC 프로젝트의 챔피언을 맡게 된 최성민 상무입니다.
              <br />
              잘 아시겠지만, 현재 우리 회사의 데이터 관리는 여전히 수작업 위주의 과거 방식에 머물러 있습니다. 고객의 숨은 니즈를 조기에 감지하고 선제적으로 대응하려면 AI를 활용한 데이터 기반 의사결정 체계 도입이 그 어느 때보다 시급합니다.
            </p>

            <p className="mt-6">
              제가 리더님께 기대하는 것은 단순한 시스템 구축이 아닙니다. 우리 조직이 일하는 방식 그 자체의 혁신입니다. 특히 이번 프로젝트에 대한 최고 경영진의 관심과 기대치가 굉장히 높습니다. 그만큼 어깨가 무거우시겠지만, 저는 {userName} 리더님이 이 중책을 훌륭히 해내리라 굳게 믿고 있습니다.
            </p>

            <p className="mt-6">
              실행 가능한 현실적인 목표에만 머물지 마십시오. 도전적인 목표가 진짜 혁신을 만듭니다. 안 되면 되게 만들 방법을 치열하게 찾고, 팀을 하나로 조율해 이끌어내는 것이 바로 리더의 역할 아니겠습니까.
            </p>

            <p className="mt-6">
              리더님의 과감한 결단과 리더십을 통해, 우리 회사가 AX 시대의 혁신을 주도해 나갈 수 있기를 고대하겠습니다.
            </p>

            <p className="mt-6">잘 부탁합니다.</p>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end mt-12">
            <button
              type="button"
              onClick={onNext}
              className="font-bold border-2 border-black px-10 py-4 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#111111]"
              style={{
                backgroundColor: "#3374F6",
                color: "#000000",
                boxShadow: "4px 4px 0px #111111",
              }}
            >
              오리엔테이션 문서 읽기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
