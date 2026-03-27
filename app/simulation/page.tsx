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
import { ExecD1Popup } from "@/components/simulation/ExecD1Popup";
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
import { initiationActions, getInitiationKpiDelta } from "@/content/initiationActions";
import { planningActions, getPlanningKpiDelta } from "@/content/planningActions";
import { ep1Options, ep1Results } from "@/content/episode1";
import { ep2AlignOptions, ep2AlignResults } from "@/content/episode2Align";
import { ep3Options, getEp3Result } from "@/content/episode3";
import { ep4Options, getEp4Result } from "@/content/episode4";
import { ep5Options, getEp5Result } from "@/content/episode5";
import { ep6Block1Options, ep6Block2Options, ep6Block3Options, ep6Block4Options, getEp6Result } from "@/content/episode6";
import { ep7Options, getEp7Result } from "@/content/episode7";
import { executionActions, getExecutionKpiDelta } from "@/content/executionActions";
import { teamMembers } from "@/content/team";

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
  "exec-d1",
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
const MODAL_OVERLAY_CLASS = "ds-modal-overlay";
const MODAL_FRAME_CLASS = "ds-modal-frame";
const MODAL_HEAD_CLASS = "ds-modal-head";
const MODAL_HEAD_LABEL_CLASS = "ds-modal-head-label";
const MODAL_HEAD_TITLE_CLASS = "ds-modal-head-title";
const BTN_SUBTLE_CLASS = "ds-btn-subtle";
const BTN_PRIMARY_CLASS = "ds-btn-primary";

