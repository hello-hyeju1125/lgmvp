"use client";

import { useRouter } from "next/navigation";

interface MonitoringSceneProps {
  userName: string;
}

export function MonitoringScene({ userName }: MonitoringSceneProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">감시 및 통제(Monitoring & Controlling) 단계</h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">
        책상 위의 계획이 현실의 변수를 만나는 순간입니다. 끊임없이 발생하는 리스크를 조율하고 플랜 B를 가동하는 리더의 진짜 실력이 드러나는 구간입니다.
      </p>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">
        (해당 단계 콘텐츠는 준비 중입니다. 추후 에피소드가 추가될 예정입니다.)
      </p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/simulation?phase=ep10-scene")}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A]"
        >
          E10. 치명적인 결함 시작
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-xl border border-[#E5E5E5] text-[#6B6B6B] text-sm font-medium hover:bg-[#F5F5F5]"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
