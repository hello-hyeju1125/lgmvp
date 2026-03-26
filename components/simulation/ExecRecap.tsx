"use client";

import { useStore } from "@/store/useStore";
import { executionRecapCopy } from "@/content/executionRecap";
import { executionActions } from "@/content/executionActions";
import { ep6Block1Options, ep6Block2Options, ep6Block3Options, ep6Block4Options, getEp6Result } from "@/content/episode6";
import { ep7Options, getEp7Result } from "@/content/episode7";
import type { KpiState } from "@/store/useStore";
import type { ReactNode } from "react";

const KPI_KEYS: (keyof KpiState)[] = [
  "quality",
  "delivery",
  "teamEngagement",
  "stakeholderAlignment",
  "leaderEnergy",
];

const KPI_LABELS: Record<keyof KpiState, string> = executionRecapCopy.kpiLabels;

interface ExecRecapProps {
  userName: string;
}

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

export function ExecRecap({ userName }: ExecRecapProps) {
  const { kpi, executionActionHours, episode6Blocks, episode7Choice, episode8CoachingText } = useStore();

  const actionItemsWithHours = executionActions
    .map((a) => ({ ...a, hours: executionActionHours[a.id] ?? 0 }))
    .filter((a) => a.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const ep7Opt = episode7Choice ? ep7Options.find((o) => o.id === episode7Choice) : null;
  const ep7Result = episode7Choice ? getEp7Result(episode7Choice, executionActionHours["voc_data"] ?? 0, executionActionHours["ref_benchmark"] ?? 0) : null;

  const ep6Summary = (() => {
    if (!episode6Blocks) return "—";
    const b1 = ep6Block1Options.find((o) => o.id === episode6Blocks.block1)?.label ?? episode6Blocks.block1;
    const b2 = ep6Block2Options.find((o) => o.id === episode6Blocks.block2)?.label ?? episode6Blocks.block2;
    const b3 = ep6Block3Options.find((o) => o.id === episode6Blocks.block3)?.label ?? episode6Blocks.block3;
    const b4 = ep6Block4Options.find((o) => o.id === episode6Blocks.block4)?.label ?? episode6Blocks.block4;
    return `[${b1}]에게 [${b2}]을 통해 [${b3}], [${b4}]를 선택했습니다.`;
  })();
  const ep6Result = episode6Blocks ? getEp6Result(episode6Blocks.block4, episode6Blocks.block2) : null;

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
              <span className="font-semibold text-white/78">{KPI_LABELS[k]}</span>{" "}
              <span className={`tabular-nums font-extrabold ${isUp ? "text-emerald-200" : "text-rose-200"}`}>
                {v > 0 ? `(+${v})` : `(${v})`}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const summaryEp7: Record<NonNullable<typeof episode7Choice>, string> = {
    A: "경험 기반 템플릿 제공으로 속도는 확보했지만, 팀원의 자율적 문제해결 역량 성장을 저해할 수 있는 선택입니다.",
    B: "정답 대신 질문으로 사고를 확장해 팀원의 오너십과 품질 개선을 함께 끌어낸 코칭형 리더십입니다.",
    C: "동기 부여는 있었지만 구체적 가이드 부족으로 실행 기준이 흔들릴 수 있는 리스크가 남는 선택입니다.",
    D: "명확한 미션 제시로 실행력을 높이고 벤치마킹 학습을 유도해 품질 향상으로 이어질 가능성이 높은 선택입니다.",
  };

  const decisionSteps = [
    {
      label: "Action Item 에너지 배분",
      value:
        actionItemsWithHours.length > 0 ? (
          <ul className="mt-1 space-y-1.5">
            {actionItemsWithHours.map((a) => (
              <li key={a.id} className="text-[15px] leading-[1.85] text-white/85 sm:text-[16px]">
                {a.title} ({a.hours}H)
              </li>
            ))}
          </ul>
        ) : (
          "—"
        ),
    },
    {
      label: "E6. 핑퐁 게임을 멈춰라!",
      value:
        episode6Blocks && ep6Result ? (
          <div className="space-y-3">
            <p className="text-[15px] leading-[1.85] text-white/88 sm:text-[16px]">{ep6Summary}</p>
            <p className="text-[15px] leading-[1.85] text-white/80 sm:text-[16px]">{ep6Result.text}</p>
            <div>{kpiDeltaList(ep6Result.kpi)}</div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      label: "E7. 길 잃은 열정, 어떻게 이끌 것인가?",
      value:
        episode7Choice && ep7Opt && ep7Result ? (
          <div className="space-y-3">
            <p className="text-[15px] leading-[1.85] text-white/88 sm:text-[16px]">[옵션 {ep7Opt.id}: {ep7Opt.title}] 선택</p>
            <p className="text-[15px] leading-[1.85] text-white/80 sm:text-[16px]">{summaryEp7[episode7Choice]}</p>
            <div>{kpiDeltaList(ep7Result.kpi)}</div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      label: "E8. 고연차 팀원의 속사정",
      value:
        episode8CoachingText && episode8CoachingText.trim().length > 0 ? (
          <p className="text-[15px] leading-[1.85] text-white/85 sm:text-[16px]">{episode8CoachingText}</p>
        ) : (
          <span className="text-white/60">—</span>
        ),
    },
  ] satisfies { label: string; value: ReactNode }[];

  return (
    <div className="-mx-6 -mb-6">
      <div className="relative overflow-hidden rounded-none bg-[#070A12] sm:mx-0 sm:mb-0 sm:rounded-lg">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(900px 420px at 18% 0%, rgba(228,0,63,0.14), transparent 55%), radial-gradient(700px 380px at 92% 12%, rgba(212,175,55,0.08), transparent 50%), radial-gradient(120% 80% at 50% 100%, rgba(15,23,42,0.9), #070A12)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_28%,transparent_72%,rgba(0,0,0,0.45))]" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#E4003F]/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" aria-hidden />

        <div className="relative px-6 py-10 sm:px-10 sm:py-12">
          <div className="text-center">
            <p className="text-[12px] font-extrabold tracking-[0.35em] text-amber-200 sm:text-[13px]">CHAPTER 3 RECAP</p>
            <div className="mx-auto mt-5 max-w-2xl">
              <h2 className="bg-gradient-to-b from-white via-white to-white/85 bg-clip-text text-[30px] font-extrabold leading-[1.15] tracking-tight text-transparent sm:text-[40px]">
                실행(Execution) 단계 완료!
              </h2>
              <p className="mt-3 text-[15px] font-bold text-amber-100 sm:text-[16px]">
                훌륭합니다. 가장 복잡한 현장 구간을 돌파했습니다.
              </p>
              <p className="mt-2 text-[13px] font-medium text-white/60 sm:text-[14px]">
                {userName} 리더님, 지금까지의 결정을 함께 되짚어봅니다.
              </p>
            </div>
            <div className="mx-auto mt-10 h-px max-w-xs bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          </div>

          <p className="mx-auto mt-10 max-w-2xl whitespace-pre-line text-center text-[15px] leading-[1.9] text-white/80 sm:text-[16px]">
            실행 단계의 복잡한 이해관계와 현장 이슈를 통과했습니다.{"\n"}
            리더님의 판단으로 팀은 다시 방향을 정렬하고 성과를 만들기 시작했습니다.{"\n"}
            이제 리스크를 통제하며 품질을 사수해야 하는 다음 구간으로 넘어갑니다.
          </p>

          <section className="mt-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
              <h3 className="shrink-0 text-center text-[12px] font-extrabold tracking-[0.22em] text-white/65">핵심 요약</h3>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
            </div>
            <p className="mb-6 text-center text-[15px] font-bold leading-snug text-white/90 sm:text-[16px]">
              성공하는 프로젝트 리더의 현장 관리법
            </p>
            <ul className="space-y-4">
              {executionRecapCopy.summaryItems.map((item, i) => (
                <li key={i} className="group relative overflow-hidden rounded-md bg-white/[0.06] p-6 backdrop-blur-sm transition hover:bg-white/[0.08]">
                  <div className="flex gap-3 sm:gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/25 to-amber-600/10 text-[12px] font-extrabold tabular-nums text-amber-100 ring-1 ring-amber-200/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[15px] leading-[1.85] text-white/85 sm:text-[16px]">
                      <span className="font-extrabold text-white/95">{item.title}</span> {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
              <h3 className="shrink-0 text-center text-[12px] font-extrabold tracking-[0.22em] text-white/65">나의 의사결정</h3>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
            </div>
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

          <section className="mt-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
              <h3 className="shrink-0 text-center text-[12px] font-extrabold tracking-[0.22em] text-white/65">스냅샷</h3>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
            </div>
            <p className="mb-5 text-center text-[15px] font-bold text-white/90 sm:text-[16px]">현재 KPI 현황</p>
            <div className="rounded-md bg-white/[0.06] p-7 ring-1 ring-white/10">
              <div className="grid gap-5 sm:grid-cols-1 sm:gap-4">
                {KPI_KEYS.map((key) => (
                  <KpiMeter key={key} label={KPI_LABELS[key]} value={kpi[key]} />
                ))}
              </div>
            </div>
          </section>

          <p className="mt-12 text-center text-[15px] font-bold leading-relaxed text-white/80 sm:text-[16px]">
            <span className="whitespace-pre-line">
              실행 단계를 무사히 완주하셨습니다!{"\n"}다음 단계에서 리스크를 통제하며 프로젝트를 지켜봅시다.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
