"use client";

import { useStore } from "@/store/useStore";
import {
  getEp6Result,
} from "@/content/episode6";
import CompositeEpisodeResult from "@/components/shared/CompositeEpisodeResult";

interface Ep6PingpongResultProps {
  userName: string;
}

export function Ep6PingpongResult({ userName }: Ep6PingpongResultProps) {
  const { episode6Blocks } = useStore();
  const b = episode6Blocks ?? { block1: "B", block2: "E", block3: "D", block4: "B" };

  const result = getEp6Result(b.block4, b.block2);

  return (
    <CompositeEpisodeResult
      title="E6. 핑퐁 게임을 멈춰라! - 결과"
      endingTitle={result.endingTitle}
      body={result.text}
      kpiLabels={result.kpiLabels}
    />
  );
}
