"use client";

const KPI_SORT_ORDER = ["산출물 품질", "일정 준수", "팀 몰입도", "이해관계자 조율", "리더"] as const;

export function sortKpiLabels(labels: string[]): string[] {
  return [...labels].sort((a, b) => {
    const idxA = KPI_SORT_ORDER.findIndex((k) => a.includes(k));
    const idxB = KPI_SORT_ORDER.findIndex((k) => b.includes(k));
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
  });
}

const UP_COLOR = "#10b981";
const DOWN_COLOR = "#FF4444";

export function KpiTrendPill({ label }: { label: string }) {
  const isUp = /▲/.test(label);
  const display = label.replace(/▼▼▼|▼▼|▼|▲▲▲|▲▲|▲/g, "").trim();

  if (isUp) {
    return (
      <div className="kpi-trend-pill kpi-trend-pill--up inline-flex items-center gap-2.5 rounded-[24px] border-2 border-[#10b981]/30 bg-[#ecfdf5] px-6 py-3" role="status">
        <span className="text-[16px] font-extrabold text-[#059669] sm:text-[17px]">{display}</span>
        <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M8 13V6M5 8.5L8 5.5 11 8.5" stroke={UP_COLOR} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="kpi-trend-pill kpi-trend-pill--down inline-flex items-center gap-2.5 rounded-[24px] border-2 border-[#FF4444]/30 bg-[#FFF5F5] px-6 py-3" role="status">
      <span className="text-[16px] font-extrabold text-[#dc2626] sm:text-[17px]">{display}</span>
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 3v7M5 7.5L8 10.5 11 7.5" stroke={DOWN_COLOR} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
