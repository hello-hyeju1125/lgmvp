"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep1Scene, ep1Options, ep1Results } from "@/content/episode1";
import EpisodeOptions from "@/components/shared/EpisodeOptions";

interface Ep1OptionsProps {
  userName: string;
}

export function Ep1Options({ userName }: Ep1OptionsProps) {
  const router = useRouter();
  const { setEpisode1Choice, applyKpiDelta } = useStore();
  const [selected, setSelected] = useState<"A" | "B" | "C" | null>(null);

  const handleNext = () => {
    if (!selected) return;
    const result = ep1Results[selected];
    if (result?.kpi) applyKpiDelta(result.kpi);
    setEpisode1Choice(selected);
    router.push("/simulation?phase=ep1-result");
  };

  return (
    <EpisodeOptions
      title="E1. 위에서 떨어진 폭탄 - 옵션 선택"
      situation={`[Action] ${ep1Scene.action}`}
      options={ep1Options.map((opt) => ({
        id: opt.id,
        label: `옵션 ${opt.id}. ${opt.title}`,
        description: opt.summary,
      }))}
      selectedOption={selected}
      onSelect={(optionId) => setSelected(optionId as "A" | "B" | "C")}
      onNext={handleNext}
    />
  );
}
