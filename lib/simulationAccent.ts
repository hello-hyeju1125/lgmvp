/** 시뮬레이션 상단 HUD·푸터·강조에 쓰는 단계별 액센트 (--sim-accent 등) */

export const SIM_ACCENT_GREEN = "#64e87a";
export const SIM_ACCENT_GREEN_END = "#76d789";
export const SIM_ACCENT_PLANNING_NAVY = "#1e3a5f";
export const SIM_ACCENT_PLANNING_NAVY_END = "#2d5684";

/** 실행(3단계) 전용 네온 오렌지 — 네온 그린 대체 */
export const SIM_ACCENT_EXECUTION_AMBER = "#FF7A00";
export const SIM_ACCENT_EXECUTION_AMBER_END = "#FF5500";

const EXECUTION_ACCENT_PHASES = new Set([
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
]);

/** 실행 단계 화면 — main.execution-accent-phase + globals 오버라이드 */
export function isExecutionAccentPhase(phase: string): boolean {
  return EXECUTION_ACCENT_PHASES.has(phase);
}

/** 감시/통제 — 네온 그린 대체 레드 #ef4444 */
export const SIM_ACCENT_MONITORING_RED = "#ef4444";
export const SIM_ACCENT_MONITORING_RED_END = "#dc2626";

const MONITORING_ACCENT_PHASES = new Set([
  "risk-radar",
  "ep10-scene",
  "ep10-result",
  "monitoring-recap",
  "monitoring-senior-tips",
  "monitoring-rampup",
]);

/** 감시·통제 단계 — main.monitoring-accent-phase + globals 오버라이드 */
export function isMonitoringAccentPhase(phase: string): boolean {
  return MONITORING_ACCENT_PHASES.has(phase);
}

/** 기획(2단계) 전용 네이비 액센트 — 착수의 ep3-charter/ep3-result 등은 제외 */
export function isPlanningAccentPhase(phase: string): boolean {
  if (phase === "plan-action" || phase === "planning-d1") return true;
  if (phase === "plan-recap" || phase === "plan-survival" || phase === "plan-rampup") return true;
  return (
    [
      "ep3-scene",
      "ep3-options",
      "ep3-team-result",
      "ep4-scene",
      "ep4-options",
      "ep4-result",
      "ep5-scene",
      "ep5-options",
      "ep5-result",
    ].includes(phase)
  );
}
