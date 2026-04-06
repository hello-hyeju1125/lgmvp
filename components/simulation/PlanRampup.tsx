"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, ChevronRight, Rocket, MapPin, Shield, BarChart3, Trophy } from "lucide-react";

interface PlanRampupProps {
  userName: string;
  progressPercent: number;
}

const NAVY = "#1e3a5f";
const NAVY_LIGHT = "#2d5684";
const NAVY_SOFT_BG = "rgba(30, 58, 95, 0.08)";
const NAVY_CARD_BG = "#f0f4fa";
const NAVY_GLOW = "rgba(30, 58, 95, 0.15)";

const STAGGER_MS = 150;

function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const trigger = () => setVisible(true);

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      requestAnimationFrame(() => trigger());
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trigger();
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function RevealGroup({
  children,
  className = "",
  delay = 0,
  visible,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  visible: boolean;
}) {
  return (
    <div
      className={`rampup-reveal ${visible ? "rampup-reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const INTRO =
  "실제 사례를 기반으로 만든 에피소드들과 선배 PM들의 꿀팁까지, 깊이 와닿으셨나요?\n빈틈없는 항해 지도를 그리는 '기획(Planning)' 단계를 훌륭하게 완수하셨습니다.\n하지만 지금부터 본격 시작입니다.\n현장에서는 예기치 못한 돌발 변수들이 늘 존재하니까요.";

const PHASES = [
  {
    label: "[착수 단계]",
    text: "프로젝트의 존재 이유(목적)를 정의하고 든든한 후원자(스폰서)를 확보하여 첫 단추를 꿰는 시간입니다.",
    state: "done" as const,
  },
  {
    label: "[기획 단계]",
    text: "완벽한 항해 지도를 그리고 자원과 R&R을 분배하는 시간입니다. 리더님께서 방금 무사히 통과하신 바로 그 관문입니다.",
    state: "done" as const,
  },
  {
    label: "[실행 단계]",
    text: "팀원들이 현장에서 본격적으로 아웃풋을 만들어냅니다. 잦은 야근, 유관부서의 이기주의, 그리고 실무진의 번아웃에 시달리게 됩니다.",
    state: "next" as const,
  },
  {
    label: "[감시 및 통제 단계]",
    text: "완벽했던 계획이 틀어지는 순간입니다. 수시로 터지는 리스크를 매니지하는 리더의 역량이 시험대에 오릅니다.",
    state: "upcoming" as const,
  },
  {
    label: "[종료 단계]",
    text: "마침내 성과를 입증하고, 팀원들의 노고를 공정하게 평가하여 '성공적인 피날레(혹은 다음을 위한 자산)'를 만들어내는 마지막 관문입니다.",
    state: "upcoming" as const,
  },
];

const OUTRO =
  "자, 이제 계획을 현실로 바꾸기 위해 팀원들이 업무에 집중하여\n아웃풋을 산출해 내는 [실행 단계]로 진입해 봅시다.";

const PHASE_ICONS = [MapPin, Rocket, BarChart3, Shield, Trophy];

function PhaseCard({
  label,
  text,
  state,
  Icon,
  delay,
  visible,
  isLast,
}: {
  label: string;
  text: string;
  state: "done" | "next" | "upcoming";
  Icon: React.ComponentType<{ className?: string }>;
  delay: number;
  visible: boolean;
  isLast: boolean;
}) {
  const isDone = state === "done";
  const isNext = state === "next";

  return (
    <div
      className={`rampup-reveal relative flex gap-4 sm:gap-6 ${visible ? "rampup-reveal--visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center">
        <div
          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 sm:h-12 sm:w-12 ${
            isDone
              ? "border-[#1e3a5f] bg-[#1e3a5f]"
              : isNext
                ? "border-[#1e3a5f] bg-white plan-rampup-dot-pulse"
                : "border-[#d1d5db] bg-white"
          }`}
        >
          {isDone ? (
            <CheckCircle2 className="plan-rampup-done-icon h-5 w-5 text-white sm:h-6 sm:w-6" strokeWidth={2.5} />
          ) : (
            <Icon
              className={`h-5 w-5 sm:h-6 sm:w-6 ${isNext ? "text-[#1e3a5f]" : "text-[#9ca3af]"}`}
            />
          )}
        </div>
        {!isLast && (
          <div
            className={`mt-0 w-[3px] flex-1 ${
              isDone
                ? "bg-[#1e3a5f]"
                : isNext
                  ? "plan-rampup-line-gradient"
                  : "bg-[#e5e7eb]"
            }`}
            style={{ minHeight: 24 }}
          />
        )}
      </div>

      <div
        className={`mb-4 min-w-0 flex-1 rounded-xl border-2 p-5 transition-all sm:mb-5 sm:p-6 ${
          isDone
            ? "border-[#1e3a5f]/30 bg-[#f0f4fa]"
            : isNext
              ? "plan-rampup-next-card border-[#1e3a5f] bg-white shadow-[0_0_24px_rgba(30,58,95,0.12)]"
              : "border-[#e5e7eb] bg-[#fafafa]"
        }`}
      >
        <div className="mb-2 flex items-center gap-2">
          {isDone && (
            <span className="plan-rampup-done-badge inline-flex items-center gap-1 rounded-md bg-[#1e3a5f] px-2 py-0.5 text-[11px] font-black tracking-wider text-white sm:text-[12px]">
              DONE
            </span>
          )}
          {isNext && (
            <span className="plan-rampup-next-badge inline-flex items-center gap-1 rounded-md border-2 border-[#1e3a5f] bg-[#1e3a5f]/10 px-2 py-0.5 text-[11px] font-black tracking-wider text-[#1e3a5f] sm:text-[12px]">
              <ChevronRight className="h-3 w-3" strokeWidth={3} />
              NEXT
            </span>
          )}
          {!isDone && !isNext && (
            <span className="inline-flex items-center rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-bold tracking-wider text-[#9ca3af] sm:text-[12px]">
              UPCOMING
            </span>
          )}
        </div>
        <p
          className={`text-[16px] font-extrabold leading-snug sm:text-[18px] ${
            isDone ? "text-[#1e3a5f]" : isNext ? "text-[#111]" : "text-[#9ca3af]"
          }`}
        >
          {label}
        </p>
        <p
          className={`mt-1.5 text-[14px] font-medium leading-[1.8] sm:text-[15px] ${
            isDone ? "text-[#1e3a5f]/70" : isNext ? "text-[#555]" : "text-[#bcbcbc]"
          }`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function ProgressRing({ progress, visible }: { progress: number; visible: boolean }) {
  const radius = 72;
  const stroke = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={176} height={176} viewBox="0 0 176 176" className="-rotate-90">
        <circle cx="88" cy="88" r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          stroke={NAVY}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          style={{
            transition: animated ? "stroke-dashoffset 1.8s cubic-bezier(0.33, 1, 0.68, 1)" : "none",
            filter: "drop-shadow(0 0 10px rgba(30, 58, 95, 0.35))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[38px] font-black tabular-nums text-[#1e3a5f] sm:text-[46px]">
          {progress}%
        </span>
        <span className="text-[12px] font-bold tracking-wider text-[#6b7280] sm:text-[13px]">
          완료
        </span>
      </div>
    </div>
  );
}

export function PlanRampup({ userName, progressPercent }: PlanRampupProps) {
  const introLines = INTRO.split("\n");
  const outroLines = OUTRO.split("\n");

  const hero = useRevealOnScroll<HTMLDivElement>();
  const intro = useRevealOnScroll<HTMLDivElement>();
  const roadmapHeader = useRevealOnScroll<HTMLDivElement>();
  const timeline = useRevealOnScroll<HTMLDivElement>();
  const outro = useRevealOnScroll<HTMLDivElement>();

  return (
    <section className="rampup-page plan-rampup-page w-full min-w-0 max-w-none">
      {/* Title + Progress + Greeting */}
      <div ref={hero.ref}>
        <div className="initiation-action-page mb-6 w-full sm:mb-8">
          <div className="flex justify-center overflow-visible px-2">
            <RevealGroup visible={hero.visible} delay={0}>
              <p className="initiation-brief-badge plan-rampup-title-badge m-0 w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]">
                Wrap-up
              </p>
            </RevealGroup>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center sm:mb-10">
          <RevealGroup visible={hero.visible} delay={STAGGER_MS}>
            <div className="flex justify-center">
              <ProgressRing progress={progressPercent} visible={hero.visible} />
            </div>
          </RevealGroup>
          <RevealGroup visible={hero.visible} delay={STAGGER_MS * 2}>
            <p className="mt-5 text-center text-[30px] font-extrabold leading-snug text-[#111] sm:text-[40px]">
              {userName}님, <span className="text-[#1e3a5f]">두 번째 관문</span>을 돌파했습니다!
            </p>
          </RevealGroup>
          <RevealGroup visible={hero.visible} delay={STAGGER_MS * 3}>
            <p className="mt-1.5 text-center text-[15px] font-medium text-[#6b7280] sm:text-[16px]">
              전체 여정 5단계 중 2단계 완료
            </p>
          </RevealGroup>
        </div>
      </div>

      {/* Intro text */}
      <div ref={intro.ref} className="mb-10 space-y-0.5 px-2 text-center sm:mb-14">
        {introLines.map((line, i) => (
          <RevealGroup key={i} visible={intro.visible} delay={i * STAGGER_MS}>
            <p className="m-0 text-[16px] font-medium leading-[2] text-[#374151] sm:text-[18px]">
              {line}
            </p>
          </RevealGroup>
        ))}
      </div>

      {/* Journey Roadmap header */}
      <div ref={roadmapHeader.ref}>
        <RevealGroup
          visible={roadmapHeader.visible}
          delay={0}
          className="mb-8 flex items-center justify-center gap-3 sm:mb-10"
        >
          <div className="h-[2px] w-8 bg-[#1e3a5f] sm:w-12" />
          <h3 className="text-center text-[20px] font-extrabold tracking-tight text-[#111] sm:text-[24px]">
            프로젝트 여정 로드맵
          </h3>
          <div className="h-[2px] w-8 bg-[#1e3a5f] sm:w-12" />
        </RevealGroup>
      </div>

      {/* Phase timeline */}
      <div ref={timeline.ref} className="mx-auto max-w-2xl px-2 sm:px-4">
        {PHASES.map((phase, i) => (
          <PhaseCard
            key={i}
            label={phase.label}
            text={phase.text}
            state={phase.state}
            Icon={PHASE_ICONS[i]}
            delay={i * STAGGER_MS * 1.2}
            visible={timeline.visible}
            isLast={i === PHASES.length - 1}
          />
        ))}
      </div>

      {/* Outro CTA section */}
      <div ref={outro.ref}>
        <RevealGroup visible={outro.visible} delay={0}>
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border-2 border-[#1e3a5f] bg-gradient-to-br from-[#f0f4fa] to-[#eaeff7] px-6 py-8 text-center shadow-[0_4px_32px_rgba(30,58,95,0.10)] sm:mt-16 sm:px-10 sm:py-10">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1e3a5f]/10 sm:h-16 sm:w-16">
              <Rocket className="h-7 w-7 text-[#1e3a5f] sm:h-8 sm:w-8" />
            </div>
            <div className="space-y-0.5">
              {outroLines.map((line, i) => (
                <p
                  key={i}
                  className="m-0 text-[16px] font-semibold leading-[2] text-[#1a1a1a] sm:text-[18px]"
                >
                  {line.includes("[실행 단계]") ? (
                    <>
                      {line.split("[실행 단계]")[0]}
                      <span className="plan-rampup-phase-tag inline-flex items-center gap-1 rounded-md bg-[#1e3a5f] px-2 py-0.5 font-extrabold text-white">
                        실행 단계
                      </span>
                      {line.split("[실행 단계]")[1]}
                    </>
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          </div>
        </RevealGroup>
      </div>

      <div className="h-10 sm:h-14" />
    </section>
  );
}
