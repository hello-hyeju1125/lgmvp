"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

const INTRO =
  "치열했던 기획(Planning) 단계, 무사히 넘기셨나요? 엑셀 칸을 채우는 것보다 어려운 것이 바로 '사람의 마음을 셋팅하는 일'이죠. 본격적인 실행을 앞둔 리더님을 위해, 현업 선배 PM들이 현장에서 직접 부딪히며 깨달았던 경험담을 공유합니다.";

const STORY_1 = {
  title: "갈등 회피를 위한 기계적 업무 분할(1/N), 결국에는 품질 저하로 이어집니다.",
  body:
    "조직 내 이견을 봉합하기 위해 가장 쉽게 빠지는 함정이 바로 업무를 인원수대로 똑같이 나누는 '기계적 분할'입니다. 특히 데이터나 개발 업무는 일관된 품질 기준(Quality Standard)이 생명인데, 이를 여러 명이 쪼개어 작업하게 되면 추후 통합 단계에서 필연적으로 정합성 오류와 재작업이 발생합니다. 순간의 마찰이 두려워 명확한 R&R 원칙을 타협하지 마십시오. 가장 적합한 역량을 가진 담당자를 배정하고, 대신 이 업무가 그 팀원의 전문성 향상에 어떤 기여를 할 수 있는지 논리적으로 설득하는 데 리더의 시간과 에너지를 써야 합니다.",
  attribution: "(LG전자 B책임님 인터뷰 중)",
};

const STORY_2 = {
  title: "모두를 만족시키려는 '착한 리더'의 함정, 프로젝트의 방향성을 잃게 합니다.",
  body:
    "기획 회의에서 유관부서의 입장을 무조건 수용하며 마찰을 피하려다 보면, 프로젝트의 범위가 통제할 수 없이 늘어나는 오류를 범하게 됩니다. 리더는 머릿속에 프로젝트의 거시적인 방향성과 큰 그림을 쥐고, 핵심 목표에 부합하지 않는 요구사항은 단호하게 거절하며 건설적인 논쟁을 이끌어내야 합니다. 물론 각 부서의 팽팽한 이기주의 사이에서 악역을 자처하며 의견을 조율하는 과정이 당장은 벅차고 고통스러울 수 있습니다. 하지만 돌이켜보면, 그 치열했던 논의의 늪을 건너며 저 스스로도 프로젝트 전체를 관통하는 시각을 갖출 수 있게 된, 한 단계 도약할 수 있었던 값진 성장의 시간이었습니다.",
  attribution: "(LG 유플러스 A책임님 인터뷰 중)",
};

interface PlanSurvivalProps {
  userName: string;
}

export function PlanSurvival({ userName }: PlanSurvivalProps) {
  const router = useRouter();
  const { nickname } = useStore();
  const [experience, setExperience] = useState("");

  const displayName = nickname || userName || "리더";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">기획 단계 선배 PM의 노하우</h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{INTRO}&quot;</p>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
        <p className="font-medium text-[#4A4A4A] text-sm">Story 1. {STORY_1.title}</p>
        <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{STORY_1.body}&quot;</p>
        <p className="text-xs text-[#6B6B6B] italic">{STORY_1.attribution}</p>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
        <p className="font-medium text-[#4A4A4A] text-sm">Story 2. {STORY_2.title}</p>
        <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{STORY_2.body}&quot;</p>
        <p className="text-xs text-[#6B6B6B] italic">{STORY_2.attribution}</p>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="font-medium text-[#4A4A4A] text-sm mb-2">
          혹시 {displayName}님의 경험담도 공유해주실 수 있나요?
        </p>
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="느낀점, 경험담 작성 칸"
          rows={4}
          className="w-full rounded-lg border border-[#E5E5E5] p-3 text-sm text-[#4A4A4A] placeholder:text-[#9CA3AF] focus:border-[#6B6B6B] focus:outline-none"
        />
      </div>

    </div>
  );
}
