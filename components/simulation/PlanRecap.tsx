"use client";

import { useStore } from "@/store/useStore";
import { planningActions } from "@/content/planningActions";
import { ep3Options, getEp3Result } from "@/content/episode3";
import { ep4Options, getEp4Result } from "@/content/episode4";
import { ep5Options, getEp5Result } from "@/content/episode5";
import type { KpiState } from "@/store/useStore";
import type { ReactNode } from "react";

const KPI_KEYS: (keyof KpiState)[] = [
  "quality",
  "delivery",
  "teamEngagement",
  "stakeholderAlignment",
  "leaderEnergy",
];

const KPI_LABELS: Record<keyof KpiState, string> = {
  quality: "산출물 품질",
  delivery: "일정 준수",
  teamEngagement: "팀 몰입도",
  stakeholderAlignment: "이해관계자 조율",
  leaderEnergy: "리더의 에너지",
};

const SUMMARY_ITEMS = [
  "자율성과 책임을 부여하는 사람 관리(People Management): 본업이 바쁜 비상주 인력이나 전문가 집단에게 가장 필요한 것은 리더의 세세한 마이크로매니징이 아닙니다. 달성해야 할 명확한 결과물을 제시하고 과정의 자율성을 보장할 때, 그들은 오너십을 가지고 200%의 퍼포먼스를 발휘합니다.",
  "'Why'를 연결하는 업무 위임 (Delegation): 누구나 기피하는 단순 반복 업무를 지시할 때, 조직의 논리로 읍소하거나 기계적인 1/N로 나누는 것은 하책입니다. 그 업무가 전체 프로젝트에서 가지는 핵심 가치를 재정의하고, 팀원의 개인적인 성장(커리어 니즈)과 연결해 주는 '의미 부여'가 자발적 몰입을 이끌어냅니다.",
  "집단 지성을 깨우는 안전한 충돌 (Debate Maker): 팀원 간/부서 간의 입장 차이가 팽팽한 기획 회의에서, 갈등을 덮기 위한 적당한 타협이나 리더의 독단적인 결정은 프로젝트를 병들게 합니다. 리더는 구성원들이 각자의 입장을 넘어 전체의 목표를 위해 치열하게 논쟁하도록 판을 깔아주는 '퍼실리테이터(Facilitator)'가 되어야 합니다.",
];

