"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getEp7Result } from "@/content/episode7";

const EP7_INTRO =
  "선택이 완료되었습니다. 실무자가 벽에 부딪혔을 때 리더가 내미는 손길은, 팀원을 스스로 성장하게 만들 수도 있고 단순한 실행 도구로 전락시킬 수도 있습니다. 리더님의 코칭이 어떤 Impact를 만들어냈는지, 확인해 보십시오.";

interface Ep7PassionResultProps {
  userName: string;
}

export function Ep7PassionResult({ userName }: Ep7PassionResultProps) {
  const router = useRouter();
  const { episode7Choice, executionActionHours } = useStore();
  const choice = episode7Choice ?? "A";
  const vocHours = executionActionHours["voc_data"] ?? 0;
  const refHours = executionActionHours["ref_benchmark"] ?? 0;
  const result = getEp7Result(choice, vocHours, refHours);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">
        E7. 길 잃은 열정, 어떻게 이끌 것인가? – 결과
      </h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{EP7_INTRO}&quot;</p>

      <p className="text-sm font-medium text-[#4A4A4A]">나의 의사결정 결과 확인하기</p>

      <div className="rounded-xl border border-[#E5E5E5] overflow-hidden bg-white">
        <div className="p-4 space-y-4 bg-[#FAFAFB] border-b border-[#E5E5E5]">
          <p className="text-sm font-medium text-[#4A4A4A]">
            결과 {choice}. {result.optionTitle}
          </p>
          <p className="text-sm text-[#4A4A4A] leading-relaxed">{result.text}</p>
          <div className="flex flex-wrap gap-2">
            {result.kpiLabels.map((label) => (
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
        </div>
        <div className="rounded-lg border-t border-[#E5E5E5] bg-white p-4">
          <p className="text-xs font-medium text-[#4A4A4A] mb-3">챗봇 선배 PM의 조언</p>
          <div className="flex gap-3">
            <div className="shrink-0 w-9 h-9 rounded-full bg-[#E8EBFA] flex items-center justify-center text-[#464775] font-bold text-sm">
              PM
            </div>
            <div className="space-y-2 min-w-0">
              {result.adviceParagraphs.map((para, i) => (
                <p key={i} className="text-sm text-[#6B6B6B] leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
