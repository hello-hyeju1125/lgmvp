"use client";

import { useState } from "react";

export interface ResultOption {
  id: string;
  label: string;
  advice: string;
  kpiImpacts?: Array<{ metric: string; change: number }>;
  kpiLabels?: string[];
  adviceParagraphs?: string[];
}

interface EpisodeResultProps {
  title: string;
  selectedOption: string;
  results: ResultOption[];
  intro?: string;
  onNext?: () => void;
  onPrev?: () => void;
  emptyLabel?: string;
}

function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export default function EpisodeResult({
  title,
  selectedOption,
  results,
  intro,
  onNext,
  onPrev,
  emptyLabel = "선택 정보가 없습니다.",
}: EpisodeResultProps) {
  const [expandedOther, setExpandedOther] = useState<string | null>(null);
  const selected = results.find((r) => r.id === selectedOption);

  if (!selected) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8 text-center">
        <p className="text-sm text-black">{emptyLabel}</p>
        {onPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className="mt-4 rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-black"
          >
            옵션 선택으로 돌아가기
          </button>
        ) : null}
      </div>
    );
  }

  const others = results.filter((r) => r.id !== selectedOption);

  return (
    <section className="mx-auto w-full max-w-4xl" aria-label={title}>
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <h2 className="text-center text-2xl font-extrabold text-black sm:text-3xl">{title}</h2>
        {intro ? <p className="text-sm leading-7 text-black">{intro}</p> : null}
        <p className="pt-2 text-sm font-extrabold text-black">나의 의사결정 결과 확인하기</p>

        <div className="space-y-4">
          <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-white p-4">
              <span className="text-sm font-extrabold text-black">
                결과 {selected.id}. {selected.label}
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-extrabold text-black">
                나의 선택
              </span>
            </div>
            <div className="space-y-3 p-4">
              <p className="text-sm leading-7 text-black">{renderWithBold(selected.advice)}</p>
              {selected.kpiLabels?.length ? (
                <div className="flex flex-wrap gap-2">
                  {selected.kpiLabels.map((label) => {
                    const isUp = /▲/.test(label);
                    const isDown = /▼/.test(label);
                    return (
                      <span
                        key={label}
                        className={`kpi-trend-pill rounded-full border-2 px-4 py-1.5 text-[13px] font-black ${
                          isUp
                            ? "kpi-trend-pill--up border-[#10b981]/30 bg-[#ecfdf5] text-[#059669]"
                            : isDown
                              ? "kpi-trend-pill--down border-[#FF4444]/30 bg-[#FFF5F5] text-[#dc2626]"
                              : "border-gray-200 bg-white text-black"
                        }`}
                      >
                        [{label}]
                      </span>
                    );
                  })}
                </div>
              ) : null}
              {selected.adviceParagraphs?.length ? (
                <div className="space-y-2 border border-gray-200 bg-white p-3">
                  {selected.adviceParagraphs.map((para, i) => (
                    <p key={i} className="text-sm leading-7 text-black">
                      {renderWithBold(para)}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </article>

          {others.map((result) => {
            const isOpen = expandedOther === result.id;
            return (
              <article key={result.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setExpandedOther(isOpen ? null : result.id)}
                  className="flex w-full items-center justify-between gap-2 bg-white p-4 text-left"
                >
                  <span className="text-sm font-extrabold text-black">
                    결과 {result.id}. {result.label}
                  </span>
                  <span className="text-black" aria-hidden>
                    {isOpen ? "▲" : "▼"}
                  </span>
                </button>
                {isOpen ? (
                  <div className="space-y-3 border-t border-gray-200 p-4">
                    <p className="text-sm leading-7 text-black">{renderWithBold(result.advice)}</p>
                    {result.kpiLabels?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {result.kpiLabels.map((label) => {
                          const isUp = /▲/.test(label);
                          const isDown = /▼/.test(label);
                          return (
                            <span
                              key={label}
                              className={`rounded-full border-2 px-4 py-1.5 text-[13px] font-black ${
                                isUp
                                  ? "border-[#10b981]/30 bg-[#ecfdf5] text-[#059669]"
                                  : isDown
                                    ? "border-[#FF4444]/30 bg-[#FFF5F5] text-[#dc2626]"
                                    : "border-gray-200 bg-white text-black"
                              }`}
                            >
                              [{label}]
                            </span>
                          );
                        })}
                      </div>
                    ) : null}
                    {result.adviceParagraphs?.length ? (
                      <div className="space-y-2 border border-gray-200 bg-white p-3">
                        {result.adviceParagraphs.map((para, i) => (
                          <p key={i} className="text-sm leading-7 text-black">
                            {renderWithBold(para)}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {onNext ? (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onNext}
              className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-black"
            >
              다음
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
