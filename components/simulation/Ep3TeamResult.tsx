"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getEp3Result } from "@/content/episode3";
import type { Ep3Choice } from "@/content/episode3";

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
  id: Ep3Choice;
  optionTitle: string;
  text: string;
  kpiLabels: string[];
  adviceParagraphs: string[];
  isOpen: boolean;
  onToggle: () => void;
  isMyChoice: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] overflow-hidden bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 p-4 text-left hover:bg-[#F9FAFB] transition-colors"
      >
        <span className="text-sm font-medium text-[#4A4A4A]">
          결과 {id}. {optionTitle}
          {isMyChoice && (
            <span className="ml-2 text-xs font-semibold text-[#464775] bg-[#E8EBFA] px-2 py-0.5 rounded">
              나의 선택
            </span>
          )}
        </span>
        <span className="text-[#6B6B6B] shrink-0" aria-hidden>
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-[#E5E5E5] p-4 space-y-4 bg-[#FAFAFA]">
          <p className="text-sm text-[#4A4A4A] leading-relaxed">{renderWithBold(text)}</p>
          <div className="flex flex-wrap gap-2">
            {kpiLabels.map((label) => (
              <span
                key={label}
                className={`rounded px-2 py-1 text-xs font-medium ${
                  label.includes("▼") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                [{label}]
              </span>
            ))}
          </div>
          <div className="rounded-lg border border-[#E5E5E5] bg-white p-4">
            <p className="text-xs font-medium text-[#4A4A4A] mb-3">챗봇 선배 PM의 조언</p>
            <div className="flex gap-3">
              <div className="shrink-0 w-9 h-9 rounded-full bg-[#E8EBFA] flex items-center justify-center text-[#464775] font-bold text-sm">
                PM
              </div>
              <div className="space-y-2 min-w-0">
                {adviceParagraphs.map((para, i) => (
                  <p key={i} className="text-sm text-[#6B6B6B] leading-relaxed">
                    {renderWithBold(para)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const EP3_INTRO =
  "선택이 완료되었습니다. 기획 단계에서 엑셀 칸을 채우는 것보다 어려운 것은, 결국 '사람의 마음과 시간'을 얻어내는 일입니다. 당신의 선택이 불러온 결과에 대해 확인해 보십시오.";

interface Ep3TeamResultProps {
  userName: string;
}

export function Ep3TeamResult({ userName }: Ep3TeamResultProps) {
  const router = useRouter();
  const { episode3Choice, planningActionHours } = useStore();
  const [expandedOther, setExpandedOther] = useState<Ep3Choice | null>(null);

  const hours = planningActionHours["resource_assign"] ?? 0;

  if (!episode3Choice) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6B6B6B]">선택 정보가 없습니다.</p>
        <button
          type="button"
          onClick={() => router.push("/simulation?phase=ep3-scene")}
          className="mt-4 text-[#6B6B6B] underline"
        >
          옵션 선택으로 돌아가기
        </button>
      </div>
    );
  }

  const myResult = getEp3Result(episode3Choice, hours);
  const otherIds: Ep3Choice[] = (["A", "B", "C", "D"] as const).filter((c) => c !== episode3Choice);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ep3-result-title"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-[#E5E5E5] bg-white shadow-xl">
        <div className="p-6 space-y-5">
          <h2 id="ep3-result-title" className="text-lg font-bold text-[#252423]">
            E3. 소속 팀 업무가 먼저 아닙니까? – 결과
          </h2>
          <p className="text-sm text-[#4A4A4A] leading-relaxed">{EP3_INTRO}</p>

          <p className="text-sm font-medium text-[#252423]">나의 의사결정 결과 확인하기</p>

          <ResultBlock
            id={episode3Choice}
            optionTitle={myResult.optionTitle}
            text={myResult.text}
            kpiLabels={myResult.kpiLabels}
            adviceParagraphs={myResult.adviceParagraphs}
            isOpen={true}
            onToggle={() => {}}
            isMyChoice={true}
          />

          {otherIds.map((id) => {
            const r = getEp3Result(id, hours);
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
    </div>
  );
}
