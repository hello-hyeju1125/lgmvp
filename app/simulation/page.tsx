"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useMemo, useState, useEffect, Suspense } from "react";
import { KpiGauges } from "@/components/KpiGauges";
import { PrevNextNav } from "@/components/common/PrevNextNav";
import { InitiationAction } from "@/components/simulation/InitiationAction";
import { InitiationD1Popup } from "@/components/simulation/InitiationD1Popup";
import { Ep1Scene } from "@/components/simulation/Ep1Scene";
import { Ep1Options } from "@/components/simulation/Ep1Options";
import { Ep1Result } from "@/components/simulation/Ep1Result";
import { Ep2AlignScene } from "@/components/simulation/Ep2AlignScene";
import { Ep2AlignResult } from "@/components/simulation/Ep2AlignResult";
import { Ep2Charter } from "@/components/simulation/Ep2Charter";
import { Ep2Result } from "@/components/simulation/Ep2Result";
import { SurvivalGuideline } from "@/components/simulation/SurvivalGuideline";
import { PlanningAction } from "@/components/simulation/PlanningAction";
import { PlanningD1Popup } from "@/components/simulation/PlanningD1Popup";
import { PlanRecap } from "@/components/simulation/PlanRecap";
import { InitiationRecap } from "@/components/simulation/InitiationRecap";
import { InitiationSeniorTips } from "@/components/simulation/InitiationSeniorTips";
import { InitiationRampup } from "@/components/simulation/InitiationRampup";
import { PlanSurvival } from "@/components/simulation/PlanSurvival";
import { PlanRampup } from "@/components/simulation/PlanRampup";
import { ExecAction } from "@/components/simulation/ExecAction";
import { ExecBoard } from "@/components/simulation/ExecBoard";
import { Ep3TeamScene } from "@/components/simulation/Ep3TeamScene";
import { Ep3TeamOptions } from "@/components/simulation/Ep3TeamOptions";
import { Ep3TeamResult } from "@/components/simulation/Ep3TeamResult";
import { Ep4RoleScene } from "@/components/simulation/Ep4RoleScene";
import { Ep4RoleOptions } from "@/components/simulation/Ep4RoleOptions";
import { Ep4RoleResult } from "@/components/simulation/Ep4RoleResult";
import { Ep5BlueprintScene } from "@/components/simulation/Ep5BlueprintScene";
import { Ep5BlueprintOptions } from "@/components/simulation/Ep5BlueprintOptions";
import { Ep5BlueprintResult } from "@/components/simulation/Ep5BlueprintResult";
import { Ep6PingpongScene } from "@/components/simulation/Ep6PingpongScene";
import { Ep6PingpongOptions } from "@/components/simulation/Ep6PingpongOptions";
import { Ep6PingpongResult } from "@/components/simulation/Ep6PingpongResult";
import { Ep7PassionScene } from "@/components/simulation/Ep7PassionScene";
import { Ep7PassionOptions } from "@/components/simulation/Ep7PassionOptions";
import { Ep7PassionResult } from "@/components/simulation/Ep7PassionResult";
import { Ep8SeniorScene } from "@/components/simulation/Ep8SeniorScene";
import { Ep8SeniorResult } from "@/components/simulation/Ep8SeniorResult";
import { ExecRecap } from "@/components/simulation/ExecRecap";
import { ExecSeniorTips } from "@/components/simulation/ExecSeniorTips";
import { ExecRampup } from "@/components/simulation/ExecRampup";
import { MonitoringScene } from "@/components/simulation/MonitoringScene";
import { RiskRadar } from "@/components/simulation/RiskRadar";
import { Ep10FailureScene } from "@/components/simulation/Ep10FailureScene";
import { Ep10Result } from "@/components/simulation/Ep10Result";
import { MonitoringRecap } from "@/components/simulation/MonitoringRecap";
import { MonitoringSeniorTips } from "@/components/simulation/MonitoringSeniorTips";
import { MonitoringRampup } from "@/components/simulation/MonitoringRampup";
import { ClosingScene } from "@/components/simulation/ClosingScene";
import { ClosingResult } from "@/components/simulation/ClosingResult";
import { initiationActions, INITIATION_TOTAL_HOURS, INITIATION_STEP_HOURS, getInitiationKpiDelta } from "@/content/initiationActions";
import { ep1Options, ep1Results } from "@/content/episode1";
import { ep2AlignOptions, ep2AlignResults } from "@/content/episode2Align";

