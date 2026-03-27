"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getEp4Result } from "@/content/episode4";
import type { Ep4Choice } from "@/content/episode4";
import EpisodeResult from "@/components/shared/EpisodeResult";

interface Ep4RoleResultProps {
  userName: string;
}

export function Ep4RoleResult({ userName }: Ep4RoleResultProps) {
  const router = useRouter();
  const { episode4Choice, initiationActionHours } = useStore();
  const hours = initiationActionHours["team_profile"] ?? 0;
  const choices: Ep4Choice[] = ["A", "B", "C", "D", "E"];
  return (
    <EpisodeResult
      title={'E4. "이게 왜 제 일입니까?" - 결과'}
      selectedOption={episode4Choice ?? ""}
      intro="선택이 반영되었습니다. 업무 할당 방식의 차이가 팀과 KPI에 미치는 영향을 확인해 보십시오."
      onPrev={() => router.push("/simulation?phase=ep4-scene")}
      results={choices.map((id) => {
        const result = getEp4Result(id, hours);
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