function getProcessStep(phase: string): ProcessStep {
  if (phase.startsWith("initiation")) return "착수";
  if (phase.startsWith("plan") || phase.startsWith("planning")) return "기획";
  if (phase.startsWith("ep3") || phase.startsWith("ep4") || phase.startsWith("ep5")) return "기획";
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

function Stepper({ current, onOpenMembers }: { current: ProcessStep; onOpenMembers: () => void }) {
  const helpByStep: Record<ProcessStep, string> = {
    착수: "프로젝트를 시작하기 위한 목표·범위·이해관계자를 정리하고 추진 기반을 만드는 단계입니다.",
    기획: "일정·범위·자원·리스크 계획을 수립해 실행 가능한 로드맵으로 구체화하는 단계입니다.",
    실행: "계획에 따라 작업을 수행하고 팀을 운영하며 산출물을 만들어 내는 단계입니다.",
    "감시/통제": "진척·품질·리스크를 모니터링하고 편차를 조정해 계획대로 되돌리는 단계입니다.",
    종료: "성과를 인수·정리하고 회고를 통해 지식을 남기며 프로젝트를 마무리하는 단계입니다.",
  };

  return (
    <div className="bg-white px-6 py-3">
      <div className="mx-auto w-full max-w-4xl">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold tracking-[0.12em] text-black/50">프로젝트 5단계</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] sm:text-[14px]">
              {PROCESS_STEPS.map((label, idx) => {
                const isCurrent = label === current;
                const isFuture = PROCESS_STEPS.indexOf(current) < idx;
                return (
                  <div key={label} className="flex items-center gap-2">
                    <span className="relative group">
                      <span
                        className={`pb-0.5 ${
                          isCurrent
                            ? "font-extrabold !text-black border-b-[3px] !border-b-[#89E586]"
                            : isFuture
                              ? "font-semibold text-black/35"
                              : "font-semibold text-black/75"
                        }`}
                      >
                        {label}
                      </span>
                      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-[260px] -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        <span className="block rounded-[0.35rem] border border-black/10 bg-white px-3 py-2 text-[12px] font-semibold leading-relaxed text-black/85 shadow-[0_14px_40px_rgba(0,0,0,0.15)]">
                          <span className="font-extrabold text-[#3374F6]">{label}</span>
                          <span className="text-black/50"> · </span>
                          {helpByStep[label]}
                        </span>
                      </span>
                    </span>
                    {idx !== PROCESS_STEPS.length - 1 && (
                      <span className="text-black/25" aria-hidden="true">
                        &gt;
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-start md:justify-end">
            <button
              type="button"
              onClick={onOpenMembers}
              className="inline-flex items-center justify-center rounded-md bg-[#EEF2F8] px-4 py-2 text-[13px] font-bold !text-[#3374F6] transition hover:bg-[#E4EAF5]"
            >
              구성원 정보
            </button>
          </div>
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
    planningActionHours,
    setPlanningActionHours,
    executionActionHours,
    setExecutionActionHours,
    setKpiBeforePlanning,
    setKpiBeforeExecution,
    episode1Choice,
    episode2AlignChoice,
    episode3Choice,
    episode4Choice,
    episode5Choice,
    episode6Blocks,
    episode7Choice,
  } = useStore();
  const [initiationConfirmOpen, setInitiationConfirmOpen] = useState(false);
  const [planningConfirmOpen, setPlanningConfirmOpen] = useState(false);
  const [ep1ConfirmOpen, setEp1ConfirmOpen] = useState(false);
  const [ep2ConfirmOpen, setEp2ConfirmOpen] = useState(false);
  const [ep3ConfirmOpen, setEp3ConfirmOpen] = useState(false);
  const [ep4ConfirmOpen, setEp4ConfirmOpen] = useState(false);
  const [ep5ConfirmOpen, setEp5ConfirmOpen] = useState(false);
  const [ep6ConfirmOpen, setEp6ConfirmOpen] = useState(false);
  const [ep7ConfirmOpen, setEp7ConfirmOpen] = useState(false);
  const [ep8ConfirmOpen, setEp8ConfirmOpen] = useState(false);
  const [execConfirmOpen, setExecConfirmOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);

  const phase = useMemo(() => {
    const raw = searchParams.get("phase") || "initiation-action";
    const p = raw === "ep2-options" ? "ep2-scene" : raw === "ep4-team-result" ? "ep4-result" : raw;
    return VALID_PHASES.includes(p) ? p : "initiation-action";
  }, [searchParams]);

  useEffect(() => {
    const raw = searchParams.get("phase");
    if (raw === "ep2-options") {
      router.replace("/simulation?phase=ep2-scene");
      return;
    }
    if (raw === "ep4-team-result") {
      router.replace("/simulation?phase=ep4-result");
    }
  }, [searchParams, router]);

  const usePhotoBackground = phase === "initiation-d1" || phase === "planning-d1" || phase === "exec-d1";
  const useRecapBackground =
    phase === "initiation-recap" ||
    phase === "initiation-senior-tips" ||
    phase === "initiation-rampup" ||
    phase === "plan-recap" ||
    phase === "plan-survival" ||
    phase === "plan-rampup" ||
    phase === "exec-recap" ||
    phase === "exec-senior-tips" ||
    phase === "exec-rampup";

  const initiationStage = useMemo(() => {
    if (phase !== "initiation-action") return "alloc" as const;
    const s = searchParams.get("stage");
    return s === "intro" || s === "alloc" ? (s as "intro" | "alloc") : "intro";
  }, [phase, searchParams]);

  const phaseIdx = useMemo(() => VALID_PHASES.indexOf(phase), [phase]);
  const planningStage = useMemo(() => {
    if (phase !== "plan-action") return "alloc" as const;
    const s = searchParams.get("stage");
    return s === "intro" || s === "alloc" ? (s as "intro" | "alloc") : "intro";
  }, [phase, searchParams]);
  const execStage = useMemo(() => {
    if (phase !== "exec-action") return "alloc" as const;
    const s = searchParams.get("stage");
    return s === "intro" || s === "alloc" ? (s as "intro" | "alloc") : "intro";
  }, [phase, searchParams]);
  const prevHref = useMemo(() => {
    if (phase === "initiation-action" && initiationStage === "alloc") return "/simulation?phase=initiation-action&stage=intro";
    if (phase === "initiation-d1") return "/simulation?phase=initiation-action&stage=alloc";
    if (phase === "plan-action" && planningStage === "alloc") return "/simulation?phase=plan-action&stage=intro";
    if (phase === "plan-action") return "/simulation?phase=initiation-rampup";
    if (phase === "planning-d1") return "/simulation?phase=plan-action&stage=alloc";
    if (phase === "exec-action" && execStage === "alloc") return "/simulation?phase=exec-action&stage=intro";
    if (phase === "exec-board") return "/simulation?phase=exec-action&stage=alloc";
    if (phase === "ep1-result") return "/simulation?phase=ep1-scene";
    if (phase === "ep6-result") return "/simulation?phase=ep6-scene";
    if (phase === "ep7-result") return "/simulation?phase=ep7-scene";
    if (phase === "ep3-team-result") return "/simulation?phase=ep3-scene";
    if (phase === "ep4-result") return "/simulation?phase=ep4-scene";
    if (phase === "ep5-result") return "/simulation?phase=ep5-scene";
    if (phaseIdx > 0) return `/simulation?phase=${VALID_PHASES[phaseIdx - 1]}`;
    return "/onboarding?step=5";
  }, [phaseIdx, phase, initiationStage, planningStage, execStage]);
  const nextHref = useMemo(() => {
    if (phase === "initiation-rampup") return "/simulation?phase=plan-action";
    if (phase === "plan-action" && planningStage === "intro") return "/simulation?phase=plan-action&stage=alloc";
    if (phase === "exec-action" && execStage === "intro") return "/simulation?phase=exec-action&stage=alloc";
    if (phaseIdx >= 0 && phaseIdx < VALID_PHASES.length - 1) {
      return `/simulation?phase=${VALID_PHASES[phaseIdx + 1]}`;
    }
    return "/";
  }, [phase, phaseIdx, planningStage, execStage]);

  const userName = nickname || "PM";
  const processStep = useMemo(() => getProcessStep(phase), [phase]);
  const containerMaxWidth = useMemo(() => {
    if (phase === "ep1-result") return "max-w-4xl";
    return "max-w-4xl";
  }, [phase]);
  const containerPaddingX = useMemo(() => {
    if (phase === "ep1-result" || phase === "ep2-result" || phase === "ep3-team-result" || phase === "ep4-result" || phase === "ep5-result" || phase === "ep7-result" || phase === "ep8-result") return "px-0";
    return "px-6";
  }, [phase]);

  const initiationTotal = useMemo(() => {
    if (phase !== "initiation-action") return 0;
    const getHours = (id: string) => {
      const v = initiationActionHours[id];
      return typeof v === "number" ? v : 0;
    };
    return initiationActions.reduce((s, a) => s + getHours(a.id), 0);
  }, [phase, initiationActionHours]);
  const initiationSelectedCount = Math.round(initiationTotal / 8);
  const initiationExceed = Math.max(0, initiationTotal - 16);
  const planningTotal = useMemo(() => {
    if (phase !== "plan-action") return 0;
    const getHours = (id: string) => {
      const v = planningActionHours[id];
      return typeof v === "number" ? v : 0;
    };
    return planningActions.reduce((s, a) => s + getHours(a.id), 0);
  }, [phase, planningActionHours]);
  const planningSelectedCount = Math.round(planningTotal / 8);
  const executionTotal = useMemo(() => {
    if (phase !== "exec-action") return 0;
    const getHours = (id: string) => {
      const v = executionActionHours[id];
      return typeof v === "number" ? v : 0;
    };
    return executionActions.reduce((s, a) => s + getHours(a.id), 0);
  }, [phase, executionActionHours]);
  const executionSelectedCount = Math.round(executionTotal / 8);

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
      hours[a.id] = typeof v === "number" ? v : 0;
    });
    setInitiationActionHours(hours);
    setKpiBeforeInitiation({ ...kpi });
    const delta = getInitiationKpiDelta(hours);
    applyKpiDelta({ ...delta, leaderEnergy: (delta.leaderEnergy ?? 0) - initiationExceed });
    setInitiationConfirmOpen(false);
    router.push("/simulation?phase=initiation-d1");
  };

  const commitPlanningAndGoNext = () => {
    if (phase !== "plan-action" || planningStage !== "alloc") return;
    const hours: Record<string, number> = {};
    planningActions.forEach((a) => {
      const v = planningActionHours[a.id];
      hours[a.id] = typeof v === "number" ? v : 0;
    });
    setPlanningActionHours(hours);
    setKpiBeforePlanning({ ...kpi });
    const delta = getPlanningKpiDelta(hours);
    applyKpiDelta(delta);
    setPlanningConfirmOpen(false);
    router.push("/simulation?phase=planning-d1");
  };
  const handlePlanningNext = () => {
    if (phase !== "plan-action") return;
    if (planningStage === "intro") {
      router.push("/simulation?phase=plan-action&stage=alloc");
      return;
    }
    setPlanningConfirmOpen(true);
  };
  const commitExecutionAndGoNext = () => {
    if (phase !== "exec-action" || execStage !== "alloc") return;
    const hours: Record<string, number> = {};
    executionActions.forEach((a) => {
      const v = executionActionHours[a.id];
      hours[a.id] = typeof v === "number" ? v : 0;
    });
    setExecutionActionHours(hours);
    setKpiBeforeExecution({ ...kpi });
    applyKpiDelta(getExecutionKpiDelta(hours));
    setExecConfirmOpen(false);
    router.push("/simulation?phase=exec-d1");
  };
  const handleExecNext = () => {
    if (phase !== "exec-action") return;
    if (execStage === "intro") {
      router.push("/simulation?phase=exec-action&stage=alloc");
      return;
    }
    setExecConfirmOpen(true);
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

  const handleEp3Next = () => {
    if (phase !== "ep3-scene") return;
    if (!episode3Choice) return;
    setEp3ConfirmOpen(true);
  };

  const commitEp3AndGoNext = () => {
    if (!episode3Choice) return;
    const result = getEp3Result(episode3Choice, planningActionHours["resource_assign"] ?? 0);
    if (result?.kpi) applyKpiDelta(result.kpi);
    setEp3ConfirmOpen(false);
    router.push("/simulation?phase=ep3-team-result");
  };

  const handleEp4Next = () => {
    if (phase !== "ep4-scene") return;
    if (!episode4Choice) return;
    setEp4ConfirmOpen(true);
  };

  const commitEp4AndGoNext = () => {
    if (!episode4Choice) return;
    const result = getEp4Result(episode4Choice, initiationActionHours["team_profile"] ?? 0);
    if (result?.kpi) applyKpiDelta(result.kpi);
    setEp4ConfirmOpen(false);
    router.push("/simulation?phase=ep4-result");
  };

  const handleEp5Next = () => {
    if (phase !== "ep5-scene") return;
    if (!episode5Choice) return;
    setEp5ConfirmOpen(true);
  };

  const commitEp5AndGoNext = () => {
    if (!episode5Choice) return;
    const result = getEp5Result(episode5Choice);
    if (result?.kpi) applyKpiDelta(result.kpi);
    setEp5ConfirmOpen(false);
    router.push("/simulation?phase=ep5-result");
  };
  const handleEp6Next = () => {
    if (phase !== "ep6-scene") return;
    setEp6ConfirmOpen(true);
  };
  const commitEp6AndGoNext = () => {
    if (!episode6Blocks) return;
    const result = getEp6Result(episode6Blocks.block4, episode6Blocks.block2);
    if (result?.kpi) applyKpiDelta(result.kpi);
    setEp6ConfirmOpen(false);
    router.push("/simulation?phase=ep6-result");
  };
  const ep6Selection = useMemo(() => {
    const b1 = episode6Blocks?.block1 ?? "B";
    const b2 = episode6Blocks?.block2 ?? "E";
    const b3 = episode6Blocks?.block3 ?? "D";
    const b4 = episode6Blocks?.block4 ?? "B";
    return {
      b1: ep6Block1Options.find((o) => o.id === b1)?.label ?? "",
      b2: ep6Block2Options.find((o) => o.id === b2)?.label ?? "",
      b3: ep6Block3Options.find((o) => o.id === b3)?.label ?? "",
      b4: ep6Block4Options.find((o) => o.id === b4)?.label ?? "",
    };
  }, [episode6Blocks]);
  const handleEp7Next = () => {
    if (phase !== "ep7-scene") return;
    if (!episode7Choice) return;
    setEp7ConfirmOpen(true);
  };
  const commitEp7AndGoNext = () => {
    if (!episode7Choice) return;
    const vocHours = executionActionHours["voc_data"] ?? 0;
    const refHours = executionActionHours["ref_benchmark"] ?? 0;
    const result = getEp7Result(episode7Choice, vocHours, refHours);
    if (result?.kpi) applyKpiDelta(result.kpi);
    setEp7ConfirmOpen(false);
    router.push("/simulation?phase=ep7-result");
  };
  const handleEp8Next = () => {
    if (phase !== "ep8-input") return;
    setEp8ConfirmOpen(true);
  };
  const commitEp8AndGoNext = () => {
    setEp8ConfirmOpen(false);
    router.push("/simulation?phase=ep8-result");
  };

  return (
    <main
      className={`min-h-screen flex flex-col ${
        usePhotoBackground
          ? "relative bg-[url('/mainbackground.jpg')] bg-cover bg-center bg-no-repeat"
          : useRecapBackground
            ? "bg-white"
            : "bg-white"
      } simulation-flat`}
    >
      {usePhotoBackground && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_30%_10%,rgba(0,0,0,0.45),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70" />
        </>
      )}
      <header className="sticky top-0 z-50">
        <Stepper current={processStep} onOpenMembers={() => setMembersModalOpen(true)} />
        <KpiGauges />
      </header>
      <div className={`mx-auto w-full ${containerMaxWidth} flex-1 ${containerPaddingX} py-6`}>
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
        {phase === "plan-action" && <PlanningAction userName={userName} stage={planningStage} />}
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
        {phase === "exec-action" && <ExecAction userName={userName} stage={execStage} />}
        {phase === "exec-d1" && <ExecD1Popup userName={userName} />}
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
        <div className={MODAL_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 선택 그대로 진행할까요?</h3>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-[15px] leading-[1.85] text-black/75">
                현재 <span className="font-extrabold text-black/90">{initiationSelectedCount}개</span>의 액션 아이템을 선택했습니다.
                <br />
                이 선택 그대로 진행하시겠습니까?
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setInitiationConfirmOpen(false)}
                  className={BTN_SUBTLE_CLASS}
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitInitiationAndGoNext}
                  className={BTN_PRIMARY_CLASS}
                >
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "plan-action" && planningStage === "alloc" && planningConfirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-6 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <div className="bg-[#0B0F19] px-6 py-5">
              <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-white/70">CHECK</p>
              <h3 className="mt-1 text-center text-[18px] font-extrabold tracking-tight text-white">이 선택 그대로 진행할까요?</h3>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-[15px] leading-[1.85] text-black/75">
                현재 <span className="font-extrabold text-black/90">{planningSelectedCount}개</span>의 액션 아이템을 선택했습니다.
                <br />
                이 선택 그대로 진행하시겠습니까?
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPlanningConfirmOpen(false)}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#f1f3f5] px-4 py-3 text-[15px] font-semibold text-black/70 transition hover:bg-[#e9ecef] active:scale-[0.99]"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitPlanningAndGoNext}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#E4003F] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_40px_rgba(228,0,63,0.28)] transition hover:bg-[#E4003F]/95 active:scale-[0.99]"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "exec-action" && execStage === "alloc" && execConfirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-6 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <div className="bg-[#0B0F19] px-6 py-5">
              <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-white/70">CHECK</p>
              <h3 className="mt-1 text-center text-[18px] font-extrabold tracking-tight text-white">이 선택 그대로 진행할까요?</h3>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-[15px] leading-[1.85] text-black/75">
                현재 <span className="font-extrabold text-black/90">{executionSelectedCount}개</span>의 액션 아이템을 선택했습니다.
                <br />
                이 선택 그대로 진행하시겠습니까?
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setExecConfirmOpen(false)}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#f1f3f5] px-4 py-3 text-[15px] font-semibold text-black/70 transition hover:bg-[#e9ecef] active:scale-[0.99]"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitExecutionAndGoNext}
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
      {phase === "ep3-scene" && ep3ConfirmOpen && (
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
                  옵션 {episode3Choice}. {ep3Options.find((o) => o.id === episode3Choice)?.title ?? ""}
                </span>
                입니다.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setEp3ConfirmOpen(false)}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#f1f3f5] px-4 py-3 text-[15px] font-semibold text-black/70 transition hover:bg-[#e9ecef] active:scale-[0.99]"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitEp3AndGoNext}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#E4003F] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_40px_rgba(228,0,63,0.28)] transition hover:bg-[#E4003F]/95 active:scale-[0.99]"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep4-scene" && ep4ConfirmOpen && (
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
                  옵션 {episode4Choice}. {ep4Options.find((o) => o.id === episode4Choice)?.title ?? ""}
                </span>
                입니다.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setEp4ConfirmOpen(false)}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#f1f3f5] px-4 py-3 text-[15px] font-semibold text-black/70 transition hover:bg-[#e9ecef] active:scale-[0.99]"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitEp4AndGoNext}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#E4003F] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_40px_rgba(228,0,63,0.28)] transition hover:bg-[#E4003F]/95 active:scale-[0.99]"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep5-scene" && ep5ConfirmOpen && (
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
                  옵션 {episode5Choice}. {ep5Options.find((o) => o.id === episode5Choice)?.title ?? ""}
                </span>
                입니다.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setEp5ConfirmOpen(false)}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#f1f3f5] px-4 py-3 text-[15px] font-semibold text-black/70 transition hover:bg-[#e9ecef] active:scale-[0.99]"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitEp5AndGoNext}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#E4003F] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_40px_rgba(228,0,63,0.28)] transition hover:bg-[#E4003F]/95 active:scale-[0.99]"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep6-scene" && ep6ConfirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-6 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <div className="px-6 py-5 bg-[#0B0F19]">
              <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-white/70">CHECK</p>
              <h3 className="mt-1 text-center text-[18px] font-extrabold tracking-tight text-white">이 선택 그대로 진행할까요?</h3>
            </div>
            <div className="px-6 py-5 text-center">
              <div className="rounded-2xl border border-black/10 bg-[#f8f9fa] p-4 text-left">
                <p className="text-[13px] font-extrabold text-black/85">선택한 조합</p>
                <ul className="mt-2 space-y-1.5 text-[14px] leading-[1.7] text-black/75">
                  <li><span className="font-extrabold text-black/85">소통 대상</span> · {ep6Selection.b1}</li>
                  <li><span className="font-extrabold text-black/85">소통 채널</span> · {ep6Selection.b2}</li>
                  <li><span className="font-extrabold text-black/85">소통 톤</span> · {ep6Selection.b3}</li>
                  <li><span className="font-extrabold text-black/85">소통 내용</span> · {ep6Selection.b4}</li>
                </ul>
              </div>
              <p className="mt-3 text-[15px] leading-[1.85] text-black/75">이 조합으로 결과를 확인하시겠습니까?</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setEp6ConfirmOpen(false)}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#f1f3f5] px-4 py-3 text-[15px] font-semibold text-black/70 transition hover:bg-[#e9ecef] active:scale-[0.99]"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitEp6AndGoNext}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#E4003F] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_40px_rgba(228,0,63,0.28)] transition hover:bg-[#E4003F]/95 active:scale-[0.99]"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep7-scene" && ep7ConfirmOpen && (
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
                  옵션 {episode7Choice}. {ep7Options.find((o) => o.id === episode7Choice)?.title ?? ""}
                </span>
                입니다.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setEp7ConfirmOpen(false)}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#f1f3f5] px-4 py-3 text-[15px] font-semibold text-black/70 transition hover:bg-[#e9ecef] active:scale-[0.99]"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitEp7AndGoNext}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#E4003F] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_40px_rgba(228,0,63,0.28)] transition hover:bg-[#E4003F]/95 active:scale-[0.99]"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep8-input" && ep8ConfirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-6 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <div className="px-6 py-5 bg-[#0B0F19]">
              <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-white/70">CHECK</p>
              <h3 className="mt-1 text-center text-[18px] font-extrabold tracking-tight text-white">이 코칭으로 진행할까요?</h3>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-[15px] leading-[1.85] text-black/75">
                작성한 코칭 메시지가 반영되고 결과 페이지로 이동합니다.
                <br />
                이대로 진행하시겠습니까?
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setEp8ConfirmOpen(false)}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#f1f3f5] px-4 py-3 text-[15px] font-semibold text-black/70 transition hover:bg-[#e9ecef] active:scale-[0.99]"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={commitEp8AndGoNext}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#E4003F] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_40px_rgba(228,0,63,0.28)] transition hover:bg-[#E4003F]/95 active:scale-[0.99]"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {membersModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 px-6 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <h3 className="text-[18px] font-extrabold text-black">구성원 정보</h3>
              <button
                type="button"
                onClick={() => setMembersModalOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-black/70 hover:bg-black/5"
                aria-label="구성원 정보 닫기"
              >
                ×
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="rounded-xl border border-black/10 p-4">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-[16px] font-extrabold text-black">{member.name}</p>
                      <p className="text-[13px] font-bold text-black/60">{member.role}</p>
                    </div>
                    <p className="mt-2 text-[13px] text-black/70">{member.position}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-black/65">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <PrevNextNav
        prevHref={prevHref}
        nextHref={nextHref}
        nextDisabled={
          (phase === "ep1-scene" && !episode1Choice) ||
          (phase === "ep2-scene" && !episode2AlignChoice) ||
          (phase === "ep3-scene" && !episode3Choice) ||
          (phase === "ep4-scene" && !episode4Choice) ||
          (phase === "ep5-scene" && !episode5Choice) ||
          (phase === "ep7-scene" && !episode7Choice)
        }
        onNextClick={
          phase === "initiation-action"
            ? handleInitiationNext
            : phase === "plan-action"
              ? handlePlanningNext
              : phase === "exec-action"
                ? handleExecNext
            : phase === "ep1-scene"
              ? handleEp1Next
              : phase === "ep2-scene"
                ? handleEp2Next
                : phase === "ep3-scene"
                  ? handleEp3Next
                  : phase === "ep4-scene"
                    ? handleEp4Next
                    : phase === "ep5-scene"
                      ? handleEp5Next
                      : phase === "ep6-scene"
                        ? handleEp6Next
                        : phase === "ep7-scene"
                          ? handleEp7Next
                          : phase === "ep8-input"
                            ? handleEp8Next
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
