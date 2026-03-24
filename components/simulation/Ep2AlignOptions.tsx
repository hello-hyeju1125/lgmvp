"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep2AlignOptions, ep2AlignResults } from "@/content/episode2Align";

interface Ep2AlignOptionsProps {
  userName: string;
}

export function Ep2AlignOptions({ userName }: Ep2AlignOptionsProps) {
  const router = useRouter();
  const { setEpisode2AlignChoice, applyKpiDelta } = useStore();
  const [selected, setSelected] = useState<"A" | "B" | "C" | null>(null);

  const handleNext = () => {
    if (!selected) return;
    const result = ep2AlignResults[selected];
    if (result?.kpi) applyKpiDelta(result.kpi);
    setEpisode2AlignChoice(selected);
    router.push("/simulation?phase=ep2-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">E2. 유관부서와의 동상이몽 – 옵션 선택</h2>

      <div className="space-y-3">
        {ep2AlignOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelected(opt.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
              selected === opt.id ? "border-[#6B6B6B] bg-[#F9FAFB]" : "border-[#E5E5E5] hover:border-[#6B6B6B]/50"
            }`}
          >
            <p className="font-medium text-[#4A4A4A]">옵션 {opt.id}. {opt.title}</p>
            <p className="text-sm text-[#6B6B6B] mt-1">{opt.summary}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={!selected}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          선택한 의사결정대로 행동하시겠습니까?
        </button>
      </div>
    </div>
  );
}
