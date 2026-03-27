"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep4Options, getEp4Result } from "@/content/episode4";
import EpisodeOptions from "@/components/shared/EpisodeOptions";

interface Ep4RoleOptionsProps {
  userName: string;
}

export function Ep4RoleOptions({ userName }: Ep4RoleOptionsProps) {
  const router = useRouter();
  const { setEpisode4Choice, applyKpiDelta, initiationActionHours } = useStore();
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | "E" | null>(null);

  const handleNext = () => {
    if (!selected) return;
    const choice = selected;
    setEpisode4Choice(choice);
    const res = getEp4Result(choice, initiationActionHours["team_profile"] ?? 0);
    applyKpiDelta(res.kpi);
    router.push("/simulation?phase=ep4-result");
  };

  return (
    <EpisodeOptions
      title="E4. 이게 왜 제 일입니까? - 옵션"
      options={ep4Options.map((opt) => ({
        id: opt.id,
        label: `옵션 ${opt.id}. ${opt.title}`,
        description: opt.summary,
      }))}
      selectedOption={selected}
      onSelect={(optionId) => setSelected(optionId as "A" | "B" | "C" | "D" | "E")}
      onNext={handleNext}
    />
  );
}
