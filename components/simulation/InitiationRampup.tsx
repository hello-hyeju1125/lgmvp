"use client";

import { initiationRampupCopy } from "@/content/initiationRecap";

interface InitiationRampupProps {
  userName: string;
}

export function InitiationRampup({ userName }: InitiationRampupProps) {
  return (
    <section className="-mx-6 -mb-6">
      <div className="relative overflow-hidden rounded-none bg-black px-6 py-10 sm:mx-0 sm:rounded-lg sm:px-10 sm:py-12">
        <div className="relative">
          <div className="text-center">
            <h2 className="text-[36px] font-extrabold tracking-tight text-white sm:text-[42px]">
              {initiationRampupCopy.title}
            </h2>
            <p className="mt-3 text-[16px] font-bold text-white">{userName}님, 다음 여정이 시작됩니다.</p>
          </div>

          <div className="mx-auto mt-8 h-px max-w-xs bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <p className="mx-auto mt-8 max-w-3xl whitespace-pre-line text-center text-[16px] leading-[1.95] text-white/90 sm:text-[17px]">
            {initiationRampupCopy.intro}
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-center text-[16px] font-bold leading-[1.95] text-[#E4003F] sm:text-[17px]">
            {initiationRampupCopy.body}
          </p>

          <ul className="mt-10 grid gap-3 sm:gap-4">
            {initiationRampupCopy.phases.map((phase, i) => (
              <li key={i} className="relative">
                {i === 0 || i >= 2 ? (
                  <div className="relative overflow-hidden rounded-2xl border border-[#D1D5DB] bg-[#E5E7EB] p-5 text-[15px] leading-[1.9] text-black sm:p-6 sm:text-[16px]">
                    <span className="absolute left-0 top-0 h-full w-[4px] bg-[#9CA3AF]" aria-hidden />
                    {i === 0 && (
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md border border-[#9CA3AF] bg-[#F3F4F6] px-2 py-1 text-[11px] font-extrabold tracking-[0.08em] text-black">
                          DONE
                        </span>
                        <span className="text-[11px] font-bold tracking-[0.08em] text-black/80">완료된 단계</span>
                      </div>
                    )}
                    <span className="font-semibold">{phase}</span>
                  </div>
                ) : (
                  <div className="group relative overflow-hidden rounded-2xl border border-[#E4003F] bg-[#E4003F] p-5 text-[15px] leading-[1.9] text-white transition hover:bg-[#D10039] sm:p-6 sm:text-[16px]">
                    <span className="absolute left-0 top-0 h-full w-[3px] bg-[#E4003F]" aria-hidden />
                    {i === 1 && (
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md border border-white bg-white px-2 py-1 text-[11px] font-extrabold tracking-[0.08em] text-[#E4003F] shadow-[0_8px_18px_rgba(0,0,0,0.16)]">
                          NEXT
                        </span>
                        <span className="text-[11px] font-bold tracking-[0.08em] text-white">다음 단계</span>
                      </div>
                    )}
                    <span>{phase}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-8 max-w-3xl whitespace-pre-line text-center text-[16px] leading-[1.95] text-white sm:text-[17px]">
            {initiationRampupCopy.outro}
          </p>

        </div>
      </div>
    </section>
  );
}
