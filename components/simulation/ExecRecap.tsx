"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { executionRecapCopy } from "@/content/executionRecap";
import { executionActions } from "@/content/executionActions";
import { ep6Block1Options, ep6Block2Options, ep6Block3Options, ep6Block4Options } from "@/content/episode6";
import { ep7Options } from "@/content/episode7";
import type { KpiState } from "@/store/useStore";

interface ExecRecapProps {
  userName: string;
}

const KPI_KEYS: (keyof KpiState)[] = [
  "quality",
  "delivery",
  "teamEngagement",
  "stakeholderAlignment",
  "leaderEnergy",
];

function getEp6Summary(blocks: { block1: string; block2: string; block3: string; block4: string } | null): string {
  if (!blocks) return "—";
  const b1 = ep6Block1Options.find((o) => o.id === blocks.block1)?.label ?? blocks.block1;
  const b2 = ep6Block2Options.find((o) => o.id === blocks.block2)?.label ?? blocks.block2;
  const b3 = ep6Block3Options.find((o) => o.id === blocks.block3)?.label ?? blocks.block3;
  const b4 = ep6Block4Options.find((o) => o.id === blocks.block4)?.label ?? blocks.block4;
  return `[${b1}]하여 [${b3}] [${b4}] (채널: ${b2})`;
}

export function ExecRecap({ userName }: ExecRecapProps) {
  const router = useRouter();
  const {
    kpi,
    executionActionHours,
    episode6Blocks,
    episode7Choice,
    episode8CoachingText,
  } = useStore();

  const actionItemsWithHours = executionActions
    .map((a) => ({ ...a, hours: executionActionHours[a.id] ?? 0 }))
    .filter((a) => a.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const ep7Opt = episode7Choice ? ep7Options.find((o) => o.id === episode7Choice) : null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">{executionRecapCopy.title}</h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{executionRecapCopy.intro}&quot;</p>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="font-medium text-[#4A4A4A] text-sm mb-3">{executionRecapCopy.summaryTitle}</p>
        <ul className="space-y-4">
          {executionRecapCopy.summaryItems.map((item, i) => (
            <li key={i} className="text-sm text-[#6B6B6B]">
              <span className="font-medium text-[#4A4A4A]">• {item.title}</span>
              <p className="mt-1 leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="font-medium text-[#4A4A4A] text-sm mb-3">{executionRecapCopy.myDecisionsTitle}</p>
        <ul className="space-y-2 text-sm text-[#6B6B6B]">
          <li>
            <span className="font-medium text-[#4A4A4A]">• {executionRecapCopy.execActionLabel}</span>
            <ul className="mt-1 ml-4 list-disc list-inside space-y-0.5">
              {actionItemsWithHours.length > 0 ? (
                actionItemsWithHours.map((a) => (
                  <li key={a.id}>[{a.title} ({a.hours}H)]</li>
                ))
              ) : (
                <li>—</li>
              )}
            </ul>
          </li>
          <li>
            <span className="font-medium text-[#4A4A4A]">• {executionRecapCopy.e6Label}</span>
            <span className="ml-1">{getEp6Summary(episode6Blocks)}</span>
          </li>
          <li>
            <span className="font-medium text-[#4A4A4A]">• {executionRecapCopy.e7Label}</span>
            <span className="ml-1">{ep7Opt ? `[옵션 ${ep7Opt.id}: ${ep7Opt.title}] 선택` : "—"}</span>
          </li>
          <li>
            <span className="font-medium text-[#4A4A4A]">• {executionRecapCopy.e8Label}</span>
            <br />
            <span className="ml-1">{episode8CoachingText ? episode8CoachingText : executionRecapCopy.e8DecisionSuffix}</span>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <p className="font-medium text-[#4A4A4A] text-sm mb-2">{executionRecapCopy.dashboardTitle}</p>
        <ul className="text-sm text-[#6B6B6B] space-y-1">
          {KPI_KEYS.map((key) => (
            <li key={key}>
              • {executionRecapCopy.kpiLabels[key]}: {kpi[key]}점
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
