"use client";

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
    <section className="mx-auto w-full max-w-4xl" aria-labelledby="ep6-result-title">
      <div className="rounded-xl border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
        <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-[#E4003F]">E6 RESULT</p>
        <h2 id="ep6-result-title" className="mt-2 text-center text-2xl font-extrabold tracking-tight text-black/90 sm:text-3xl">
          E6. 핑퐁 게임을 멈춰라! – 결과
        </h2>

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-[#E4003F]/12 px-4 py-1.5 text-[16px] font-extrabold tracking-tight text-[#E4003F] ring-1 ring-[#E4003F]/25">
              {result.endingTitle}
            </span>
          </div>
          <p className="text-[15px] leading-[1.85] text-black/75">{renderWithBold(result.text)}</p>
          <div className="flex flex-wrap gap-2">
            {result.kpiLabels.map((label) => (
              <span
                key={label}
                className={`rounded-full px-3 py-1 text-[12px] font-extrabold ${
                  label.includes("▼") ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                }`}
              >
                [{label}]
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
