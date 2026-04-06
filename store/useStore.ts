import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Episode1Choice = "A" | "B" | "C" | null;

export type Episode3Choice = "A" | "B" | "C" | "D" | null;
export type Episode4Choice = "A" | "B" | "C" | "D" | "E" | null;
export type Episode5Choice = "A" | "B" | "C" | "D" | null;
export type Episode6Block = { block1: string; block2: string; block3: string; block4: string };
export type Episode7Choice = "A" | "B" | "C" | "D" | null;
export type Episode10Choice = "A" | "B" | "C" | null;

export type CharterBlockId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Ep2Pattern =
  | "dictator"
  | "line-crosser"
  | "misaligned"
  | "strategic"
  | "empty-handed"
  | null;

export interface KpiState {
  quality: number;       // 산출물 품질 0-100
  delivery: number;      // 일정 준수 0-100
  teamEngagement: number;
  stakeholderAlignment: number; // 이해관계자 조율 0-100
  leaderEnergy: number;
}

const INITIAL_KPI: KpiState = {
  quality: 75,
  delivery: 75,
  teamEngagement: 75,
  stakeholderAlignment: 75,
  leaderEnergy: 100,
};

interface AppState {
  nickname: string;
  setNickname: (v: string) => void;

  onboardingStep: number;
  setOnboardingStep: (step: number) => void;

  /** 온보딩: Step1(메일) 빈칸 reveal 상태 (한 번 열리면 유지) */
  onboardingStep1Revealed: Record<number, boolean>;
  revealOnboardingStep1: (index: number) => void;

  /** 온보딩: Step3(프로젝트 개요) reveal 칩 상태 (한 번 열리면 유지) */
  onboardingStep3Revealed: Record<number, boolean>;
  revealOnboardingStep3: (index: number) => void;

  simulationPhase: string;
  setSimulationPhase: (phase: string) => void;

  kpi: KpiState;
  applyKpiDelta: (delta: Partial<Record<keyof KpiState, number>>) => void;
  resetKpi: () => void;

  /** 각 의사결정 단계별 KPI 적용 여부 추적 — 최초 1회만 반영 */
  committedPhases: Record<string, boolean>;
  markCommitted: (phase: string) => void;

  /** 시뮬레이션 전체 초기화 (리플레이용) */
  resetSimulation: () => void;

  /** 착수 D-1 팝업에서 "지표 변화" 표시용 (적용 직전 KPI 스냅샷) */
  kpiBeforeInitiation: KpiState | null;
  setKpiBeforeInitiation: (k: KpiState | null) => void;

  /** 기획 D-1 팝업에서 "지표 변화" 표시용 (적용 직전 KPI 스냅샷) */
  kpiBeforePlanning: KpiState | null;
  setKpiBeforePlanning: (k: KpiState | null) => void;

  /** 실행 D-1 팝업에서 "지표 변화" 표시용 (적용 직전 KPI 스냅샷) */
  kpiBeforeExecution: KpiState | null;
  setKpiBeforeExecution: (k: KpiState | null) => void;

  /** E1 결과 HUD 애니메이션용 (선택 직전 KPI — applyKpiDelta 이전 값) */
  kpiBeforeEp1Result: KpiState | null;
  setKpiBeforeEp1Result: (k: KpiState | null) => void;

  /** E2 결과 HUD 애니메이션용 */
  kpiBeforeEp2Result: KpiState | null;
  setKpiBeforeEp2Result: (k: KpiState | null) => void;

  /** E3 결과 HUD 애니메이션용 */
  kpiBeforeEp3Result: KpiState | null;
  setKpiBeforeEp3Result: (k: KpiState | null) => void;

  /** E4 결과 HUD 애니메이션용 */
  kpiBeforeEp4Result: KpiState | null;
  setKpiBeforeEp4Result: (k: KpiState | null) => void;

  /** E5 결과 HUD 애니메이션용 */
  kpiBeforeEp5Result: KpiState | null;
  setKpiBeforeEp5Result: (k: KpiState | null) => void;

  /** E6 결과 HUD 애니메이션용 */
  kpiBeforeEp6Result: KpiState | null;
  setKpiBeforeEp6Result: (k: KpiState | null) => void;

  /** E7 결과 HUD 애니메이션용 */
  kpiBeforeEp7Result: KpiState | null;
  setKpiBeforeEp7Result: (k: KpiState | null) => void;

  /** E10 결과 HUD 애니메이션용 */
  kpiBeforeEp10Result: KpiState | null;
  setKpiBeforeEp10Result: (k: KpiState | null) => void;

