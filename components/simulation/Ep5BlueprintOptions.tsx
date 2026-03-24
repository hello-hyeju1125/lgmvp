"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep5Options, getEp5Result } from "@/content/episode5";

interface Ep5BlueprintOptionsProps {
  userName: string;
}

export function Ep5BlueprintOptions({ userName }: Ep5BlueprintOptionsProps) {
  const router = useRouter();
  const { setEpisode5Choice, applyKpiDelta } = useStore();

  const handleSelect = (choice: "A" | "B" | "C" | "D") => {
    setEpisode5Choice(choice);
    const res = getEp5Result(choice);
    applyKpiDelta(res.kpi);
    router.push("/simulation?phase=ep5-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">E5. 우리의 청사진 – 옵션</h2>
      <div className="space-y-3">
        {ep5Options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSelect(opt.id)}
            className="w-full text-left p-4 rounded-xl border border-[#E5E5E5] bg-[#F9FAFB] hover:border-[#6B6B6B] hover:bg-[#F0F0F0] transition-colors"
          >
            <p className="font-medium text-[#4A4A4A] text-sm">옵션 {opt.id}: {opt.title}</p>
            <p className="text-xs text-[#6B6B6B] mt-2">{opt.summary}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
