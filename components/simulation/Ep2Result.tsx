"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep2Patterns } from "@/content/episode2";

interface Ep2ResultProps {
  userName: string;
}

export function Ep2Result({ userName }: Ep2ResultProps) {
  const router = useRouter();
  const { episode2Pattern } = useStore();

  if (!episode2Pattern) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6B6B6B]">선택 정보가 없습니다.</p>
        <button
          type="button"
          onClick={() => router.push("/simulation?phase=ep3-charter")}
          className="mt-4 text-[#6B6B6B] underline"
        >
          Charter로 돌아가기
        </button>
      </div>
    );
  }

  const config = ep2Patterns[episode2Pattern];
  if (!config) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">Ep 2 – 결과</h2>
      <p className="text-sm font-medium text-[#4A4A4A]">{config.name}</p>
      <p className="text-xs text-[#6B6B6B]">{config.subtitle}</p>
      <p className="text-xs text-[#6B6B6B]">조건: {config.condition}</p>

      <div className="p-4 rounded-xl border border-[#E5E5E5] text-sm text-[#6B6B6B] leading-relaxed">
        {config.text}
      </div>
      <p className="text-xs text-[#6B6B6B]">KPI가 상단 게이지에 반영되었습니다.</p>

    </div>
  );
}
