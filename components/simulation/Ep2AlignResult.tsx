"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep2AlignResults } from "@/content/episode2Align";
import EpisodeResult from "@/components/shared/EpisodeResult";

interface Ep2AlignResultProps {
  userName: string;
}

export function Ep2AlignResult({ userName }: Ep2AlignResultProps) {
  const router = useRouter();
  const { episode2AlignChoice } = useStore();
  return (
    <EpisodeResult
      title="E2. 유관부서와의 동상이몽 - 결과"
      selectedOption={episode2AlignChoice ?? ""}
      intro="선택이 완료되었습니다. 부서 간 의사결정의 영향과 KPI 변화를 함께 확인해 보십시오."
      onPrev={() => router.push("/simulation?phase=ep2-scene")}
      results={(Object.entries(ep2AlignResults) as Array<[string, (typeof ep2AlignResults)["A"]]>).map(([id, result]) => ({
        id,
        label: result.optionTitle,
        advice: result.text,
        kpiLabels: result.kpiLabels,
        adviceParagraphs: result.adviceParagraphs,
      }))}
    />
  );
}
