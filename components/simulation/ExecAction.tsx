"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  executionActions,
  executionScreenCopy,
  EXECUTION_TOTAL_HOURS,
  EXECUTION_MIN_PER_ACTION,
  EXECUTION_MAX_PER_ACTION,
  getExecutionKpiDelta,
} from "@/content/executionActions";

interface ExecActionProps {
  userName: string;
}

const defaultHours = (): Record<string, number> => {
  const h: Record<string, number> = {};
  executionActions.forEach((a) => (h[a.id] = 8));
  return h;
};

const SECTION_BREAKS = [
  { afterIndex: 3, label: executionScreenCopy.section2 },
  { afterIndex: 6, label: executionScreenCopy.section3 },
];

export function ExecAction({ userName }: ExecActionProps) {
  const router = useRouter();
  const { setExecutionActionHours, applyKpiDelta } = useStore();
  const [localHours, setLocalHours] = useState<Record<string, number>>(defaultHours);

  const getHours = (id: string) => localHours[id] ?? 8;
  const total = executionActions.reduce((s, a) => s + getHours(a.id), 0);
  const isValid = total === EXECUTION_TOTAL_HOURS;

  const handleRun = () => {
    const hours: Record<string, number> = {};
    executionActions.forEach((a) => {
      hours[a.id] = getHours(a.id);
    });
    setExecutionActionHours(hours);
    applyKpiDelta(getExecutionKpiDelta(hours));
    router.push("/simulation?phase=exec-board");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">실행 단계: Action Items</h2>
      <p className="text-sm font-medium text-[#4A4A4A]">본격적으로 업무를 실행할 시간입니다.</p>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{executionScreenCopy.intro1}&quot;</p>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{executionScreenCopy.intro2}&quot;</p>
      <p className="text-sm text-[#6B6B6B]">{executionScreenCopy.intro3}</p>
      <p className="text-xs text-[#6B6B6B] italic">{executionScreenCopy.sprintGlossary}</p>

      <p className="text-sm font-medium text-[#4A4A4A]">{executionScreenCopy.section1}</p>

      <div className="space-y-4">
        {executionActions.map((action, index) => {
          const actionNumber = index + 1;
          const showSection2 = SECTION_BREAKS[0].afterIndex === index;
          const showSection3 = SECTION_BREAKS[1].afterIndex === index;
          return (
            <div key={action.id}>
              {showSection2 && (
                <p className="text-sm font-medium text-[#4A4A4A] mt-6 mb-2">{SECTION_BREAKS[0].label}</p>
              )}
              {showSection3 && (
                <p className="text-sm font-medium text-[#4A4A4A] mt-6 mb-2">{SECTION_BREAKS[1].label}</p>
              )}
              <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F9FAFB]">
                <p className="font-medium text-[#4A4A4A] text-sm">
                  액션 {actionNumber}: {action.title}
                </p>
                <p className="text-xs text-[#6B6B6B] mt-1">설명: {action.description}</p>
                {action.glossary && (
                  <p className="text-xs text-[#6B6B6B] mt-2 italic">o {action.glossary}</p>
                )}
                <p className="text-xs text-[#6B6B6B] mt-1">o PMBOK 습득 지식: {action.pmbok}</p>
                <p className="text-xs text-[#6B6B6B] mt-1">o 선택 시 영향: [{action.effect.join("] [")}]</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-[#6B6B6B]">투입 시간:</span>
                  <input
                    type="range"
                    min={EXECUTION_MIN_PER_ACTION}
                    max={EXECUTION_MAX_PER_ACTION}
                    step={1}
                    value={getHours(action.id)}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setLocalHours((prev) => ({ ...prev, [action.id]: v }));
                    }}
                    className="flex-1 h-2 rounded-full appearance-none bg-[#E5E5E5] accent-[#6B6B6B]"
                  />
                  <span className="text-sm font-medium text-[#4A4A4A] w-10">{getHours(action.id)}h</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className={`text-sm font-medium ${isValid ? "text-[#4A4A4A]" : "text-red-600"}`}>
        총 배분 시간: {total}시간 / {EXECUTION_TOTAL_HOURS}시간
        {!isValid && " (합계 80시간이 되어야 실행 가능)"}
      </p>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!isValid}
          onClick={handleRun}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          실행하기 (PM 보드 세팅으로)
        </button>
      </div>
    </div>
  );
}
