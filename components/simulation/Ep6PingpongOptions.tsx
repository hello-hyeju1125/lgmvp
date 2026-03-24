"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  ep6Block1Options,
  ep6Block2Options,
  ep6Block3Options,
  ep6Block4Options,
  getEp6Result,
} from "@/content/episode6";

interface Ep6PingpongOptionsProps {
  userName: string;
}

export function Ep6PingpongOptions({ userName }: Ep6PingpongOptionsProps) {
  const router = useRouter();
  const { setEpisode6Blocks, applyKpiDelta } = useStore();
  const [b1, setB1] = useState("B");
  const [b2, setB2] = useState("E");
  const [b3, setB3] = useState("D");
  const [b4, setB4] = useState("B");

  const handleSubmit = () => {
    setEpisode6Blocks({ block1: b1, block2: b2, block3: b3, block4: b4 });
    const res = getEp6Result(b4, b2);
    applyKpiDelta(res.kpi);
    router.push("/simulation?phase=ep6-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">E6. 커뮤니케이션 전략 조합</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-[#4A4A4A] mb-2">블록 1: 누구에게 연락하시겠습니까?</p>
          <select value={b1} onChange={(e) => setB1(e.target.value)} className="w-full p-2 border border-[#E5E5E5] rounded-lg text-sm">
            {ep6Block1Options.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-sm font-medium text-[#4A4A4A] mb-2">블록 2: 소통 채널</p>
          <select value={b2} onChange={(e) => setB2(e.target.value)} className="w-full p-2 border border-[#E5E5E5] rounded-lg text-sm">
            {ep6Block2Options.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-sm font-medium text-[#4A4A4A] mb-2">블록 3: 소통 톤</p>
          <select value={b3} onChange={(e) => setB3(e.target.value)} className="w-full p-2 border border-[#E5E5E5] rounded-lg text-sm">
            {ep6Block3Options.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-sm font-medium text-[#4A4A4A] mb-2">블록 4: 핵심 메시지 (결과 결정)</p>
          <select value={b4} onChange={(e) => setB4(e.target.value)} className="w-full p-2 border border-[#E5E5E5] rounded-lg text-sm">
            {ep6Block4Options.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A]"
        >
          전송하기
        </button>
      </div>
    </div>
  );
}
