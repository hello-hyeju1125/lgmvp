"use client";

import { useStore } from "@/store/useStore";
import { initiationRecapCopy } from "@/content/initiationRecap";
import { initiationActions } from "@/content/initiationActions";
import { ep1Options } from "@/content/episode1";
import { ep2AlignOptions } from "@/content/episode2Align";
import type { KpiState } from "@/store/useStore";
import type { ReactNode } from "react";
import { ep1Results } from "@/content/episode1";
import { ep2AlignResults } from "@/content/episode2Align";

interface InitiationRecapProps {
  userName: string;
}

const KPI_KEYS: (keyof KpiState)[] = [
  "quality",
  "delivery",
  "teamEngagement",
  "stakeholderAlignment",
  "leaderEnergy",
];

function KpiMeter({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold tracking-tight text-white/80 sm:text-[14px]">{label}</span>
        <span className="tabular-nums text-[13px] font-extrabold text-amber-200 sm:text-[14px]">{value}</span>
      </div>
      <div className="h-[6px] overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7A0021] via-[#E4003F] to-[#FF6A8A] shadow-[0_0_12px_rgba(228,0,63,0.30)] transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function InitiationRecap({ userName }: InitiationRecapProps) {
  const { initiationActionHours, episode1Choice, episode2AlignChoice, kpi } = useStore();

  const e1Items = initiationActions
    .filter((a) => (initiationActionHours[a.id] ?? 0) > 0)
    .map((a) => `${a.title} (${initiationActionHours[a.id] ?? 0}H)`);

  const e2Label =
    episode1Choice != null
      ? `[옵션 ${episode1Choice}: ${ep1Options.find((o) => o.id === episode1Choice)?.title ?? ""}] 선택`
      : "—";

  const e3Label =
    episode2AlignChoice != null
      ? `[옵션 ${episode2AlignChoice}: ${ep2AlignOptions.find((o) => o.id === episode2AlignChoice)?.title ?? ""}] 선택`
      : "—";

  const ep1Result = episode1Choice ? ep1Results[episode1Choice] : null;
  const ep2Result = episode2AlignChoice ? ep2AlignResults[episode2AlignChoice] : null;

  const kpiDeltaList = (delta: Partial<Record<keyof KpiState, number>>) => {
    const keys = KPI_KEYS.filter((k) => typeof delta[k] === "number" && (delta[k] ?? 0) !== 0);
    if (keys.length === 0) return <span className="text-white/60">—</span>;
    return (
      <ul className="mt-2 list-disc space-y-1.5 pl-5">
        {keys.map((k) => {
          const v = delta[k] ?? 0;
          const isUp = v > 0;
          return (
            <li key={k} className="text-[15px] leading-[1.75] text-white/82 sm:text-[16px]">
              <span className="font-semibold text-white/78">{initiationRecapCopy.kpiLabels[k]}</span>{" "}
              <span
                className={`tabular-nums font-extrabold ${isUp ? "text-emerald-200" : "text-rose-200"}`}
              >
                {v > 0 ? `(+${v})` : `(${v})`}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const summaryEp1: Record<Exclude<typeof episode1Choice, null>, string> = {
    A: "리더가 방패막이가 되어 팀을 보호했지만, 긴장감과 혁신 동력이 약해지고 상부와 실무 간 괴리가 커질 수 있습니다.",
    B: "데이터로 방어 논리를 세웠지만, ‘대안’ 없이 반박으로만 보이면 상부 설득에 실패하고 리더의 소모가 커질 수 있습니다.",
    C: "도전 목표를 투명하게 공유하고 고객 관점에서 트레이드오프를 설계해, ‘조건부 50%’ 역제안 시나리오로 위기를 팀 결속으로 바꿨습니다.",
  };
  const summaryEp2: Record<Exclude<typeof episode2AlignChoice, null>, string> = {
    A: "본질을 묻는 질문으로 양쪽의 시야를 넓혀, 목표에 부합하는 대안을 스스로 도출하도록 만들었습니다.",
    B: "당장의 갈등은 봉합했지만 오너십이 무너지고, 품질 저하와 피로 누적로 이어질 위험이 큽니다.",
    C: "일정 리스크는 크게 줄였지만, 현업의 참여 의지를 꺾어 ‘사용되지 않는 결과물’ 리스크가 커졌습니다.",
  };

  const decisionSteps = [
    {
      label: initiationRecapCopy.e1Label,
      value:
        e1Items.length > 0 ? (
          <ul className="mt-1 space-y-1.5">
            {e1Items.map((item) => (
              <li key={item} className="text-[15px] leading-[1.85] text-white/85 sm:text-[16px]">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          "—"
        ),
    },
    {
      label: initiationRecapCopy.e2Label,
      value:
        episode1Choice && ep1Result ? (
          <div className="space-y-3">
            <p className="text-[15px] leading-[1.85] text-white/88 sm:text-[16px]">{e2Label}</p>
            <p className="text-[15px] leading-[1.85] text-white/80 sm:text-[16px]">
              {summaryEp1[episode1Choice]}
            </p>
            <div>{kpiDeltaList(ep1Result.kpi)}</div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      label: initiationRecapCopy.e3Label,
      value:
        episode2AlignChoice && ep2Result ? (
          <div className="space-y-3">
            <p className="text-[15px] leading-[1.85] text-white/88 sm:text-[16px]">{e3Label}</p>
            <p className="text-[15px] leading-[1.85] text-white/80 sm:text-[16px]">
              {summaryEp2[episode2AlignChoice]}
            </p>
            <div>{kpiDeltaList(ep2Result.kpi)}</div>
          </div>
        ) : (
          "—"
        ),
    },
  ] satisfies { label: string; value: ReactNode }[];

  return (
    <div className="-mx-6 -mb-6">
      <div className="relative overflow-hidden rounded-none bg-[#070A12] sm:mx-0 sm:mb-0 sm:rounded-lg">
        {/* ambient */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(900px 420px at 18% 0%, rgba(228,0,63,0.14), transparent 55%), radial-gradient(700px 380px at 92% 12%, rgba(212,175,55,0.08), transparent 50%), radial-gradient(120% 80% at 50% 100%, rgba(15,23,42,0.9), #070A12)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_28%,transparent_72%,rgba(0,0,0,0.45))]" />
        <div
          className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#E4003F]/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
          aria-hidden
        />

        <div className="relative px-6 py-10 sm:px-10 sm:py-12">
          {/* Hero — semi-ending */}
          <div className="text-center">
            <p className="text-[12px] font-extrabold tracking-[0.35em] text-amber-200 sm:text-[13px]">
              {initiationRecapCopy.chapterBadge}
            </p>
            <div className="mx-auto mt-5 max-w-2xl">
              <h2 className="bg-gradient-to-b from-white via-white to-white/85 bg-clip-text text-[30px] font-extrabold leading-[1.15] tracking-tight text-transparent sm:text-[40px]">
                {initiationRecapCopy.title}
              </h2>
              <p className="mt-3 text-[15px] font-bold text-amber-100 sm:text-[16px]">
                {initiationRecapCopy.semiEndingLine}
              </p>
              <p className="mt-2 text-[13px] font-medium text-white/60 sm:text-[14px]">
                {initiationRecapCopy.personalizeGreeting(userName)}
              </p>
            </div>
            <div className="mx-auto mt-10 h-px max-w-xs bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          </div>

          <p className="mx-auto mt-10 max-w-2xl whitespace-pre-line text-center text-[15px] leading-[1.9] text-white/80 sm:text-[16px]">
            {initiationRecapCopy.intro}
          </p>

          {/* 핵심 요약 */}
          <section className="mt-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
              <h3 className="shrink-0 text-center text-[12px] font-extrabold tracking-[0.22em] text-white/65">
                핵심 요약
              </h3>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
            </div>
            <p className="mb-6 text-center text-[15px] font-bold leading-snug text-white/90 sm:text-[16px]">
              {initiationRecapCopy.summaryTitle}
            </p>
            <ul className="space-y-4">
              {initiationRecapCopy.summaryItems.map((item, i) => (
                <li
                  key={i}
                  className="group relative overflow-hidden rounded-md bg-white/[0.06] p-6 backdrop-blur-sm transition hover:bg-white/[0.08]"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/25 to-amber-600/10 text-[12px] font-extrabold tabular-nums text-amber-100 ring-1 ring-amber-200/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[15px] leading-[1.85] text-white/85 sm:text-[16px]">{item}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 나의 결정 + 타임라인 */}
          <section className="mt-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
              <h3 className="shrink-0 text-center text-[12px] font-extrabold tracking-[0.22em] text-white/65">
                나의 의사결정
              </h3>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
            </div>
            {initiationRecapCopy.myDecisionsTitle && (
              <p className="mb-6 text-center text-[14px] font-medium text-white/65 sm:text-[15px]">
                {initiationRecapCopy.myDecisionsTitle}
              </p>
            )}
            <div className="relative pl-2">
              <div className="absolute bottom-3 left-[11px] top-3 w-px bg-gradient-to-b from-amber-300/50 via-white/20 to-white/5" aria-hidden />
              <ol className="space-y-7">
                {decisionSteps.map((step, idx) => (
                  <li key={idx} className="relative flex gap-4 pl-6">
                    <span className="absolute left-0 top-1.5 flex h-[10px] w-[10px] items-center justify-center rounded-full bg-[#0B0F19] ring-2 ring-amber-300/70" />
                    <div className="min-w-0 flex-1 rounded-md bg-white/[0.05] p-6">
                      <p className="text-[13px] font-extrabold text-amber-100 sm:text-[14px]">{step.label}</p>
                      <div className="mt-2 min-w-0 text-[15px] leading-[1.85] text-white/85 sm:text-[16px]">{step.value}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 대시보드 스냅샷 */}
          <section className="mt-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
              <h3 className="shrink-0 text-center text-[12px] font-extrabold tracking-[0.22em] text-white/65">
                스냅샷
              </h3>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
            </div>
            {initiationRecapCopy.dashboardTitle && (
              <p className="mb-5 text-center text-[15px] font-bold text-white/90 sm:text-[16px]">
                {initiationRecapCopy.dashboardTitle}
              </p>
            )}
            <div className="rounded-md bg-white/[0.06] p-7 ring-1 ring-white/10">
              <div className="grid gap-5 sm:grid-cols-1 sm:gap-4">
                {KPI_KEYS.map((key) => (
                  <KpiMeter key={key} label={initiationRecapCopy.kpiLabels[key]} value={kpi[key]} />
                ))}
              </div>
            </div>
          </section>

          <p className="mt-12 text-center text-[15px] font-bold leading-relaxed text-white/80 sm:text-[16px]">
            <span className="whitespace-pre-line">{initiationRecapCopy.recapFooterNote}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
