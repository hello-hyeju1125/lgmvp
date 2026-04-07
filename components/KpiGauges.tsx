"use client";

import { useEffect, useMemo, type CSSProperties } from "react";
import { SIM_COLUMN_GUTTER, SIM_COLUMN_MAX_INNER } from "@/lib/simulationLayout";
import { useStore } from "@/store/useStore";
import type { KpiState } from "@/store/useStore";
import type { LucideIcon } from "lucide-react";
import { Calendar, FileText, Sparkles, Users, UsersRound } from "lucide-react";

const KPI_ROWS: {
  field: keyof Pick<KpiState, "quality" | "delivery" | "teamEngagement" | "stakeholderAlignment" | "leaderEnergy">;
  label: string;
  Icon: LucideIcon;
  help: string;
}[] = [
  {
    field: "stakeholderAlignment",
    label: "이해관계자 조율",
    Icon: UsersRound,
    help: "유관부서·임원진의 협조와 프로젝트 지지도 수준을 의미합니다.",
  },
  {
    field: "delivery",
    label: "일정 준수",
    Icon: Calendar,
    help: "계획한 마일스톤을 제때 달성하고 있는지를 보여줍니다.",
  },
  {
    field: "teamEngagement",
    label: "팀 몰입도",
    Icon: Users,
    help: "팀원들이 목표에 자발적으로 참여하고 협업에 몰입하는 수준입니다.",
  },
  {
    field: "quality",
    label: "산출물 품질",
    Icon: FileText,
    help: "결과물의 완성도와 실효성을 나타내는 품질 지표입니다.",
  },
  {
    field: "leaderEnergy",
    label: "리더 에너지",
    Icon: Sparkles,
    help: "리더가 의사결정과 실행을 지속할 수 있는 한정 자원입니다.",
  },
];

function clampPct(n: number) {
  return Math.max(0, Math.min(100, n));
}

type Ep1Tone = "up" | "down" | "flat";

function ep1DramaticStops(from: number, to: number): {
  peak: number;
  mid: number;
  tone: Ep1Tone;
  keyframes: "kpi-ep1-up" | "kpi-ep1-down" | "kpi-ep1-flat";
} {
  const a = clampPct(from);
  const b = clampPct(to);
  const d = b - a;
  if (Math.abs(d) < 0.5) {
    const w = 1.2;
    return {
      peak: clampPct(a + w),
      mid: clampPct(a - w * 0.45),
      tone: "flat",
      keyframes: "kpi-ep1-flat",
    };
  }
  if (d > 0) {
    const overshoot = Math.min(12, d * 0.48 + 3.5);
    const peak = clampPct(b + overshoot);
    const mid = clampPct(b - Math.min(7, d * 0.28 + 2));
    return { peak, mid, tone: "up", keyframes: "kpi-ep1-up" };
  }
  const undershoot = Math.min(12, Math.abs(d) * 0.48 + 3.5);
  const peak = clampPct(b - undershoot);
  const mid = clampPct(b + Math.min(7, Math.abs(d) * 0.28 + 2));
  return { peak, mid, tone: "down", keyframes: "kpi-ep1-down" };
}

export type KpiGaugesProps = {
  /** `ep1-result`일 때 E1 선택 직전 스냅샷이 있으면 HUD 게이지 드라마틱 애니메이션 */
  phase?: string;
};

/**
 * 시뮬레이션 HUD 하단: 연회색 배경 + 5열 균등 배치 (디자인 시안과 동일).
 */
