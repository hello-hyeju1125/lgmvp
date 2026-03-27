"use client";

import { guideScript } from "@/content/onboarding";
import React from "react";

interface OnboardingStep0Props {
  onNext: () => void;
}

/** **텍스트** → <strong>텍스트</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

function renderWithHighlights(node: React.ReactNode) {
  if (typeof node !== "string") return node;
  const targets = ["진짜 딜레마", "AI 기반 고객 VOC 통합 분석 프로젝트", "완벽한 하나의 정답은 없습니다"];
  const escaped = targets.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "g");
  const parts = node.split(regex);
  return parts.map((part, idx) => {
    if (targets.includes(part)) {
      return (
        <span key={`${part}-${idx}`} className="bg-[#89E586] px-1">
          {part}
        </span>
      );
    }
    return <span key={`${part}-${idx}`}>{part}</span>;
  });
}

export function OnboardingStep0({}: OnboardingStep0Props) {
  const paragraphs = guideScript
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col bg-transparent">
      <header className="px-6 pt-12">
        <div className="mx-auto w-full max-w-4xl text-center">
          <h1 className="neo-display text-4xl font-extrabold leading-[1.1] sm:text-5xl">
            <span className="bg-[#3374F6] px-2">Welcome</span> to the Simulation!
          </h1>
        </div>
      </header>

      {/* 본문: 카드 영역 */}
      <div className="overflow-y-auto px-6 pt-10 pb-24">
        <article className="mx-auto max-w-4xl bg-white border-2 border-black shadow-[6px_6px_0px_#111111] p-10 sm:p-12">
          <div className="space-y-4">
            {paragraphs.map((para, i) => (
              <p key={i} className="break-keep text-[16px] sm:text-[18px] leading-[1.9] text-[#111111]">
                {renderWithBold(para).map((n, idx) => (
                  <span key={idx}>{renderWithHighlights(n)}</span>
                ))}
              </p>
            ))}
          </div>
        </article>
      </div>

    </div>
  );
}
