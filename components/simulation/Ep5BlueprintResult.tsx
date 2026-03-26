"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getEp5Result } from "@/content/episode5";
import type { Ep5Choice } from "@/content/episode5";

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
  id: Ep5Choice;
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

interface Ep5BlueprintResultProps {
  userName: string;
}

export function Ep5BlueprintResult({ userName }: Ep5BlueprintResultProps) {
  const router = useRouter();
  const { episode5Choice } = useStore();
  const [expandedOther, setExpandedOther] = useState<Ep5Choice | null>(null);

  if (!episode5Choice) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8 text-center">
        <p className="text-[15px] text-black/70">선택 정보가 없습니다.</p>
        <button
          type="button"
          onClick={() => router.push("/simulation?phase=ep5-scene")}
          className="mt-4 text-[15px] font-semibold text-[#E4003F] underline underline-offset-2"
        >
          옵션 선택으로 돌아가기
        </button>
      </div>
    );
  }

  const myResult = getEp5Result(episode5Choice);
  const otherIds: Ep5Choice[] = (["A", "B", "C", "D"] as const).filter((c) => c !== episode5Choice);

  return (
    <section className="mx-auto w-full max-w-4xl" aria-labelledby="ep5-result-title">
      <div className="rounded-xl border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
        <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-[#E4003F]">E5 RESULT</p>
        <h2 id="ep5-result-title" className="mt-2 text-center text-2xl font-extrabold tracking-tight text-black/90 sm:text-3xl">
          E5. "우리의 청사진, 어떻게 그릴 것인가?" – 결과
        </h2>
        <p className="mt-4 text-[15px] leading-[1.85] text-black/75">
          선택이 반영되었습니다. 기획의 뼈대를 세우는 방식은 앞으로 6개월간 팀이 일하는 방식을 결정짓는 기준이 됩니다. 당신의
          선택이 어떤 트레이드오프(Trade-off)를 발생시켰으며, 상단의 5가지 지표가 어떻게 변화했는지 확인해 보십시오.
        </p>

        <p className="mt-8 text-[15px] font-extrabold text-black/85">나의 의사결정 결과 확인하기</p>

        <div className="mt-4 space-y-4">
          <ResultBlock
            id={episode5Choice}
            optionTitle={myResult.optionTitle}
            text={myResult.text}
            kpiLabels={myResult.kpiLabels}
            adviceParagraphs={myResult.adviceParagraphs}
            isOpen={true}
            onToggle={() => {}}
            isMyChoice={true}
          />

          {otherIds.map((id) => {
            const r = getEp5Result(id);
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
