"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep7Options, getEp7Result } from "@/content/episode7";
import EpisodeOptions from "@/components/shared/EpisodeOptions";

interface Ep7PassionOptionsProps {
  userName: string;
}

export function Ep7PassionOptions({ userName }: Ep7PassionOptionsProps) {
  const router = useRouter();
  const { setEpisode7Choice, applyKpiDelta, executionActionHours } = useStore();
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);

  const handleNext = () => {
    if (!selected) return;
    const choice = selected;
    setEpisode7Choice(choice);
    const vocHours = executionActionHours["voc_data"] ?? 0;
    const refHours = executionActionHours["ref_benchmark"] ?? 0;
    const res = getEp7Result(choice, vocHours, refHours);
    applyKpiDelta(res.kpi);
    router.push("/simulation?phase=ep7-result");
  };

  return (
    <EpisodeOptions
      title="E7. 길 잃은 열정 - 옵션"
      options={ep7Options.map((opt) => ({
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
