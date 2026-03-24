"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep4Scene, ep4Options, getEp4Result } from "@/content/episode4";

interface Ep4RoleSceneProps {
  userName: string;
}

export function Ep4RoleScene({ userName }: Ep4RoleSceneProps) {
  const router = useRouter();
  const { setEpisode4Choice, applyKpiDelta, initiationActionHours } = useStore();
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | "E" | null>(null);

  const handleConfirm = () => {
    if (!selected) return;
    const result = getEp4Result(selected, initiationActionHours["team_profile"] ?? 0);
    applyKpiDelta(result.kpi);
    setEpisode4Choice(selected);
    router.push("/simulation?phase=ep4-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">{ep4Scene.title}</h2>
      <p className="text-sm text-[#6B6B6B]">[상황] {ep4Scene.situation}</p>
      <div className="border border-[#E5E5E5] rounded-xl p-4 space-y-3 bg-[#F9FAFB]">
        {ep4Scene.dialogue.map((line, i) => (
          <p key={i} className="text-sm text-[#6B6B6B]">{line}</p>
        ))}
      </div>
      <p className="text-sm font-medium text-[#4A4A4A]">[Action] {ep4Scene.action}</p>

      <div className="space-y-3">
        {ep4Options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelected(opt.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
              selected === opt.id ? "border-[#6B6B6B] bg-[#F9FAFB]" : "border-[#E5E5E5] hover:border-[#6B6B6B]/50"
            }`}
          >
            <p className="font-medium text-[#4A4A4A]">
              옵션 {opt.id}. {opt.title}
            </p>
            <p className="text-sm text-[#6B6B6B] mt-1">{opt.summary}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selected}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          선택한 의사결정대로 행동하시겠습니까?
        </button>
      </div>
    </div>
  );
}
