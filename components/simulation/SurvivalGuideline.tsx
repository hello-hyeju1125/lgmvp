"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ep2SurvivalGuideline } from "@/content/episode2";

interface SurvivalGuidelineProps {
  userName: string;
}

export function SurvivalGuideline({ userName }: SurvivalGuidelineProps) {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({
    esc: false,
    weapon: false,
    public: false,
  });

  const allChecked = ep2SurvivalGuideline.checklist.every((c) => checked[c.id]);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#4A4A4A] text-white -mx-4 -my-6 px-4 py-6 rounded-none">
      <div className="max-w-2xl mx-auto space-y-6">
        <p className="text-red-400 text-sm font-medium">{ep2SurvivalGuideline.redPoint}</p>
        <h2 className="text-xl font-bold">{ep2SurvivalGuideline.title}</h2>
        <p className="text-gray-300 text-sm">{ep2SurvivalGuideline.subtitle}</p>

        {ep2SurvivalGuideline.factBombs.map((fb, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/10 border border-white/20">
            <p className="font-medium text-sm">{fb.title}</p>
            <p className="text-xs text-gray-400 mt-1">{fb.source}</p>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">{fb.text}</p>
          </div>
        ))}

        <div className="p-4 rounded-xl bg-white/10 border border-white/20">
          <p className="font-medium text-sm mb-3">PM 생존 지침서 (3개 모두 체크 후 다음 단계로)</p>
          {ep2SurvivalGuideline.checklist.map((c) => (
            <label key={c.id} className="flex gap-3 items-start cursor-pointer mb-3 last:mb-0">
              <input
                type="checkbox"
                checked={!!checked[c.id]}
                onChange={() => toggle(c.id)}
                className="mt-1 w-4 h-4 rounded border-gray-500"
              />
              <div>
                <p className="text-sm font-medium">{c.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.detail}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => router.push("/simulation?phase=plan-action")}
            disabled={!allChecked}
            className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            기획 단계로 이동하기
          </button>
        </div>
      </div>
    </div>
  );
}
