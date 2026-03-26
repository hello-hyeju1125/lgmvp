"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { getEp7Result } from "@/content/episode7";
import type { Ep7Choice } from "@/content/episode7";

const EP7_INTRO =
  "선택이 완료되었습니다. 실무자가 벽에 부딪혔을 때 리더가 내미는 손길은, 팀원을 스스로 성장하게 만들 수도 있고 단순한 실행 도구로 전락시킬 수도 있습니다. 리더님의 코칭이 어떤 Impact를 만들어냈는지, 확인해 보십시오.";

interface Ep7PassionResultProps {
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
  id: Ep7Choice;
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

export function Ep7PassionResult({ userName }: Ep7PassionResultProps) {
  const { episode7Choice, executionActionHours } = useStore();
  const choice: Ep7Choice = episode7Choice ?? "A";
  const [expandedOther, setExpandedOther] = useState<Ep7Choice | null>(null);
  const vocHours = executionActionHours["voc_data"] ?? 0;
  const refHours = executionActionHours["ref_benchmark"] ?? 0;
  const myResult = getEp7Result(choice, vocHours, refHours);
  const otherIds: Ep7Choice[] = (["A", "B", "C", "D"] as const).filter((c) => c !== choice);

  return (
    <section className="mx-auto w-full max-w-4xl" aria-labelledby="ep7-result-title">
      <div className="rounded-xl border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
        <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-[#E4003F]">E7 RESULT</p>
        <h2 id="ep7-result-title" className="mt-2 text-center text-2xl font-extrabold tracking-tight text-black/90 sm:text-3xl">
          E7. 길 잃은 열정, 어떻게 이끌 것인가? – 결과
        </h2>
        <p className="mt-4 text-[15px] leading-[1.85] text-black/75">{EP7_INTRO}</p>

        <p className="mt-8 text-[15px] font-extrabold text-black/85">나의 의사결정 결과 확인하기</p>

        <div className="mt-4 space-y-4">
          <ResultBlock
            id={choice}
            optionTitle={myResult.optionTitle}
            text={myResult.text}
            kpiLabels={myResult.kpiLabels}
            adviceParagraphs={myResult.adviceParagraphs}
            isOpen={true}
            onToggle={() => {}}
            isMyChoice={true}
          />

          {otherIds.map((id) => {
            const r = getEp7Result(id, vocHours, refHours);
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