interface PlanRecapProps {
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

export function PlanRecap({ userName }: PlanRecapProps) {
  const { kpi, initiationActionHours, planningActionHours, episode3Choice, episode4Choice, episode5Choice } = useStore();

  const actionItemsWithHours = planningActions
    .map((a) => ({ ...a, hours: planningActionHours[a.id] ?? 0 }))
    .filter((a) => a.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const ep3Opt = episode3Choice ? ep3Options.find((o) => o.id === episode3Choice) : null;
  const ep4Opt = episode4Choice ? ep4Options.find((o) => o.id === episode4Choice) : null;
  const ep5Opt = episode5Choice ? ep5Options.find((o) => o.id === episode5Choice) : null;

  const ep3Result = episode3Choice ? getEp3Result(episode3Choice, planningActionHours["resource_assign"] ?? 0) : null;
  const ep4Result = episode4Choice ? getEp4Result(episode4Choice, initiationActionHours["team_profile"] ?? 0) : null;
  const ep5Result = episode5Choice ? getEp5Result(episode5Choice) : null;

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

  const summaryEp3: Record<NonNullable<typeof episode3Choice>, string> = {
    A: "비상주 인력의 자율성을 존중해 오너십을 끌어낸 선택으로, 몰입과 산출물 품질을 함께 높일 가능성이 큽니다.",
    B: "갈등은 줄었지만 리더가 실무를 떠안는 구조가 되어, 장기적으로 리더 소모와 품질 저하 리스크가 커집니다.",
    C: "관리 체계를 세웠지만 리소스 확보 수준에 따라 효과가 갈리며, 준비가 부족하면 팀원의 방어적 태도를 유발할 수 있습니다.",
    D: "공식 라인으로 동력을 만들 수 있으나, 당사자와의 신뢰를 해치면 몰입도 저하라는 부작용이 뒤따를 수 있습니다.",
  };
  const summaryEp4: Record<NonNullable<typeof episode4Choice>, string> = {
    A: "조직 논리 중심 설득은 단기 실행력은 확보해도 팀원의 내적 동기와 품질을 약화시킬 수 있습니다.",
    B: "리더가 직접 짐을 나누면 즉시 불만은 줄지만, 리더 번아웃과 팀원의 성장 정체가 발생하기 쉽습니다.",
    C: "업무 의미를 재정의하고 자율성을 부여해 팀원의 성장 동기와 성과를 동시에 자극한 선택입니다.",
    D: "기계적 공평 배분은 갈등은 줄여도 기준 불일치로 품질과 일정 모두 흔들릴 수 있는 위험이 있습니다.",
    E: "업무 숙련도와 맥락을 고려하지 않은 재배분은 되레 재작업과 조율 비용을 늘릴 가능성이 큽니다.",
  };
  const summaryEp5: Record<NonNullable<typeof episode5Choice>, string> = {
    A: "핵심 인력 중심의 빠른 의사결정은 속도는 올리지만, 배제된 이해관계자의 반발과 실행 저항을 키울 수 있습니다.",
    B: "모두를 만족시키는 타협은 쉬워 보이지만, 우선순위가 흐려져 산출물 품질과 일정 안정성이 떨어지기 쉽습니다.",
    C: "리더 주도안은 정렬은 빠르지만 팀의 집단 지성을 약화시켜 수동적 실행으로 이어질 수 있습니다.",
    D: "구조화된 충돌과 역할 전환 토론으로 집단 지성을 끌어내, 전략 품질과 팀 몰입을 동시에 높인 선택입니다.",
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
      label: "E3. 소속 팀 업무가 먼저 아닙니까?",
      value:
        episode3Choice && ep3Opt && ep3Result ? (
          <div className="space-y-3">
            <p className="text-[15px] leading-[1.85] text-white/88 sm:text-[16px]">[옵션 {ep3Opt.id}: {ep3Opt.title}] 선택</p>
            <p className="text-[15px] leading-[1.85] text-white/80 sm:text-[16px]">{summaryEp3[episode3Choice]}</p>
            <div>{kpiDeltaList(ep3Result.kpi)}</div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      label: "E4. \"이게 왜 제 일입니까?\"",
      value:
        episode4Choice && ep4Opt && ep4Result ? (
          <div className="space-y-3">
            <p className="text-[15px] leading-[1.85] text-white/88 sm:text-[16px]">[옵션 {ep4Opt.id}: {ep4Opt.title}] 선택</p>
            <p className="text-[15px] leading-[1.85] text-white/80 sm:text-[16px]">{summaryEp4[episode4Choice]}</p>
            <div>{kpiDeltaList(ep4Result.kpi)}</div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      label: "E5. 우리의 청사진, 어떻게 그릴 것인가?",
      value:
        episode5Choice && ep5Opt && ep5Result ? (
          <div className="space-y-3">
            <p className="text-[15px] leading-[1.85] text-white/88 sm:text-[16px]">[옵션 {ep5Opt.id}: {ep5Opt.title}] 선택</p>
            <p className="text-[15px] leading-[1.85] text-white/80 sm:text-[16px]">{summaryEp5[episode5Choice]}</p>
            <div>{kpiDeltaList(ep5Result.kpi)}</div>
          </div>
        ) : (
          "—"
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
            <p className="text-[12px] font-extrabold tracking-[0.35em] text-amber-200 sm:text-[13px]">CHAPTER 2 RECAP</p>
            <div className="mx-auto mt-5 max-w-2xl">
              <h2 className="bg-gradient-to-b from-white via-white to-white/85 bg-clip-text text-[30px] font-extrabold leading-[1.15] tracking-tight text-transparent sm:text-[40px]">
                기획(Planning) 단계 완료!
              </h2>
              <p className="mt-3 text-[15px] font-bold text-amber-100 sm:text-[16px]">
                훌륭합니다. 프로젝트의 청사진이 선명해졌습니다.
              </p>
              <p className="mt-2 text-[13px] font-medium text-white/60 sm:text-[14px]">
                {userName} 리더님, 지금까지의 결정을 함께 되짚어봅니다.
              </p>
            </div>
            <div className="mx-auto mt-10 h-px max-w-xs bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          </div>

          <p className="mx-auto mt-10 max-w-2xl whitespace-pre-line text-center text-[15px] leading-[1.9] text-white/80 sm:text-[16px]">
            프로젝트의 밑그림을 그리는 기획 주간이 끝났습니다.{"\n"}
            리더님의 결단으로 체계적인 프로젝트 플랜과 협업 프로세스가 정립되었습니다.{"\n"}
            이제 팀원들은 혼선 없이 각자의 전문성을 발휘하며 목표를 향해 나아갈 것입니다.
          </p>

          <section className="mt-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
              <h3 className="shrink-0 text-center text-[12px] font-extrabold tracking-[0.22em] text-white/65">핵심 요약</h3>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
            </div>
            <p className="mb-6 text-center text-[15px] font-bold leading-snug text-white/90 sm:text-[16px]">
              성공하는 프로젝트 리더의 뼈대 세우기
            </p>
            <ul className="space-y-4">
              {SUMMARY_ITEMS.map((item, i) => (
                <li key={i} className="group relative overflow-hidden rounded-md bg-white/[0.06] p-6 backdrop-blur-sm transition hover:bg-white/[0.08]">
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
              의사결정을 수행하시느라 고생 많으셨습니다!{"\n"}다음 단계로 넘어가면 선배 PM 노하우가 이어집니다.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
