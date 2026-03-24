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
    <main className="relative min-h-screen flex flex-col font-lgsmart bg-[url('/mainbackground.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Netflix-style vignette/gradient overlays (keep background visible) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_30%_10%,rgba(0,0,0,0.25),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />

      {/* Main */}
      <div className="relative flex-1 flex items-center px-6 py-14 sm:py-20">
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            {/* Title */}
            <section className="w-full max-w-3xl">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-1.5 text-[13px] text-white/85 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur">
                  LG인화원 MVP과정
                </div>
              </div>

              <h1 className="mt-5 text-center text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.16] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
                Welcome to
                <br />
                Project Management Simulation!
              </h1>

              <p className="mt-7 text-center text-[16px] sm:text-[18px] text-white/90 leading-[1.85] drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)]">
                프로젝트 리더가 된 당신, 착수부터 종료까지 모든 과정을 직접 경험해 보세요.
                <br />
                다양한 이해관계자 사이에서 정답 없는 의사결정을 수행합니다.
                <br />
                한정된 자원 속에서 일과 사람을 모두 얻고, 프로젝트를 성공으로 이끄십시오.
              </p>
            </section>

            {/* Input card (placed under copy) */}
            <section className="mt-10 w-full max-w-3xl">
              <div className="rounded-3xl border border-white/15 bg-black/35 p-5 sm:p-6 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
                <p className="text-center text-[14px] sm:text-[15px] text-white/70 leading-relaxed">
                  시뮬레이션 상에서 사용할 닉네임을 입력해주십시오.
                </p>

                <label htmlFor="nickname" className="sr-only">
                  닉네임
                </label>

                <div className="mt-4 space-y-3">
                  <div className="relative w-full">
                    <input
                      id="nickname"
                      type="text"
                      maxLength={maxLength}
                      placeholder="예) 김엘지"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && canStart && handleStart()}
                      className="w-full rounded-2xl border border-white/15 bg-black/35 px-4 py-3.5 text-[16px] sm:text-[17px] text-white placeholder:text-white/45 shadow-inner shadow-black/40 outline-none transition focus:border-white/30 focus:ring-4 focus:ring-[#A50034]/25"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[12px] text-white/45">
                      {input.length}/{maxLength}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleStart}
                    disabled={!canStart}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-[16px] sm:text-[17px] font-semibold text-[#E4003F] shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:active:scale-100"
                  >
                    프로젝트 시작하기
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative w-full border-t border-white/10 bg-black/35 py-5 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 text-[15px] sm:text-[16px] text-white/85">
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </span>
            <span className="font-semibold">약 50분 소요</span>
          </span>
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </span>
            <span className="font-semibold">크롬 / PC 환경 최적화</span>
          </span>
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M9 9h6v6H9zM12 6v2M12 16v2M6 12h2M16 12h2" />
              </svg>
            </span>
            <span className="font-semibold">AI의 맞춤형 결과 피드백 제공</span>
          </span>
        </div>
      </footer>
    </main>
  );
}
