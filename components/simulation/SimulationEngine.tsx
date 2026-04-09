"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useStore } from "@/store/useStore";
import { KpiGauges } from "@/components/KpiGauges";
import {
  initialKpi,
  scenarioSteps,
  toKpiDelta,
} from "@/content/simulationData";
import type { SimEffects } from "@/content/simulationData";
import { AlertTriangle, Check } from "lucide-react";
import {
  SIM_COLUMN_GUTTER,
  SIM_COLUMN_MAX_INNER,
} from "@/lib/simulationLayout";

function stageToPhaseClass(stage: string): string {
  if (stage === "기획") return "planning-accent-phase";
  if (stage === "실행") return "execution-accent-phase";
  if (stage === "감시 및 통제") return "monitoring-accent-phase";
  return "";
}

function CardSelectIcon({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <span
        className="card-select-icon card-select-icon--selected flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[color:var(--sim-accent)] text-[color:var(--sim-accent-cta-text)] shadow-[2px_2px_0_#111]"
        aria-hidden
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span
      className="card-select-icon card-select-icon--idle h-6 w-6 shrink-0 rounded-full border-2 border-black bg-white"
      aria-hidden
    />
  );
}

interface PersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (fn: () => void) => () => void;
}

export default function SimulationEngine() {
  const applyKpiDelta = useStore((s) => s.applyKpiDelta);
  const kpi = useStore((s) => s.kpi);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const apply = () => {
      useStore.setState({ kpi: { ...initialKpi } });
      setInitialized(true);
    };

    const persistApi = (
      useStore as unknown as { persist: PersistApi }
    ).persist;

    if (persistApi.hasHydrated()) {
      apply();
    } else {
      const unsub = persistApi.onFinishHydration(() => {
        apply();
      });
      return () => unsub();
    }
  }, []);

  const isFinished = currentStep >= scenarioSteps.length;
  const stepData = !isFinished ? scenarioSteps[currentStep] : null;

  const toggleActionItem = useCallback(
    (choiceId: string, maxSelect: number) => {
      setSelectedIds((prev) => {
        if (prev.includes(choiceId))
          return prev.filter((id) => id !== choiceId);
        if (prev.length >= maxSelect) return prev;
        return [...prev, choiceId];
      });
    },
    [],
  );

  const applyEffects = useCallback(
    (effects: SimEffects) => {
      applyKpiDelta(toKpiDelta(effects));
    },
    [applyKpiDelta],
  );

  const moveToNextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
    setSelectedIds([]);
  }, []);

  const handleActionSubmit = useCallback(() => {
    if (!stepData || stepData.type !== "action_item") return;
    if (selectedIds.length !== (stepData.maxSelect ?? 2)) return;
    stepData.choices
      .filter((c) => selectedIds.includes(c.id))
      .forEach((c) => applyEffects(c.effects));
    moveToNextStep();
  }, [stepData, selectedIds, applyEffects, moveToNextStep]);

  const handleEventSelect = useCallback(
    (effects: SimEffects) => {
      applyEffects(effects);
      moveToNextStep();
    },
    [applyEffects, moveToNextStep],
  );

  const phaseClass = useMemo(() => {
    if (!stepData) return "";
    return stageToPhaseClass(stepData.stage);
  }, [stepData]);

  const progressPercent = useMemo(
    () => Math.round(((currentStep + 1) / scenarioSteps.length) * 100),
    [currentStep],
  );

  if (!initialized) return null;

  if (isFinished) {
    return (
      <main className="simulation-flat initiation-action-phase flex min-h-screen flex-col bg-[#F6F7F9]">
        <header className="simulation-hud sticky top-0 z-50 bg-white font-sans">
          <KpiGauges />
        </header>
        <div className={`w-full flex-1 ${SIM_COLUMN_GUTTER}`}>
          <div
            className={`initiation-content-shell py-8 sm:py-10 ${SIM_COLUMN_MAX_INNER}`}
          >
            <div className="initiation-action-page flex flex-col items-center space-y-10">
              <div className="flex w-full justify-center">
                <p className="initiation-brief-badge w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]">
                  시뮬레이션 종료
                </p>
              </div>
              <p className="text-center font-sans text-[18px] font-medium leading-relaxed text-black/70 sm:text-[20px]">
                모든 의사결정을 마쳤습니다. 아래에서 최종 KPI 결과를
                확인하세요.
              </p>
              <div className="grid w-full max-w-lg grid-cols-2 gap-4">
                {(
                  [
                    ["산출물 품질", kpi.quality, "quality"],
                    ["일정 준수", kpi.delivery, "delivery"],
                    ["팀 몰입도", kpi.teamEngagement, "teamEngagement"],
                    ["이해관계자 조율", kpi.stakeholderAlignment, "stakeholderAlignment"],
                  ] as const
                ).map(([label, value, field]) => {
                  const critical = value <= 40;
                  return (
                    <div
                      key={label}
                      className={`action-card-wrap action-card-idle rounded-xl p-4 ${critical ? "kpi-critical-card" : ""}`}
                    >
                      <p className={`font-sans text-[12px] font-bold ${critical ? "kpi-critical-text" : "text-black/50"}`}>
                        {critical && <AlertTriangle className="kpi-critical-icon mr-1 inline h-3.5 w-3.5" strokeWidth={2.5} />}
                        {label}
                      </p>
                      <p className={`font-mono text-[28px] font-black tabular-nums ${critical ? "kpi-critical-text" : "text-black"}`}>
                        {Math.round(value)}%
                      </p>
                    </div>
                  );
                })}
                {(() => {
                  const energyCritical = kpi.leaderEnergy <= 20;
                  return (
                    <div className={`action-card-wrap action-card-idle col-span-2 rounded-xl p-4 ${energyCritical ? "kpi-critical-card" : ""}`}>
                      <p className={`font-sans text-[12px] font-bold ${energyCritical ? "kpi-critical-text" : "text-black/50"}`}>
                        {energyCritical && <AlertTriangle className="kpi-critical-icon mr-1 inline h-3.5 w-3.5" strokeWidth={2.5} />}
                        리더 에너지
                      </p>
                      <p className={`font-mono text-[28px] font-black tabular-nums ${energyCritical ? "kpi-critical-text" : "text-black"}`}>
                        {Math.round(kpi.leaderEnergy)}%
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const maxSelect = stepData!.maxSelect ?? 1;

  return (
    <main
      className={`simulation-flat initiation-action-phase flex min-h-screen flex-col bg-[#F6F7F9] ${phaseClass}`}
    >
      <header className="simulation-hud sticky top-0 z-50 bg-white font-sans">
        <KpiGauges />
      </header>

      <div className={`w-full flex-1 ${SIM_COLUMN_GUTTER}`}>
        <div
          className={`initiation-content-shell py-8 sm:py-10 ${SIM_COLUMN_MAX_INNER}`}
        >
          <div className="initiation-action-page flex w-full flex-col">
            {/* Stage + Title badge */}
            <div className="mb-8 flex justify-center sm:mb-10">
              <p className="initiation-brief-badge w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]">
                [{stepData!.stage} 단계] {stepData!.title}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="mb-8 flex items-center justify-center gap-3 sm:mb-10">
              <span className="font-sans text-[12px] font-bold text-black/40">
                Step {currentStep + 1} / {scenarioSteps.length}
              </span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[color:var(--sim-accent)] transition-[width] duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {stepData!.type === "action_item" ? (
              <>
                {/* Instruction */}
                <p className="initiation-instruction-line mb-12 mt-2 text-center sm:mb-16">
                  <span className="inline-block max-w-[min(100%,68ch)]">
                    가용한 리소스를 고려하여{" "}
                    <span className="font-extrabold text-[#2563eb]">
                      {maxSelect}개
                    </span>
                    의 아이템을 선택하세요.
                  </span>
                </p>

                {/* Action cards */}
                <div className="flex flex-col gap-3.5">
                  {stepData!.choices.map((choice) => {
                    const isSelected = selectedIds.includes(choice.id);
                    const isDisabled =
                      !isSelected && selectedIds.length >= maxSelect;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => toggleActionItem(choice.id, maxSelect)}
                        disabled={isDisabled}
                        className={`action-card-wrap w-full text-left transition-transform ${
                          isSelected
                            ? "action-card-selected"
                            : isDisabled
                              ? "action-card-disabled cursor-not-allowed opacity-45 grayscale"
                              : "action-card-idle hover:translate-x-px hover:translate-y-px"
                        }`}
                      >
                        <div className="action-card-body">
                          <div className="flex gap-3 sm:gap-4">
                            <CardSelectIcon selected={isSelected} />
                            <div className="min-w-0 flex-1">
                              <h3 className="action-card-title">
                                {choice.text}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Submit button */}
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    disabled={selectedIds.length !== maxSelect}
                    onClick={handleActionSubmit}
                    className="ds-btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    선택 완료 ({selectedIds.length}/{maxSelect})
                  </button>
                </div>

                {/* Footer chips showing selected items */}
                {selectedIds.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    {stepData!.choices
                      .filter((c) => selectedIds.includes(c.id))
                      .map((c) => (
                        <span
                          key={c.id}
                          className="inline-flex max-w-[min(100%,220px)] items-center gap-1.5 rounded-[10px] border-2 border-black bg-[color:var(--sim-accent)] px-3 py-2 font-sans text-[12px] font-extrabold text-[color:var(--sim-accent-cta-text)] shadow-[2px_2px_0_#111111] sm:text-[13px]"
                        >
                          <span aria-hidden className="neo-no-bg text-white">
                            ✓
                          </span>
                          <span className="neo-no-bg min-w-0 truncate">
                            {c.text.length > 22
                              ? `${c.text.slice(0, 22)}…`
                              : c.text}
                          </span>
                        </span>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Event question prompt */}
                <div className="mb-10 text-center sm:mb-12">
                  <p className="mb-5 font-sans text-[56px] font-black leading-none text-black sm:mb-6 sm:text-[72px]">
                    Q.
                  </p>
                  <p className="mx-auto max-w-[min(100%,40rem)] font-sans text-[18px] font-medium leading-relaxed text-[#111] sm:text-[20px]">
                    리더로서 어떤 결정을 내리시겠습니까?
                  </p>
                </div>

                {/* Event option cards */}
                <div className="flex flex-col gap-3.5">
                  {stepData!.choices.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => handleEventSelect(choice.effects)}
                      className="action-card-wrap action-card-idle w-full text-left transition-transform hover:translate-x-px hover:translate-y-px"
                    >
                      <div className="action-card-body">
                        <div className="flex gap-3 sm:gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="action-card-title">{choice.text}</h3>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
