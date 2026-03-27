"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep3Options, getEp3Result } from "@/content/episode3";
import EpisodeOptions from "@/components/shared/EpisodeOptions";

interface Ep3TeamOptionsProps {
  userName: string;
}

export function Ep3TeamOptions({ userName }: Ep3TeamOptionsProps) {
  const router = useRouter();
  const { setEpisode3Choice, applyKpiDelta, planningActionHours } = useStore();
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);

  const handleNext = () => {
    if (!selected) return;
    const choice = selected;
    setEpisode3Choice(choice);
    const res = getEp3Result(choice, planningActionHours["resource_assign"] ?? 0);
    applyKpiDelta(res.kpi);
    router.push("/simulation?phase=ep3-team-result");
  };

  return (
    <EpisodeOptions
      title="E3. 소속 팀 업무가 먼저 아닙니까? - 옵션"
      situation="선택한 의사결정대로 행동하시겠습니까?"
      options={ep3Options.map((opt) => ({
        id: opt.id,
        label: `옵션 ${opt.id}. ${opt.title}`,
        description: opt.summary,
      }))}
      selectedOption={selected}
      onSelect={(optionId) => setSelected(optionId as "A" | "B" | "C" | "D")}
      onNext={handleNext}
    />
  );
}
