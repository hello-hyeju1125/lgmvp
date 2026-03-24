"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep4Options, getEp4Result } from "@/content/episode4";

interface Ep4RoleOptionsProps {
  userName: string;
}

export function Ep4RoleOptions({ userName }: Ep4RoleOptionsProps) {
  const router = useRouter();
  const { setEpisode4Choice, applyKpiDelta, initiationActionHours } = useStore();

  const handleSelect = (choice: "A" | "B" | "C" | "D" | "E") => {
    setEpisode4Choice(choice);
    const res = getEp4Result(choice, initiationActionHours["team_profile"] ?? 0);
    applyKpiDelta(res.kpi);
    router.push("/simulation?phase=ep4-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">E4. 이게 왜 제 일입니까? – 옵션</h2>
      <div className="space-y-3">
        {ep4Options.map((opt) => (
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
