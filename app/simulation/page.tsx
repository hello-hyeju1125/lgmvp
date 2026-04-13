"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useMemo, useState, useEffect, useCallback, useRef, useLayoutEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { KpiGauges } from "@/components/KpiGauges";
import { SimulationHudMenu, type HudMenuAction } from "@/components/simulation/SimulationHudMenu";
import { SimulationHudModal } from "@/components/simulation/SimulationHudModal";
import ProjectOverview from "@/components/onboarding/OnboardingStepProjectOverview";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import { OnboardingStep0 } from "@/components/onboarding/OnboardingStep0";
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
import { ExecBoardWbsTimelineModal } from "@/components/simulation/ExecBoardWbsTimelineModal";
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
import { initiationActions, getInitiationKpiDelta } from "@/content/initiationActions";
import { planningActions, getPlanningKpiDelta } from "@/content/planningActions";
import { executionActions, getExecutionKpiDelta, EXEC_ACTION_MAX_SELECTED } from "@/content/executionActions";
import { ep1Options, ep1Results } from "@/content/episode1";
import { ep2AlignOptions, ep2AlignResults } from "@/content/episode2Align";
import { ep3Options, getEp3Result } from "@/content/episode3";
import { ep4Options, getEp4Result } from "@/content/episode4";
import { ep5Options, getEp5Result } from "@/content/episode5";
import { ep6Block1Options, ep6Block2Options, ep6Block3Options, getEp6Result } from "@/content/episode6";
import { ep7Options, getEp7Result } from "@/content/episode7";
import { ep10Options, getEp10Result } from "@/content/episode10";
import { EXEC_BOARD_TICKETS, type PlacementId } from "@/content/execBoard";
import { RISK_POSTITS } from "@/content/riskRadar";
import { SIM_COLUMN_GUTTER, SIM_COLUMN_MAX_INNER } from "@/lib/simulationLayout";
import { isExecutionAccentPhase, isMonitoringAccentPhase, isPlanningAccentPhase } from "@/lib/simulationAccent";

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
  "ep10-scene",
  "ep10-result",
  "monitoring-recap",
  "monitoring-senior-tips",
  "monitoring-rampup",
  "closing-scene",
];

/** `ep1-result` 및 그 이후 phase — ep1-options 제외, initiation 3화면과 동일 HUD·본문 컬럼·푸터 */
const EP1_RESULT_PHASE_INDEX = VALID_PHASES.indexOf("ep1-result");

const PROCESS_STEPS = ["착수", "기획", "실행", "감시/통제", "종료"] as const;
type ProcessStep = (typeof PROCESS_STEPS)[number];

const MODAL_OVERLAY_CLASS = "ds-modal-overlay";
const MODAL_FRAME_CLASS = "ds-modal-frame";
const MODAL_HEAD_CLASS = "ds-modal-head";
const MODAL_HEAD_LABEL_CLASS = "ds-modal-head-label";
const MODAL_HEAD_TITLE_CLASS = "ds-modal-head-title";
const BTN_SUBTLE_CLASS = "ds-btn-subtle";
const BTN_PRIMARY_CLASS = "ds-btn-primary";
/** 기획 단계 확인 모달 — 딥 네이비 패널 + 흰 글자 (globals `.planning-accent-confirm-modal`) */
const PLANNING_CONFIRM_OVERLAY_CLASS = `${MODAL_OVERLAY_CLASS} planning-accent-confirm-modal`;

const CONFIRM_CAUTION_MSG = (
  <p className="mt-3 rounded-md bg-black/5 px-3 py-2.5 text-center text-[12px] leading-[1.7] text-black/55">
    ※ 한번 확정된 의사결정은 이전 버튼을 누르더라도 번복할 수 없습니다. 신중하게 선택해 주십시오.
  </p>
);

function getProcessStep(phase: string): ProcessStep {
  if (phase.startsWith("initiation")) return "착수";
  if (phase.startsWith("plan") || phase.startsWith("planning")) return "기획";
  if (phase.startsWith("ep3") || phase.startsWith("ep4") || phase.startsWith("ep5")) return "기획";
  if (phase.startsWith("exec")) return "실행";
  if (phase.startsWith("monitoring") || phase === "risk-radar" || phase.startsWith("ep10")) return "감시/통제";
  if (phase.startsWith("closing")) return "종료";
  // Episodes: up to Ep2 + initiation recap are still Initiation(착수)
  if (phase.startsWith("ep1-") || phase.startsWith("ep2") || phase === "ep3-charter" || phase === "ep3-result" || phase === "ep3-survival") {
    return "착수";
  }
  // Remaining episodes are part of execution in this simulation flow
  if (phase.startsWith("ep")) return "실행";
  return "착수";
}

