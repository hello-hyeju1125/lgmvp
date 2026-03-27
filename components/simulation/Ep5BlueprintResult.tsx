"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getEp5Result } from "@/content/episode5";
import type { Ep5Choice } from "@/content/episode5";
import EpisodeResult from "@/components/shared/EpisodeResult";

interface Ep5BlueprintResultProps {
  userName: string;
}

export function Ep5BlueprintResult({ userName }: Ep5BlueprintResultProps) {
  const router = useRouter();
  const { episode5Choice } = useStore();
  const choices: Ep5Choice[] = ["A", "B", "C", "D"];
  return (
    <EpisodeResult
      title={'E5. "우리의 청사진, 어떻게 그릴 것인가?" - 결과'}
      selectedOption={episode5Choice ?? ""}
      intro="선택이 반영되었습니다. 기획의 뼈대를 세우는 방식이 팀의 실행 구조와 KPI를 어떻게 바꾸는지 확인해 보십시오."
      onPrev={() => router.push("/simulation?phase=ep5-scene")}
      results={choices.map((id) => {
        const result = getEp5Result(id);
        return {
          id,
          label: result.optionTitle,
          advice: result.text,
          kpiLabels: result.kpiLabels,
          adviceParagraphs: result.adviceParagraphs,
        };
      })}
    />
  );
}
