"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep1Scene, ep1Options, ep1Results } from "@/content/episode1";

interface Ep1OptionsProps {
  userName: string;
}

export function Ep1Options({ userName }: Ep1OptionsProps) {
  const router = useRouter();
  const { setEpisode1Choice, applyKpiDelta } = useStore();
  const [selected, setSelected] = useState<"A" | "B" | "C" | null>(null);

  const handleNext = () => {
    if (!selected) return;
    const result = ep1Results[selected];
    if (result?.kpi) applyKpiDelta(result.kpi);
    setEpisode1Choice(selected);
    router.push("/simulation?phase=ep1-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">E1. 위에서 떨어진 폭탄 – 옵션 선택</h2>
      <p className="text-sm text-[#6B6B6B]">[Action] {ep1Scene.action}</p>

      <div className="space-y-3">
        {ep1Options.map((opt) => (
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