const VALID_PHASES = [
  "initiation-action",
  "initiation-d1",
  "ep1-scene",
  "ep1-options",
  "ep1-result",
  "ep2-scene",
  "ep2-result",
  "initiation-recap",
  "initiation-senior-tips",
  "initiation-rampup",
  "ep3-charter",
  "ep3-result",
  "ep3-survival",
  "plan-action",
  "planning-d1",
  "ep3-scene",
  "ep3-options",
  "ep3-team-result",
  "ep4-scene",
  "ep4-options",
  "ep4-result",
  "ep5-scene",
  "ep5-options",
  "ep5-result",
  "plan-recap",
  "plan-survival",
  "plan-rampup",
  "exec-action",
  "exec-board",
  "ep6-scene",
  "ep6-options",
  "ep6-result",
  "ep7-scene",
  "ep7-options",
  "ep7-result",
  "ep8-scene",
  "ep8-input",
  "ep8-result",
  "exec-recap",
  "exec-senior-tips",
  "exec-rampup",
  "risk-radar",
  "monitoring-scene",
  "ep10-scene",
  "ep10-result",
  "monitoring-recap",
  "monitoring-senior-tips",
  "monitoring-rampup",
  "closing-scene",
  "closing-result",
];

const PROCESS_STEPS = ["착수", "기획", "실행", "감시/통제", "종료"] as const;
type ProcessStep = (typeof PROCESS_STEPS)[number];

function getProcessStep(phase: string): ProcessStep {
  if (phase.startsWith("initiation")) return "착수";
  if (phase.startsWith("plan") || phase.startsWith("planning")) return "기획";
  if (phase.startsWith("exec")) return "실행";
  if (phase.startsWith("monitoring") || phase === "risk-radar") return "감시/통제";
  if (phase.startsWith("closing")) return "종료";
  // Episodes: up to Ep2 + initiation recap are still Initiation(착수)
  if (phase.startsWith("ep1") || phase.startsWith("ep2") || phase === "ep3-charter" || phase === "ep3-result" || phase === "ep3-survival") {
    return "착수";
  }
  // Remaining episodes are part of execution in this simulation flow
  if (phase.startsWith("ep")) return "실행";
  return "착수";
}

