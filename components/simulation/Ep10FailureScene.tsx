"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep10Scene, ep10Options, getEp10Result, type Ep10Choice } from "@/content/episode10";

interface Ep10FailureSceneProps {
  userName: string;
}

export function Ep10FailureScene({ userName }: Ep10FailureSceneProps) {
  const router = useRouter();
  const { setEpisode10Choice, applyKpiDelta } = useStore();
  const [selected, setSelected] = useState<Ep10Choice | null>(null);

  const handleConfirm = () => {
    if (!selected) return;
    const result = getEp10Result(selected);
    applyKpiDelta(result.kpi);
    setEpisode10Choice(selected);
    router.push("/simulation?phase=ep10-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">
        {ep10Scene.title} – {ep10Scene.subtitle}
      </h2>

      <section className="space-y-3">
        <p className="text-sm text-[#6B6B6B] leading-relaxed">[상황] {ep10Scene.situation}</p>
        <div className="border border-[#E5E5E5] rounded-xl p-4 space-y-3 bg-[#F9FAFB]">
          {ep10Scene.dialogue.map((line, i) => (
            <p key={i} className="text-sm text-[#6B6B6B] leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </section>

      <p className="text-sm font-medium text-[#4A4A4A]">[의사결정] {ep10Scene.action}</p>

      <div className="space-y-3">
        {ep10Options.map((opt) => (
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
            <p className="text-sm text-[#6B6B6B] mt-2 leading-relaxed">{opt.summary}</p>
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
          선택 확정
        </button>
      </div>
    </div>
  );
}
