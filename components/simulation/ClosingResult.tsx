"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { closingResultCopy } from "@/content/closingScene";
import type { KpiState } from "@/store/useStore";

const KPI_KEYS: (keyof KpiState)[] = [
  "quality",
  "delivery",
  "teamEngagement",
  "stakeholderAlignment",
  "leaderEnergy",
];

const KPI_LABELS: Record<keyof KpiState, string> = {
  quality: "산출물 품질",
  delivery: "일정 준수",
  teamEngagement: "팀 몰입도",
  stakeholderAlignment: "이해관계자 조율",
  leaderEnergy: "리더의 에너지",
};

interface ClosingResultProps {
  userName: string;
}

export function ClosingResult({ userName }: ClosingResultProps) {
  const router = useRouter();
  const { kpi } = useStore();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">{closingResultCopy.title}</h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">{closingResultCopy.intro}</p>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-[#4A4A4A] mb-3">[현재 대시보드 상태]</p>
        <ul className="space-y-2 text-sm text-[#6B6B6B]">
          {KPI_KEYS.map((key) => (
            <li key={key}>
              • {KPI_LABELS[key]}: {kpi[key]}점
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-[#6B6B6B] leading-relaxed font-medium">
        {closingResultCopy.outro}
      </p>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A]"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
