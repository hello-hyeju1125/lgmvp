"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useRef, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { nickname, setNickname } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(nickname ?? "");
  const maxLength = 20;
  const canStart = input.trim().length > 0;

  /** DOM 값을 우선 — IME·리렌더 직전 클릭에서도 state보다 정확함 */
  const getNicknameFromDom = () => (inputRef.current?.value ?? input).trim();

  const handleStart = () => {
    const name = getNicknameFromDom();
    if (!name) return;
    setNickname(name);
    router.push("/onboarding?step=0");
  };

  return (
    <main className="neo-page main-dynamic min-h-screen px-4 py-8 sm:px-8 sm:py-12">
      <div className="neo-stage mx-auto flex w-full max-w-5xl items-center justify-center">
        <section className="neo-main-card neo-main-card-frame main-card-enter w-full max-w-4xl border-[1.5px] border-transparent !bg-white px-5 pt-7 pb-6 sm:px-12 sm:pt-9 sm:pb-8">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
            <div className="main-stagger-1 flex w-full justify-center">
              <span className="main-option-badge main-badge-float">
                <span className="neo-badge-text main-option-badge-text">LG인화원 MVP과정</span>
              </span>
            </div>

            <h1 className="neo-display main-title-pop main-stagger-2 mt-6 border-[2px] border-black !bg-[#55E96F] px-3 py-2 text-[28px] font-black leading-tight tracking-tight sm:text-[44px]">
              프로젝트 매니지먼트 시뮬레이션
            </h1>
          </div>

          <div className="relative main-stagger-3 mx-auto mt-8 w-full max-w-4xl px-5 text-center sm:px-8">
            <p className="main-hero-copy main-copy-reveal !text-[#222222]">
              <span className="neo-highlight-green hero-copy-strong font-extrabold">프로젝트 리더가 된 당신</span>,
              <br />
              착수부터 종료까지 모든 과정을 직접 경험해 보세요.
              <br />
              다양한 이해관계자 사이에서 정답 없는 의사결정을 수행합니다.
              <br />
              한정된 자원 속에서 일과 사람을 모두 얻고,
              <br />
              <span className="neo-highlight-green hero-copy-strong font-extrabold">프로젝트를 성공으로 이끄십시오.</span>
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
            <div className="main-stagger-4 mt-10 w-full max-w-xl">
              <label htmlFor="nickname" className="sr-only">
                닉네임
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="nickname"
                  type="text"
                  maxLength={maxLength}
                  placeholder="사용하실 닉네임을 입력해주세요."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onCompositionEnd={(e) => setInput(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
                    if (getNicknameFromDom()) handleStart();
                  }}
                  className="comic-nickname-input h-[56px] w-full rounded-[12px] border-[3px] border-black !bg-white px-5 pr-24 text-[15px] font-extrabold !text-[#111111] placeholder:!text-[#7F7F7F] focus:outline-none"
                />
                <span className="comic-counter pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-black !text-[#2FAE53]">
                  {input.length} / {maxLength}
                </span>
              </div>
            </div>

            <div className="mt-10 flex w-full justify-center sm:mt-11">
              <button
                type="button"
                aria-disabled={!canStart}
                tabIndex={canStart ? 0 : -1}
                onClick={handleStart}
                className={`comic-start-btn relative z-10 inline-flex h-[56px] min-w-[220px] items-center justify-center gap-2 rounded-[12px] border-[3px] border-black px-8 text-[23px] font-black tracking-tight transition ${
                  canStart
                    ? "is-active !bg-[#55E96F] !text-[#111111]"
                    : "is-disabled !bg-black !text-white"
                }`}
              >
                프로젝트 시작하기
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none shrink-0"
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="main-stagger-6 mt-11 text-center sm:mt-12">
              <p className="text-[20px] font-semibold tracking-tight !text-[#6E6E6E]">
                약 60~90분 소요 · AI 맞춤 결과 피드백 제공
              </p>
              <p className="mt-2 inline-flex items-center rounded-full border-2 border-black/80 !bg-[#F4FFF2] px-4 py-1 text-[15px] font-extrabold tracking-tight !text-[#2F7A3F] shadow-[2px_2px_0_#111111]">
                해당 서비스는 크롬 / PC 환경에 최적화되어 있습니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
