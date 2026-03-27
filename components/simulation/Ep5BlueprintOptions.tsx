"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep5Options, getEp5Result } from "@/content/episode5";
import EpisodeOptions from "@/components/shared/EpisodeOptions";

interface Ep5BlueprintOptionsProps {
  userName: string;
}

export function Ep5BlueprintOptions({ userName }: Ep5BlueprintOptionsProps) {
  const router = useRouter();
  const { setEpisode5Choice, applyKpiDelta } = useStore();
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);

  const handleNext = () => {
    if (!selected) return;
    const choice = selected;
    setEpisode5Choice(choice);
    const res = getEp5Result(choice);
    applyKpiDelta(res.kpi);
    router.push("/simulation?phase=ep5-result");
  };

  return (
    <EpisodeOptions
      title="E5. 우리의 청사진 - 옵션"
      options={ep5Options.map((opt) => ({
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
