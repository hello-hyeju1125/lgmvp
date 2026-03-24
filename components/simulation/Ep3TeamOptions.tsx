"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep3Options, getEp3Result } from "@/content/episode3";

interface Ep3TeamOptionsProps {
  userName: string;
}

export function Ep3TeamOptions({ userName }: Ep3TeamOptionsProps) {
  const router = useRouter();
  const { setEpisode3Choice, applyKpiDelta, planningActionHours } = useStore();

  const handleSelect = (choice: "A" | "B" | "C" | "D") => {
    setEpisode3Choice(choice);
    const res = getEp3Result(choice, planningActionHours["resource_assign"] ?? 0);
    applyKpiDelta(res.kpi);
    router.push("/simulation?phase=ep3-team-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">E3. 소속 팀 업무가 먼저 아닙니까? – 옵션</h2>
      <p className="text-sm text-[#6B6B6B]">선택한 의사결정대로 행동하시겠습니까?</p>
      <div className="space-y-3">
        {ep3Options.map((opt) => (
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