function Stepper({ current }: { current: ProcessStep }) {
  return (
    <div className="bg-[#0B0F19] px-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex h-12 items-center justify-center gap-2 text-[14px] sm:text-[15px]">
          {PROCESS_STEPS.map((label, idx) => {
            const isCurrent = label === current;
            const isFuture = PROCESS_STEPS.indexOf(current) < idx;
            return (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={`pb-1 ${
                    isCurrent
                      ? "font-extrabold text-[#E4003F] border-b-2 border-[#E4003F]"
                      : isFuture
                        ? "font-semibold text-white/35"
                        : "font-semibold text-white/80"
                  }`}
                >
                  {label}
                </span>
                {idx !== PROCESS_STEPS.length - 1 && (
                  <span className="text-white/25" aria-hidden="true">
                    &gt;
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SimulationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    nickname,
    initiationActionHours,
    setInitiationActionHours,
    applyKpiDelta,
    kpi,
    setKpiBeforeInitiation,
    episode1Choice,
    episode2AlignChoice,
  } = useStore();
  const [initiationConfirmOpen, setInitiationConfirmOpen] = useState(false);
  const [ep1ConfirmOpen, setEp1ConfirmOpen] = useState(false);
  const [ep2ConfirmOpen, setEp2ConfirmOpen] = useState(false);

  const phase = useMemo(() => {
    const raw = searchParams.get("phase") || "initiation-action";
    const p = raw === "ep2-options" ? "ep2-scene" : raw;
    return VALID_PHASES.includes(p) ? p : "initiation-action";
  }, [searchParams]);

  useEffect(() => {
    const raw = searchParams.get("phase");
    if (raw === "ep2-options") {
      router.replace("/simulation?phase=ep2-scene");
    }
  }, [searchParams, router]);

  const useMainBackground = phase === "initiation-d1";

  const initiationStage = useMemo(() => {
    if (phase !== "initiation-action") return "alloc" as const;
    const s = searchParams.get("stage");
    return s === "intro" || s === "alloc" ? (s as "intro" | "alloc") : "intro";
  }, [phase, searchParams]);

  const phaseIdx = useMemo(() => VALID_PHASES.indexOf(phase), [phase]);
  const prevHref = useMemo(() => {
    if (phase === "initiation-action" && initiationStage === "alloc") return "/simulation?phase=initiation-action&stage=intro";
    if (phase === "initiation-d1") return "/simulation?phase=initiation-action&stage=alloc";
    if (phase === "ep1-result") return "/simulation?phase=ep1-scene";
    if (phaseIdx > 0) return `/simulation?phase=${VALID_PHASES[phaseIdx - 1]}`;
    return "/onboarding?step=5";
  }, [phaseIdx, phase, initiationStage]);
  const nextHref = useMemo(() => {
    if (phaseIdx >= 0 && phaseIdx < VALID_PHASES.length - 1) {
      return `/simulation?phase=${VALID_PHASES[phaseIdx + 1]}`;
    }
    return "/";
  }, [phaseIdx]);

  const userName = nickname || "PM";
  const processStep = useMemo(() => getProcessStep(phase), [phase]);

  const initiationTotal = useMemo(() => {
    if (phase !== "initiation-action") return 0;
    const getHours = (id: string) => {
      const v = initiationActionHours[id];
      if (typeof v === "number" && (INITIATION_STEP_HOURS as readonly number[]).includes(v)) return v;
      return INITIATION_STEP_HOURS[0];
    };
    return initiationActions.reduce((s, a) => s + getHours(a.id), 0);
  }, [phase, initiationActionHours]);
  const initiationExceed = Math.max(0, initiationTotal - INITIATION_TOTAL_HOURS);

  const handleInitiationNext = () => {
    if (phase !== "initiation-action") return;
    if (initiationStage === "intro") {
      router.push("/simulation?phase=initiation-action&stage=alloc");
      return;
    }
    setInitiationConfirmOpen(true);
  };

  const commitInitiationAndGoNext = () => {
    const hours: Record<string, number> = {};
    initiationActions.forEach((a) => {
      const v = initiationActionHours[a.id];
      hours[a.id] = typeof v === "number" && (INITIATION_STEP_HOURS as readonly number[]).includes(v) ? v : INITIATION_STEP_HOURS[0];
    });
    setInitiationActionHours(hours);
    setKpiBeforeInitiation({ ...kpi });
    const delta = getInitiationKpiDelta(hours);
    applyKpiDelta({ ...delta, leaderEnergy: (delta.leaderEnergy ?? 0) - initiationExceed });
    setInitiationConfirmOpen(false);
    router.push("/simulation?phase=initiation-d1");
  };

  const handleEp1Next = () => {
    if (phase !== "ep1-scene") return;
    if (!episode1Choice) return;
    setEp1ConfirmOpen(true);
  };

  const commitEp1AndGoNext = () => {
    if (!episode1Choice) return;
    const result = ep1Results[episode1Choice];
    if (result?.kpi) applyKpiDelta(result.kpi);
    setEp1ConfirmOpen(false);
    router.push("/simulation?phase=ep1-result");
  };

  const handleEp2Next = () => {
    if (phase !== "ep2-scene") return;
    if (!episode2AlignChoice) return;
    setEp2ConfirmOpen(true);
  };

  const commitEp2AndGoNext = () => {
    if (!episode2AlignChoice) return;
    const result = ep2AlignResults[episode2AlignChoice];
    if (result?.kpi) applyKpiDelta(result.kpi);
    setEp2ConfirmOpen(false);
    router.push("/simulation?phase=ep2-result");
  };

  return (
    <main
      className={`min-h-screen flex flex-col ${
        useMainBackground ? "relative bg-[url('/mainbackground.jpg')] bg-cover bg-center bg-no-repeat" : "bg-white"
      }`}
    >
      {useMainBackground && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_30%_10%,rgba(0,0,0,0.45),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70" />
        </>
      )}
      <header className="sticky top-0 z-50">
        <Stepper current={processStep} />
        <KpiGauges />
      </header>
      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-6">
        {phase === "initiation-action" && <InitiationAction userName={userName} stage={initiationStage} />}
        {phase === "initiation-d1" && <InitiationD1Popup userName={userName} />}
        {phase === "ep1-scene" && <Ep1Scene userName={userName} />}
        {phase === "ep1-options" && <Ep1Options userName={userName} />}
        {phase === "ep1-result" && <Ep1Result userName={userName} />}
        {phase === "ep2-scene" && <Ep2AlignScene userName={userName} />}
        {phase === "ep2-result" && <Ep2AlignResult userName={userName} />}
        {phase === "initiation-recap" && <InitiationRecap userName={userName} />}
        {phase === "initiation-senior-tips" && <InitiationSeniorTips userName={userName} />}
        {phase === "initiation-rampup" && <InitiationRampup userName={userName} />}
        {phase === "ep3-charter" && <Ep2Charter userName={userName} />}
        {phase === "ep3-result" && <Ep2Result userName={userName} />}
        {phase === "ep3-survival" && <SurvivalGuideline userName={userName} />}
        {phase === "plan-action" && <PlanningAction userName={userName} />}
        {phase === "planning-d1" && <PlanningD1Popup userName={userName} />}
        {phase === "ep3-scene" && <Ep3TeamScene userName={userName} />}
        {phase === "ep3-options" && <Ep3TeamOptions userName={userName} />}
        {phase === "ep3-team-result" && <Ep3TeamResult userName={userName} />}
        {phase === "ep4-scene" && <Ep4RoleScene userName={userName} />}
        {phase === "ep4-options" && <Ep4RoleOptions userName={userName} />}
        {phase === "ep4-result" && <Ep4RoleResult userName={userName} />}
        {phase === "ep5-scene" && <Ep5BlueprintScene userName={userName} />}
        {phase === "ep5-options" && <Ep5BlueprintOptions userName={userName} />}
        {phase === "ep5-result" && <Ep5BlueprintResult userName={userName} />}
        {phase === "plan-recap" && <PlanRecap userName={userName} />}
        {phase === "plan-survival" && <PlanSurvival userName={userName} />}
        {phase === "plan-rampup" && <PlanRampup userName={userName} />}
        {phase === "exec-action" && <ExecAction userName={userName} />}
        {phase === "exec-board" && <ExecBoard userName={userName} />}
        {phase === "ep6-scene" && <Ep6PingpongScene userName={userName} />}
        {phase === "ep6-options" && <Ep6PingpongOptions userName={userName} />}
        {phase === "ep6-result" && <Ep6PingpongResult userName={userName} />}
        {phase === "ep7-scene" && <Ep7PassionScene userName={userName} />}
        {phase === "ep7-options" && <Ep7PassionOptions userName={userName} />}
        {phase === "ep7-result" && <Ep7PassionResult userName={userName} />}
        {phase === "ep8-scene" && <Ep8SeniorScene userName={userName} />}
        {phase === "ep8-input" && <Ep8SeniorScene userName={userName} />}
        {phase === "ep8-result" && <Ep8SeniorResult userName={userName} />}
        {phase === "exec-recap" && <ExecRecap userName={userName} />}
        {phase === "exec-senior-tips" && <ExecSeniorTips userName={userName} />}
        {phase === "exec-rampup" && <ExecRampup userName={userName} />}
        {phase === "risk-radar" && <RiskRadar userName={userName} />}
        {phase === "monitoring-scene" && <MonitoringScene userName={userName} />}
        {phase === "ep10-scene" && <Ep10FailureScene userName={userName} />}
        {phase === "ep10-result" && <Ep10Result userName={userName} />}
        {phase === "monitoring-recap" && <MonitoringRecap userName={userName} />}
        {phase === "monitoring-senior-tips" && <MonitoringSeniorTips userName={userName} />}
        {phase === "monitoring-rampup" && <MonitoringRampup userName={userName} />}
        {phase === "closing-scene" && <ClosingScene userName={userName} />}
        {phase === "closing-result" && <ClosingResult userName={userName} />}
      </div>
      {phase === "initiation-action" && initiationStage === "alloc" && initiationConfirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-6 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <div className={`px-6 py-5 ${initiationExceed > 0 ? "bg-[#0B0F19]" : "bg-[#0B0F19]"}`}>
              <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-white/70">CHECK</p>
              <h3 className="mt-1 text-center text-[18px] font-extrabold tracking-tight text-white">
                {initiationExceed > 0 ? "배분 시간이 초과되었습니다" : "이 선택 그대로 진행할까요?"}
              </h3>
            </div>
            <div className="px-6 py-5 text-center">
              {initiationExceed > 0 ? (
                <div className="space-y-3">
                  <p className="text-[15px] leading-[1.85] text-black/75">
                    현재 총 배분 시간은 <span className="font-extrabold text-black/90">{initiationTotal}시간</span>입니다.
                    기준 시간(40시간)보다 <span className="font-extrabold text-[#E4003F]">{initiationExceed}시간</span> 초과되었습니다.
                  </p>
                  <div className="rounded-2xl border border-black/10 bg-[#f8f9fa] p-4">
                    <p className="mt-2 text-[14px] leading-[1.85] text-black/75">
                      초과한 {initiationExceed}시간만큼 <span className="font-extrabold">리더의 에너지가 추가로 소진</span>됩니다.
                      <br />
                      그래도 이 의사결정을 그대로 진행하시겠습니까?
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-[15px] leading-[1.85] text-black/75">
                  현재 총 배분 시간은 <span className="font-extrabold text-black/90">{initiationTotal}시간</span>입니다.
                  이 선택 그대로 진행하시겠습니까?
                </p>
              )}
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setInitiationConfirmOpen(false)}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#f1f3f5] px-4 py-3 text-[15px] font-semibold text-black/70 transition hover:bg-[#e9ecef] active:scale-[0.99]"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitInitiationAndGoNext}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#E4003F] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_40px_rgba(228,0,63,0.28)] transition hover:bg-[#E4003F]/95 active:scale-[0.99]"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === "ep2-scene" && ep2ConfirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-6 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <div className="bg-[#0B0F19] px-6 py-5">
              <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-white/70">CHECK</p>
              <h3 className="mt-1 text-center text-[18px] font-extrabold tracking-tight text-white">이 옵션으로 진행할까요?</h3>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-[15px] leading-[1.85] text-black/75">
                선택하신 의사결정은{" "}
                <span className="font-extrabold text-black/90">
                  옵션 {episode2AlignChoice}. {ep2AlignOptions.find((o) => o.id === episode2AlignChoice)?.title ?? ""}
                </span>
                입니다.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setEp2ConfirmOpen(false)}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#f1f3f5] px-4 py-3 text-[15px] font-semibold text-black/70 transition hover:bg-[#e9ecef] active:scale-[0.99]"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitEp2AndGoNext}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#E4003F] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_40px_rgba(228,0,63,0.28)] transition hover:bg-[#E4003F]/95 active:scale-[0.99]"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === "ep1-scene" && ep1ConfirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-6 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <div className="px-6 py-5 bg-[#0B0F19]">
              <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-white/70">CHECK</p>
              <h3 className="mt-1 text-center text-[18px] font-extrabold tracking-tight text-white">이 옵션으로 진행할까요?</h3>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-[15px] leading-[1.85] text-black/75">
                선택하신 의사결정은{" "}
                <span className="font-extrabold text-black/90">
                  옵션 {episode1Choice}. {ep1Options.find((o) => o.id === episode1Choice)?.title ?? ""}
                </span>
                입니다.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setEp1ConfirmOpen(false)}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#f1f3f5] px-4 py-3 text-[15px] font-semibold text-black/70 transition hover:bg-[#e9ecef] active:scale-[0.99]"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitEp1AndGoNext}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#E4003F] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_40px_rgba(228,0,63,0.28)] transition hover:bg-[#E4003F]/95 active:scale-[0.99]"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <PrevNextNav
        prevHref={prevHref}
        nextHref={nextHref}
        nextDisabled={
          (phase === "ep1-scene" && !episode1Choice) || (phase === "ep2-scene" && !episode2AlignChoice)
        }
        onNextClick={
          phase === "initiation-action"
            ? handleInitiationNext
            : phase === "ep1-scene"
              ? handleEp1Next
              : phase === "ep2-scene"
                ? handleEp2Next
                : undefined
        }
      />
    </main>
  );
}

export default function SimulationPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-white flex items-center justify-center text-[#6B6B6B]">로딩 중...</main>}>
      <SimulationContent />
    </Suspense>
  );
}
