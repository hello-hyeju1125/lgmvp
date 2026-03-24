"use client";

import { useStore } from "@/store/useStore";
import { ep2AlignScene, ep2AlignOptions } from "@/content/episode2Align";

interface Ep2AlignSceneProps {
  userName: string;
}

export function Ep2AlignScene({ userName: _userName }: Ep2AlignSceneProps) {
  const { episode2AlignChoice, setEpisode2AlignChoice } = useStore();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-black/90 sm:text-3xl">{ep2AlignScene.title}</h2>
      <p className="text-[16px] leading-[1.85] text-black/75">
        <span className="font-extrabold text-black/85">[Situation]</span> {ep2AlignScene.situation}
      </p>

      <div className="rounded-2xl border border-black/10 bg-gray-50 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div className="border-l-4 border-[#E4003F] pl-4">
          <p className="text-[13px] font-extrabold text-black/85">회의 중</p>
          {ep2AlignScene.dialogue.map((line, i) => (
            <p key={i} className="mt-2 text-[16px] leading-[1.85] text-black/80">
              {line}
            </p>
          ))}
        </div>
      </div>

      <p className="mt-12 text-[18px] font-extrabold leading-[1.85] text-black/90">
        <span className="text-black/90">[Action]</span> {ep2AlignScene.action}
      </p>

      <div className="space-y-3">
        {ep2AlignOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setEpisode2AlignChoice(opt.id)}
            className={`w-full cursor-pointer rounded-2xl border-2 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${
              episode2AlignChoice === opt.id
                ? "border-[#E4003F] shadow-[0_14px_50px_rgba(228,0,63,0.14)]"
                : "border-black/10 hover:border-[#E4003F]"
            }`}
          >
            <p className="text-[18px] font-bold leading-tight text-gray-900">
              옵션 {opt.id}. {opt.title}
            </p>
            <p className="mt-2 text-[16px] leading-[1.85] text-gray-600">{opt.summary}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