export function KpiGauges({ phase }: KpiGaugesProps) {
  const kpi = useStore((s) => s.kpi);
  const kpiBeforeInitiation = useStore((s) => s.kpiBeforeInitiation);
  const setKpiBeforeInitiation = useStore((s) => s.setKpiBeforeInitiation);
  const kpiBeforePlanning = useStore((s) => s.kpiBeforePlanning);
  const setKpiBeforePlanning = useStore((s) => s.setKpiBeforePlanning);
  const kpiBeforeExecution = useStore((s) => s.kpiBeforeExecution);
  const setKpiBeforeExecution = useStore((s) => s.setKpiBeforeExecution);
  const kpiBeforeEp1Result = useStore((s) => s.kpiBeforeEp1Result);
  const setKpiBeforeEp1Result = useStore((s) => s.setKpiBeforeEp1Result);
  const kpiBeforeEp2Result = useStore((s) => s.kpiBeforeEp2Result);
  const setKpiBeforeEp2Result = useStore((s) => s.setKpiBeforeEp2Result);
  const kpiBeforeEp3Result = useStore((s) => s.kpiBeforeEp3Result);
  const setKpiBeforeEp3Result = useStore((s) => s.setKpiBeforeEp3Result);
  const kpiBeforeEp4Result = useStore((s) => s.kpiBeforeEp4Result);
  const setKpiBeforeEp4Result = useStore((s) => s.setKpiBeforeEp4Result);
  const kpiBeforeEp5Result = useStore((s) => s.kpiBeforeEp5Result);
  const setKpiBeforeEp5Result = useStore((s) => s.setKpiBeforeEp5Result);
  const kpiBeforeEp6Result = useStore((s) => s.kpiBeforeEp6Result);
  const setKpiBeforeEp6Result = useStore((s) => s.setKpiBeforeEp6Result);
  const kpiBeforeEp7Result = useStore((s) => s.kpiBeforeEp7Result);
  const setKpiBeforeEp7Result = useStore((s) => s.setKpiBeforeEp7Result);
  const kpiBeforeEp10Result = useStore((s) => s.kpiBeforeEp10Result);
  const setKpiBeforeEp10Result = useStore((s) => s.setKpiBeforeEp10Result);

  const kpiSnapshotMap: Record<string, [typeof kpiBeforeEp1Result, (k: typeof kpiBeforeEp1Result) => void]> = {
    "initiation-d1": [kpiBeforeInitiation, setKpiBeforeInitiation],
    "planning-d1": [kpiBeforePlanning, setKpiBeforePlanning],
    "exec-d1": [kpiBeforeExecution, setKpiBeforeExecution],
    "ep1-result": [kpiBeforeEp1Result, setKpiBeforeEp1Result],
    "ep2-result": [kpiBeforeEp2Result, setKpiBeforeEp2Result],
    "ep3-team-result": [kpiBeforeEp3Result, setKpiBeforeEp3Result],
    "ep4-result": [kpiBeforeEp4Result, setKpiBeforeEp4Result],
    "ep5-result": [kpiBeforeEp5Result, setKpiBeforeEp5Result],
    "ep6-result": [kpiBeforeEp6Result, setKpiBeforeEp6Result],
    "ep7-result": [kpiBeforeEp7Result, setKpiBeforeEp7Result],
    "ep10-result": [kpiBeforeEp10Result, setKpiBeforeEp10Result],
  };

  const entry = phase ? kpiSnapshotMap[phase] : undefined;
  const baseline = entry?.[0] ?? null;
  const clearBaseline = entry?.[1] ?? setKpiBeforeEp1Result;
  const playAnim = baseline !== null;

  useEffect(() => {
    if (!playAnim) return;
    const lastDelayMs = (KPI_ROWS.length - 1) * 88;
    const animMs = 1480;
    const t = window.setTimeout(() => clearBaseline(null), lastDelayMs + animMs + 120);
    return () => window.clearTimeout(t);
  }, [playAnim, clearBaseline]);

  const rowMeta = useMemo(() => {
    if (!playAnim || !baseline) return null;
    return KPI_ROWS.map(({ field }) => {
      const before = clampPct(baseline[field]);
      const after = clampPct(kpi[field]);
      const { peak, mid, tone, keyframes } = ep1DramaticStops(before, after);
      const dirClass =
        tone === "up" ? "kpi-bar-fill--ep1-up" : tone === "down" ? "kpi-bar-fill--ep1-down" : "kpi-bar-fill--ep1-flat";
      const deltaPts = Math.round(after) - Math.round(before);
      return { before, after, peak, mid, keyframes, dirClass, deltaPts };
    });
  }, [playAnim, baseline, kpi]);

  return (
    <div className={`sim-hud-kpi-strip py-4 ${SIM_COLUMN_GUTTER}`}>
      <div className={`grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6 ${SIM_COLUMN_MAX_INNER}`}>
        {KPI_ROWS.map(({ field, label, Icon, help }, index) => {
          const value = clampPct(kpi[field]);
          const isEnergy = field === "leaderEnergy";
          const meta = rowMeta?.[index];

          const fillClass = isEnergy ? "kpi-bar-fill-energy" : "kpi-bar-fill-kpi";
          const ep1Extra = playAnim && meta ? `${meta.dirClass} kpi-bar-fill--ep1-animating` : "";
          const barClass = `h-full min-h-[7px] ${fillClass} ${ep1Extra} ${
            playAnim && meta ? "" : "transition-[width] duration-1000 ease-out"
          }`;

          const animStyle =
            playAnim && meta
              ? ({
                  ["--kpi-from" as string]: `${meta.before}%`,
                  ["--kpi-to" as string]: `${meta.after}%`,
                  ["--kpi-peak" as string]: `${meta.peak}%`,
                  ["--kpi-mid" as string]: `${meta.mid}%`,
                  animation: `${meta.keyframes} 1.48s cubic-bezier(0.25, 0.9, 0.35, 1) ${index * 88}ms both`,
                  willChange: "width",
                } as CSSProperties)
              : { width: `${value}%` };

          const deltaBadge =
            playAnim && meta ? (
              <span
                className={`kpi-delta-badge kpi-delta-badge--anim inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 font-mono text-[11px] font-black tabular-nums leading-none sm:text-[12px] ${
                  meta.deltaPts > 0
                    ? "kpi-delta-badge--up"
                    : meta.deltaPts < 0
                      ? "kpi-delta-badge--down"
                      : "kpi-delta-badge--flat"
                }`}
                style={{ ["--kpi-delta-delay" as string]: `${index * 88}ms` }}
                aria-label={
                  meta.deltaPts === 0
                    ? "변화 없음"
                    : meta.deltaPts > 0
                      ? `포인트 ${meta.deltaPts} 상승`
                      : `포인트 ${Math.abs(meta.deltaPts)} 하락`
                }
              >
                {meta.deltaPts > 0 ? `+${meta.deltaPts}` : meta.deltaPts < 0 ? `${meta.deltaPts}` : "0"}
              </span>
            ) : null;

          return (
            <div key={field} className="group relative min-w-0">
              <div className="mb-1.5 flex min-w-0 items-center justify-between gap-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[#111]" aria-hidden>
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
                  </span>
                  <span className="truncate font-sans text-[12px] font-bold leading-tight text-black sm:text-[13px]">{label}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {deltaBadge}
                  <span className="whitespace-nowrap font-mono text-[12px] font-extrabold tabular-nums text-black sm:text-[13px]">
                    {Math.round(value)}%
                  </span>
                </div>
              </div>
              <div className="kpi-bar-track w-full overflow-hidden">
                <div className={barClass} style={animStyle} />
              </div>
              <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-max min-w-[120px] -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <div className="sim-hud-tooltip min-w-[220px] max-w-[260px] px-2.5 py-2 text-left font-sans text-[11px] font-semibold text-white">
                  <span className="font-black text-white">{label}</span>
                  <span className="sim-hud-tooltip-muted"> · </span>
                  <span className="whitespace-nowrap font-black">{Math.round(value)}%</span>
                  <p className="mt-1 leading-relaxed">{help}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
