"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  riskRadarCopy,
  riskRadarResultCopy,
  RISK_QUADRANTS,
  RISK_POSTITS,
  type QuadrantId,
} from "@/content/riskRadar";

function Hl({ children }: { children: React.ReactNode }) {
  return <span style={{ backgroundColor: "#FFD600", fontWeight: 800, padding: "1px 4px", borderRadius: "3px" }}>{children}</span>;
}

function RiskGuideContent() {
  return (
    <>
      <p>리더님,</p>
      <p>순조롭던 실행 단계를 지나 마침내 <Hl>[감시 및 통제 단계]</Hl>에 진입하셨습니다! 프로젝트 실행이 중반을 넘어서면서, 곳곳에서 심상치 않은 <Hl>조짐(Risk)</Hl>들이 감지되고 있습니다.</p>
      <p>PM은 모든 리스크에 동일한 에너지를 쏟을 수 없습니다. <Hl>한정된 리소스를 현명하게 쓰려면</Hl>, 발생할 수 있는 리스크들을 <Hl>2가지 축</Hl>을 기준으로 분류하고 대응 전략을 세워야 합니다.</p>
      <p>하단에 흩어진 8개의 <Hl>&lsquo;리스크 포스트잇&rsquo;</Hl>을 읽고, <Hl>[영향도]</Hl>와 <Hl>[발생 가능성]</Hl>을 판단하여 알맞은 사분면(Quadrant)으로 <Hl>드래그 앤 드롭</Hl>해 보세요!</p>
    </>
  );
}

const POOL = "pool" as const;
type PlacementId = QuadrantId | typeof POOL;

interface RiskRadarProps {
  userName: string;
}

