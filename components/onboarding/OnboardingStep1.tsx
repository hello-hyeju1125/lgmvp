"use client";

import { useState } from "react";
import { mailContent, emailBodyParts } from "@/content/mail";
import { useStore } from "@/store/useStore";

interface OnboardingStep1Props {
  onNext: () => void;
  userName: string;
}

function replaceUserName(text: string, name: string) {
  return text.replace(/\{User_Name\}/g, name);
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function OnboardingStep1({ userName }: OnboardingStep1Props) {
  const [isOpen, setIsOpen] = useState(false);
  const revealedEmail = useStore((s) => s.onboardingStep1Revealed);
  const revealEmail = useStore((s) => s.revealOnboardingStep1);
  const displaySubject = mailContent.subject;

  const reveal = (index: number) => revealEmail(index);

  const openMail = () => {
    setIsOpen((v) => !v);
  };

  return (
    <div className="flex flex-col bg-transparent">
      <header className="flex-shrink-0 border-b border-white/10 bg-black/45 px-6 backdrop-blur-md">
        <div className="mx-auto w-full max-w-4xl py-4">
          <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)]">
            프로젝트 리더로 보임된 당신
          </h1>
        </div>
      </header>

      <div className="px-5 pt-10 pb-3">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-2xl bg-black/55 p-4 sm:p-5 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <div className="mb-3">
              <img
                src="/mail-arrived.svg"
                alt="이메일 도착"
                className="w-full h-auto max-h-32 sm:max-h-36 object-contain opacity-90"
              />
            </div>
            <div className="flex min-h-[44px] items-center justify-center py-3">
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-[#BBBBBB]">
                  <MailIcon />
                </span>
                <p className="font-semibold">이메일이 도착했습니다</p>
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border-2 border-[#BBBBBB]/40 bg-black/30 transition hover:border-[#E4003F]">
              <button
                type="button"
                onClick={openMail}
                className="w-full px-4 py-3 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-keep text-[15px] sm:text-[16px] font-semibold text-white">
                      {displaySubject}
                    </p>
                    <p className="mt-1 text-[13px] text-[#BBBBBB]">
                      보낸사람: {mailContent.from}
                    </p>
                  </div>
                  <span className="shrink-0 text-[#6b6b6b] text-sm font-semibold">
                    {isOpen ? "닫기" : "열기"}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/10 px-4 py-4">
                  <div className="break-keep whitespace-pre-line text-[15px] sm:text-[16px] leading-[1.8] text-white/90">
                    {emailBodyParts.map((part, i) => (
                      <span key={i}>
                        {part.hidden ? (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => reveal(i)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                reveal(i);
                              }
                            }}
                            aria-label="클릭하여 내용 보기"
                            className={`inline-flex items-center justify-center align-baseline rounded-md px-2 py-0.5 mx-0.5 select-none outline-none transition-all duration-200 ease-out ${
                              revealedEmail[i]
                                ? "bg-[#E4003F]/12 text-white font-semibold border border-[#E4003F]/25 shadow-[0_0_0_1px_rgba(228,0,63,0.12)]"
                                : "cursor-pointer border border-[#E4003F]/45 bg-[radial-gradient(120px_60px_at_20%_30%,rgba(228,0,63,0.22),rgba(255,255,255,0.06)_55%,rgba(255,255,255,0.03))] text-white/85 shadow-[0_0_0_1px_rgba(228,0,63,0.18),0_14px_40px_rgba(228,0,63,0.12)] animate-[pulse_1.15s_ease-in-out_infinite] hover:-translate-y-[1px] hover:scale-[1.02] hover:border-[#E4003F] hover:text-white hover:shadow-[0_0_0_1px_rgba(228,0,63,0.28),0_18px_55px_rgba(228,0,63,0.22)] focus:border-[#E4003F] focus:ring-4 focus:ring-[#E4003F]/30"
                            }`}
                          >
                            {revealedEmail[i] ? replaceUserName(part.text, userName) : "클릭하여 내용 보기"}
                          </span>
                        ) : (
                          replaceUserName(part.text, userName)
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
