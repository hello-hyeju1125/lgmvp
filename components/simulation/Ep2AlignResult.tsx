"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep2AlignResults } from "@/content/episode2Align";
import type { Ep2AlignChoice } from "@/content/episode2Align";

interface Ep2AlignResultProps {
  userName: string;
}

/** **text** → <strong>text</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

function ResultBlock({
  id,
  optionTitle,
  text,
  kpiLabels,
  adviceParagraphs,
  isOpen,
  onToggle,
  isMyChoice,
}: {
  id: Ep2AlignChoice;
  optionTitle: string;
  text: string;
  kpiLabels: string[];
  adviceParagraphs: string[];
  isOpen: boolean;
  onToggle: () => void;
  isMyChoice: boolean;
}) {
  const header = (
    <span className="text-[15px] font-extrabold text-black/85">
      결과 {id}. {optionTitle}
      {isMyChoice && (
        <span className="ml-2 inline-flex rounded-full bg-[#E4003F]/10 px-2.5 py-0.5 text-[12px] font-extrabold text-[#E4003F] ring-1 ring-[#E4003F]/20">
          나의 선택
        </span>
      )}
    </span>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      {isMyChoice ? (
        <div className="flex items-center justify-between gap-2 bg-[#f8f9fa] p-4">{header}</div>
      ) : (
        <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-2 p-4 text-left transition-colors hover:bg-gray-50">
          {header}
          <span className="shrink-0 text-black/45" aria-hidden>
            {isOpen ? "▲" : "▼"}
          </span>
        </button>
      )}
      {isOpen && (
        <div className="space-y-4 border-t border-black/10 bg-[#f8f9fa] p-4">
          <p className="text-[15px] leading-[1.85] text-black/75">{renderWithBold(text)}</p>
          <div className="flex flex-wrap gap-2">
            {kpiLabels.map((label) => (
              <span
                key={label}
                className={`rounded-full px-3 py-1 text-[12px] font-extrabold ${
                  label.includes("▼") ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                }`}
              >
                [{label}]
              </span>
            ))}
          </div>
          <div className="flex items-start gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#E4003F]/10 ring-1 ring-black/10">
              <img src="/chatbot.png" alt="챗봇 선배 PM" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-[13px] font-extrabold text-black/85">챗봇 선배 PM</p>
              <div className="relative rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                <div className="absolute left-0 top-5 -translate-x-1/2 rotate-45 h-3 w-3 border border-black/10 bg-white" aria-hidden="true" />
                <div className="space-y-2">
                  {adviceParagraphs.map((para, i) => (
                    <p key={i} className="text-[14px] leading-[1.85] text-black/70">
                      {renderWithBold(para)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Ep2AlignResult({ userName }: Ep2AlignResultProps) {
  const router = useRouter();
  const { episode2AlignChoice } = useStore();
  const [expandedOther, setExpandedOther] = useState<Ep2AlignChoice | null>(null);

  if (!episode2AlignChoice) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8 text-center">
        <p className="text-[15px] text-black/70">선택 정보가 없습니다.</p>
        <button
          type="button"
          onClick={() => router.push("/simulation?phase=ep2-scene")}
          className="mt-4 text-[15px] font-semibold text-[#E4003F] underline underline-offset-2"
        >
          옵션 선택으로 돌아가기
        </button>
      </div>
    );
  }

  const myResult = ep2AlignResults[episode2AlignChoice];
  const otherIds: Ep2AlignChoice[] = (["A", "B", "C"] as const).filter((c) => c !== episode2AlignChoice);

  return (
    <section className="mx-auto w-full max-w-4xl" aria-labelledby="ep2-result-title">
      <div className="rounded-xl border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
        <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-[#E4003F]">E2 RESULT</p>
        <h2 id="ep2-result-title" className="mt-2 text-center text-2xl font-extrabold tracking-tight text-black/90 sm:text-3xl">
          E2. 유관부서와의 동상이몽 – 결과
        </h2>
        <p className="mt-4 text-[15px] leading-[1.85] text-black/75">
          선택이 완료되었습니다. 부서 간의 팽팽한 줄다리기 속에서 리더의 의사결정이 어떤 영향을 미치게 되었는지, 결과를 같이
          살펴봅시다. 상단의 5가지 지표 변화도 함께 확인해 보십시오.
        </p>

        <p className="mt-8 text-[15px] font-extrabold text-black/85">나의 의사결정 결과 확인하기</p>

        <div className="mt-4 space-y-4">
          <ResultBlock
            id={episode2AlignChoice}
            optionTitle={myResult.optionTitle}
            text={myResult.text}
            kpiLabels={myResult.kpiLabels}
            adviceParagraphs={myResult.adviceParagraphs}
            isOpen={true}
            onToggle={() => {}}
            isMyChoice={true}
          />

          {otherIds.map((id) => {
            const r = ep2AlignResults[id];
            return (
              <ResultBlock
                key={id}
                id={id}
                optionTitle={r.optionTitle}
                text={r.text}
                kpiLabels={r.kpiLabels}
                adviceParagraphs={r.adviceParagraphs}
                isOpen={expandedOther === id}
                onToggle={() => setExpandedOther(expandedOther === id ? null : id)}
                isMyChoice={false}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
