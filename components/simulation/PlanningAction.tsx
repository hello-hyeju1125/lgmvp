"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  planningActions,
  planningScreenCopy,
  PLANNING_TOTAL_HOURS,
  PLANNING_STEP_HOURS,
  getPlanningKpiDelta,
} from "@/content/planningActions";

interface PlanningActionProps {
  userName: string;
}

export function PlanningAction({ userName }: PlanningActionProps) {
  const router = useRouter();
  const { planningActionHours, setPlanningActionHours, applyKpiDelta, kpi, setKpiBeforePlanning } = useStore();

  const getHours = (id: string) => planningActionHours[id] ?? 5;
  const setStep = (id: string, stepIndex: number) => {
    const h = PLANNING_STEP_HOURS[stepIndex];
    setPlanningActionHours({ ...planningActionHours, [id]: h });
  };

  const total = planningActions.reduce((s, a) => s + getHours(a.id), 0);
  const isValid = total === PLANNING_TOTAL_HOURS;

  const handleRun = () => {
    const hours: Record<string, number> = {};
    planningActions.forEach((a) => {
      hours[a.id] = getHours(a.id);
    });
    setPlanningActionHours(hours);
    setKpiBeforePlanning({ ...kpi });
    const delta = getPlanningKpiDelta(hours);
    applyKpiDelta(delta);
    router.push("/simulation?phase=planning-d1");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <h1 className="text-xl font-bold text-[#252423]">항해 지도를 그릴 시간입니다.</h1>

      <p className="text-sm text-[#4A4A4A]">{planningScreenCopy.intro1}</p>
      <p className="text-sm text-[#4A4A4A]">{planningScreenCopy.intro2}</p>

      <h2 className="text-base font-semibold text-[#252423]">Action Items</h2>

      <div className="space-y-4">
        {planningActions.map((action) => (
          <div key={action.id} className="rounded-xl border border-[#E5E5E5] bg-white p-4">
            <p className="font-medium text-[#252423]">액션 {planningActions.indexOf(action) + 1}. {action.title}</p>
            <p className="mt-1 text-sm text-[#6B6B6B]">{action.description}</p>
            <p className="mt-2 text-xs text-[#605E5C]">
              <span className="font-medium">PMBOK 습득 지식:</span> {action.pmbok}
            </p>
            <p className="mt-1 text-xs text-[#605E5C]">
              <span className="font-medium">선택 시 영향:</span> [{action.effect.join("] [")}]
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-[#605E5C]">투입 시간:</span>
              {PLANNING_STEP_HOURS.map((h, i) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setStep(action.id, i)}
                  className={`rounded-lg border px-2 py-1 text-xs font-medium transition-colors ${
                    getHours(action.id) === h
                      ? "border-[#464775] bg-[#E8EBFA] text-[#464775]"
                      : "border-[#E5E5E5] bg-white text-[#6B6B6B] hover:bg-[#F3F2F1]"
                  }`}
                >
                  {i + 1}단계 ({h}시간)
                </button>
              ))}
              <span className="ml-1 text-sm font-medium text-[#252423]">{getHours(action.id)}시간</span>
            </div>
          </div>
        ))}
      </div>

      <p className={`text-sm font-medium ${isValid ? "text-[#252423]" : "text-red-600"}`}>
        총 배분 시간: {total}시간 / {PLANNING_TOTAL_HOURS}시간
        {!isValid && " (합계 40시간이 되어야 실행 가능)"}
      </p>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!isValid}
          onClick={handleRun}
          className="rounded-lg bg-[#1a1a1a] px-6 py-2.5 text-[15px] font-medium text-white shadow-md hover:bg-[#2d2d2d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          실행
        </button>
      </div>
    </div>
  );
}
