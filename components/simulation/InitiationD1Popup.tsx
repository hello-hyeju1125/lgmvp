"use client";

import { useStore } from "@/store/useStore";
import { initiationActions, initiationScreenCopy, INITIATION_STEP_HOURS } from "@/content/initiationActions";
import type { KpiState } from "@/store/useStore";
import Link from "next/link";
import { AlertTriangle, ArrowRight, BellRing, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface InitiationD1PopupProps {
  userName: string;
}

const BADGE_NAMES: Record<string, string> = {
  champion_1on1: "프로젝트 헌장 개발",
  mentoring: "전문가 판단 및 OPA",
  pmbok_study: "프로젝트 관리 프레임워크",
  stakeholder_interview: "이해관계자 식별",
  team_profile: "EEF 인적 자원",
};

const KPI_LABELS: Record<keyof KpiState, string> = {
  quality: "산출물 품질",
  delivery: "일정 준수",
  teamEngagement: "팀 몰입도",
  stakeholderAlignment: "이해관계자 조율",
  leaderEnergy: "리더의 에너지",
};

export function InitiationD1Popup({ userName }: InitiationD1PopupProps) {
  const { initiationActionHours, kpi, kpiBeforeInitiation } = useStore();

  const badges = initiationActions
    .filter((a) => (initiationActionHours[a.id] ?? 0) >= INITIATION_STEP_HOURS[0])
    .map((a) => BADGE_NAMES[a.id] ?? a.title);

  const before = kpiBeforeInitiation ?? kpi;
  const kpiKeys: (keyof KpiState)[] = ["quality", "delivery", "teamEngagement", "stakeholderAlignment", "leaderEnergy"];
  const increased = kpiKeys.filter((key) => kpi[key] > before[key]);
  const [displayed, setDisplayed] = useState<Record<keyof KpiState, number>>({
    quality: before.quality,
    delivery: before.delivery,
    teamEngagement: before.teamEngagement,
    stakeholderAlignment: before.stakeholderAlignment,
    leaderEnergy: before.leaderEnergy,
  });

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplayed({
        quality: Math.round(before.quality + (kpi.quality - before.quality) * eased),
        delivery: Math.round(before.delivery + (kpi.delivery - before.delivery) * eased),
        teamEngagement: Math.round(before.teamEngagement + (kpi.teamEngagement - before.teamEngagement) * eased),
        stakeholderAlignment: Math.round(before.stakeholderAlignment + (kpi.stakeholderAlignment - before.stakeholderAlignment) * eased),
        leaderEnergy: Math.round(before.leaderEnergy + (kpi.leaderEnergy - before.leaderEnergy) * eased),
      });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [before, kpi]);

  return (
    <section className="initiation-d1-page" aria-labelledby="initiation-d1-title">
      <div className="d1-shell border-4 border-black p-6 sm:p-8">
        <p className="d1-label text-center font-sans text-[11px] font-black tracking-[0.18em]">LEVEL UP RECAP</p>
        <h2 id="initiation-d1-title" className="mt-2 text-center font-alice text-2xl font-black tracking-tight sm:text-3xl">
          {initiationScreenCopy.popupTitle}
        </h2>
        <p className="mt-4 text-center font-sans text-[15px] font-semibold leading-[1.8]">{initiationScreenCopy.popupIntro}</p>

        <div className="d1-panel mt-6 border-2 border-black bg-white p-5">
          <p className="font-sans text-[13px] font-black">{initiationScreenCopy.popupBadgesLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.length > 0 ? (
              badges.map((b, idx) => (
                <span key={b} className={`d1-badge ${idx % 2 === 0 ? "d1-badge-pink" : "d1-badge-blue"}`}>
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  {b}
                </span>
              ))
            ) : (
              <span className="font-sans text-[13px] font-semibold text-black/55">선택한 액션이 없습니다.</span>
            )}
          </div>
        </div>

        <div className="d1-panel mt-4 border-2 border-black bg-white p-5">
          <p className="font-sans text-[13px] font-black">{initiationScreenCopy.popupKpiLabel}</p>
          {increased.length > 0 ? (
            <ul className="mt-3 space-y-2 font-sans text-[14px] font-semibold leading-[1.8]">
              {increased.map((key) => (
                <li key={key}>
                  <span className="font-black">{KPI_LABELS[key]}</span>{" "}
                  <span>{before[key]}점</span>{" "}
                  <span className="d1-score-neon">
                    <ArrowRight className="inline-block h-4 w-4 align-[-1px]" strokeWidth={2.8} aria-hidden /> {displayed[key]}점 (
                    {initiationScreenCopy.popupKpiRise})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 font-sans text-[13px] font-semibold text-black/55">변동된 지표가 없습니다.</p>
          )}
        </div>

        <div className="d1-redline mt-6 border-4 border-black p-4 sm:p-5">
          <p className="flex items-center gap-2 font-sans text-[17px] font-black sm:text-[19px]">
            <BellRing className="h-5 w-5" strokeWidth={2.7} aria-hidden />
            {initiationScreenCopy.popupOutro}
          </p>
          <div className="mt-4 flex justify-end">
            <Link href="/simulation?phase=ep1-scene" className="d1-redline-btn inline-flex items-center gap-2 border-2 border-black px-4 py-2.5 font-sans text-[14px] font-black">
              상무님 호출 응답하기
              <span aria-hidden>⚡</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
