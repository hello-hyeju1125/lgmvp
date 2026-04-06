"use client";

import { guideScript, GUIDE_VIDEO_URL } from "@/content/onboarding";
import { useStore } from "@/store/useStore";
import React, { useState, useEffect, useRef } from "react";
import { Rocket, Target, Users, BarChart3, ChevronDown, Play, BookOpen } from "lucide-react";

interface OnboardingStep0Props {
  onNext: () => void;
}

function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

const HIGHLIGHT_PHRASES = [
  "프로젝트 매니지먼트 시뮬레이션",
  "진심으로 환영합니다.",
  "제한된 정보와 자원",
  "프로젝트 리더의 역할",
  "정답이 없는 상황",
  "선배·후배·유관부서",
  "제한된 시간 안에 성과",
  "'AI 기반 고객 VOC 통합 분석 프로젝트'",
  "실제에 가까운 에피소드",
  "단 하나의 정답이 존재하지 않습니다.",
  "제한된 자원을 어떻게 배분할지",
  "Trade-off",
  "프로젝트 리더로서의 여정",
];

function highlightPlainString(text: string, keyPrefix: string): React.ReactNode {
  const sorted = [...HIGHLIGHT_PHRASES].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "g");
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (sorted.includes(part)) {
      return (
        <span key={`${keyPrefix}-${part}-${idx}`} className="ob0-highlight">
          {part}
        </span>
      );
    }
    return <span key={`${keyPrefix}-${idx}`}>{part}</span>;
  });
}

function renderWithHighlights(node: React.ReactNode, keyPrefix = "h"): React.ReactNode {
  if (typeof node === "string") return highlightPlainString(node, keyPrefix);
  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <React.Fragment key={`${keyPrefix}-a-${i}`}>{renderWithHighlights(child, `${keyPrefix}-${i}`)}</React.Fragment>
    ));
  }
  if (React.isValidElement(node) && node.props && "children" in node.props) {
    const children = (node.props as { children?: React.ReactNode }).children;
    const mapped = React.Children.map(children, (c, i) => renderWithHighlights(c, `${keyPrefix}-c${i}`));
    return React.cloneElement(node as React.ReactElement<{ children?: React.ReactNode }>, {}, mapped);
  }
  return node;
}

function getVideoEmbed(url: string): { kind: "youtube"; src: string } | { kind: "mp4"; src: string } | null {
  const raw = url.trim();
  if (!raw) return null;
  try {
    const href = raw.startsWith("http") ? raw : `https://${raw}`;
    const u = new URL(href);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return { kind: "youtube", src: `https://www.youtube.com/embed/${id}` };
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      if (id) return { kind: "youtube", src: `https://www.youtube.com/embed/${id}` };
    }
  } catch { /* ignore */ }
  if (/\.mp4(\?|$)/i.test(raw)) return { kind: "mp4", src: raw };
  return null;
}

const JOURNEY_STEPS = [
  { icon: Target, label: "착수", desc: "프로젝트의 방향을 정하고 스폰서를 확보합니다" },
  { icon: BookOpen, label: "기획", desc: "항해 지도를 그리고 자원과 R&R을 분배합니다" },
  { icon: BarChart3, label: "실행", desc: "팀원들이 현장에서 아웃풋을 만들어냅니다" },
  { icon: Users, label: "감시/통제", desc: "리스크를 감지하고 프로젝트를 바로잡습니다" },
  { icon: Rocket, label: "종료", desc: "성과를 입증하고 성공적 피날레를 만듭니다" },
];

