"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  getEp6Result,
  getBlockLabelShort,
  ep6Block1Options,
  ep6Block2Options,
  ep6Block3Options,
  ep6Block4Options,
} from "@/content/episode6";

/** **text** → <strong>text</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

interface Ep6PingpongResultProps {
  userName: string;
}

export function Ep6PingpongResult({ userName }: Ep6PingpongResultProps) {
  const router = useRouter();
  const { episode6Blocks } = useStore();
  const b = episode6Blocks ?? { block1: "B", block2: "E", block3: "D", block4: "B" };

  const label1 = ep6Block1Options.find((o) => o.id === b.block1)?.label ?? b.block1;
  const label2 = ep6Block2Options.find((o) => o.id === b.block2)?.label ?? b.block2;
  const label3 = ep6Block3Options.find((o) => o.id === b.block3)?.label ?? b.block3;
  const opt4 = ep6Block4Options.find((o) => o.id === b.block4);
  const messagePart = opt4?.shortMessage ?? opt4?.label ?? b.block4;

  const composedMessage = `나는 [${label1}]에게 [${getBlockLabelShort(label2)}]을 통해 [${getBlockLabelShort(label3)}], [${messagePart}]했다.`;

  const result = getEp6Result(b.block4, b.block2);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">E6. 핑퐁 게임을 멈춰라! – 결과</h2>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="text-sm font-medium text-[#4A4A4A] mb-2">[나의 커뮤니케이션 전략]</p>
        <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{composedMessage}&quot;</p>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#F9FAFB] p-4 space-y-4">
        <p className="text-sm text-[#4A4A4A] leading-relaxed">{renderWithBold(result.text)}</p>
        {result.kpiLabels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.kpiLabels.map((label) => (
              <span
                key={label}
                className={`rounded px-2 py-1 text-xs font-medium ${
                  label.includes("▼") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                [{label}]
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="text-xs font-medium text-[#4A4A4A] mb-2">챗봇 선배 PM의 조언</p>
        <p className="text-sm text-[#6B6B6B] leading-relaxed">{result.advice}</p>
      </div>

    </div>
  );
}
