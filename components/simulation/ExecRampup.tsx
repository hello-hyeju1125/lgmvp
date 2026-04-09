"use client";

import { useState, useEffect, useRef } from "react";
import { executionRampupCopy } from "@/content/executionRecap";
import { CheckCircle2, ChevronRight, Rocket, MapPin, Shield, BarChart3, Trophy } from "lucide-react";

interface ExecRampupProps {
  userName: string;
  progressPercent: number;
}

const AMBER = "#FF7A00";
const AMBER_LIGHT = "#FFB347";
const AMBER_SOFT_BG = "rgba(217, 119, 6, 0.08)";
const AMBER_CARD_BG = "#fffbeb";

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
              ? "border-[#FF7A00] bg-[#FF7A00]"
              : isNext
                ? "border-[#FF7A00] bg-white exec-rampup-dot-pulse"
                : "border-[#d1d5db] bg-white"
          }`}
        >
          {isDone ? (
            <CheckCircle2 className="h-5 w-5 text-white sm:h-6 sm:w-6" strokeWidth={2.5} />
          ) : (
            <Icon
              className={`h-5 w-5 sm:h-6 sm:w-6 ${isNext ? "text-[#FF7A00]" : "text-[#9ca3af]"}`}
            />
          )}
        </div>
        {!isLast && (
          <div
            className={`mt-0 w-[3px] flex-1 ${
              isDone
                ? "bg-[#FF7A00]"
                : isNext
                  ? "exec-rampup-line-gradient"
                  : "bg-[#e5e7eb]"
            }`}
            style={{ minHeight: 24 }}
          />
        )}
      </div>

      <div
        className={`mb-4 min-w-0 flex-1 rounded-xl border-2 p-5 transition-all sm:mb-5 sm:p-6 ${
          isDone
            ? "border-[#FF7A00]/30 bg-[#fffbeb]"
            : isNext
              ? "exec-rampup-next-card border-[#FF7A00] bg-white shadow-[0_0_24px_rgba(255,122,0,0.12)]"
              : "border-[#e5e7eb] bg-[#fafafa]"
        }`}
      >
        <div className="mb-2 flex items-center gap-2">
          {isDone && (
            <span className="exec-rampup-done-badge inline-flex items-center gap-1 rounded-md bg-[#FF7A00] px-2 py-0.5 text-[11px] font-black tracking-wider text-white sm:text-[12px]">
              DONE
            </span>
          )}
          {isNext && (
            <span className="exec-rampup-next-badge inline-flex items-center gap-1 rounded-md border-2 border-[#FF7A00] bg-[#FF7A00]/10 px-2 py-0.5 text-[11px] font-black tracking-wider text-[#B35500] sm:text-[12px]">
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
            isDone ? "text-[#B35500]" : isNext ? "text-[#111]" : "text-[#9ca3af]"
          }`}
        >
          {label}
        </p>
        <p
          className={`mt-1.5 text-[14px] font-medium leading-[1.8] sm:text-[15px] ${
            isDone ? "text-[#B35500]/70" : isNext ? "text-[#555]" : "text-[#bcbcbc]"
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
          stroke={AMBER}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          style={{
            transition: animated ? "stroke-dashoffset 1.8s cubic-bezier(0.33, 1, 0.68, 1)" : "none",
            filter: "drop-shadow(0 0 10px rgba(217, 119, 6, 0.35))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[38px] font-black tabular-nums text-[#B35500] sm:text-[46px]">
          {progress}%
        </span>
        <span className="text-[12px] font-bold tracking-wider text-[#6b7280] sm:text-[13px]">
          완료
        </span>
      </div>
    </div>
  );
}

export function ExecRampup({ userName, progressPercent }: ExecRampupProps) {
  const introText = `${executionRampupCopy.intro}\n${executionRampupCopy.body1}\n${executionRampupCopy.body2}`;
  const introLines = introText.split("\n");
  const outroLines = executionRampupCopy.outro.split("\n");
  const phases = executionRampupCopy.phases.map((p, i) => ({
    label: p.label,
    text: p.text,
    state: (i <= 2 ? "done" : i === 3 ? "next" : "upcoming") as "done" | "next" | "upcoming",
  }));

  const hero = useRevealOnScroll<HTMLDivElement>();
  const intro = useRevealOnScroll<HTMLDivElement>();
  const roadmapHeader = useRevealOnScroll<HTMLDivElement>();
  const timeline = useRevealOnScroll<HTMLDivElement>();
  const outro = useRevealOnScroll<HTMLDivElement>();

  return (
    <section className="rampup-page exec-rampup-page w-full min-w-0 max-w-none">
      {/* Title + Progress + Greeting */}
      <div ref={hero.ref}>
        <div className="initiation-action-page mb-6 w-full sm:mb-8">
          <div className="flex justify-center overflow-visible px-2">
            <RevealGroup visible={hero.visible} delay={0}>
              <p className="initiation-brief-badge exec-rampup-title-badge m-0 w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]">
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
              {userName}님, <span className="text-[#FF7A00]">세 번째 관문</span>을 돌파했습니다!
            </p>
          </RevealGroup>
          <RevealGroup visible={hero.visible} delay={STAGGER_MS * 3}>
            <p className="mt-1.5 text-center text-[15px] font-medium text-[#6b7280] sm:text-[16px]">
              전체 여정 5단계 중 3단계 완료
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
          <div className="h-[2px] w-8 bg-[#FF7A00] sm:w-12" />
          <h3 className="text-center text-[20px] font-extrabold tracking-tight text-[#111] sm:text-[24px]">
            프로젝트 여정 로드맵
          </h3>
          <div className="h-[2px] w-8 bg-[#FF7A00] sm:w-12" />
        </RevealGroup>
      </div>

      {/* Phase timeline */}
      <div ref={timeline.ref} className="mx-auto max-w-2xl px-2 sm:px-4">
        {phases.map((phase, i) => (
          <PhaseCard
            key={i}
            label={phase.label}
            text={phase.text}
            state={phase.state}
            Icon={PHASE_ICONS[i]}
            delay={i * STAGGER_MS * 1.2}
            visible={timeline.visible}
            isLast={i === phases.length - 1}
          />
        ))}
      </div>

      {/* Outro CTA section */}
      <div ref={outro.ref}>
        <RevealGroup visible={outro.visible} delay={0}>
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border-2 border-[#FF7A00] bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] px-6 py-8 text-center shadow-[0_4px_32px_rgba(255,122,0,0.10)] sm:mt-16 sm:px-10 sm:py-10">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FF7A00]/10 sm:h-16 sm:w-16">
              <Rocket className="h-7 w-7 text-[#FF7A00] sm:h-8 sm:w-8" />
            </div>
            <div className="space-y-0.5">
              {outroLines.map((line, i) => (
                <p
                  key={i}
                  className="m-0 text-[16px] font-semibold leading-[2] text-[#1a1a1a] sm:text-[18px]"
                >
                  {line.includes("[감시 및 통제 단계]") ? (
                    <>
                      {line.split("[감시 및 통제 단계]")[0]}
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#FF7A00] px-2 py-0.5 font-extrabold text-white">
                        감시 및 통제 단계
                      </span>
                      {line.split("[감시 및 통제 단계]")[1]}
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
