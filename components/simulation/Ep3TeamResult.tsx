"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getEp3Result } from "@/content/episode3";
import type { Ep3Choice } from "@/content/episode3";
import EpisodeResult from "@/components/shared/EpisodeResult";

interface Ep3TeamResultProps {
  userName: string;
}

export function Ep3TeamResult({ userName }: Ep3TeamResultProps) {
  const router = useRouter();
  const { episode3Choice, planningActionHours } = useStore();

  const hours = planningActionHours["resource_assign"] ?? 0;
  const choices: Ep3Choice[] = ["A", "B", "C", "D"];
  return (
    <EpisodeResult
      title="E3. 소속 팀 업무가 먼저 아닙니까? - 결과"
      selectedOption={episode3Choice ?? ""}
      intro="선택이 반영되었습니다. 사람의 마음과 시간을 얻어내는 리더의 선택이 KPI에 어떤 영향을 주는지 확인해 보십시오."
      onPrev={() => router.push("/simulation?phase=ep3-scene")}
      results={choices.map((id) => {
        const result = getEp3Result(id, hours);
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
