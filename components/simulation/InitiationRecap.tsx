"use client";

import { useStore } from "@/store/useStore";
import { initiationRecapCopy } from "@/content/initiationRecap";
import { initiationActions } from "@/content/initiationActions";
import { ep1Options } from "@/content/episode1";
import { ep2AlignOptions } from "@/content/episode2Align";
import type { KpiState } from "@/store/useStore";

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
        <span className="text-[12px] font-semibold tracking-tight text-white/75">{label}</span>
        <span className="tabular-nums text-[12px] font-bold text-amber-200/95">{value}</span>
      </div>
      <div className="h-[6px] overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#E4003F] via-[#ff5c7a] to-amber-300/95 shadow-[0_0_12px_rgba(228,0,63,0.35)] transition-[width] duration-700 ease-out"
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
    .map((a) => `[${a.title} (${initiationActionHours[a.id] ?? 0}H)]`);

  const e2Label =
    episode1Choice != null
      ? `[옵션 ${episode1Choice}: ${ep1Options.find((o) => o.id === episode1Choice)?.title ?? ""}] 선택`
      : "—";

  const e3Label =
    episode2AlignChoice != null
      ? `[옵션 ${episode2AlignChoice}: ${ep2AlignOptions.find((o) => o.id === episode2AlignChoice)?.title ?? ""}] 선택`
      : "—";

  const decisionSteps = [
    { label: initiationRecapCopy.e1Label, value: e1Items.length > 0 ? e1Items.join(" ") : "—" },
    { label: initiationRecapCopy.e2Label, value: e2Label },
    { label: initiationRecapCopy.e3Label, value: e3Label },
  ];

  return (
    <div className="-mx-6 -mb-6">
      <div className="relative overflow-hidden rounded-none border-y border-white/10 bg-[#070A12] shadow-[0_40px_120px_rgba(0,0,0,0.35)] sm:mx-0 sm:mb-0 sm:rounded-2xl sm:border">
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

        <div className="relative px-5 py-8 sm:px-8 sm:py-10">
          {/* Hero — semi-ending */}
          <div className="text-center">
            <p className="text-[11px] font-extrabold tracking-[0.35em] text-amber-200/85 sm:text-[12px]">
              {initiationRecapCopy.chapterBadge}
            </p>
            <div className="mx-auto mt-4 max-w-2xl">
              <h2 className="bg-gradient-to-b from-white via-white to-white/75 bg-clip-text text-[26px] font-extrabold leading-tight tracking-tight text-transparent sm:text-[32px]">
                {initiationRecapCopy.title}
              </h2>
              <p className="mt-3 text-[13px] font-semibold text-amber-100/90 sm:text-[14px]">
                {initiationRecapCopy.semiEndingLine}
              </p>
              <p className="mt-2 text-[12px] font-medium text-white/45 sm:text-[13px]">
                {initiationRecapCopy.personalizeGreeting(userName)}
              </p>
            </div>
            <div className="mx-auto mt-8 h-px max-w-xs bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-[14px] leading-[1.85] text-white/72 sm:text-[15px]">
            {initiationRecapCopy.intro}
          </p>

          {/* 핵심 요약 */}
          <section className="mt-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
              <h3 className="shrink-0 text-center text-[11px] font-extrabold tracking-[0.2em] text-white/50">
                핵심 요약
              </h3>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
            </div>
            <p className="mb-5 text-center text-[13px] font-semibold leading-snug text-white/88 sm:text-[14px]">
              {initiationRecapCopy.summaryTitle}
            </p>
            <ul className="space-y-3">
              {initiationRecapCopy.summaryItems.map((item, i) => (
                <li
                  key={i}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition hover:border-amber-200/25 hover:bg-white/[0.06]"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/25 to-amber-600/10 text-[11px] font-extrabold tabular-nums text-amber-100 ring-1 ring-amber-200/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[13px] leading-[1.8] text-white/78 sm:text-[14px]">{item}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 나의 결정 + 타임라인 */}
          <section className="mt-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
              <h3 className="shrink-0 text-center text-[11px] font-extrabold tracking-[0.2em] text-white/50">
                나의 의사결정
              </h3>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
            </div>
            <p className="mb-6 text-center text-[12px] text-white/45">{initiationRecapCopy.myDecisionsTitle}</p>
            <div className="relative pl-2">
              <div className="absolute bottom-3 left-[11px] top-3 w-px bg-gradient-to-b from-amber-300/50 via-white/20 to-white/5" aria-hidden />
              <ol className="space-y-6">
                {decisionSteps.map((step, idx) => (
                  <li key={idx} className="relative flex gap-4 pl-6">
                    <span className="absolute left-0 top-1.5 flex h-[10px] w-[10px] items-center justify-center rounded-full bg-[#0B0F19] ring-2 ring-amber-300/70" />
                    <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/25 p-4">
                      <p className="text-[12px] font-bold text-amber-100/95 sm:text-[13px]">{step.label}</p>
                      <p className="mt-2 text-[13px] leading-[1.75] text-white/70 sm:text-[14px]">{step.value}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 대시보드 스냅샷 */}
          <section className="mt-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
              <h3 className="shrink-0 text-center text-[11px] font-extrabold tracking-[0.2em] text-white/50">
                스냅샷
              </h3>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
            </div>
            <p className="mb-5 text-center text-[13px] font-semibold text-white/88 sm:text-[14px]">
              {initiationRecapCopy.dashboardTitle}
            </p>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 ring-1 ring-white/5">
              <div className="grid gap-5 sm:grid-cols-1 sm:gap-4">
                {KPI_KEYS.map((key) => (
                  <KpiMeter key={key} label={initiationRecapCopy.kpiLabels[key]} value={kpi[key]} />
                ))}
              </div>
            </div>
          </section>

          <p className="mt-10 text-center text-[11px] font-medium leading-relaxed text-white/38">
            {initiationRecapCopy.recapFooterNote}
          </p>
        </div>
      </div>
    </div>
  );
}
