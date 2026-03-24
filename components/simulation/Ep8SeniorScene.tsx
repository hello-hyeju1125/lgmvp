"use client";

import { useRouter } from "next/navigation";
import { ep8Scene } from "@/content/episode8";
import { useStore } from "@/store/useStore";

interface Ep8SeniorSceneProps {
  userName: string;
}

export function Ep8SeniorScene({ userName }: Ep8SeniorSceneProps) {
  const router = useRouter();
  const { episode8CoachingText, setEpisode8CoachingText } = useStore();

  const handleSubmit = () => {
    router.push("/simulation?phase=ep8-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">
        {ep8Scene.title} – {ep8Scene.screenSubtitle}
      </h2>

      <section className="space-y-3">
        <p className="text-sm text-[#6B6B6B]">{ep8Scene.situation}</p>
        <p className="text-sm text-[#6B6B6B]">{ep8Scene.afterSituation}</p>
      </section>

      <div className="border border-[#E5E5E5] rounded-xl p-4 space-y-3 bg-[#F9FAFB]">
        <p className="text-xs font-semibold text-[#4A4A4A]">
          {ep8Scene.meetingRequestLabel}
        </p>
        {ep8Scene.dialogue.map((line, i) => (
          <p key={i} className="text-sm text-[#6B6B6B]">
            &ldquo;{line}&rdquo;
          </p>
        ))}
      </div>

      <p className="text-sm font-medium text-[#4A4A4A]">[과제] {ep8Scene.action}</p>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-[#4A4A4A]">
          이민수 책임에게 건넬 코칭 (직접 작성)
        </h3>
        <textarea
          value={episode8CoachingText}
          onChange={(e) => setEpisode8CoachingText(e.target.value)}
          placeholder="예: 민수 책임님의 현장 VOC 경험은 우리 프로젝트에 없어서는 안 될 자산입니다. 기술 용어보다 '고객이 무엇에 불만을 갖는지'를 데이터에서 짚어내는 역할을 맡아 주시면, 개발팀이 그걸 기준으로 AI 로직을 설계할 수 있습니다..."
          className="w-full min-h-[200px] p-4 border border-[#E5E5E5] rounded-xl text-sm text-[#4A4A4A] placeholder:text-[#9CA3AF]"
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[#4A4A4A]">
          다른 참가자가 쓴 코칭 (참고)
        </h3>
        <p className="text-xs text-[#6B6B6B]">
          다른 리더들이 이민수 책임에게 어떤 코칭을 제시했는지 참고해 보세요.
        </p>
        <ul className="space-y-3">
          {ep8Scene.othersCoachingSamples.map((item, i) => (
            <li
              key={i}
              className="border border-[#E5E5E5] rounded-xl p-4 bg-white text-sm text-[#6B6B6B]"
            >
              <p className="font-medium text-[#4A4A4A] text-xs mb-2">{item.name}</p>
              <p className="whitespace-pre-wrap">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A]"
        >
          제출하고 결과 보기
        </button>
      </div>
    </div>
  );
}