function Stepper({ current, onHudMenuAction, progressPercent }: { current: ProcessStep; onHudMenuAction: (action: HudMenuAction) => void; progressPercent: number }) {
  const helpByStep: Record<ProcessStep, string> = {
    착수: "프로젝트 목표·범위·이해관계자를 정리해 시작 기반을 만듭니다.",
    기획: "일정·자원·리스크 계획을 세워 실행 가능한 로드맵으로 구체화합니다.",
    실행: "계획에 맞춰 작업을 수행하고 팀을 운영해 산출물을 만듭니다.",
    "감시/통제": "진척과 품질을 점검하고 편차를 조정해 계획 궤도로 복귀시킵니다.",
    종료: "성과를 인수·정리하고 회고를 통해 프로젝트를 마무리합니다.",
  };

  /** 스테퍼 칩 래퍼 ref — 툴팁을 overflow 스크롤 영역 밖(body·fixed)에 두어 가로 스크롤 박스에 세로 스크롤이 생기지 않게 함 */
  const stepperItemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [hoverStepIndex, setHoverStepIndex] = useState<number | null>(null);
  const [stepperTipPos, setStepperTipPos] = useState<{ left: number; top: number } | null>(null);

  const updateStepperTipPosition = useCallback(() => {
    if (hoverStepIndex === null) return;
    const el = stepperItemRefs.current[hoverStepIndex];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setStepperTipPos({ left: rect.left + rect.width / 2, top: rect.bottom + 8 });
  }, [hoverStepIndex]);

  useLayoutEffect(() => {
    if (hoverStepIndex === null) {
      return;
    }
    updateStepperTipPosition();
    const onScrollOrResize = () => updateStepperTipPosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [hoverStepIndex, updateStepperTipPosition]);

  const hoverStepLabel = hoverStepIndex !== null ? PROCESS_STEPS[hoverStepIndex] : null;

  return (
    <div className="sim-hud-stepper-row border-b border-[#e8e8e8] bg-white">
      <div className={`py-2 ${SIM_COLUMN_GUTTER}`}>
        <div className={`flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8 ${SIM_COLUMN_MAX_INNER}`}>
        <div className="flex shrink-0 items-center gap-2">
          <span className="sim-hud-brand-mark font-sans text-[14px] font-extrabold leading-none tracking-wide sm:text-[15px]">
            LGMVP
          </span>
          <span className="font-sans text-[13px] text-black/25">|</span>
          <span className="font-sans text-[14px] font-extrabold leading-none text-black sm:text-[15px]">
            프로젝트 매니지먼트 5단계
          </span>
        </div>

        <div className="flex min-w-0 flex-1 justify-center overflow-x-auto overflow-y-hidden pb-0.5 [-webkit-overflow-scrolling:touch] lg:pb-0">
          <div
            className="sim-hud-chevron-strip inline-flex max-w-full shrink-0 items-stretch pr-1"
            dir="ltr"
            role="list"
            aria-label="프로젝트 매니지먼트 5단계"
          >
            {PROCESS_STEPS.map((label, idx) => {
              const isCurrent = label === current;
              return (
                <span
                  key={label}
                  ref={(el) => {
                    stepperItemRefs.current[idx] = el;
                  }}
                  role="listitem"
                  className="relative inline-flex"
                  style={{ zIndex: isCurrent ? 20 : idx + 1 }}
                  onMouseEnter={(e) => {
                    setHoverStepIndex(idx);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setStepperTipPos({ left: rect.left + rect.width / 2, top: rect.bottom + 8 });
                  }}
                  onMouseLeave={() => {
                    setHoverStepIndex(null);
                    setStepperTipPos(null);
                  }}
                >
                  <span
                    className={`sim-hud-chevron font-sans ${isCurrent ? "sim-hud-chevron--active" : ""}`}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <span className="sim-hud-chevron-inner">{`${idx + 1}. ${label}`}</span>
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 justify-end">
          <SimulationHudMenu onSelect={onHudMenuAction} progressPercent={progressPercent} />
        </div>
        </div>
      </div>
      {typeof document !== "undefined" &&
        hoverStepIndex !== null &&
        stepperTipPos &&
        hoverStepLabel &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[200] w-[min(260px,calc(100vw-2rem))] -translate-x-1/2"
            style={{ left: stepperTipPos.left, top: stepperTipPos.top }}
            role="tooltip"
          >
            <span className="sim-hud-tooltip block px-2.5 py-2 text-left font-sans text-[11px] font-semibold text-white">
              <span className="font-black text-white">
                {hoverStepIndex + 1}. {hoverStepLabel}
              </span>
              <span className="sim-hud-tooltip-muted"> · </span>
              {helpByStep[hoverStepLabel]}
            </span>
          </div>,
          document.body,
        )}
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
    setKpiBeforeEp1Result,
    setKpiBeforeEp2Result,
    setKpiBeforeEp3Result,
    setKpiBeforeEp4Result,
    setKpiBeforeEp5Result,
    setKpiBeforeEp6Result,
    setKpiBeforeEp7Result,
    setKpiBeforeEp10Result,
    setKpiStartPlanning,
    setKpiStartExecution,
    setKpiStartMonitoring,
    committedPhases,
    markCommitted,
    episode1Choice,
    setEpisode1Choice,
    episode2AlignChoice,
    setEpisode2AlignChoice,
    episode3Choice,
    setEpisode3Choice,
    episode4Choice,
    setEpisode4Choice,
    episode5Choice,
    setEpisode5Choice,
    episode6Blocks,
    setEpisode6Blocks,
    episode7Choice,
    setEpisode7Choice,
    episode10Choice,
    setEpisode10Choice,
    setEpisode8CoachingText,
  } = useStore();
  const [initiationConfirmOpen, setInitiationConfirmOpen] = useState(false);
  const [planningConfirmOpen, setPlanningConfirmOpen] = useState(false);
  const [execConfirmOpen, setExecConfirmOpen] = useState(false);
  const [ep1ConfirmOpen, setEp1ConfirmOpen] = useState(false);
  const [ep2ConfirmOpen, setEp2ConfirmOpen] = useState(false);
  const [ep3ConfirmOpen, setEp3ConfirmOpen] = useState(false);
  const [ep4ConfirmOpen, setEp4ConfirmOpen] = useState(false);
  const [ep5ConfirmOpen, setEp5ConfirmOpen] = useState(false);
  const [ep6ConfirmOpen, setEp6ConfirmOpen] = useState(false);
  const [ep7ConfirmOpen, setEp7ConfirmOpen] = useState(false);
  const [ep10ConfirmOpen, setEp10ConfirmOpen] = useState(false);

  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [simulationProgressModalOpen, setSimulationProgressModalOpen] = useState(false);
  const [pmInfoModalOpen, setPmInfoModalOpen] = useState(false);
  const [projectOverviewModalOpen, setProjectOverviewModalOpen] = useState(false);
  const [execBoardWbsOpen, setExecBoardWbsOpen] = useState(false);
  const [execBoardPlacement, setExecBoardPlacement] = useState<Record<string, PlacementId>>({});

  const handleExecBoardPlacement = useCallback((p: Record<string, PlacementId>) => {
    setExecBoardPlacement(p);
  }, []);

  /** exec-board: 모든 티켓이 정답 컬럼에 있을 때만 다음(WBS) 가능 */
  const execBoardAllCorrect = useMemo(
    () => EXEC_BOARD_TICKETS.every((t) => execBoardPlacement[t.id] === t.correctColumn),
    [execBoardPlacement],
  );

  const [riskRadarPlacement, setRiskRadarPlacement] = useState<Record<string, string>>({});
  const handleRiskRadarPlacement = useCallback((p: Record<string, string>) => {
    setRiskRadarPlacement(p);
  }, []);
  /** risk-radar: 8개 포스트잇이 모두 정답 사분면에 있을 때만 다음 가능 */
  const riskRadarAllCorrect = useMemo(
    () => RISK_POSTITS.every((r) => riskRadarPlacement[r.id] === r.suggestedQuadrant),
    [riskRadarPlacement],
  );

  const phase = useMemo(() => {
    const raw = searchParams.get("phase") || "initiation-action";
    const p =
      raw === "ep2-options"
        ? "ep2-scene"
        : raw === "ep4-team-result"
          ? "ep4-result"
          : raw === "ep5-team-result"
            ? "ep5-result"
            : raw;
    return VALID_PHASES.includes(p) ? p : "initiation-action";
  }, [searchParams]);

  useEffect(() => {
    if (phase !== "exec-board") setExecBoardWbsOpen(false);
  }, [phase]);

  useEffect(() => {
    if (phase !== "risk-radar") setRiskRadarPlacement({});
  }, [phase]);

  useEffect(() => {
    if (phase !== "ep10-scene") setEp10ConfirmOpen(false);
  }, [phase]);

  useEffect(() => {
    const { committedPhases: cp, kpiStartPlanning: ksp, kpiStartExecution: kse, kpiStartMonitoring: ksm } = useStore.getState();
    switch (phase) {
      case "initiation-action":
        if (!cp["initiation"]) setInitiationActionHours({});
        break;
      case "ep1-scene":
        if (!cp["ep1"]) setEpisode1Choice(null);
        break;
      case "ep2-scene":
        if (!cp["ep2"]) setEpisode2AlignChoice(null);
        break;
      case "plan-action":
        if (!cp["planning"]) setPlanningActionHours({});
        if (!ksp) setKpiStartPlanning({ ...useStore.getState().kpi });
        break;
      case "ep3-scene":
        if (!cp["ep3"]) setEpisode3Choice(null);
        break;
      case "ep4-scene":
        if (!cp["ep4"]) setEpisode4Choice(null);
        break;
      case "ep5-scene":
        if (!cp["ep5"]) setEpisode5Choice(null);
        break;
      case "exec-action":
        if (!cp["execution"]) setExecutionActionHours({});
        if (!kse) setKpiStartExecution({ ...useStore.getState().kpi });
        break;
      case "ep6-scene":
        if (!cp["ep6"]) setEpisode6Blocks(null);
        break;
      case "ep7-scene":
        if (!cp["ep7"]) setEpisode7Choice(null);
        break;
      case "ep8-scene":
      case "ep8-input":
        setEpisode8CoachingText("");
        break;
      case "risk-radar":
        if (!ksm) setKpiStartMonitoring({ ...useStore.getState().kpi });
        break;
      case "ep10-scene":
        if (!cp["ep10"]) setEpisode10Choice(null);
        break;
    }
  }, [phase, setInitiationActionHours, setEpisode1Choice, setEpisode2AlignChoice, setPlanningActionHours, setEpisode3Choice, setEpisode4Choice, setEpisode5Choice, setExecutionActionHours, setEpisode6Blocks, setEpisode7Choice, setEpisode8CoachingText, setEpisode10Choice, setKpiStartPlanning, setKpiStartExecution, setKpiStartMonitoring]);

  useEffect(() => {
    const raw = searchParams.get("phase");
    if (raw === "ep2-options") {
      router.replace("/simulation?phase=ep2-scene");
      return;
    }
    if (raw === "ep4-team-result") {
      router.replace("/simulation?phase=ep4-result");
      return;
    }
    if (raw === "ep5-team-result") {
      router.replace("/simulation?phase=ep5-result");
      return;
    }
    if (raw === "exec-action" && searchParams.get("stage") !== "alloc") {
      router.replace("/simulation?phase=exec-action&stage=alloc");
      return;
    }
    if (raw === "plan-action" && searchParams.get("stage") === "intro") {
      router.replace("/simulation?phase=plan-action&stage=alloc");
    }
  }, [searchParams, router]);

  const closingSceneFullBleed = phase === "closing-scene";
  const initiationSeniorTipsFullBleed = phase === "initiation-senior-tips";
  const execSeniorTipsFullBleed = phase === "exec-senior-tips";
  const monitoringSeniorTipsFullBleed = phase === "monitoring-senior-tips";
  const planSurvivalFullBleed = phase === "plan-survival";


  const initiationStage = useMemo(() => {
    if (phase !== "initiation-action") return "alloc" as const;
    const s = searchParams.get("stage");
    return s === "intro" || s === "alloc" ? (s as "intro" | "alloc") : "intro";
  }, [phase, searchParams]);

  const phaseIdx = useMemo(() => VALID_PHASES.indexOf(phase), [phase]);
  const prevHref = useMemo(() => {
    if (phase === "initiation-d1") return "/simulation?phase=initiation-action";
    if (phase === "plan-action") return "/simulation?phase=initiation-rampup";
    if (phase === "planning-d1") return "/simulation?phase=plan-action&stage=alloc";
    if (phase === "exec-action") return "/simulation?phase=plan-rampup";
    if (phase === "exec-d1") return "/simulation?phase=exec-action&stage=alloc";
    if (phase === "exec-board") return "/simulation?phase=exec-d1";
    if (phase === "ep1-result") return "/simulation?phase=ep1-scene";
    if (phase === "ep6-result") return "/simulation?phase=ep6-scene";
    if (phase === "ep7-result") return "/simulation?phase=ep7-scene";
    if (phase === "ep3-team-result") return "/simulation?phase=ep3-scene";
    if (phase === "ep4-result") return "/simulation?phase=ep4-scene";
    if (phase === "ep5-result") return "/simulation?phase=ep5-scene";
    if (phaseIdx > 0) return `/simulation?phase=${VALID_PHASES[phaseIdx - 1]}`;
    return "/onboarding?step=5";
  }, [phaseIdx, phase]);
  const nextHref = useMemo(() => {
    if (phase === "initiation-rampup") return "/simulation?phase=plan-action&stage=alloc";
    if (phaseIdx >= 0 && phaseIdx < VALID_PHASES.length - 1) {
      return `/simulation?phase=${VALID_PHASES[phaseIdx + 1]}`;
    }
    return "/";
  }, [phase, phaseIdx]);

  const userName = nickname || "PM";
  const processStep = useMemo(() => getProcessStep(phase), [phase]);

  const handleHudMenuAction = useCallback((action: HudMenuAction) => {
    if (action === "simulationProgress") setSimulationProgressModalOpen(true);
    if (action === "projectOverview") setProjectOverviewModalOpen(true);
    if (action === "characters") setMembersModalOpen(true);
    if (action === "pmInfo") setPmInfoModalOpen(true);
  }, []);

  const containerMaxWidth = useMemo(() => {
    if (phase === "ep1-result") return "max-w-7xl";
    if (phase === "ep6-scene") return "max-w-7xl";
    return "max-w-4xl";
  }, [phase]);
  const containerPaddingX = useMemo(() => {
    if (phase === "ep1-result" || phase === "ep2-result" || phase === "ep3-team-result" || phase === "ep4-result" || phase === "ep5-result" || phase === "ep6-result" || phase === "ep7-result" || phase === "ep8-result" || phase === "ep10-result") return "px-0";
    return "px-6";
  }, [phase]);
  /** 본문 영역 — ep1-options만 SIM_COLUMN 밖(구 레이아웃), 나머지는 grayHudChrome 래퍼 사용 */
  const simulationContentClass = useMemo(() => {
    const base = "mx-auto w-full flex-1";
    if (phase === "ep1-result" || phase === "ep2-result" || phase === "ep3-team-result" || phase === "ep4-result" || phase === "ep5-result" || phase === "ep6-result" || phase === "ep7-result" || phase === "ep8-result" || phase === "ep10-result") {
      return `${base} ${containerMaxWidth} px-0 py-6`;
    }
    return `${base} ${containerMaxWidth} ${containerPaddingX} py-6`;
  }, [phase, containerMaxWidth, containerPaddingX]);

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

  const progressPercent = useMemo(() => {
    const idx = VALID_PHASES.indexOf(phase);
    if (idx < 0) return 0;
    return Math.round(((idx + 1) / VALID_PHASES.length) * 100);
  }, [phase]);

  const handleInitiationNext = () => {
    if (phase !== "initiation-action") return;
    setInitiationConfirmOpen(true);
  };

  const commitInitiationAndGoNext = () => {
    const hours: Record<string, number> = {};
    initiationActions.forEach((a) => {
      const v = initiationActionHours[a.id];
      hours[a.id] = typeof v === "number" ? v : 0;
    });
    setInitiationActionHours(hours);
    if (!committedPhases["initiation"]) {
      setKpiBeforeInitiation({ ...kpi });
      const delta = getInitiationKpiDelta(hours);
      applyKpiDelta(delta);
      markCommitted("initiation");
    }
    setInitiationConfirmOpen(false);
    router.push("/simulation?phase=initiation-d1");
  };

  const commitPlanningAndGoNext = () => {
    if (phase !== "plan-action") return;
    const hours: Record<string, number> = {};
    planningActions.forEach((a) => {
      const v = planningActionHours[a.id];
      hours[a.id] = typeof v === "number" ? v : 0;
    });
    setPlanningActionHours(hours);
    if (!committedPhases["planning"]) {
      setKpiBeforePlanning({ ...kpi });
      const delta = getPlanningKpiDelta(hours);
      applyKpiDelta(delta);
      markCommitted("planning");
    }
    setPlanningConfirmOpen(false);
    router.push("/simulation?phase=planning-d1");
  };
  const handlePlanningNext = () => {
    if (phase !== "plan-action") return;
    setPlanningConfirmOpen(true);
  };

  const commitExecutionAndGoNext = () => {
    if (phase !== "exec-action") return;
    const hours: Record<string, number> = {};
    executionActions.forEach((a) => {
      const v = executionActionHours[a.id];
      hours[a.id] = typeof v === "number" ? v : 0;
    });
    setExecutionActionHours(hours);
    if (!committedPhases["execution"]) {
      setKpiBeforeExecution({ ...kpi });
      const delta = getExecutionKpiDelta(hours);
      applyKpiDelta(delta);
      markCommitted("execution");
    }
    setExecConfirmOpen(false);
    router.push("/simulation?phase=exec-d1");
  };
  const handleExecNext = () => {
    if (phase !== "exec-action") return;
    setExecConfirmOpen(true);
  };

  const handleEp1Next = () => {
    if (phase !== "ep1-scene") return;
    if (!episode1Choice) return;
    setEp1ConfirmOpen(true);
  };

  const commitEp1AndGoNext = () => {
    if (!episode1Choice) return;
    if (!committedPhases["ep1"]) {
      setKpiBeforeEp1Result({ ...kpi });
      const result = ep1Results[episode1Choice];
      if (result?.kpi) applyKpiDelta(result.kpi);
      markCommitted("ep1");
    }
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
    if (!committedPhases["ep2"]) {
      setKpiBeforeEp2Result({ ...kpi });
      const result = ep2AlignResults[episode2AlignChoice];
      if (result?.kpi) applyKpiDelta(result.kpi);
      markCommitted("ep2");
    }
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
    if (!committedPhases["ep3"]) {
      setKpiBeforeEp3Result({ ...kpi });
      const result = getEp3Result(episode3Choice, planningActionHours["resource_assign"] ?? 0);
      if (result?.kpi) applyKpiDelta(result.kpi);
      markCommitted("ep3");
    }
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
    if (!committedPhases["ep4"]) {
      setKpiBeforeEp4Result({ ...kpi });
      const result = getEp4Result(episode4Choice, initiationActionHours["team_profile"] ?? 0);
      if (result?.kpi) applyKpiDelta(result.kpi);
      markCommitted("ep4");
    }
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
    if (!committedPhases["ep5"]) {
      setKpiBeforeEp5Result({ ...kpi });
      const result = getEp5Result(episode5Choice);
      if (result?.kpi) applyKpiDelta(result.kpi);
      markCommitted("ep5");
    }
    setEp5ConfirmOpen(false);
    router.push("/simulation?phase=ep5-result");
  };
  const handleEp6Next = () => {
    if (phase !== "ep6-scene") return;
    setEp6ConfirmOpen(true);
  };
  const commitEp6AndGoNext = () => {
    if (!episode6Blocks || !episode6Blocks.block1 || !episode6Blocks.block2 || !episode6Blocks.block3) return;
    const ep6 = episode6Blocks;
    if (!committedPhases["ep6"]) {
      setKpiBeforeEp6Result({ ...kpi });
      const result = getEp6Result(ep6.block1, ep6.block2, ep6.block3);
      if (result?.kpi) applyKpiDelta(result.kpi);
      markCommitted("ep6");
    }
    setEp6ConfirmOpen(false);
    router.push("/simulation?phase=ep6-result");
  };
  const ep6Selection = useMemo(() => {
    const b1 = episode6Blocks?.block1 ?? "";
    const b2 = episode6Blocks?.block2 ?? "";
    const b3 = episode6Blocks?.block3 ?? "";
    return {
      b1: ep6Block1Options.find((o) => o.id === b1)?.label ?? "",
      b2: ep6Block2Options.find((o) => o.id === b2)?.label ?? "",
      b3: ep6Block3Options.find((o) => o.id === b3)?.label ?? "",
    };
  }, [episode6Blocks]);
  const handleEp7Next = () => {
    if (phase !== "ep7-scene") return;
    if (!episode7Choice) return;
    setEp7ConfirmOpen(true);
  };
  const commitEp7AndGoNext = () => {
    if (!episode7Choice) return;
    if (!committedPhases["ep7"]) {
      setKpiBeforeEp7Result({ ...kpi });
      const vocHours = executionActionHours["voc_data"] ?? 0;
      const refHours = executionActionHours["ref_benchmark"] ?? 0;
      const result = getEp7Result(episode7Choice, vocHours, refHours);
      if (result?.kpi) applyKpiDelta(result.kpi);
      markCommitted("ep7");
    }
    setEp7ConfirmOpen(false);
    router.push("/simulation?phase=ep7-result");
  };
  const handleEp8Next = () => {
    if (phase !== "ep8-scene" && phase !== "ep8-input") return;
    router.push("/simulation?phase=ep8-result");
  };
  const handleEp10Next = () => {
    if (phase !== "ep10-scene") return;
    if (!episode10Choice) return;
    setEp10ConfirmOpen(true);
  };
  const commitEp10AndGoNext = () => {
    if (!episode10Choice) return;
    if (!committedPhases["ep10"]) {
      setKpiBeforeEp10Result({ ...kpi });
      const result = getEp10Result(episode10Choice);
      if (result?.kpi) applyKpiDelta(result.kpi);
      markCommitted("ep10");
    }
    setEp10ConfirmOpen(false);
    router.push("/simulation?phase=ep10-result");
  };

  /** 회색 HUD + SIM_COLUMN 본문 + initiation 푸터: 착수 3화면 + ep1-result 이후 전 phase (ep1-options 제외) */
  const grayHudChrome =
    phase === "initiation-action" ||
    phase === "initiation-d1" ||
    phase === "ep1-scene" ||
    (phaseIdx >= EP1_RESULT_PHASE_INDEX && EP1_RESULT_PHASE_INDEX >= 0);

  const planningAccentPhase = isPlanningAccentPhase(phase);
  const executionAccentPhase = isExecutionAccentPhase(phase);
  const monitoringAccentPhase = isMonitoringAccentPhase(phase);

  const isRampup = phase.endsWith("-rampup");

  const phaseTintBg = isRampup
    ? "bg-white"
    : monitoringAccentPhase
      ? "bg-[#fef5f5]"
      : executionAccentPhase
        ? "bg-[#fff9f3]"
        : planningAccentPhase
          ? "bg-[#f1f4f9]"
          : "bg-[#f4fef6]";

  /** 선배 노하우 전용 화면 — 상단 Stepper·KPI 헤더 숨김 (closing과 동일 UX) */
  const showSimulationHeader =
    phase !== "closing-scene" &&
    phase !== "initiation-senior-tips" &&
    phase !== "plan-survival" &&
    phase !== "exec-senior-tips" &&
    phase !== "monitoring-senior-tips";

  return (
    <main
      className={`min-h-screen flex flex-col ${
        closingSceneFullBleed
          ? "closing-scene-fullbleed"
          : initiationSeniorTipsFullBleed
            ? "initiation-senior-tips-fullbleed"
            : execSeniorTipsFullBleed
              ? "exec-senior-tips-fullbleed"
              : monitoringSeniorTipsFullBleed
                ? "monitoring-senior-tips-fullbleed"
                : planSurvivalFullBleed
                  ? "plan-survival-fullbleed"
                  : phaseTintBg
      } simulation-flat ${grayHudChrome ? "initiation-action-phase" : ""} ${planningAccentPhase ? "planning-accent-phase" : ""} ${executionAccentPhase ? "execution-accent-phase" : ""} ${monitoringAccentPhase ? "monitoring-accent-phase" : ""}`}
    >
      {showSimulationHeader && (
        <header className="simulation-hud sticky top-0 z-50 bg-white font-sans">
          <Stepper current={processStep} onHudMenuAction={handleHudMenuAction} progressPercent={progressPercent} />
          <KpiGauges phase={phase} />
        </header>
      )}
      {grayHudChrome ? (
        <div className={`w-full flex-1 ${SIM_COLUMN_GUTTER}`}>
          <div className={`initiation-content-shell py-8 sm:py-10 ${SIM_COLUMN_MAX_INNER}`}>
            {phase === "initiation-action" && <InitiationAction userName={userName} stage={initiationStage} />}
            {phase === "initiation-d1" && <InitiationD1Popup userName={userName} />}
            {phase === "ep1-scene" && <Ep1Scene userName={userName} />}
            {phase === "ep1-result" && <Ep1Result userName={userName} />}
            {phase === "ep2-scene" && <Ep2AlignScene userName={userName} />}
            {phase === "ep2-result" && <Ep2AlignResult userName={userName} />}
            {phase === "initiation-recap" && <InitiationRecap userName={userName} />}
            {phase === "initiation-senior-tips" && <InitiationSeniorTips userName={userName} />}
            {phase === "initiation-rampup" && <InitiationRampup userName={userName} progressPercent={progressPercent} />}
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
            {phase === "plan-rampup" && <PlanRampup userName={userName} progressPercent={progressPercent} />}
            {phase === "exec-action" && <ExecAction userName={userName} />}
            {phase === "exec-d1" && <ExecD1Popup userName={userName} />}
            {phase === "exec-board" && (
              <ExecBoard userName={userName} onPlacementChange={handleExecBoardPlacement} />
            )}
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
            {phase === "exec-rampup" && <ExecRampup userName={userName} progressPercent={progressPercent} />}
            {phase === "risk-radar" && (
              <RiskRadar userName={userName} onPlacementChange={handleRiskRadarPlacement} />
            )}
            {phase === "monitoring-scene" && <MonitoringScene userName={userName} />}
            {phase === "ep10-scene" && <Ep10FailureScene userName={userName} />}
            {phase === "ep10-result" && <Ep10Result userName={userName} />}
            {phase === "monitoring-recap" && <MonitoringRecap userName={userName} />}
            {phase === "monitoring-senior-tips" && <MonitoringSeniorTips userName={userName} />}
            {phase === "monitoring-rampup" && <MonitoringRampup userName={userName} progressPercent={progressPercent} />}
            {phase === "closing-scene" && <ClosingScene userName={userName} />}
          </div>
        </div>
      ) : (
        <div className={simulationContentClass}>{phase === "ep1-options" && <Ep1Options userName={userName} />}</div>
      )}
      {phase === "initiation-action" && initiationConfirmOpen && (
        <div className={MODAL_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 선택 그대로 진행할까요?</h3>
            </div>
            <div className="ds-modal-body">
              <p>
                현재 <span className="ds-modal-highlight">{initiationSelectedCount}개</span>의 액션 아이템을 선택했습니다.
                <br />
                이 선택 그대로 진행하시겠습니까?
              </p>
              {CONFIRM_CAUTION_MSG}
              <div className="ds-modal-actions">
                <button type="button" onClick={() => setInitiationConfirmOpen(false)} className={BTN_SUBTLE_CLASS}>
                  아니오
                </button>
                <button type="button" onClick={commitInitiationAndGoNext} className={BTN_PRIMARY_CLASS}>
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "plan-action" && planningConfirmOpen && (
        <div className={PLANNING_CONFIRM_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 선택 그대로 진행할까요?</h3>
            </div>
            <div className="ds-modal-body">
              <p>
                현재 <span className="ds-modal-highlight">{planningSelectedCount}개</span>의 액션 아이템을 선택했습니다.
                <br />
                이 선택 그대로 진행하시겠습니까?
              </p>
              {CONFIRM_CAUTION_MSG}
              <div className="ds-modal-actions">
                <button type="button" onClick={() => setPlanningConfirmOpen(false)} className={BTN_SUBTLE_CLASS}>
                  아니오
                </button>
                <button type="button" onClick={commitPlanningAndGoNext} className={BTN_PRIMARY_CLASS}>
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "exec-action" && execConfirmOpen && (
        <div className={MODAL_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 선택 그대로 진행할까요?</h3>
            </div>
            <div className="ds-modal-body">
              <p>
                현재 <span className="ds-modal-highlight">{executionSelectedCount}개</span>의 액션 아이템을 선택했습니다.
                <br />
                이 선택 그대로 진행하시겠습니까?
              </p>
              {CONFIRM_CAUTION_MSG}
              <div className="ds-modal-actions">
                <button type="button" onClick={() => setExecConfirmOpen(false)} className={BTN_SUBTLE_CLASS}>
                  아니오
                </button>
                <button type="button" onClick={commitExecutionAndGoNext} className={BTN_PRIMARY_CLASS}>
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep2-scene" && ep2ConfirmOpen && (
        <div className={MODAL_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 옵션으로 진행할까요?</h3>
            </div>
            <div className="ds-modal-body">
              <p>
                선택하신 의사결정은{" "}
                <span className="ds-modal-highlight">
                  옵션 {episode2AlignChoice}. {ep2AlignOptions.find((o) => o.id === episode2AlignChoice)?.title ?? ""}
                </span>
                입니다.
              </p>
              {CONFIRM_CAUTION_MSG}
              <div className="ds-modal-actions">
                <button type="button" onClick={() => setEp2ConfirmOpen(false)} className={BTN_SUBTLE_CLASS}>
                  아니오
                </button>
                <button type="button" onClick={commitEp2AndGoNext} className={BTN_PRIMARY_CLASS}>
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === "ep1-scene" && ep1ConfirmOpen && (
        <div className={MODAL_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 옵션으로 진행할까요?</h3>
            </div>
            <div className="ds-modal-body">
              <p>
                선택하신 의사결정은{" "}
                <span className="ds-modal-highlight">
                  옵션 {episode1Choice}. {ep1Options.find((o) => o.id === episode1Choice)?.title ?? ""}
                </span>
                입니다.
              </p>
              {CONFIRM_CAUTION_MSG}
              <div className="ds-modal-actions">
                <button type="button" onClick={() => setEp1ConfirmOpen(false)} className={BTN_SUBTLE_CLASS}>
                  아니오
                </button>
                <button type="button" onClick={commitEp1AndGoNext} className={BTN_PRIMARY_CLASS}>
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep3-scene" && ep3ConfirmOpen && (
        <div className={PLANNING_CONFIRM_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 옵션으로 진행할까요?</h3>
            </div>
            <div className="ds-modal-body">
              <p>
                선택하신 의사결정은{" "}
                <span className="ds-modal-highlight">
                  옵션 {episode3Choice}. {ep3Options.find((o) => o.id === episode3Choice)?.title ?? ""}
                </span>
                입니다.
              </p>
              {CONFIRM_CAUTION_MSG}
              <div className="ds-modal-actions">
                <button type="button" onClick={() => setEp3ConfirmOpen(false)} className={BTN_SUBTLE_CLASS}>
                  아니오
                </button>
                <button type="button" onClick={commitEp3AndGoNext} className={BTN_PRIMARY_CLASS}>
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep4-scene" && ep4ConfirmOpen && (
        <div className={PLANNING_CONFIRM_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 옵션으로 진행할까요?</h3>
            </div>
            <div className="ds-modal-body">
              <p>
                선택하신 의사결정은{" "}
                <span className="ds-modal-highlight">
                  옵션 {episode4Choice}. {ep4Options.find((o) => o.id === episode4Choice)?.title ?? ""}
                </span>
                입니다.
              </p>
              {CONFIRM_CAUTION_MSG}
              <div className="ds-modal-actions">
                <button type="button" onClick={() => setEp4ConfirmOpen(false)} className={BTN_SUBTLE_CLASS}>
                  아니오
                </button>
                <button type="button" onClick={commitEp4AndGoNext} className={BTN_PRIMARY_CLASS}>
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep5-scene" && ep5ConfirmOpen && (
        <div className={PLANNING_CONFIRM_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 옵션으로 진행할까요?</h3>
            </div>
            <div className="ds-modal-body">
              <p>
                선택하신 의사결정은{" "}
                <span className="ds-modal-highlight">
                  옵션 {episode5Choice}. {ep5Options.find((o) => o.id === episode5Choice)?.title ?? ""}
                </span>
                입니다.
              </p>
              {CONFIRM_CAUTION_MSG}
              <div className="ds-modal-actions">
                <button type="button" onClick={() => setEp5ConfirmOpen(false)} className={BTN_SUBTLE_CLASS}>
                  아니오
                </button>
                <button type="button" onClick={commitEp5AndGoNext} className={BTN_PRIMARY_CLASS}>
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep6-scene" && ep6ConfirmOpen && (
        <div className={MODAL_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 선택 그대로 진행할까요?</h3>
            </div>
            <div className="ds-modal-body">
              <div className="ds-modal-combo-box mb-4 rounded-md border-[1.5px] border-[#111] bg-[#fffbeb] p-4 text-left">
                <p className="text-[13px] font-extrabold text-black/85">선택한 조합</p>
                <ul className="mt-2 space-y-1.5 text-[14px] leading-[1.7] text-black/75">
                  <li><span className="font-extrabold text-black/85">소통 대상</span> · {ep6Selection.b1}</li>
                  <li><span className="font-extrabold text-black/85">소통 채널</span> · {ep6Selection.b2}</li>
                  <li><span className="font-extrabold text-black/85">소통 톤</span> · {ep6Selection.b3}</li>
                </ul>
              </div>
              <p>이 조합으로 결과를 확인하시겠습니까?</p>
              {CONFIRM_CAUTION_MSG}
              <div className="ds-modal-actions">
                <button type="button" onClick={() => setEp6ConfirmOpen(false)} className={BTN_SUBTLE_CLASS}>
                  아니오
                </button>
                <button type="button" onClick={commitEp6AndGoNext} className={BTN_PRIMARY_CLASS}>
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep7-scene" && ep7ConfirmOpen && (
        <div className={MODAL_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 옵션으로 진행할까요?</h3>
            </div>
            <div className="ds-modal-body">
              <p>
                선택하신 의사결정은{" "}
                <span className="ds-modal-highlight">
                  옵션 {episode7Choice}. {ep7Options.find((o) => o.id === episode7Choice)?.title ?? ""}
                </span>
                입니다.
              </p>
              {CONFIRM_CAUTION_MSG}
              <div className="ds-modal-actions">
                <button type="button" onClick={() => setEp7ConfirmOpen(false)} className={BTN_SUBTLE_CLASS}>
                  아니오
                </button>
                <button type="button" onClick={commitEp7AndGoNext} className={BTN_PRIMARY_CLASS}>
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {phase === "ep10-scene" && ep10ConfirmOpen && (
        <div className={MODAL_OVERLAY_CLASS} role="dialog" aria-modal="true">
          <div className={MODAL_FRAME_CLASS}>
            <div className={MODAL_HEAD_CLASS}>
              <p className={MODAL_HEAD_LABEL_CLASS}>CHECK</p>
              <h3 className={MODAL_HEAD_TITLE_CLASS}>이 옵션으로 진행할까요?</h3>
            </div>
            <div className="ds-modal-body">
              <p>
                선택하신 의사결정은{" "}
                <span className="ds-modal-highlight">
                  옵션 {episode10Choice}. {ep10Options.find((o) => o.id === episode10Choice)?.title ?? ""}
                </span>
                입니다.
              </p>
              {CONFIRM_CAUTION_MSG}
              <div className="ds-modal-actions">
                <button type="button" onClick={() => setEp10ConfirmOpen(false)} className={BTN_SUBTLE_CLASS}>
                  아니오
                </button>
                <button type="button" onClick={commitEp10AndGoNext} className={BTN_PRIMARY_CLASS}>
                  네
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <SimulationHudModal
        open={simulationProgressModalOpen}
        onClose={() => setSimulationProgressModalOpen(false)}
        title="시뮬레이션 진행 상황"
        titleId="hud-sim-progress-title"
        size="md"
      >
        <div className="space-y-5">
          <p className="font-sans text-[14px] leading-relaxed text-black/80">
            현재 프로세스 그룹은 <span className="font-extrabold text-black">{processStep}</span> 입니다. 상단 셰브론 단계 표시와 동일한
            기준입니다.
          </p>
          <ol className="space-y-2 border-t-2 border-black/10 pt-4 font-sans text-[15px]">
            {PROCESS_STEPS.map((step) => (
              <li
                key={step}
                className={`flex items-center gap-2 ${step === processStep ? "font-extrabold text-black" : "text-black/50"}`}
              >
                <span aria-hidden className="w-6 shrink-0 text-center">
                  {step === processStep ? "●" : "○"}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="rounded-xl border-2 border-black/10 bg-[#f3f4f6] px-3 py-2 font-mono text-[12px] text-black/70">
            현재 화면 코드: {phase}
          </p>
        </div>
      </SimulationHudModal>

      <SimulationHudModal
        open={pmInfoModalOpen}
        onClose={() => setPmInfoModalOpen(false)}
        title="튜토리얼"
        titleId="hud-pm-info-title"
        size="2xl"
        bodyClassName="p-0 sm:p-0"
      >
        <div className="max-h-[min(80vh,860px)] min-h-0 overflow-y-auto">
          <OnboardingStep0 onNext={() => setPmInfoModalOpen(false)} />
        </div>
      </SimulationHudModal>

      <SimulationHudModal
        open={projectOverviewModalOpen}
        onClose={() => setProjectOverviewModalOpen(false)}
        title="프로젝트 개요"
        titleId="hud-project-overview-title"
        size="2xl"
        bodyClassName="p-0 sm:p-0"
      >
        <div className="max-h-[min(80vh,860px)] min-h-0 overflow-y-auto">
          <ProjectOverview />
        </div>
      </SimulationHudModal>

      <SimulationHudModal
        open={membersModalOpen}
        onClose={() => setMembersModalOpen(false)}
        title="주요 인물 정보"
        titleId="hud-members-title"
        size="2xl"
        bodyClassName="p-0 sm:p-0"
      >
        <div className="max-h-[min(80vh,860px)] min-h-0 overflow-y-auto">
          <OnboardingStep2 onNext={() => setMembersModalOpen(false)} userName={userName} />
        </div>
      </SimulationHudModal>
      {phase !== "closing-scene" && <PrevNextNav
        prevHref={prevHref}
        nextHref={nextHref}
        nextLabel={phase === "initiation-d1" ? "상무님 호출에 응답하기" : undefined}
        simHudFooterLayout={grayHudChrome}
        centerSlot={
          phase === "initiation-action" ? (
            <>
              <span className="initiation-footer-meta w-full text-center font-sans text-[12px] font-extrabold text-black/45 sm:w-auto sm:text-left">
                선택 된 액션 {initiationSelectedCount} / 2
              </span>
              {initiationActions
                .filter((a) => (initiationActionHours[a.id] ?? 0) > 0)
                .map((a) => (
                  <span
                    key={a.id}
                    className="initiation-footer-chip-green inline-flex max-w-[min(100%,220px)] items-center gap-1.5 rounded-[10px] border-2 border-black bg-[#64e87a] px-3 py-2 font-sans text-[12px] font-extrabold text-black shadow-[2px_2px_0_#111111] sm:text-[13px]"
                  >
                    <span aria-hidden className="neo-no-bg text-white">
                      ✓
                    </span>
                    <span className="neo-no-bg min-w-0 truncate">{a.title.length > 22 ? `${a.title.slice(0, 22)}…` : a.title}</span>
                  </span>
                ))}
              {phase === "initiation-action" && initiationSelectedCount < 2 ? (
                <span className="initiation-footer-chip-placeholder inline-flex items-center rounded-[10px] border-2 border-dashed border-black/35 bg-white px-3 py-2 font-sans text-[12px] font-semibold text-black/40 sm:text-[13px]">
                  액션 카드를 선택해주세요.
                </span>
              ) : null}
            </>
          ) : phase === "plan-action" ? (
            <>
              <span className="initiation-footer-meta w-full text-center font-sans text-[12px] font-extrabold text-black/45 sm:w-auto sm:text-left">
                선택 된 액션 {planningSelectedCount} / 2
              </span>
              {planningActions
                .filter((a) => (planningActionHours[a.id] ?? 0) > 0)
                .map((a) => (
                  <span
                    key={a.id}
                    className="initiation-footer-chip-green inline-flex max-w-[min(100%,220px)] items-center gap-1.5 rounded-[10px] border-2 border-black bg-[#64e87a] px-3 py-2 font-sans text-[12px] font-extrabold text-black shadow-[2px_2px_0_#111111] sm:text-[13px]"
                  >
                    <span aria-hidden className="neo-no-bg text-white">
                      ✓
                    </span>
                    <span className="neo-no-bg min-w-0 truncate">{a.title.length > 22 ? `${a.title.slice(0, 22)}…` : a.title}</span>
                  </span>
                ))}
              {planningSelectedCount < 2 ? (
                <span className="initiation-footer-chip-placeholder inline-flex items-center rounded-[10px] border-2 border-dashed border-black/35 bg-white px-3 py-2 font-sans text-[12px] font-semibold text-black/40 sm:text-[13px]">
                  액션 카드를 선택해주세요.
                </span>
              ) : null}
            </>
          ) : phase === "exec-action" ? (
            <div className="flex w-full min-w-0 max-w-full flex-nowrap items-center justify-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2">
              <span className="shrink-0 whitespace-nowrap font-sans text-[10px] font-extrabold text-black/45 sm:text-[11px]">
                선택 된 액션 {executionSelectedCount}/{EXEC_ACTION_MAX_SELECTED}
              </span>
              {executionActions
                .filter((a) => (executionActionHours[a.id] ?? 0) > 0)
                .map((a) => (
                  <span
                    key={a.id}
                    className="initiation-footer-chip-green inline-flex max-w-[9.5rem] shrink-0 items-center gap-1 rounded-[8px] border-2 border-black bg-[#FF7A00] px-2 py-1.5 font-sans text-[10px] font-extrabold leading-tight text-black shadow-[2px_2px_0_#111111] sm:max-w-[11rem] sm:text-[11px]"
                  >
                    <span aria-hidden className="neo-no-bg shrink-0 text-white">
                      ✓
                    </span>
                    <span className="neo-no-bg min-w-0 truncate">{a.title.length > 16 ? `${a.title.slice(0, 16)}…` : a.title}</span>
                  </span>
                ))}
              {executionSelectedCount < EXEC_ACTION_MAX_SELECTED ? (
                <span className="initiation-footer-chip-placeholder inline-flex shrink-0 items-center rounded-[8px] border-2 border-dashed border-black/35 bg-white px-2 py-1.5 font-sans text-[10px] font-semibold text-black/40 sm:text-[11px]">
                  카드 선택
                </span>
              ) : null}
            </div>
          ) : undefined
        }
        hideNext={phase === "closing-scene"}
        nextDisabled={
          (phase === "initiation-action" && initiationSelectedCount !== 2) ||
          (phase === "plan-action" && planningSelectedCount !== 2) ||
          (phase === "ep1-scene" && !episode1Choice) ||
          (phase === "ep2-scene" && !episode2AlignChoice) ||
          (phase === "ep3-scene" && !episode3Choice) ||
          (phase === "ep4-scene" && !episode4Choice) ||
          (phase === "ep5-scene" && !episode5Choice) ||
          (phase === "ep6-scene" && (!episode6Blocks || !episode6Blocks.block1 || !episode6Blocks.block2 || !episode6Blocks.block3)) ||
          (phase === "ep7-scene" && !episode7Choice) ||
          (phase === "ep10-scene" && !episode10Choice) ||
          (phase === "exec-action" && executionSelectedCount !== EXEC_ACTION_MAX_SELECTED) ||
          (phase === "exec-board" && !execBoardAllCorrect) ||
          (phase === "risk-radar" && !riskRadarAllCorrect)
        }
        onNextClick={
          phase === "initiation-action"
            ? handleInitiationNext
            : phase === "plan-action"
              ? handlePlanningNext
              : phase === "exec-action"
                ? handleExecNext
                : phase === "exec-board"
                  ? () => setExecBoardWbsOpen(true)
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
                                : phase === "ep8-scene" || phase === "ep8-input"
                                  ? handleEp8Next
                                  : phase === "ep10-scene"
                                    ? handleEp10Next
                                    : undefined
        }
      />}
      {phase === "exec-board" && (
        <ExecBoardWbsTimelineModal
          open={execBoardWbsOpen}
          onClose={() => setExecBoardWbsOpen(false)}
          onConfirm={() => {
            setExecBoardWbsOpen(false);
            router.push(nextHref);
          }}
          placement={execBoardPlacement}
        />
      )}
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
