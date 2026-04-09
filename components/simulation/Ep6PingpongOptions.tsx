"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  ep6Block1Options,
  ep6Block2Options,
  ep6Block3Options,
  getEp6Result,
} from "@/content/episode6";
import CompositeEpisodeOptions from "@/components/shared/CompositeEpisodeOptions";

interface Ep6PingpongOptionsProps {
  userName: string;
}

export function Ep6PingpongOptions({ userName }: Ep6PingpongOptionsProps) {
  const router = useRouter();
  const { setEpisode6Blocks, applyKpiDelta } = useStore();

  const handleSubmit = (selected: Record<string, string>) => {
    const b1 = selected.block1 ?? "";
    const b2 = selected.block2 ?? "";
    const b3 = selected.block3 ?? "";
    setEpisode6Blocks({ block1: b1, block2: b2, block3: b3, block4: "" });
    const res = getEp6Result(b1, b2, b3);
    applyKpiDelta(res.kpi);
    router.push("/simulation?phase=ep6-result");
  };

  return (
    <CompositeEpisodeOptions
      title="E6. 커뮤니케이션 전략 조합"
      onSubmit={handleSubmit}
      blocks={[
        {
          id: "block1",
          title: "블록 1: 소통 대상 - 누구에게 연락하시겠습니까?",
          options: ep6Block1Options.map((o) => ({ id: o.id, label: `${o.id}. ${o.headline}` })),
        },
        {
          id: "block2",
          title: "블록 2: 소통 채널",
          options: ep6Block2Options.map((o) => ({ id: o.id, label: `${o.id}. ${o.headline}` })),
        },
        {
          id: "block3",
          title: "블록 3: 소통 톤",
          options: ep6Block3Options.map((o) => ({ id: o.id, label: `${o.id}. ${o.headline}` })),
        },
      ]}
    />
  );
}
