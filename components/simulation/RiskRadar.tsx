"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  riskRadarCopy,
  riskRadarResultCopy,
  RISK_QUADRANTS,
  RISK_POSTITS,
  type QuadrantId,
} from "@/content/riskRadar";

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
    const t = setTimeout(() => setShowRadarIntro(false), 2800);
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
        <div className="relative z-10 flex flex-col items-center gap-4">
          <p className="text-red-400 font-medium text-lg animate-pulse">[ 삐빅- ]</p>
          <p className="text-red-300/90 text-sm">리스크 감지 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 챗봇 가이드 모달 */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="risk-radar-guide-title"
        >
          <div
            className="bg-white rounded-2xl p-6 shadow-xl max-w-lg text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="risk-radar-guide-title" className="text-sm font-semibold text-[#172B4D] mb-3">
              챗봇 선배 PM의 가이드
            </p>
            <div className="space-y-3 text-sm text-[#6B778C] leading-relaxed">
              {riskRadarCopy.chatbotGuide.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#6B778C]">
              각 사분면에 마우스를 올리면 설명(툴팁)을 볼 수 있습니다.
            </p>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors"
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

      <h2 className="text-lg font-bold text-[#4A4A4A]">{riskRadarCopy.title}</h2>

      {/* 축 설명 */}
      <div className="grid grid-cols-2 gap-2 text-xs text-[#6B6B6B]">
        <div>
          <span className="font-medium text-[#4A4A4A]">Y축 ({riskRadarCopy.axisY})</span>
          <p className="mt-0.5">{riskRadarCopy.axisYDesc}</p>
        </div>
        <div>
          <span className="font-medium text-[#4A4A4A]">X축 ({riskRadarCopy.axisX})</span>
          <p className="mt-0.5">{riskRadarCopy.axisXDesc}</p>
        </div>
      </div>

      {/* 2x2 매트릭스: [Q2][Q1] / [Q4][Q3] (Y=영향도 상→하, X=가능성 좌→우) */}
      <div className="grid grid-cols-2 gap-2">
        {[
          [RISK_QUADRANTS[1], RISK_QUADRANTS[0]],
          [RISK_QUADRANTS[3], RISK_QUADRANTS[2]],
        ].map((row, rowIdx) =>
          row.map((quad) => (
            <div
              key={quad.id}
              data-quadrant={quad.id}
              onDragOver={(e) => handleDragOver(e, quad.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, quad.id)}
              title={quad.tooltip}
              className={`min-h-[140px] rounded-xl border-2 border-dashed p-3 transition-colors ${
                dragOverId === quad.id
                  ? "border-red-500 bg-red-50/80"
                  : "border-[#E5E5E5] bg-[#F9FAFB] hover:border-red-300"
              }`}
            >
              <p className="text-xs font-semibold text-[#4A4A4A] mb-0.5">{quad.label}</p>
              <p className="text-[10px] text-[#6B6B6B] mb-2">{quad.subLabel}</p>
              <div className="flex flex-col gap-2">
                {risksByZone[quad.id]?.map((r) => (
                  <div
                    key={r.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, r.id)}
                    onDragEnd={handleDragEnd}
                    className={`rounded-lg border border-red-200 bg-[#FEF2F2] p-2 shadow-sm cursor-grab active:cursor-grabbing text-xs text-[#7F1D1D] hover:shadow-md ${
                      draggingId === r.id ? "opacity-50" : ""
                    }`}
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
        className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
          dragOverId === POOL ? "border-red-500 bg-red-50/50" : "border-[#E5E5E5] bg-[#FAFAFA]"
        }`}
      >
        <p className="text-sm font-semibold text-[#6B6B6B] mb-2">
          리스크 포스트잇 ({risksByZone[POOL]?.length ?? 0}장) — 사분면으로 드래그하세요
        </p>
        <div className="flex flex-wrap gap-2">
          {risksByZone[POOL]?.map((r) => (
            <div
              key={r.id}
              draggable
              onDragStart={(e) => handleDragStart(e, r.id)}
              onDragEnd={handleDragEnd}
              className={`max-w-[280px] rounded-lg border border-red-200 bg-[#FEF2F2] p-2.5 shadow-sm cursor-grab active:cursor-grabbing text-xs text-[#7F1D1D] hover:shadow-md ${
                draggingId === r.id ? "opacity-50" : ""
              }`}
            >
              {r.text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => router.push("/simulation?phase=monitoring-scene")}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A]"
        >
          다음
        </button>
      </div>
    </div>
  );
}
