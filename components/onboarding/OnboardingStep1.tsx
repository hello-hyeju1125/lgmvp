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
  const [isRead, setIsRead] = useState(false);
  const revealedEmail = useStore((s) => s.onboardingStep1Revealed);
  const revealEmail = useStore((s) => s.revealOnboardingStep1);
  const displaySubject = mailContent.subject;

  const reveal = (index: number) => revealEmail(index);

  const openMail = () => {
    setIsOpen((v) => !v);
    setIsRead(true);
  };

  return (
    <div className="flex flex-col bg-transparent">
      <header className="flex-shrink-0 border-b border-white/10 bg-black/45 px-5 py-3 backdrop-blur-md">
        <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)]">
          프로젝트 리더로 보임된 당신
        </h1>
      </header>

      <div className="px-5 pt-10 pb-3">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-2xl border border-white/12 bg-black/55 p-4 sm:p-5 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-[#BBBBBB]">
                  <MailIcon />
                </span>
                <p className="font-semibold">이메일이 도착했습니다</p>
              </div>
              {!isRead && (
                <span className="inline-flex items-center rounded-full bg-[#a50034] px-2.5 py-1 text-xs font-semibold text-white">
                  읽지 않음
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={openMail}
              className="mt-3 w-full rounded-xl border border-[#BBBBBB]/40 bg-black/30 px-4 py-3 text-left transition hover:border-[#BBBBBB]/70"
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
              <div className="mt-4 rounded-xl border border-[#BBBBBB]/25 bg-black/25 p-4">
                <div className="break-keep whitespace-pre-line text-[15px] sm:text-[16px] leading-[1.8] text-white/90">
                  <p className="text-[13px] text-[#BBBBBB]">
                    보낸사람: {mailContent.from}
                    {"\n"}받는사람: {replaceUserName("{User_Name}", userName)} {mailContent.toLabel}
                    {"\n"}제목: {displaySubject}
                  </p>
                  {"\n\n"}

                  <p className="mb-3 text-[12px] font-semibold text-white/85">
                    아래 문구를 클릭하면 문장이 드러납니다.
                  </p>

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
                          className={`inline-flex items-center justify-center align-baseline rounded-md px-2 py-0.5 mx-0.5 select-none outline-none transition ${
                            revealedEmail[i]
                              ? "bg-white/10 text-white font-semibold border border-white/10"
                              : "cursor-pointer border border-[#BBBBBB]/60 bg-white/5 text-[#BBBBBB] shadow-[0_0_0_1px_rgba(165,0,52,0.15)] hover:border-[#a50034] hover:text-white hover:bg-white/10 focus:border-[#a50034] focus:ring-4 focus:ring-[#a50034]/25 animate-pulse"
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
  );
}
