"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

interface Ep8SeniorInputProps {
  userName: string;
}

export function Ep8SeniorInput({ userName }: Ep8SeniorInputProps) {
  const router = useRouter();
  const { episode8CoachingText, setEpisode8CoachingText } = useStore();

  const handleSubmit = () => {
    router.push("/simulation?phase=ep8-result");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">E8. 이민수 책임에게 건넬 코칭</h2>
      <p className="text-sm text-[#6B6B6B]">기술의 장벽 앞에서 위축되었지만, 누구보다 팀에 기여하고 싶어 하는 이 책임님에게 당신만의 조언과 역할 제안을 작성해 주세요.</p>
      <textarea
        value={episode8CoachingText}
        onChange={(e) => setEpisode8CoachingText(e.target.value)}
        placeholder="예: 민수 책임님의 현장 VOC 경험은 우리 프로젝트에 없어서는 안 될 자산입니다. 기술 용어보다 '고객이 무엇에 불만을 갖는지'를 데이터에서 짚어내는 역할을 맡아 주시면, 개발팀이 그걸 기준으로 AI 로직을 설계할 수 있습니다..."
        className="w-full min-h-[200px] p-4 border border-[#E5E5E5] rounded-xl text-sm text-[#4A4A4A] placeholder:text-[#9CA3AF]"
      />
      <div className="flex justify-end">
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
