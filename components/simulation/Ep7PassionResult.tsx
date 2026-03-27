"use client";

import { useStore } from "@/store/useStore";
import { getEp7Result } from "@/content/episode7";
import type { Ep7Choice } from "@/content/episode7";
import EpisodeResult from "@/components/shared/EpisodeResult";

const EP7_INTRO =
  "선택이 완료되었습니다. 실무자가 벽에 부딪혔을 때 리더가 내미는 손길은, 팀원을 스스로 성장하게 만들 수도 있고 단순한 실행 도구로 전락시킬 수도 있습니다. 리더님의 코칭이 어떤 Impact를 만들어냈는지, 확인해 보십시오.";

interface Ep7PassionResultProps {
  userName: string;
}

export function Ep7PassionResult({ userName }: Ep7PassionResultProps) {
  const { episode7Choice, executionActionHours } = useStore();
  const choice: Ep7Choice = episode7Choice ?? "A";
  const vocHours = executionActionHours["voc_data"] ?? 0;
  const refHours = executionActionHours["ref_benchmark"] ?? 0;
  const choices: Ep7Choice[] = ["A", "B", "C", "D"];
  return (
    <EpisodeResult
      title="E7. 길 잃은 열정, 어떻게 이끌 것인가? - 결과"
      selectedOption={choice}
      intro={EP7_INTRO}
      results={choices.map((id) => {
        const result = getEp7Result(id, vocHours, refHours);
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
