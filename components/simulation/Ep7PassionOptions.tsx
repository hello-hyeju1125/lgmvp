"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep7Options, getEp7Result } from "@/content/episode7";

interface Ep7PassionOptionsProps {
  userName: string;
}

export function Ep7PassionOptions({ userName }: Ep7PassionOptionsProps) {
  const router = useRouter();
  const { setEpisode7Choice, applyKpiDelta, executionActionHours } = useStore();

  const handleSelect = (choice: "A" | "B" | "C" | "D") => {
    setEpisode7Choice(choice);
    const vocHours = executionActionHours["voc_data"] ?? 0;
    const refHours = executionActionHours["ref_benchmark"] ?? 0;
    const res = getEp7Result(choice, vocHours, refHours);
    applyKpiDelta(res.kpi);
    router.push("/simulation?phase=ep7-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">E7. 길 잃은 열정 – 옵션</h2>
      <div className="space-y-3">
        {ep7Options.map((opt) => (
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