export function RiskRadar({ userName }: RiskRadarProps) {
  const router = useRouter();
  const [showRadarIntro, setShowRadarIntro] = useState(true);
  const [placement, setPlacement] = useState<Record<string, PlacementId>>(() => {
    const init: Record<string, PlacementId> = {};
    RISK_POSTITS.forEach((r) => (init[r.id] = POOL));
    return init;
  });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<PlacementId | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const successShownRef = useRef(false);

  const allCorrect =
    RISK_POSTITS.every((r) => placement[r.id] === r.suggestedQuadrant);

  useEffect(() => {
    if (!showRadarIntro) return;
    const t = setTimeout(() => setShowRadarIntro(false), 1400);
    return () => clearTimeout(t);
  }, [showRadarIntro]);

  useEffect(() => {
    if (!allCorrect || successShownRef.current) return;
    successShownRef.current = true;
    setShowSuccessModal(true);
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
        osc.start(start);
        osc.stop(start + duration);
      };
      playTone(523.25, 0, 0.15);
      playTone(659.25, 0.18, 0.2);
    } catch {
      /* no sound */
    }
  }, [allCorrect]);

  const moveTo = useCallback((riskId: string, to: PlacementId) => {
    setPlacement((prev) => ({ ...prev, [riskId]: to }));
  }, []);

  const handleDragStart = (e: React.DragEvent, riskId: string) => {
    setDraggingId(riskId);
    e.dataTransfer.setData("text/plain", riskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, zoneId: PlacementId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(zoneId);
  };

  const handleDragLeave = () => setDragOverId(null);

  const handleDrop = (e: React.DragEvent, zoneId: PlacementId) => {
    e.preventDefault();
    setDragOverId(null);
    setDraggingId(null);
    const riskId = e.dataTransfer.getData("text/plain");
    if (riskId) moveTo(riskId, zoneId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  const risksByZone = (RISK_QUADRANTS.map((q) => q.id) as PlacementId[])
    .concat([POOL])
    .reduce(
      (acc, zoneId) => {
        acc[zoneId] = RISK_POSTITS.filter((r) => placement[r.id] === zoneId);
        return acc;
      },
      {} as Record<PlacementId, typeof RISK_POSTITS>
    );

  if (showRadarIntro) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0a0a]" aria-hidden="true">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(220,38,38,0.15) 2px, rgba(220,38,38,0.15) 4px)" +
                ", repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(220,38,38,0.1) 2px, rgba(220,38,38,0.1) 4px)",
            }}
          />
          <div
            className="absolute inset-0 animate-risk-sweep"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(220,38,38,0.5) 60deg, transparent 120deg)",
            }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-3">
          <p className="ds-white-text text-[28px] font-extrabold animate-pulse sm:text-[32px]">리스크 감지 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 챗봇 가이드 모달 */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="risk-radar-guide-title"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden bg-white"
            style={{ border: "2px solid #111", borderRadius: "6px", boxShadow: "6px 6px 0 #111", animation: "ds-modal-enter 350ms ease-out both" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="ds-dark-header flex items-center gap-3 px-6 py-4" style={{ backgroundColor: "#111", borderBottom: "2px solid #111" }}>
              <div className="min-w-0 flex-1">
                <p className="ds-dark-header-sub text-[12px] font-extrabold tracking-[0.2em]">리스크 매니지먼트</p>
                <h3 id="risk-radar-guide-title" className="mt-1 text-[22px] font-extrabold tracking-tight sm:text-[24px]">챗봇 선배 PM의 가이드</h3>
              </div>
            </div>

            {/* Body */}
            <div className="flex gap-5 px-6 pt-6 pb-3 items-start">
              <div className="shrink-0 flex flex-col items-center">
                <div className="h-[80px] w-[80px] overflow-hidden rounded-full sm:h-[100px] sm:w-[100px]">
                  <img src="/LG_MVP_chatbot.jpg" alt="챗봇 선배 PM" className="h-full w-full object-cover" />
                </div>
                <p className="mt-2 text-center text-[13px] font-extrabold text-[#111]">챗봇 선배 PM</p>
              </div>

              <div className="relative min-w-0 flex-1 p-5 text-left" style={{ border: "2px solid #ef4444", borderRadius: "6px", backgroundColor: "#ffffff" }}>
                <div
                  className="absolute hidden sm:block"
                  style={{ top: "28px", left: "-10px", width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "10px solid #ef4444" }}
                  aria-hidden
                />
                <div className="space-y-3 text-[15px] leading-relaxed text-[#333]">
                  <RiskGuideContent />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-[15px] font-extrabold transition-all"
                style={{ backgroundColor: "#FFD600", color: "#111", border: "2px solid #111", borderRadius: "6px", boxShadow: "3px 3px 0 #111", padding: "10px 28px" }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "0 0 0 #111"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 #111"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 #111"; }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen 29: 올바르게 배치 시 결과 팝업 */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="risk-radar-result-title"
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-4 flex-shrink-0">
              <h2 id="risk-radar-result-title" className="text-lg font-bold text-[#4A4A4A]">
                {riskRadarResultCopy.title}
              </h2>
              <p className="text-sm font-semibold text-[#6B6B6B] mt-2">
                {riskRadarResultCopy.subtitle}
              </p>
            </div>
            <div className="px-6 pb-6 overflow-y-auto flex-1 min-h-0 space-y-4">
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                {riskRadarResultCopy.intro}
              </p>
              <ul className="space-y-3">
                {riskRadarResultCopy.quadrantFeedback.map((item, i) => (
                  <li key={i} className="text-sm text-[#6B6B6B]">
                    <span className="font-medium text-[#4A4A4A]">• [{item.label}]</span>
                    <p className="mt-1 leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                {riskRadarResultCopy.outro}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="exec-board-jira-shell overflow-hidden rounded-lg border border-[#e8c4c4]">
        {/* 상단 앱 바 */}
        <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e8c4c4" }}>
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <span className="inline-flex h-8 min-w-[2.5rem] items-center justify-center rounded px-2 text-[13px] font-extrabold tracking-tight" style={{ backgroundColor: "#DC2626", color: "#ffffff" }}>
              RM
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#9b4d4d" }}>
                LGMVP · 감시/통제 단계 · Risk Radar
              </p>
              <h2 className="truncate text-[18px] font-semibold leading-tight sm:text-[20px]" style={{ color: "#7f1d1d" }}>
                {riskRadarCopy.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-bold" style={{ backgroundColor: "#fef2f2", border: "1px solid #e8c4c4", color: "#991b1b" }}>
              배치 {RISK_POSTITS.length - (risksByZone[POOL]?.length ?? 0)}/{RISK_POSTITS.length}
            </span>
          </div>
        </header>

        {/* 보드 캔버스 */}
        <div className="px-3 pb-5 pt-4 sm:px-4" style={{ backgroundColor: "#fef8f8" }}>
          {/* 축 설명 배너 */}
          <div className="ds-white-text mb-4 rounded-md px-4 py-3 text-[14px] font-medium leading-relaxed" style={{ backgroundColor: "#DC2626" }}>
            <p>
              <span className="font-extrabold">Y축 ({riskRadarCopy.axisY}):</span> {riskRadarCopy.axisYDesc}
            </p>
            <p className="mt-1">
              <span className="font-extrabold">X축 ({riskRadarCopy.axisX}):</span> {riskRadarCopy.axisXDesc}
            </p>
          </div>

          {/* 2x2 매트릭스 */}
          <div className="grid grid-cols-2 gap-3">
            {[
              [RISK_QUADRANTS[1], RISK_QUADRANTS[0]],
              [RISK_QUADRANTS[3], RISK_QUADRANTS[2]],
            ].map((row) =>
              row.map((quad) => (
                <div
                  key={quad.id}
                  data-quadrant={quad.id}
                  onDragOver={(e) => handleDragOver(e, quad.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, quad.id)}
                  className={`group relative min-h-[140px] rounded-md border-2 p-3 transition-colors ${
                    dragOverId === quad.id
                      ? "border-[#DC2626] bg-[#fef2f2]"
                      : "border-dashed border-[#e8c4c4] bg-[#fff5f5] hover:border-[#DC2626]"
                  }`}
                >
                  {/* Hover tooltip */}
                  <div className="pointer-events-none absolute left-1/2 bottom-0 z-50 -translate-x-1/2 translate-y-full opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <div className="mt-1.5 max-w-[280px] rounded-md px-3 py-2 text-[12px] font-semibold leading-relaxed ds-white-text" style={{ backgroundColor: "#111", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                      {quad.tooltip}
                    </div>
                  </div>
                  <p className="text-[13px] font-extrabold mb-0.5" style={{ color: "#7f1d1d" }}>{quad.label}</p>
                  <p className="text-[11px] mb-2" style={{ color: "#9b4d4d" }}>{quad.subLabel}</p>
                  <div className="flex flex-col gap-2">
                    {risksByZone[quad.id]?.map((r) => (
                      <div
                        key={r.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, r.id)}
                        onDragEnd={handleDragEnd}
                        className={`rounded-md p-2.5 text-[12px] font-medium cursor-grab active:cursor-grabbing ${
                          draggingId === r.id ? "opacity-50" : ""
                        }`}
                        style={{ backgroundColor: "#ffffff", border: "1px solid #e8c4c4", color: "#7f1d1d" }}
                      >
                        {r.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 배치 대기 포스트잇 (풀) */}
          <div
            onDragOver={(e) => handleDragOver(e, POOL)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, POOL)}
            className={`mt-4 rounded-md border-2 p-4 transition-colors ${
              dragOverId === POOL ? "border-[#111] bg-[#fffbeb]" : "border-dashed border-[#d4d4d4] bg-[#f5f5f5]"
            }`}
          >
            <p className="text-[13px] font-extrabold mb-2" style={{ color: "#333" }}>
              리스크 포스트잇 ({risksByZone[POOL]?.length ?? 0}장) — 사분면으로 드래그하세요
            </p>
            <div className="flex flex-wrap gap-2">
              {risksByZone[POOL]?.map((r) => (
                <div
                  key={r.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, r.id)}
                  onDragEnd={handleDragEnd}
                  className={`max-w-[280px] rounded-md p-2.5 text-[12px] font-medium cursor-grab active:cursor-grabbing ${
                    draggingId === r.id ? "opacity-50" : ""
                  }`}
                  style={{ backgroundColor: "#ffffff", border: "1px solid #d4d4d4", color: "#333" }}
                >
                  {r.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
