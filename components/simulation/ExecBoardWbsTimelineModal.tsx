"use client";

import { useMemo } from "react";
import {
  getIssueKey,
  getLabelFromText,
  getPlacementStatusLabel,
  getTicketsSortedByTimeline,
  type ExecBoardTicketDef,
  type PlacementId,
} from "@/content/execBoard";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  placement: Record<string, PlacementId>;
};

function buildTableRows(tickets: ExecBoardTicketDef[]) {
  const out: ({ type: "phase"; title: string } | { type: "row"; ticket: ExecBoardTicketDef })[] = [];
  let prevPhase = "";
  for (const t of tickets) {
    if (t.timelinePhase !== prevPhase) {
      out.push({ type: "phase", title: t.timelinePhase });
      prevPhase = t.timelinePhase;
    }
    out.push({ type: "row", ticket: t });
  }
  return out;
}

export function ExecBoardWbsTimelineModal({ open, onClose, onConfirm, placement }: Props) {
  const tableRows = useMemo(() => buildTableRows(getTicketsSortedByTimeline()), []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#091E42]/55 px-4 py-8 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exec-wbs-timeline-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(90vh,720px)] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-[#DFE1E6] bg-white shadow-[0_8px_32px_rgba(9,30,66,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-[#DFE1E6] bg-[#F4F5F7] px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#5E6C84]">WBS · 타임라인 요약</p>
          <h2 id="exec-wbs-timeline-title" className="mt-1 text-[18px] font-semibold text-[#172B4D]">
            스프린트 일정 순 작업·이해관계자
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-[#5E6C84]">
            보드에 배치하신 상태를 시간 흐름(WBS) 순으로 정리했습니다. 참석자분들이 잠깐 공유하고 넘어가기에 좋습니다. 확인 후 다음
            단계로 이동합니다.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#DFE1E6] text-[11px] font-bold uppercase tracking-wide text-[#5E6C84]">
                  <th className="whitespace-nowrap py-2 pr-3">WBS</th>
                  <th className="whitespace-nowrap py-2 pr-3">일정</th>
                  <th className="min-w-[200px] py-2 pr-3">Task</th>
                  <th className="whitespace-nowrap py-2 pr-3">이해관계자·역할</th>
                  <th className="whitespace-nowrap py-2">보드 상태</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((item, idx) =>
                  item.type === "phase" ? (
                    <tr key={`phase-${item.title}-${idx}`} className="bg-[#DEEBFF]/80">
                      <td colSpan={5} className="border-t border-[#B3D4FF] px-2 py-2 text-[12px] font-bold text-[#0747A6]">
                        {item.title}
                      </td>
                    </tr>
                  ) : (
                    <tr key={item.ticket.id} className="border-b border-[#EBECF0] hover:bg-[#FAFBFC]">
                      <td className="whitespace-nowrap py-2.5 pr-3 align-top font-mono text-[12px] font-semibold text-[#0C66E4]">
                        {item.ticket.wbsCode}
                      </td>
                      <td className="whitespace-nowrap py-2.5 pr-3 align-top text-[#5E6C84]">{item.ticket.scheduleLabel}</td>
                      <td className="py-2.5 pr-3 align-top text-[#172B4D]">
                        <span className="font-medium">{item.ticket.text}</span>
                        {getLabelFromText(item.ticket.text) ? (
                          <span className="mt-1 ml-0 block w-fit rounded bg-[#E9F2FF] px-1.5 py-0.5 text-[11px] font-bold text-[#0747A6]">
                            {getLabelFromText(item.ticket.text)}
                          </span>
                        ) : null}
                        <span className="mt-1 block text-[11px] text-[#5E6C84]">{getIssueKey(item.ticket.id)}</span>
                      </td>
                      <td className="py-2.5 pr-3 align-top text-[#172B4D]">
                        <ul className="list-inside list-disc space-y-0.5 text-[12px]">
                          {item.ticket.stakeholders.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="whitespace-nowrap py-2.5 align-top">
                        <StatusPill col={placement[item.ticket.id] ?? "pool"} />
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-[#DFE1E6] bg-[#FAFBFC] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-[14px] font-semibold text-[#42526E] transition hover:bg-[#EBECF0]"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded bg-[#0C66E4] px-5 py-2 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0055CC]"
          >
            다음 단계로
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ col }: { col: PlacementId }) {
  const cls =
    col === "done"
      ? "bg-[#E3FCEF] text-[#006644]"
      : col === "in_progress"
        ? "bg-[#DEEBFF] text-[#0747A6]"
        : col === "todo"
          ? "bg-[#F4F5F7] text-[#42526E]"
          : col === "blocker"
            ? "bg-[#FFEBE6] text-[#BF2600]"
            : "border border-dashed border-[#B3BAC5] bg-white text-[#5E6C84]";
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-[11px] font-bold ${cls}`}>{getPlacementStatusLabel(col)}</span>
  );
}
