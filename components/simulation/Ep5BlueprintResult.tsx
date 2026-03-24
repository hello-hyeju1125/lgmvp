"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getEp5Result } from "@/content/episode5";

/** **text** → <strong>text</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

const EP5_INTRO =
  "선택이 완료되었습니다. 기획의 뼈대를 세우는 방식은 앞으로 6개월간 팀이 일하는 방식을 결정짓는 기준이 됩니다. 리더님의 결단이 어떤 Impact를 만들어냈는지, 확인해 보십시오.";

interface Ep5BlueprintResultProps {
  userName: string;
}

export function Ep5BlueprintResult({ userName }: Ep5BlueprintResultProps) {
  const router = useRouter();
  const { episode5Choice } = useStore();
  const choice = episode5Choice ?? "A";
  const result = getEp5Result(choice);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">
        E5. &quot;우리의 청사진, 어떻게 그릴 것인가?&quot; – 결과
      </h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">{EP5_INTRO}</p>

      <p className="text-sm font-medium text-[#4A4A4A]">나의 의사결정 결과 확인하기</p>

      <div className="rounded-xl border border-[#E5E5E5] overflow-hidden bg-white">
        <div className="p-4 space-y-4 bg-[#FAFAFB] border-b border-[#E5E5E5]">
          <p className="text-sm font-medium text-[#4A4A4A]">
            결과 {choice}. {result.optionTitle}
          </p>
          <p className="text-sm text-[#4A4A4A] leading-relaxed">{renderWithBold(result.text)}</p>
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
                  {renderWithBold(para)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/simulation?phase=plan-recap")}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A]"
        >
          기획 단계 Recap으로
        </button>
      </div>
    </div>
  );
}