  episode1Choice: Episode1Choice;
  setEpisode1Choice: (c: Episode1Choice) => void;

  /** E1 scene: 최성민 상무 인용구 펼침 (한 번 열면 유지) */
  ep1SceneRevealedQuotes: { first: boolean; second: boolean };
  revealEp1SceneQuote: (key: "first" | "second") => void;

  episode2AlignChoice: "A" | "B" | "C" | null;
  setEpisode2AlignChoice: (c: "A" | "B" | "C" | null) => void;

  episode2SelectedBlocks: CharterBlockId[];
  setEpisode2SelectedBlocks: (ids: CharterBlockId[]) => void;
  toggleEpisode2Block: (id: CharterBlockId) => void;

  episode2Pattern: Ep2Pattern;
  setEpisode2Pattern: (p: Ep2Pattern) => void;

  /** 착수 40h 액션 배분 (5개, 각 5~25h, 합 40) */
  initiationActionHours: Record<string, number>;
  setInitiationActionHours: (hours: Record<string, number>) => void;

  /** 기획 40h 액션 배분 */
  planningActionHours: Record<string, number>;
  setPlanningActionHours: (hours: Record<string, number>) => void;

  /** 실행 80h 액션 배분 */
  executionActionHours: Record<string, number>;
  setExecutionActionHours: (hours: Record<string, number>) => void;

  episode3Choice: Episode3Choice;
  setEpisode3Choice: (c: Episode3Choice) => void;
  episode4Choice: Episode4Choice;
  setEpisode4Choice: (c: Episode4Choice) => void;
  episode5Choice: Episode5Choice;
  setEpisode5Choice: (c: Episode5Choice) => void;
  episode6Blocks: Episode6Block | null;
  setEpisode6Blocks: (b: Episode6Block | null) => void;
  episode7Choice: Episode7Choice;
  setEpisode7Choice: (c: Episode7Choice) => void;
  episode8CoachingText: string;
  setEpisode8CoachingText: (t: string) => void;
  episode10Choice: Episode10Choice;
  setEpisode10Choice: (c: Episode10Choice) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      nickname: "",
      setNickname: (v) => set({ nickname: v }),

      onboardingStep: 0,
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      onboardingStep1Revealed: {},
      revealOnboardingStep1: (index) =>
        set((s) => {
          if (s.onboardingStep1Revealed[index]) return s;
          return { onboardingStep1Revealed: { ...s.onboardingStep1Revealed, [index]: true } };
        }),

      onboardingStep3Revealed: {},
      revealOnboardingStep3: (index) =>
        set((s) => {
          if (s.onboardingStep3Revealed[index]) return s;
          return { onboardingStep3Revealed: { ...s.onboardingStep3Revealed, [index]: true } };
        }),

      simulationPhase: "ep1-scene",
      setSimulationPhase: (phase) => set({ simulationPhase: phase }),

      kpi: INITIAL_KPI,
      applyKpiDelta: (delta) =>
        set((s) => ({
          kpi: {
            quality: Math.max(0, Math.min(100, s.kpi.quality + (delta.quality ?? 0))),
            delivery: Math.max(0, Math.min(100, s.kpi.delivery + (delta.delivery ?? 0))),
            teamEngagement: Math.max(0, Math.min(100, s.kpi.teamEngagement + (delta.teamEngagement ?? 0))),
            stakeholderAlignment: Math.max(0, Math.min(100, s.kpi.stakeholderAlignment + (delta.stakeholderAlignment ?? 0))),
            leaderEnergy: Math.max(0, Math.min(100, s.kpi.leaderEnergy + (delta.leaderEnergy ?? 0))),
          },
        })),
      resetKpi: () => set({ kpi: INITIAL_KPI }),

      committedPhases: {},
      markCommitted: (phase) =>
        set((s) => ({
          committedPhases: { ...s.committedPhases, [phase]: true },
        })),

      resetSimulation: () =>
        set({
          kpi: INITIAL_KPI,
          committedPhases: {},
          kpiBeforeInitiation: null,
          kpiBeforePlanning: null,
          kpiBeforeExecution: null,
          kpiBeforeEp1Result: null,
          kpiBeforeEp2Result: null,
          kpiBeforeEp3Result: null,
          kpiBeforeEp4Result: null,
          kpiBeforeEp5Result: null,
          kpiBeforeEp6Result: null,
          kpiBeforeEp7Result: null,
          kpiBeforeEp10Result: null,
          episode1Choice: null,
          ep1SceneRevealedQuotes: { first: false, second: false },
          episode2AlignChoice: null,
          episode2SelectedBlocks: [],
          episode2Pattern: null,
          initiationActionHours: {},
          planningActionHours: {},
          executionActionHours: {},
          episode3Choice: null,
          episode4Choice: null,
          episode5Choice: null,
          episode6Blocks: null,
          episode7Choice: null,
          episode8CoachingText: "",
          episode10Choice: null,
        }),

