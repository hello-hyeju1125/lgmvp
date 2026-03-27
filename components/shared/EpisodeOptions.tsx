"use client";

import React from "react";

export interface EpisodeOption {
  id: string;
  label: string;
  description: string;
}

interface EpisodeOptionsProps {
  title: string;
  situation?: string;
  options: EpisodeOption[];
  selectedOption: string | null;
  onSelect: (optionId: string) => void;
  onNext: () => void;
  onPrev?: () => void;
  submitLabel?: string;
  disableNextWhenUnselected?: boolean;
}

export default function EpisodeOptions({
  title,
  situation,
  options,
  selectedOption,
  onSelect,
  onNext,
  onPrev,
  submitLabel = "선택한 의사결정대로 행동하시겠습니까?",
  disableNextWhenUnselected = true,
}: EpisodeOptionsProps) {
  const disableNext = disableNextWhenUnselected && !selectedOption;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-lg font-bold text-black">{title}</h2>
        {situation ? <p className="text-sm text-black">{situation}</p> : null}
      </header>

      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`w-full rounded-xl border p-4 text-left transition ${
              selectedOption === opt.id ? "border-black bg-white" : "border-gray-200 bg-white hover:border-black"
            }`}
          >
            <p className="text-sm font-semibold text-black">{opt.label}</p>
            <p className="mt-1 text-sm leading-6 text-black">{opt.description}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-between gap-3">
        {onPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-black"
          >
            이전
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={disableNext}
          className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </section>
  );
}
