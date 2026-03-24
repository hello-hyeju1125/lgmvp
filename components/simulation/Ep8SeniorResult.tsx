"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

interface Ep8SeniorResultProps {
  userName: string;
}

export function Ep8SeniorResult({ userName }: Ep8SeniorResultProps) {
  const router = useRouter();
  const { episode8CoachingText } = useStore();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">E8. 결과</h2>
      <p className="text-sm font-medium text-[#4A4A4A]">나의 코칭 메시지</p>
      <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F9FAFB]">
        <p className="text-sm text-[#6B6B6B] whitespace-pre-wrap">{episode8CoachingText || "(작성된 내용 없음)"}</p>
      </div>
      <div className="p-4 rounded-xl border border-[#E5E5E5]">
        <p className="font-medium text-[#4A4A4A] text-sm mb-2">챗봇 선배 PM의 조언</p>
        <p className="text-sm text-[#6B6B6B]">시니어 팀원에게는 '기술 부재'가 아니라 '도메인 전문성'을 강조하고, 그가 할 수 있는 명확한 역할(예: VOC 해석, 현장 기준 정의)을 제시하는 것이 핵심입니다. 리더님이 직접 작성하신 코칭이 이민수 책임에게 든든한 나침반이 되었을 것입니다.</p>
      </div>
    </div>
  );
}