      kpiBeforeInitiation: null,
      setKpiBeforeInitiation: (k) => set({ kpiBeforeInitiation: k }),

      kpiBeforePlanning: null,
      setKpiBeforePlanning: (k) => set({ kpiBeforePlanning: k }),

      kpiBeforeExecution: null,
      setKpiBeforeExecution: (k) => set({ kpiBeforeExecution: k }),

      kpiBeforeEp1Result: null,
      setKpiBeforeEp1Result: (k) => set({ kpiBeforeEp1Result: k }),

      kpiBeforeEp2Result: null,
      setKpiBeforeEp2Result: (k) => set({ kpiBeforeEp2Result: k }),

      kpiBeforeEp3Result: null,
      setKpiBeforeEp3Result: (k) => set({ kpiBeforeEp3Result: k }),

      kpiBeforeEp4Result: null,
      setKpiBeforeEp4Result: (k) => set({ kpiBeforeEp4Result: k }),

      kpiBeforeEp5Result: null,
      setKpiBeforeEp5Result: (k) => set({ kpiBeforeEp5Result: k }),

      kpiBeforeEp6Result: null,
      setKpiBeforeEp6Result: (k) => set({ kpiBeforeEp6Result: k }),

      kpiBeforeEp7Result: null,
      setKpiBeforeEp7Result: (k) => set({ kpiBeforeEp7Result: k }),

      kpiBeforeEp10Result: null,
      setKpiBeforeEp10Result: (k) => set({ kpiBeforeEp10Result: k }),

      episode1Choice: null,
      setEpisode1Choice: (c) => set({ episode1Choice: c }),

      ep1SceneRevealedQuotes: { first: false, second: false },
      revealEp1SceneQuote: (key) =>
        set((s) => {
          if (s.ep1SceneRevealedQuotes[key]) return s;
          return {
            ep1SceneRevealedQuotes: { ...s.ep1SceneRevealedQuotes, [key]: true },
          };
        }),

      episode2AlignChoice: null,
      setEpisode2AlignChoice: (c) => set({ episode2AlignChoice: c }),

      episode2SelectedBlocks: [],
      setEpisode2SelectedBlocks: (ids) => set({ episode2SelectedBlocks: ids }),
      toggleEpisode2Block: (id) =>
        set((s) => {
          const has = s.episode2SelectedBlocks.includes(id);
          if (has) return { episode2SelectedBlocks: s.episode2SelectedBlocks.filter((x) => x !== id) };
          if (s.episode2SelectedBlocks.length >= 4) return s;
          return { episode2SelectedBlocks: [...s.episode2SelectedBlocks, id].sort((a, b) => a - b) };
        }),

      episode2Pattern: null,
      setEpisode2Pattern: (p) => set({ episode2Pattern: p }),

      initiationActionHours: {},
      setInitiationActionHours: (hours) => set({ initiationActionHours: hours }),

      planningActionHours: {},
      setPlanningActionHours: (hours) => set({ planningActionHours: hours }),

      executionActionHours: {},
      setExecutionActionHours: (hours) => set({ executionActionHours: hours }),

      episode3Choice: null,
      setEpisode3Choice: (c) => set({ episode3Choice: c }),
      episode4Choice: null,
      setEpisode4Choice: (c) => set({ episode4Choice: c }),
      episode5Choice: null,
      setEpisode5Choice: (c) => set({ episode5Choice: c }),
      episode6Blocks: null,
      setEpisode6Blocks: (b) => set({ episode6Blocks: b }),
      episode7Choice: null,
      setEpisode7Choice: (c) => set({ episode7Choice: c }),
      episode8CoachingText: "",
      setEpisode8CoachingText: (t) => set({ episode8CoachingText: t }),
      episode10Choice: null,
      setEpisode10Choice: (c) => set({ episode10Choice: c }),
    }),
    {
      name: "lg-pm-simulation",
      version: 1,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version === 0 && state?.kpi) {
          const old = state.kpi as KpiState;
          return {
            ...state,
            kpi: {
              ...old,
              quality: Math.min(100, old.quality + 25),
              delivery: Math.min(100, old.delivery + 25),
              teamEngagement: Math.min(100, old.teamEngagement + 25),
              stakeholderAlignment: Math.min(100, old.stakeholderAlignment + 25),
            },
          };
        }
        return state;
      },
    }
  )
);
