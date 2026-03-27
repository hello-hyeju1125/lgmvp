"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { nickname, setNickname } = useStore();
  const [input, setInput] = useState(nickname ?? "");
  const maxLength = 20;
  const canStart = input.trim().length > 0;

  const handleStart = () => {
    const name = input.trim() || "PM";
    setNickname(name);
    router.push("/onboarding?step=0");
  };

  return (
    <main className="neo-page min-h-screen bg-white px-8 py-16 sm:px-12 sm:py-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-12">
        <section className="space-y-12">
          <div className="flex w-full justify-center">
            <div className="inline-block border-2 border-black bg-[#3374F6] px-4 py-2 neo-solid-shadow">
              <p className="neo-display text-sm font-extrabold uppercase tracking-[0.08em] text-black">LG인화원 MVP 과정</p>
            </div>
          </div>

          <div className="relative inline-block pt-2">
            <h1 className="neo-display relative text-center text-5xl font-extrabold leading-[1.1] sm:text-6xl lg:text-7xl">
              <span className="inline bg-[#3374F6] px-2">
                프로젝트 매니지먼트
                <br />
                시뮬레이션
              </span>
            </h1>
          </div>

          <div className="max-w-4xl border-2 border-black bg-white p-8 neo-solid-shadow">
            <p className="text-center text-[18px] leading-[1.85] text-[#111111]">
              프로젝트 리더가 된 당신, 착수부터 종료까지 모든 과정을 직접 경험해 보세요.
              <br />
              다양한 이해관계자 사이에서 정답 없는 의사결정을 수행합니다.
              <br />
              한정된 자원 속에서 일과 사람을 모두 얻고, 프로젝트를 성공으로 이끄십시오.
            </p>
          </div>
        </section>

        <section className="w-full max-w-3xl border-2 border-black bg-white p-8 text-center neo-solid-shadow">
          <p className="mb-4 text-[16px] font-semibold">시뮬레이션 상에서 사용할 닉네임을 입력해주십시오.</p>
          <label htmlFor="nickname" className="sr-only">
            닉네임
          </label>

          <div className="space-y-4">
            <div className="relative">
              <input
                id="nickname"
                type="text"
                maxLength={maxLength}
                placeholder="예) 김엘지"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canStart && handleStart()}
                className="w-full border-2 border-black bg-white px-4 py-4 pr-24 text-left text-[18px] focus:outline-none focus:ring-0 focus:border-black"
              />
              <div className="neo-no-bg pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-extrabold text-[#666666]">
                {input.length} / {maxLength}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className={`inline-flex w-full translate-x-0 translate-y-0 items-center justify-center gap-2 border-2 border-black px-6 py-4 text-[20px] font-black transition duration-150 ease-out ${
                canStart
                  ? "neo-btn-primary neo-solid-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#111111] active:translate-x-[4px] active:translate-y-[4px] active:neo-solid-shadow-pressed"
                  : "neo-btn-disabled cursor-not-allowed"
              }`}
            >
              <span className="neo-display neo-no-bg bg-transparent">프로젝트 시작하기</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        <footer className="grid w-full justify-center justify-items-center gap-4 text-center sm:grid-cols-3">
          <div className="w-full max-w-xs border-2 border-black bg-white p-6 neo-solid-shadow">
            <p className="neo-display text-base font-extrabold">약 50분 소요</p>
          </div>
          <div className="w-full max-w-xs rotate-1 border-2 border-black bg-white p-6 neo-solid-shadow">
            <p className="neo-display text-base font-extrabold">크롬 / PC 환경 최적화</p>
          </div>
          <div className="w-full max-w-xs border-2 border-black bg-[#3374F6] p-6 neo-solid-shadow">
            <p className="neo-display text-base font-extrabold">AI 맞춤형 결과 피드백 제공</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
