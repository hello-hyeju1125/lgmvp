"use client";

import { tutorialContent } from "@/content/tutorial";
import { useState, type ReactNode } from "react";
import {
  Calendar,
  Construction,
  GanttChartSquare,
  Handshake,
  Mail,
  MessageSquare,
  Target,
  Users,
  Zap,
} from "lucide-react";

interface OnboardingStep3Props {
  onNext: () => void;
  userName: string;
}

function replaceUserName(text: string, name: string) {
  return text.replace(/\{User_Name\}/g, name);
}

/** **텍스트** → <strong>텍스트</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>));
}

const GAUGE_META = [
  { icon: Target, bg: "bg-[#CFE8FF]", abbr: "Quality" },
  { icon: Calendar, bg: "bg-[#CFE8FF]", abbr: "Delivery" },
  { icon: Users, bg: "bg-[#FFDEE8]", abbr: "Engage" },
  { icon: Handshake, bg: "bg-[#FFDEE8]", abbr: "Align" },
  { icon: Zap, bg: "bg-[#FFF59E]", abbr: "Energy" },
] as const;

const TOOL_ICONS = [Mail, MessageSquare, GanttChartSquare] as const;

const TABS = [
  { id: "kpi", label: "1. 5대 핵심 지표" },
  { id: "iface", label: "2. 인터페이스" },
  { id: "rules", label: "3. 당부 사항" },
] as const;

function WarningCallout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 border-2 border-black bg-[#FFD12A] p-4 shadow-[4px_4px_0px_#111111]">
      <Construction className="h-9 w-9 shrink-0 text-black" strokeWidth={2.5} aria-hidden />
      <div className="min-w-0 font-sans text-[15px] font-bold leading-relaxed text-[#111]">{children}</div>
    </div>
  );
}

export function OnboardingStep3({ userName, onNext: _onNext }: OnboardingStep3Props) {
  const [activeTab, setActiveTab] = useState(0);

  const dashboardIntro = replaceUserName(tutorialContent.dashboardIntro, userName);
  const cta = replaceUserName(tutorialContent.cta, userName);
  const kpiGauges = tutorialContent.gauges.filter((g) => !g.title.includes("에너지"));
  const energyGauge = tutorialContent.gauges.find((g) => g.title.includes("에너지"));

  const introBits = dashboardIntro.split(/(?<=입니다\.)\s+/);
  const introP1 = introBits[0] ?? dashboardIntro;
  const introP2 = introBits.slice(1).join(" ").trim();

  return (
    <div className="tutorial-manual-page flex min-h-0 flex-1 flex-col bg-white px-3 py-3 sm:px-5 sm:py-4">
      <div
        className="manual-chrome mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col border-4 border-black bg-[#d4d4d4] shadow-[12px_12px_0px_#111111]"
        style={{ maxHeight: "min(calc(100dvh - 6.5rem), 900px)" }}
      >
        {/* Title bar */}
        <header className="manual-titlebar relative shrink-0 flex items-center justify-center border-b-2 border-black bg-[#F4F4F4] px-4 py-3 sm:px-6">
          <div className="absolute left-3 flex gap-2 sm:left-6">
            <span className="manual-dot-red h-4 w-4 border-2 border-black bg-[#FF5F57]" />
            <span className="manual-dot-yellow h-4 w-4 border-2 border-black bg-[#FEBC2E]" />
            <span className="manual-dot-green h-4 w-4 border-2 border-black bg-[#28C840]" />
          </div>
          <h1 className="w-full px-10 text-center font-alice text-lg font-black tracking-tight text-[#111] sm:px-14 sm:text-2xl">
            게임 매뉴얼 · 시뮬레이션 튜토리얼
          </h1>
        </header>

        {/* 레트로 폴더 탭 */}
        <div
          className="manual-tabstrip flex shrink-0 border-b-2 border-black bg-[#c8c8c8] px-2 pt-2 sm:px-3 sm:pt-3"
          role="tablist"
          aria-label="매뉴얼 섹션"
        >
          {TABS.map((tab, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                id={`manual-tab-${tab.id}`}
                aria-controls={`manual-panel-${tab.id}`}
                onClick={() => setActiveTab(i)}
                className={`min-h-[48px] flex-1 border-2 border-black px-2 py-2.5 font-sans text-[11px] font-black leading-tight shadow-[3px_3px_0px_#111111] transition-colors duration-150 ease-out sm:min-h-[52px] sm:px-3 sm:text-sm ${
                  isActive
                    ? "manual-tab-active relative z-10 mb-[-4px] border-b-0 bg-[#89E586] pb-3 text-[#111] ring-2 ring-inset ring-black/20"
                    : "manual-tab-inactive bg-[#a8a8a8] text-[#2a2a2a] hover:bg-[#b8b8b8] hover:text-[#111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#111111]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 탭 패널 — 굵은 래퍼 테두리 없음, 여백·배경으로 구분 */}
        <div
          className="manual-tab-panel flex min-h-0 flex-1 flex-col overflow-hidden bg-white"
          role="tabpanel"
          id={`manual-panel-${TABS[activeTab]?.id}`}
          aria-labelledby={`manual-tab-${TABS[activeTab]?.id}`}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8 sm:py-8">
            {activeTab === 0 && (
              <div className="space-y-8">
                <section className="space-y-3">
                  <h2 className="text-center font-alice text-xl font-black text-[#111] sm:text-2xl">
                    시작하기 전에 확인해주세요
                  </h2>
                  <div className="space-y-3 font-sans text-sm font-medium leading-relaxed text-[#111] sm:text-[15px]">
                    <p>{introP1}</p>
                    {introP2 ? <p>{introP2}</p> : null}
                  </div>
                </section>

                <section aria-label="HUD 미리보기">
                  <h2 className="mb-3 inline-block border-2 border-black bg-[#111] px-2 py-1 font-sans text-[10px] font-black uppercase tracking-widest text-white shadow-[2px_2px_0px_#111]">
                    Heads-Up Display (미리보기)
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
                    {tutorialContent.gauges.map((g, i) => {
                      const meta = GAUGE_META[i] ?? GAUGE_META[0];
                      const Icon = meta.icon;
                      return (
                        <div
                          key={g.title}
                          className={`flex flex-col border-2 border-black ${meta.bg} p-3 shadow-[3px_3px_0px_#111111]`}
                        >
                          <div className="mb-1 flex items-center justify-between gap-1">
                            <Icon className="h-5 w-5 shrink-0 text-[#111] sm:h-6 sm:w-6" strokeWidth={2.5} aria-hidden />
                            <span className="font-sans text-[9px] font-black text-[#111] sm:text-[10px]">{meta.abbr}</span>
                          </div>
                          <div className="manual-progress-track h-1.5 w-full border-2 border-black bg-[#e5e5e5] sm:h-2">
                            <div
                              className="h-full bg-[#89E586]"
                              style={{ width: `${[72, 68, 75, 70, 55][i] ?? 60}%` }}
                            />
                          </div>
                          <p className="mt-1 line-clamp-2 font-sans text-[10px] font-bold leading-tight text-[#111]">
                            {g.title.replace(/\s*\([^)]*\)\s*/g, "").trim()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3 font-sans text-[11px] font-bold text-[#555]">
                    실제 플레이 중 화면 상단에 동일한 5개 지표가 실시간으로 표시됩니다.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 inline-block border-2 border-black bg-[#89E586] px-3 py-1 font-sans text-xs font-black text-[#111] shadow-[2px_2px_0px_#111]">
                    4가지 KPI + 한정 자원
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {kpiGauges.map((g, i) => {
                      const Icon = GAUGE_META[i]?.icon ?? Target;
                      return (
                        <article
                          key={g.title}
                          className={`border-2 border-black p-4 shadow-[3px_3px_0px_#111111] ${GAUGE_META[i]?.bg ?? "bg-[#CFE8FF]"}`}
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="neo-no-bg flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
                              <Icon className="h-5 w-5 text-[#111] sm:h-7 sm:w-7" strokeWidth={2.5} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-alice text-sm font-black leading-tight text-[#111] sm:text-base">{g.title}</h3>
                              <p className="mt-1.5 font-sans text-xs font-semibold leading-relaxed text-[#111] sm:text-sm">{g.desc}</p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {energyGauge && (
                    <article className="mt-4 border-2 border-dashed border-black bg-[#FFF59E] p-4 shadow-[3px_3px_0px_#111111]">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="neo-no-bg flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
                          <Zap className="h-5 w-5 text-[#111] sm:h-7 sm:w-7" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-alice text-sm font-black leading-tight text-[#111] sm:text-base">{energyGauge.title}</h3>
                          <p className="mt-1.5 font-sans text-xs font-semibold leading-relaxed text-[#111] sm:text-sm">{energyGauge.desc}</p>
                        </div>
                      </div>
                    </article>
                  )}
                </section>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-8">
                <p className="text-center font-sans text-sm font-bold leading-relaxed text-[#111] sm:text-base">
                  {replaceUserName(tutorialContent.intro, userName)}
                </p>
                <div>
                  <h2 className="mb-4 inline-block border-2 border-black bg-[#ADF1FF] px-3 py-1 font-sans text-xs font-black text-[#111] shadow-[2px_2px_0px_#111]">
                    게임 인터페이스
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {tutorialContent.tools.map((t, i) => {
                      const Icon = TOOL_ICONS[i] ?? Mail;
                      return (
                        <div
                          key={t.name}
                          className="manual-tool-card flex flex-col border-2 border-black p-4 shadow-[3px_3px_0px_#111111]"
                        >
                          <div className="mb-3 flex h-11 w-11 items-center justify-center">
                            <Icon className="h-6 w-6 text-[#111]" strokeWidth={2.5} />
                          </div>
                          <h3 className="font-alice text-base font-black leading-tight text-[#111]">{t.name}</h3>
                          <p className="mt-2 font-sans text-xs font-semibold leading-snug text-[#111] sm:text-sm">
                            {t.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="flex min-h-full flex-col gap-10 px-2 py-6 sm:gap-12 sm:px-6 sm:py-10 md:px-8 pb-14 sm:pb-20">
                <WarningCallout>
                  <h2 className="font-alice text-base font-black leading-snug sm:text-lg">{tutorialContent.closingTitle}</h2>
                </WarningCallout>

                <div className="space-y-6 font-sans text-sm font-medium leading-relaxed text-[#111] sm:space-y-8 sm:text-[15px]">
                  <p>{renderWithBold(tutorialContent.closingParagraphs[0] ?? "")}</p>
                  <p>{renderWithBold(tutorialContent.closingParagraphs[1] ?? "")}</p>
                </div>

                <WarningCallout>
                  <p className="font-sans text-sm font-bold leading-relaxed sm:text-[15px]">
                    {renderWithBold(tutorialContent.closingParagraphs[2] ?? "")}
                  </p>
                </WarningCallout>

                <p className="text-center font-alice text-base font-black text-[#111] sm:text-lg">{cta}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
