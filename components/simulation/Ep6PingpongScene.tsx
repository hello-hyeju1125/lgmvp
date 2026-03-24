"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  ep6Scene,
  ep6Block1Options,
  ep6Block2Options,
  ep6Block3Options,
  ep6Block4Options,
  getEp6Result,
} from "@/content/episode6";

interface Ep6PingpongSceneProps {
  userName: string;
}

export function Ep6PingpongScene({ userName }: Ep6PingpongSceneProps) {
  const router = useRouter();
  const { nickname, setEpisode6Blocks, applyKpiDelta } = useStore();
  const [b1, setB1] = useState("B");
  const [b2, setB2] = useState("E");
  const [b3, setB3] = useState("D");
  const [b4, setB4] = useState("B");

  const displayName = nickname || userName || "PM";
  const commentsWithName = ep6Scene.comments.map((line) =>
    line.replace("@User_Name", displayName)
  );

  const handleSubmit = () => {
    setEpisode6Blocks({ block1: b1, block2: b2, block3: b3, block4: b4 });
    const res = getEp6Result(b4, b2);
    applyKpiDelta(res.kpi);
    router.push("/simulation?phase=ep6-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">{ep6Scene.title}</h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">[상황] {ep6Scene.situation}</p>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#F9FAFB] p-4 space-y-3">
        <p className="text-xs font-semibold text-[#4A4A4A]">(프로젝트 보드 댓글 히스토리)</p>
        {commentsWithName.map((line, i) => (
          <p key={i} className="text-xs text-[#6B6B6B] leading-relaxed">
            {line}
          </p>
        ))}
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="text-xs font-semibold text-[#4A4A4A] mb-2">[시스템 프롬프트: 커뮤니케이션 블록 조립기]</p>
        <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{ep6Scene.systemPrompt}&quot;</p>
      </div>

      <p className="text-sm font-medium text-[#4A4A4A]">[블록 1: 누구에게 연락하시겠습니까?]</p>
      <div className="flex flex-wrap gap-2">
        {ep6Block1Options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setB1(o.id)}
            className={`rounded-xl border-2 px-4 py-2.5 text-left text-sm transition-colors ${
              b1 === o.id ? "border-[#6B6B6B] bg-[#F9FAFB]" : "border-[#E5E5E5] bg-white hover:border-[#6B6B6B]/50"
            }`}
          >
            <span className="font-medium text-[#4A4A4A]">[ 블록 1-{o.id} ]</span>
            <span className="ml-1 text-[#6B6B6B]">➔ {o.label}</span>
          </button>
        ))}
      </div>

      <p className="text-sm font-medium text-[#4A4A4A]">[블록 2: 소통 채널(Channel) - 어디서 이야기하시겠습니까?]</p>
      <div className="space-y-2">
        {ep6Block2Options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setB2(o.id)}
            className={`w-full rounded-xl border-2 px-4 py-2.5 text-left text-sm transition-colors ${
              b2 === o.id ? "border-[#6B6B6B] bg-[#F9FAFB]" : "border-[#E5E5E5] bg-white hover:border-[#6B6B6B]/50"
            }`}
          >
            <span className="font-medium text-[#4A4A4A]">[ 블록 2-{o.id} ]</span>
            <span className="ml-1 text-[#6B6B6B]">➔ {o.label}</span>
          </button>
        ))}
      </div>

      <p className="text-sm font-medium text-[#4A4A4A]">[블록 3: 소통 톤(Tone) - 어떤 태도로 접근하시겠습니까?]</p>
      <div className="flex flex-wrap gap-2">
        {ep6Block3Options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setB3(o.id)}
            className={`rounded-xl border-2 px-4 py-2.5 text-left text-sm transition-colors ${
              b3 === o.id ? "border-[#6B6B6B] bg-[#F9FAFB]" : "border-[#E5E5E5] bg-white hover:border-[#6B6B6B]/50"
            }`}
          >
            <span className="font-medium text-[#4A4A4A]">[ 블록 3-{o.id} ]</span>
            <span className="ml-1 text-[#6B6B6B]">➔ {o.label}</span>
          </button>
        ))}
      </div>

      <p className="text-sm font-medium text-[#4A4A4A]">[블록 4: 소통 내용(Message) - 가장 핵심이 되는 지시/요청 사항은 무엇입니까?]</p>
      <div className="space-y-2">
        {ep6Block4Options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setB4(o.id)}
            className={`w-full rounded-xl border-2 px-4 py-2.5 text-left text-sm transition-colors ${
              b4 === o.id ? "border-[#6B6B6B] bg-[#F9FAFB]" : "border-[#E5E5E5] bg-white hover:border-[#6B6B6B]/50"
            }`}
          >
            <span className="font-medium text-[#4A4A4A]">[ 블록 4-{o.id} ]</span>
            <span className="ml-1 text-[#6B6B6B]">➔ {o.label}</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-[#6B6B6B]">(유저는 각 항목에서 하나의 블록을 선택하여 문장을 완성한 뒤, [전송하기] 버튼을 누릅니다.)</p>

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