function useReveal<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      requestAnimationFrame(() => setVisible(true));
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -20px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function OnboardingStep0({ onNext }: OnboardingStep0Props) {
  const { nickname } = useStore();
  const userName = nickname || "PM";
  const [prologueOpen, setPrologueOpen] = useState(false);
  const paragraphs = guideScript.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const video = getVideoEmbed(GUIDE_VIDEO_URL);

  const hero = useReveal<HTMLDivElement>();
  const videoSection = useReveal<HTMLDivElement>(0.05);
  const journeySection = useReveal<HTMLDivElement>();
  const prologueSection = useReveal<HTMLDivElement>();
  const ctaSection = useReveal<HTMLDivElement>();

  const [countTarget, setCountTarget] = useState(false);
  useEffect(() => {
    if (hero.visible) {
      const t = setTimeout(() => setCountTarget(true), 800);
      return () => clearTimeout(t);
    }
  }, [hero.visible]);

  return (
    <div className="ob0-root flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto">

        {/* ─── HERO SECTION ─── */}
        <div ref={hero.ref} className="ob0-hero relative overflow-hidden px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="ob0-hero-bg pointer-events-none absolute inset-0" />
          <div className="ob0-hero-grid pointer-events-none absolute inset-0" />
          {/* Floating particles */}
          <div className="ob0-particle ob0-particle--1 pointer-events-none absolute" />
          <div className="ob0-particle ob0-particle--2 pointer-events-none absolute" />
          <div className="ob0-particle ob0-particle--3 pointer-events-none absolute" />
          <div className="ob0-particle ob0-particle--4 pointer-events-none absolute" />
          <div className="ob0-particle ob0-particle--5 pointer-events-none absolute" />
          <div className="ob0-particle ob0-particle--6 pointer-events-none absolute" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div
              className={`ob0-fade-up ${hero.visible ? "ob0-fade-up--visible" : ""}`}
              style={{ transitionDelay: "0ms" }}
            >
              <span className="ob0-top-badge mb-5 inline-flex items-center gap-2 rounded-full border-2 border-black/80 px-4 py-1.5 text-[13px] font-extrabold tracking-tight shadow-[2px_2px_0_#111] sm:text-[14px]">
                LG인화원 MVP과정
              </span>
            </div>

            <div
              className={`ob0-fade-up ${hero.visible ? "ob0-fade-up--visible" : ""}`}
              style={{ transitionDelay: "150ms" }}
            >
              <h1 className="ob0-hero-title mx-auto mb-4 inline-block border-[3px] border-black px-4 py-3 text-[32px] font-black leading-[1.1] tracking-tight shadow-[6px_6px_0_#111] sm:px-6 sm:py-4 sm:text-[52px]">
                프로젝트 매니지먼트
                <br />
                시뮬레이션
              </h1>
            </div>

            <div
              className={`ob0-fade-up ${hero.visible ? "ob0-fade-up--visible" : ""}`}
              style={{ transitionDelay: "300ms" }}
            >
              <p className="ob0-hero-subtitle mx-auto mt-5 max-w-2xl text-[22px] font-extrabold leading-[1.5] sm:text-[28px]">
                프로젝트 리더가 된 &ldquo;{userName}&rdquo; 님,
                <br />
                착수부터 종료까지
                <br />
                모든 과정을 직접 경험해 보세요.
              </p>
            </div>

            {/* Animated counter stats */}
            <div
              className={`ob0-fade-up ${hero.visible ? "ob0-fade-up--visible" : ""} mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6`}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="ob0-stat-card">
                <span className="ob0-stat-number">{countTarget ? "5" : "0"}</span>
                <span className="ob0-stat-label">단계</span>
              </div>
              <div className="ob0-stat-card">
                <span className="ob0-stat-number">{countTarget ? "10" : "0"}</span>
                <span className="ob0-stat-label">에피소드</span>
              </div>
              <div className="ob0-stat-card">
                <span className="ob0-stat-number">{countTarget ? "60" : "0"}</span>
                <span className="ob0-stat-label">분 소요</span>
              </div>
              <div className="ob0-stat-card">
                <span className="ob0-stat-number">AI</span>
                <span className="ob0-stat-label">맞춤 피드백</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── VIDEO SECTION ─── */}
        <div ref={videoSection.ref} className="relative bg-white px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <div
              className={`ob0-fade-up ${videoSection.visible ? "ob0-fade-up--visible" : ""}`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="mb-6 text-center">
                <span className="ob0-section-badge mb-3 inline-flex items-center gap-1.5">
                  <Play className="h-3.5 w-3.5" strokeWidth={3} />
                  TUTORIAL VIDEO
                </span>
                <p className="mt-2 text-[15px] font-medium text-[#6b7280] sm:text-[16px]">
                  아래의 영상을 통해 시뮬레이션 전반에 대해 이해합니다
                </p>
              </div>
            </div>

            <div
              className={`ob0-fade-up ${videoSection.visible ? "ob0-fade-up--visible" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="ob0-video-wrap overflow-hidden rounded-2xl border-[3px] border-black shadow-[8px_8px_0_#111]">
                <div className="ob0-video-header flex items-center justify-between border-b-2 border-black/20 px-4 py-2.5">
                  <div className="ob0-video-dots flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="font-mono text-[11px] font-bold tracking-widest text-white/70">TUTORIAL · CH-01</span>
                </div>
                <div className="relative aspect-video">
                  {video?.kind === "youtube" ? (
                    <iframe className="h-full w-full" src={video.src} title="시뮬레이션 튜토리얼" allowFullScreen />
                  ) : video?.kind === "mp4" ? (
                    <video className="h-full w-full object-cover" controls src={video.src} />
                  ) : (
                    <div className="ob0-video-placeholder relative flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
                      <div className="ob0-video-pulse flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30">
                        <Play className="h-7 w-7 text-white/80" fill="white" fillOpacity={0.5} />
                      </div>
                      <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">No Signal</p>
                      <p className="max-w-sm text-[13px] text-white/40">튜토리얼 영상 URL을 설정하면 여기서 재생됩니다.</p>
                    </div>
                  )}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)",
                      backgroundSize: "100% 3px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── JOURNEY OVERVIEW ─── */}
        <div ref={journeySection.ref} className="ob0-journey-section relative px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <div
              className={`ob0-fade-up ${journeySection.visible ? "ob0-fade-up--visible" : ""} mb-10 text-center`}
              style={{ transitionDelay: "0ms" }}
            >
              <span className="ob0-section-badge mb-3 inline-flex items-center gap-1.5">
                <Rocket className="h-3.5 w-3.5" strokeWidth={3} />
                SIMULATION JOURNEY
              </span>
              <h2 className="mt-2 text-[22px] font-extrabold tracking-tight text-[#111] sm:text-[28px]">
                프로젝트 5단계 여정 미리보기
              </h2>
              <p className="mt-2 text-[15px] font-medium text-[#6b7280] sm:text-[16px]">
                PM으로서 착수부터 종료까지, 실전과 동일한 의사결정을 경험합니다
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-5">
              {JOURNEY_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    className={`ob0-fade-up ob0-journey-card ${journeySection.visible ? "ob0-fade-up--visible" : ""}`}
                    style={{ transitionDelay: `${200 + i * 120}ms` }}
                  >
                    <div className="ob0-journey-card-number">{i + 1}</div>
                    <div className="ob0-journey-card-icon">
                      <Icon className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <h3 className="mt-3 text-[15px] font-extrabold text-[#111] sm:text-[16px]">{step.label}</h3>
                    <p className="mt-1 text-[12px] font-medium leading-snug text-[#6b7280] sm:text-[13px]">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── PROLOGUE ─── */}
        <div ref={prologueSection.ref} className="relative bg-white px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <div
              className={`ob0-fade-up ${prologueSection.visible ? "ob0-fade-up--visible" : ""}`}
              style={{ transitionDelay: "0ms" }}
            >
              {!prologueOpen ? (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setPrologueOpen(true)}
                    className="ob0-prologue-btn group inline-flex items-center gap-3 rounded-xl border-[3px] border-black px-8 py-4 text-[17px] font-black tracking-tight shadow-[4px_4px_0_#111] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#111] sm:text-[19px]"
                  >
                    <span className="ob0-prologue-icon inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black">
                      <BookOpen className="h-5 w-5" strokeWidth={2.5} />
                    </span>
                    <span className="flex flex-col items-start text-left">
                      <span>프롤로그 보기</span>
                      <span className="mt-0.5 text-[11px] font-bold normal-case text-[#6b7280]">
                        Tap to unlock briefing · 약 1분 읽기
                      </span>
                    </span>
                    <ChevronDown className="ml-1 h-5 w-5 text-[#9ca3af] transition-transform group-hover:translate-y-0.5" strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <div className="ob0-prologue-panel rounded-2xl border-[3px] border-black p-6 shadow-[6px_6px_0_#111] sm:p-8">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-black/15 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="ob0-prologue-badge inline-flex items-center gap-1.5 rounded-md border-2 border-black px-2.5 py-1 text-[12px] font-black uppercase tracking-wider">
                        <BookOpen className="h-3.5 w-3.5" strokeWidth={3} />
                        Prologue
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPrologueOpen(false)}
                      className="rounded-md border-2 border-black bg-white px-3 py-1 text-[11px] font-bold uppercase text-black shadow-[2px_2px_0_#111] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_#111]"
                    >
                      접기
                    </button>
                  </div>
                  <div className="space-y-4">
                    {paragraphs.map((para, i) => (
                      <p key={i} className="break-keep text-[15px] leading-[2] text-[#222] sm:text-[16px]">
                        {renderWithBold(para).map((n, idx) => (
                          <React.Fragment key={idx}>{renderWithHighlights(n)}</React.Fragment>
                        ))}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div ref={ctaSection.ref} className="relative bg-white px-4 pb-16 pt-4 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className={`ob0-fade-up ${ctaSection.visible ? "ob0-fade-up--visible" : ""}`}
              style={{ transitionDelay: "0ms" }}
            >
              <button
                type="button"
                onClick={onNext}
                className="ob0-cta-btn group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl border-[3px] border-black px-10 py-4 text-[20px] font-black tracking-tight shadow-[5px_5px_0_#111] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#111] sm:px-12 sm:py-5 sm:text-[24px]"
              >
                <span className="ob0-cta-shimmer pointer-events-none absolute inset-0" />
                <span className="relative">시작하기</span>
                <span className="relative text-xl transition-transform duration-200 group-hover:translate-x-1 sm:text-2xl">→</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
