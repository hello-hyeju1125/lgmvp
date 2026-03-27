"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep1Results } from "@/content/episode1";
import EpisodeResult from "@/components/shared/EpisodeResult";

interface Ep1ResultProps {
  userName: string;
}

export function Ep1Result({ userName }: Ep1ResultProps) {
  const router = useRouter();
  const { episode1Choice } = useStore();
  return (
    <EpisodeResult
      title="E1. 위에서 떨어진 폭탄 - 결과"
      selectedOption={episode1Choice ?? ""}
      intro="선택이 반영되었습니다. 완벽하게 모든 것을 지켜내는 정답은 존재하지 않습니다. 당신의 선택이 만든 트레이드오프와 KPI 변화를 확인해 보십시오."
      onPrev={() => router.push("/simulation?phase=ep1-scene")}
      results={(Object.entries(ep1Results) as Array<[string, (typeof ep1Results)["A"]]>).map(([id, result]) => ({
        id,
        label: result.optionTitle,
        advice: result.text,
        kpiLabels: result.kpiLabels,
        adviceParagraphs: result.adviceParagraphs,
      }))}
    />
  );
}
