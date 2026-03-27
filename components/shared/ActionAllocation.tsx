"use client";

import { useState } from "react";

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  pmbok?: string;
  min: number;
  max: number;
}

interface ActionAllocationProps {
  phaseTitle: string;
  totalHours: number;
  actions: ActionItem[];
  allocations: Record<string, number>;
  onAllocate: (actionId: string, hours: number) => void;
  onConfirm?: () => void;
  introTitle?: string;
  introLines?: string[];
}

const HOURS_PER_SELECTED_ACTION = 8;

export default function ActionAllocation({
  phaseTitle,
  totalHours,
  actions,
  allocations,
  onAllocate,
  onConfirm,
  introTitle,
  introLines = [],
}: ActionAllocationProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = actions[activeIndex];
  const selectedCount = actions.filter((a) => (allocations[a.id] ?? 0) > 0).length;
  const usedHours = actions.reduce((sum, a) => sum + (allocations[a.id] ?? 0), 0);

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 px-6 py-6">
      {introTitle ? (
        <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-extrabold text-black">{introTitle}</h2>
          {introLines.map((line) => (
            <p key={line} className="text-sm leading-7 text-black">
              {line}
            </p>
          ))}
        </div>
      ) : null}

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-black">{phaseTitle}</h3>
        <p className="text-sm text-black">
          선택 개수: {selectedCount}개 / 사용 시간: {usedHours}H / 총 시간: {totalHours}H
        </p>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveIndex((cur) => (cur - 1 + actions.length) % actions.length)}
          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-black"
        >
          이전
        </button>
        <span className="text-sm font-medium text-black">
          {activeIndex + 1} / {actions.length}
        </span>
        <button
          type="button"
          onClick={() => setActiveIndex((cur) => (cur + 1) % actions.length)}
          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-black"
        >
          다음
        </button>
      </div>

      <article className="space-y-3 rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-lg font-extrabold text-black">{active.title}</p>
        <p className="text-sm leading-7 text-black">{active.description}</p>
        {active.pmbok ? (
          <p className="text-sm leading-7 text-black">
            <strong>PMBOK:</strong> {active.pmbok}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => onAllocate(active.id, (allocations[active.id] ?? 0) > 0 ? 0 : HOURS_PER_SELECTED_ACTION)}
          className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-black"
        >
          {(allocations[active.id] ?? 0) > 0 ? "선택 해제" : "선택 (8H)"}
        </button>
      </article>

      {onConfirm ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-black"
          >
            확정
          </button>
        </div>
      ) : null}
    </section>
  );
}
