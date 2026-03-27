"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep2AlignOptions, ep2AlignResults } from "@/content/episode2Align";
import EpisodeOptions from "@/components/shared/EpisodeOptions";

interface Ep2AlignOptionsProps {
  userName: string;
}

export function Ep2AlignOptions({ userName }: Ep2AlignOptionsProps) {
  const router = useRouter();
  const { setEpisode2AlignChoice, applyKpiDelta } = useStore();
  const [selected, setSelected] = useState<"A" | "B" | "C" | null>(null);

  const handleNext = () => {
    if (!selected) return;
    const result = ep2AlignResults[selected];
    if (result?.kpi) applyKpiDelta(result.kpi);
    setEpisode2AlignChoice(selected);
    router.push("/simulation?phase=ep2-result");
  };

  return (
    <EpisodeOptions
      title="E2. 유관부서와의 동상이몽 - 옵션 선택"
      options={ep2AlignOptions.map((opt) => ({
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
