"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { reportData } from "@/content/pmReport";
import type { KpiState } from "@/store/useStore";


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

function getGrade(avg: number): { grade: string; color: string } {
  if (avg >= 85) return { grade: "S", color: "#64e87a" };
  if (avg >= 70) return { grade: "A", color: "#64e87a" };
  if (avg >= 55) return { grade: "B", color: "#FFD600" };
  return { grade: "C", color: "#ff6b6b" };
}

/* ── Radar Chart (SVG) ── */
function RadarChart({ values }: { values: number[] }) {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const levels = 5;
  const maxR = 110;

  const angleStep = (2 * Math.PI) / values.length;
  const startAngle = -Math.PI / 2;

  const getPoint = (i: number, r: number) => {
    const angle = startAngle + i * angleStep;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridLines = Array.from({ length: levels }, (_, li) => {
    const r = ((li + 1) / levels) * maxR;
    const pts = values.map((_, i) => getPoint(i, r));
    return pts.map((p) => `${p.x},${p.y}`).join(" ");
  });

  const dataPoints = values.map((v, i) => {
    const r = (v / 100) * maxR;
    return getPoint(i, r);
  });
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const labels = Object.values(KPI_LABELS);

  const getLabelAnchor = (i: number): "start" | "middle" | "end" => {
    const angle = startAngle + i * angleStep;
    const deg = (angle * 180) / Math.PI;
    if (deg > -100 && deg < -80) return "middle";
    if (deg > 80 && deg < 100) return "middle";
    if (Math.cos(angle) > 0.1) return "start";
    if (Math.cos(angle) < -0.1) return "end";
    return "middle";
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[400px]">
      {gridLines.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="#ddd" strokeWidth={1} />
      ))}
      {values.map((_, i) => {
        const p = getPoint(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e0e0e0" strokeWidth={0.7} />;
      })}
      <polygon points={dataPath} fill="rgba(100, 232, 122, 0.25)" stroke="#64e87a" strokeWidth={2.5} />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#64e87a" stroke="#111" strokeWidth={1.5} />
      ))}
      {values.map((_, i) => {
        const p = getPoint(i, maxR + 38);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor={getLabelAnchor(i)}
            dominantBaseline="middle"
            className="fill-[#222] text-[12px] font-bold"
          >
            {labels[i]}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Section wrapper ── */
function Section({
  number,
  title,
  accent,
  children,
}: {
  number: number;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)" }}
    >
      <div className="mb-5 flex items-center gap-3">
        <span
          className="pm-num-circle flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[15px] font-black"
          style={{ backgroundColor: "#111", border: "2px solid #111" }}
        >
          {number}
        </span>
        <h2 className="text-[22px] font-extrabold tracking-tight text-[#111] sm:text-[24px]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* ── Bullet list card ── */
function BulletCard({
  heading,
  summary,
  bullets,
  accentColor,
  icon,
}: {
  heading: string;
  summary: string;
  bullets: string[];
  accentColor: string;
  icon: string;
}) {
  return (
    <div
      className="pm-card overflow-hidden rounded-md bg-white"
    >
      <div className="px-6 py-4" style={{ backgroundColor: accentColor, borderBottom: "2px solid #111" }}>
        <p className="text-[17px] font-extrabold text-[#111] sm:text-[18px]">
          {heading}
        </p>
        <p className="mt-1 text-[14px] font-semibold text-[#111]/70">{summary}</p>
      </div>
      <ul className="space-y-4 px-6 py-5">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-[#333]">
            <span className="mt-0.5 shrink-0 text-[13px] font-black" style={{ color: accentColor === "#ffffff" ? "#111" : accentColor }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Main Report ── */
export function PmReport() {
  const router = useRouter();
  const { kpi, nickname } = useStore();
  const avg = Math.round(KPI_KEYS.reduce((s, k) => s + kpi[k], 0) / KPI_KEYS.length);
  const { grade, color } = getGrade(avg);
  const radarValues = KPI_KEYS.map((k) => kpi[k]);
  const displayName = nickname || "리더";

  return (
    <div className="pm-report-page min-h-screen bg-[#fafafa]">
      {/* Hero header */}
      <header
        className="relative overflow-hidden px-6 pb-6 pt-8 text-center sm:pt-10 sm:pb-8"
        style={{ backgroundColor: "#111" }}
      >
        <p className="pm-white-sub text-[12px] font-extrabold tracking-[0.25em]">MY PM JOURNEY REPORT</p>
        <h1 className="pm-white mt-2 text-[34px] font-black tracking-tight sm:text-[44px]">
          {displayName}님의 PM 여정 보고서
        </h1>
        <div className="mx-auto mt-4 h-[2px] w-16" style={{ backgroundColor: "#f9a8d4" }} />
      </header>

      <main className="mx-auto max-w-[1200px] space-y-16 px-10 py-14 lg:px-16">
        {/* ─── Section 1: 최종 성적표 ─── */}
        <Section number={1} title={reportData.scorecard.sectionTitle} accent="#f9a8d4">
          <div className="pm-card overflow-hidden rounded-md bg-white">
            {/* Grade + ending */}
            <div className="flex flex-col items-center gap-4 px-6 py-8 text-center" style={{ borderBottom: "2px solid #111" }}>
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-[42px] font-black sm:h-24 sm:w-24 sm:text-[50px]"
                style={{ backgroundColor: color, border: "3px solid #111", color: "#111" }}
              >
                {grade}
              </div>
              <p className="text-[14px] font-extrabold text-[#111]">종합 평균 {avg}점</p>
              <p className="max-w-md text-[16px] font-bold leading-relaxed text-[#333] sm:text-[17px]">
                {reportData.scorecard.ending}
              </p>
            </div>

            {/* Radar + KPI bars side by side */}
            <div className="grid grid-cols-2 items-center gap-6 px-8 py-8">
            <div>
              <RadarChart values={radarValues} />
            </div>

            <div className="space-y-3">
              {KPI_KEYS.map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-[110px] shrink-0 text-right text-[14px] font-extrabold text-[#111] sm:w-[130px]">
                    {KPI_LABELS[key]}
                  </span>
                  <div className="h-5 flex-1 overflow-hidden rounded-sm" style={{ backgroundColor: "#e8e8e8", border: "1.5px solid #111" }}>
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${kpi[key]}%`,
                        backgroundColor: kpi[key] >= 70 ? "#64e87a" : kpi[key] >= 40 ? "#FFD600" : "#ff6b6b",
                        transition: "width 1s ease-out",
                      }}
                    />
                  </div>
                  <span className="w-[38px] shrink-0 font-mono text-[13px] font-extrabold tabular-nums text-[#111]">
                    {kpi[key]}
                  </span>
                </div>
              ))}
            </div>
            </div>
          </div>
        </Section>

        {/* ─── Section 2: PM 유형 ─── */}
        <Section number={2} title={reportData.pmType.sectionTitle} accent="#64e87a">
          <div className="grid grid-cols-2 gap-6">
            <BulletCard
              heading={reportData.pmType.strengths.heading}
              summary={reportData.pmType.strengths.summary}
              bullets={reportData.pmType.strengths.bullets}
              accentColor="#64e87a"
              icon=""
            />
            <BulletCard
              heading={reportData.pmType.improvements.heading}
              summary={reportData.pmType.improvements.summary}
              bullets={reportData.pmType.improvements.bullets}
              accentColor="#FFD600"
              icon=""
            />
          </div>
        </Section>

        {/* ─── Section 3: 의사결정 복기 ─── */}
        <Section number={3} title={reportData.decisions.sectionTitle} accent="#FFD600">
          <div className="grid grid-cols-2 gap-6">
            <BulletCard
              heading={reportData.decisions.best.heading}
              summary={reportData.decisions.best.summary}
              bullets={reportData.decisions.best.bullets}
              accentColor="#64e87a"
              icon=""
            />
            <BulletCard
              heading={reportData.decisions.regret.heading}
              summary={reportData.decisions.regret.summary}
              bullets={reportData.decisions.regret.bullets}
              accentColor="#FFD600"
              icon=""
            />
          </div>
        </Section>

        {/* ─── Section 4: PM 지식 포트폴리오 ─── */}
        <Section number={4} title={reportData.portfolio.sectionTitle} accent="#64e87a">
          {/* Badges */}
          <div className="pm-card overflow-hidden rounded-md bg-white mb-6">
            <div className="flex flex-col items-center gap-5 px-6 py-8 text-center">
              <p className="text-[13px] font-extrabold tracking-[0.12em] text-[#111]/50">획득 뱃지</p>
              <div className="flex flex-wrap justify-center gap-3">
                {reportData.portfolio.badges.map((badge) => (
                  <span
                    key={badge}
                    className="pm-badge inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[15px] font-extrabold text-[#111]"
                    style={{ backgroundColor: "#64e87a" }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <p className="mt-2 max-w-lg text-[16px] font-semibold leading-relaxed text-[#333]">
                {reportData.portfolio.summary}
              </p>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-2 gap-6">
            <BulletCard
              heading={reportData.portfolio.strengths.heading}
              summary=""
              bullets={reportData.portfolio.strengths.bullets}
              accentColor="#64e87a"
              icon=""
            />
            <BulletCard
              heading={reportData.portfolio.improvements.heading}
              summary=""
              bullets={reportData.portfolio.improvements.bullets}
              accentColor="#FFD600"
              icon=""
            />
          </div>
        </Section>

        {/* ─── Section 5: 현업 적용 처방 ─── */}
        <Section number={5} title={reportData.prescription.sectionTitle} accent="#f9a8d4">
          <div className="pm-card overflow-hidden rounded-md bg-white">
            <ul className="space-y-4 px-8 py-6">
              {reportData.prescription.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-[#333]">
                  <span className="mt-0.5 shrink-0 text-[13px] font-black" style={{ color: "#f9a8d4" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ─── Footer ─── */}
        <div className="flex flex-col items-center pb-8 pt-4 text-center">
          <div className="h-[2px] w-12" style={{ backgroundColor: "#ddd" }} />
          <p className="mt-5 text-[28px] font-bold text-[#999]">수고하셨습니다, 리더님!</p>
          <div className="mt-10 flex items-center gap-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="pm-white pm-dark-card inline-flex items-center gap-2 text-[16px] font-extrabold transition-all sm:text-[17px]"
              style={{ backgroundColor: "#111", border: "2px solid #111", borderRadius: "6px", padding: "12px 32px", cursor: "pointer" }}
            >
              PDF 다운로드
            </button>
            <button
              type="button"
              onClick={() => { window.location.href = "/"; }}
              className="pm-card inline-flex items-center gap-2 text-[16px] font-extrabold text-[#111] transition-all sm:text-[17px]"
              style={{ backgroundColor: "#fff", border: "2px solid #111", borderRadius: "6px", padding: "12px 32px", cursor: "pointer" }}
            >
              종료하기
            </button>
            <button
              type="button"
              onClick={() => {
                useStore.getState().resetSimulation();
                router.push("/simulation?phase=initiation-action");
              }}
              className="pm-card inline-flex items-center gap-2 text-[16px] font-extrabold text-[#111] transition-all sm:text-[17px]"
              style={{ backgroundColor: "#f9a8d4", border: "2px solid #111", borderRadius: "6px", padding: "12px 32px", cursor: "pointer" }}
            >
              처음부터 다시 시작하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
