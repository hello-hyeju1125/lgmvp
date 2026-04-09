"use client";

import { useEffect, useState, useRef } from "react";
import { useStore } from "@/store/useStore";
import { executionRecapCopy } from "@/content/executionRecap";
import { executionActions } from "@/content/executionActions";
import { ep6Block1Options, ep6Block2Options, ep6Block3Options, getBlockLabelShort } from "@/content/episode6";
import { ep7Options } from "@/content/episode7";
import type { ReactNode, CSSProperties } from "react";
import { AlertTriangle, Calendar, FileText, Sparkles, Users, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const KPI_CRITICAL_THRESHOLD = 40;
const ENERGY_CRITICAL_THRESHOLD = 20;
function isCritical(field: string, value: number): boolean {
  return value <= (field === "leaderEnergy" ? ENERGY_CRITICAL_THRESHOLD : KPI_CRITICAL_THRESHOLD);
}

interface ExecRecapProps {
  userName: string;
}

const KPI_META: {
  field: "quality" | "delivery" | "teamEngagement" | "stakeholderAlignment" | "leaderEnergy";
  label: string;
  Icon: LucideIcon;
}[] = [
  { field: "quality", label: "산출물 품질", Icon: FileText },
  { field: "delivery", label: "일정 준수", Icon: Calendar },
  { field: "teamEngagement", label: "팀 몰입도", Icon: Users },
  { field: "stakeholderAlignment", label: "이해관계자 조율", Icon: UsersRound },
  { field: "leaderEnergy", label: "리더 에너지", Icon: Sparkles },
];

/** KPI 막대·숫자 카운트 — 스크롤로 해당 구간이 보일 때만 재생 (initiation-recap과 동일) */
const KPI_BAR_FILL_MS = 2200;

const REVEAL_STAGGER_MS = 120;
function revealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * REVEAL_STAGGER_MS}ms` };
}

function BadgeLabel({ text }: { text: string }) {
  return (
    <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
      <span className="recap-badge-label inline-block rounded-none bg-[#000000] p-[5px] sm:p-[6px]">
        <span className="inline-block rounded-none border-[2px] border-white px-7 py-2.5 text-[20px] font-bold tracking-wide sm:px-9 sm:py-3 sm:text-[23px]">
          • {text} •
        </span>
      </span>
    </div>
  );
}

function renderHighlightedText(text: string): ReactNode {
  const parts = text.split(/==(.+?)==/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-[#FFF176] px-0.5 font-bold text-[#111]" style={{ textDecoration: "none" }}>
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function SummaryItem({ title, body, step }: { title: string; body: string; step: number }) {
  return (
    <div className="ep1-scene-reveal space-y-2 pb-6 sm:pb-7" style={revealDelay(step)}>
      <div className="flex items-start gap-2.5">
        <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center text-[#FF7A00]">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M4 10.5L8.5 15L16 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-[18px] font-extrabold leading-snug text-[#111] sm:text-[20px]">{title}</p>
      </div>
      <p className="pl-[30px] text-[15px] font-medium leading-[1.9] text-[#555] sm:text-[16px]">
        {renderHighlightedText(body)}
      </p>
    </div>
  );
}

function AnimatedKpiBar({
  label,
  value,
  base,
  field,
  Icon,
  delayMs,
  play,
}: {
  label: string;
  value: number;
  base: number;
  field: string;
  Icon: LucideIcon;
  delayMs: number;
  play: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const delta = pct - base;
  const went_up = delta > 0;

  const [animatedWidth, setAnimatedWidth] = useState(0);
  const [displayPct, setDisplayPct] = useState(0);
  const [started, setStarted] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!play) return;

    const timer = window.setTimeout(() => {
      setStarted(true);
      setAnimatedWidth(pct);

      const duration = KPI_BAR_FILL_MS;
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayPct(Math.round(eased * pct));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [play, pct, delayMs]);

  const deltaLabel = delta !== 0 ? (went_up ? `▲${delta}` : `▼${Math.abs(delta)}`) : null;
  const critical = isCritical(field, pct);

  return (
    <div
      className={`flex flex-nowrap items-center gap-3 transition-opacity duration-500 ${started ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex w-[130px] shrink-0 items-center gap-2 sm:w-[150px]">
        {critical ? (
          <AlertTriangle className="kpi-critical-icon h-5 w-5 shrink-0" strokeWidth={2.5} />
        ) : (
          <Icon className="h-5 w-5 shrink-0 text-[#6b7280]" />
        )}
        <span className={`min-w-0 text-[15px] font-extrabold leading-tight sm:text-[16px] ${critical ? "kpi-critical-text" : "text-[#333]"}`}>{label}</span>
      </div>
      <div className={`relative h-[14px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#e5e7eb] ${critical ? "kpi-critical-track" : ""}`}>
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${critical ? "kpi-critical-bar" : "bg-[#FF7A00]"}`}
          style={{
            width: `${animatedWidth}%`,
            transition: started ? `width ${KPI_BAR_FILL_MS}ms cubic-bezier(0.33, 1, 0.68, 1)` : "none",
          }}
        />
      </div>
      <span className={`min-w-[3rem] shrink-0 whitespace-nowrap text-right text-[16px] font-extrabold tabular-nums leading-none sm:min-w-[3.25rem] sm:text-[18px] ${critical ? "kpi-critical-text" : "text-[#FF7A00]"}`}>
        {displayPct}%
      </span>
      <span
        className={`recap-kpi-delta w-[62px] shrink-0 whitespace-nowrap text-right text-[18px] font-black tabular-nums sm:w-[72px] sm:text-[20px] ${
          deltaLabel
            ? went_up
              ? "recap-kpi-delta--up"
              : "recap-kpi-delta--down"
            : "opacity-0"
        }`}
      >
        {deltaLabel ?? "—"}
      </span>
    </div>
  );
}

function GreenChip({ children }: { children: ReactNode }) {
  return (
    <span className="recap-green-chip flex w-full items-center gap-2 rounded-none bg-[#FF7A00] px-4 py-2.5 text-[13px] font-bold text-white sm:text-[14px]">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white">
        <svg className="h-3 w-3 text-[#FF7A00]" viewBox="0 0 12 10" fill="none" aria-hidden>
          <path d="M1 5L4 8L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </span>
  );
}

export function ExecRecap({ userName }: ExecRecapProps) {
  const { kpi, kpiStartExecution, executionActionHours, episode6Blocks, episode7Choice, episode8CoachingText } = useStore();

  const selectedActions = executionActions.filter((a) => (executionActionHours[a.id] ?? 0) > 0);

  const ep6Summary = (() => {
    if (!episode6Blocks) return null;
    const b1 = ep6Block1Options.find((o) => o.id === episode6Blocks.block1)?.label ?? episode6Blocks.block1;
    const b2Raw = ep6Block2Options.find((o) => o.id === episode6Blocks.block2)?.label ?? episode6Blocks.block2;
    const b3Raw = ep6Block3Options.find((o) => o.id === episode6Blocks.block3)?.label ?? episode6Blocks.block3;
    return `${b1} / ${getBlockLabelShort(b2Raw)} / ${getBlockLabelShort(b3Raw)}`;
  })();

  const ep7Label =
    episode7Choice != null
      ? `옵션 ${episode7Choice}: ${ep7Options.find((o) => o.id === episode7Choice)?.title ?? ""}`
      : null;

  const ep8Label = episode8CoachingText?.trim() || null;

  const summaryItems = executionRecapCopy.summaryItems;

  const decisionSummaryRef = useRef<HTMLDivElement>(null);
  const [decisionKpiInView, setDecisionKpiInView] = useState(false);

  useEffect(() => {
    const el = decisionSummaryRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDecisionKpiInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /** 카드가 보인 뒤 막대별 시작 간격 (initiation-recap과 동일) */
  const kpiStaggerMs = 480;
  const kpiFirstDelayMs = 400;

  return (
    <section className="ep1-scene-layout w-full min-w-0 max-w-none">
      {/* 스탬프 헤더 — initiation-recap과 동일 줌 스탬프·레이어링 */}
      <div className="initiation-action-page mb-8 w-full sm:mb-10">
        <div className="flex justify-center overflow-visible px-2">
          <div className="relative inline-block min-h-[120px] overflow-visible sm:min-h-[130px]">
            <p
              className="relative z-[5] ep1-scene-reveal initiation-brief-badge m-0 w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
              style={revealDelay(0)}
            >
              실행(Execution) 단계
            </p>
            <span
              className="recap-stamp-complete absolute -right-9 -top-6 z-[15] flex h-[88px] w-[88px] items-center justify-center sm:-right-11 sm:-top-7 sm:h-[102px] sm:w-[102px]"
              aria-label="완료"
            >
              <span className="recap-stamp-zoom-inner relative">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
                  <polygon
                    points="50,2 61,20 80,10 74,30 95,32 80,46 96,60 76,62 82,82 64,74 54,94 46,74 28,84 30,64 8,62 22,48 4,34 24,30 18,12 38,18"
                    fill="#FFD600"
                    stroke="#111"
                    strokeWidth="2"
                  />
                </svg>
                <span className="relative z-10 text-[17px] font-black tracking-tight text-[#111] sm:text-[21px]">완료</span>
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 인트로 문구 */}
      <div className="mb-10 space-y-1 px-2 text-center sm:mb-12">
        <p className="ep1-scene-reveal m-0 text-[17px] font-medium leading-[2] text-[#374151] sm:text-[18px]" style={revealDelay(1)}>
          실행 단계를 경험하셨습니다!
        </p>
        <p className="ep1-scene-reveal m-0 text-[17px] font-medium leading-[2] text-[#374151] sm:text-[18px]" style={revealDelay(2)}>
          리더님의 현명한 상황 판단과 코칭 덕분에,
        </p>
        <p className="ep1-scene-reveal m-0 text-[17px] font-medium leading-[2] text-[#374151] sm:text-[18px]" style={revealDelay(3)}>
          팀원들이 다시 <strong className="font-bold text-[#FF7A00]">오너십을 발휘하며 아웃풋</strong>을 만들어내고 있습니다.
        </p>
      </div>

      {/* 핵심 요약 카드 */}
      <div
        className="ep1-scene-reveal relative mx-auto mt-20 w-full max-w-4xl rounded-xl border border-black/10 bg-white pt-12 shadow-[0_4px_24px_rgba(0,0,0,0.07)] sm:mt-24 sm:pt-14"
        style={revealDelay(4)}
      >
        <BadgeLabel text="실행 단계 핵심 요약" />
        <div className="px-6 pb-5 pt-0 text-center sm:px-8 sm:pb-6">
          <h3 className="recap-green-title text-[22px] font-extrabold leading-snug sm:text-[26px]">
            성공하는 프로젝트 리더의 현장 관리법
          </h3>
        </div>

        <div className="px-6 pt-2 sm:px-8">
          {summaryItems.map((item, i) => (
            <SummaryItem key={i} title={item.title} body={item.body} step={5 + i} />
          ))}
        </div>
      </div>

      {/* 의사결정 및 결과 요약 카드 — ref로 뷰포트 진입 시 KPI 애니메이션 트리거 */}
      <div
        ref={decisionSummaryRef}
        className="ep1-scene-reveal relative mx-auto mt-20 w-full max-w-5xl rounded-xl border border-black/10 bg-white pt-12 shadow-[0_4px_24px_rgba(0,0,0,0.07)] sm:mt-24 sm:pt-14"
        style={revealDelay(9)}
      >
        <BadgeLabel text="의사결정 및 결과 요약" />

        <div className="flex flex-col gap-6 px-6 pb-8 pt-4 sm:px-8 sm:pb-10 md:flex-row md:gap-0">
          {/* 좌측: 의사결정 내역 */}
          <div className="min-w-0 space-y-5 md:w-[55%] md:shrink-0 md:border-r md:border-black/10 md:pr-8">
            {/* 액션 아이템 선택 */}
            <div className="ep1-scene-reveal space-y-2" style={revealDelay(10)}>
              <p className="text-[14px] font-extrabold text-[#111] sm:text-[15px]">액션 아이템 선택</p>
              <div className="flex flex-col gap-2">
                {selectedActions.length > 0 ? (
                  selectedActions.map((a) => <GreenChip key={a.id}>{a.title}</GreenChip>)
                ) : (
                  <span className="text-[13px] text-[#9ca3af]">—</span>
                )}
              </div>
            </div>

            {/* E6 선택 */}
            <div className="ep1-scene-reveal space-y-2" style={revealDelay(11)}>
              <p className="text-[14px] font-extrabold text-[#111] sm:text-[15px]">E6. 핑퐁 게임을 멈춰라!</p>
              {ep6Summary ? <GreenChip>{ep6Summary}</GreenChip> : <span className="text-[13px] text-[#9ca3af]">—</span>}
            </div>

            {/* E7 선택 */}
            <div className="ep1-scene-reveal space-y-2" style={revealDelay(12)}>
              <p className="text-[14px] font-extrabold text-[#111] sm:text-[15px]">E7. 길 잃은 열정, 어떻게 이끌 것인가?</p>
              {ep7Label ? <GreenChip>{ep7Label}</GreenChip> : <span className="text-[13px] text-[#9ca3af]">—</span>}
            </div>

            {/* E8 선택 */}
            <div className="ep1-scene-reveal space-y-2" style={revealDelay(13)}>
              <p className="text-[14px] font-extrabold text-[#111] sm:text-[15px]">E8. 고연차 팀원의 속사정</p>
              <GreenChip>코칭 메시지 전달하기</GreenChip>
            </div>
          </div>

          {/* 우측: KPI 프로그레스 바 */}
          <div className="flex min-w-0 flex-col justify-between md:w-[45%] md:pb-1 md:pl-8 md:pt-8">
            {KPI_META.map(({ field, label, Icon }, i) => (
              <AnimatedKpiBar
                key={field}
                label={label}
                value={kpi[field]}
                base={kpiStartExecution?.[field] ?? kpi[field]}
                field={field}
                Icon={Icon}
                play={decisionKpiInView}
                delayMs={kpiFirstDelayMs + i * kpiStaggerMs}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 풋터 문구 */}
      <div className="mt-16 space-y-1 px-2 text-center sm:mt-20">
        <p className="ep1-scene-reveal m-0 text-[17px] font-bold leading-[2] text-[#111] sm:text-[18px]" style={revealDelay(14)}>
          실행 단계를 무사히 완주하셨습니다!
        </p>
        <p className="ep1-scene-reveal m-0 text-[17px] font-medium leading-[2] text-[#374151] sm:text-[18px]" style={revealDelay(15)}>
          다음 단계로 넘어가면 <strong className="font-bold text-[#FF7A00]">선배 PM들의 노하우</strong>가 이어집니다.
        </p>
      </div>
    </section>
  );
}
