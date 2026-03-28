"use client";

import { useStore } from "@/store/useStore";
import { initiationActions, initiationScreenCopy } from "@/content/initiationActions";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Calendar, Handshake, Lightbulb, Target, Users, Zap } from "lucide-react";
import type { ReactNode } from "react";

interface InitiationActionProps {
  userName: string;
  stage?: "intro" | "alloc";
}

const HOURS_PER_SELECTED_ACTION = 8;
const MAX_SELECTED = 2;

function renderEmphasisLine(line: string): ReactNode {
  const parts = line.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, idx) =>
    idx % 2 === 1 ? (
      <strong key={`${part}-${idx}`} className="font-black underline decoration-2 underline-offset-2">
        {part}
      </strong>
    ) : (
      <span key={`${part}-${idx}`}>{part}</span>
    ),
  );
}

function splitPmbokText(raw: string): { keyword: string; detail: string } {
  const match = raw.match(/^\[(.+?)\]\s*(.*)$/);
  if (!match) return { keyword: raw, detail: "" };
  return { keyword: match[1], detail: match[2] };
}

function impactMeta(effect: string): {
  label: string;
  Icon: typeof Target;
  isUp: boolean;
} {
  const isUp = effect.includes("상승");
  if (effect.includes("산출물 품질")) return { label: "산출물 품질", Icon: Target, isUp };
  if (effect.includes("일정 준수")) return { label: "일정 준수", Icon: Calendar, isUp };
  if (effect.includes("팀 몰입도")) return { label: "팀 몰입도", Icon: Users, isUp };
  if (effect.includes("이해관계자 조율")) return { label: "이해관계자 조율", Icon: Handshake, isUp };
  return { label: "리더 에너지", Icon: Zap, isUp };
}

export function InitiationAction({ userName, stage: _stage = "alloc" }: InitiationActionProps) {
  const { initiationActionHours, setInitiationActionHours } = useStore();
  const selectedActions = initiationActions.filter((a) => (initiationActionHours[a.id] ?? 0) > 0);
  const selectedCount = selectedActions.length;

  const toggleAction = (actionId: string) => {
    const current = initiationActionHours[actionId] ?? 0;
    const isSelected = current > 0;
    if (!isSelected && selectedCount >= MAX_SELECTED) return;
    setInitiationActionHours({
      ...initiationActionHours,
      [actionId]: isSelected ? 0 : HOURS_PER_SELECTED_ACTION,
    });
  };

  return (
    <section className="initiation-action-page mx-auto w-full max-w-5xl space-y-6 px-6 py-6">
      <div className="briefing-shell border-4 border-black shadow-[6px_6px_0px_#111111]">
        <div className="briefing-head flex items-center justify-between gap-3 border-b-4 border-black px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="briefing-head-icon h-6 w-6 shrink-0" strokeWidth={2.7} aria-hidden />
            <h2 className="briefing-head-title font-alice text-xl font-black sm:text-2xl">일주일 뒤, 당장 투입입니다.</h2>
          </div>
          <p className="dossier-label inline-block border-2 border-black bg-[#111] px-2 py-1 font-sans text-[11px] font-black uppercase tracking-[0.12em] text-white">
            Red Alert
          </p>
        </div>
        <div className="briefing-body bg-white px-4 py-4 sm:px-5">
          <p className="font-sans text-sm font-semibold leading-relaxed text-[#111] sm:text-[15px]">
            {renderEmphasisLine(initiationScreenCopy.scenarioIntro.replace("{User_Name}", userName))}
          </p>
          <p className="mt-2 font-sans text-sm font-semibold leading-relaxed text-[#111] sm:text-[15px]">
            {renderEmphasisLine(initiationScreenCopy.timeRule)}
          </p>
          <p className="mt-2 font-sans text-sm font-semibold leading-relaxed text-[#111] sm:text-[15px]">
            {renderEmphasisLine(initiationScreenCopy.pmbokExplanation)}
          </p>
        </div>
      </div>

      <div className="initiation-clear-bg border-2 border-black bg-transparent p-4 shadow-[4px_4px_0px_#111111] sm:p-5">
        <p className="text-center font-sans text-[13px] font-black text-[#111] sm:text-sm">
          선택된 액션: <span className="text-[#89E586]">{selectedCount}</span> / {MAX_SELECTED}
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[0, 1].map((idx) => (
            <div key={idx} className="initiation-clear-bg min-h-[52px] border-2 border-dashed border-black/50 bg-transparent px-3 py-2">
              <p className="font-sans text-[12px] font-bold text-[#111]">
                {selectedActions[idx]?.title ?? "비어 있음"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {initiationActions.map((action) => {
          const isSelected = (initiationActionHours[action.id] ?? 0) > 0;
          const isDisabled = !isSelected && selectedCount >= MAX_SELECTED;
          const pmbok = splitPmbokText(action.pmbok);
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => toggleAction(action.id)}
              disabled={isDisabled}
              className={`w-full text-left transition-all ${
                isSelected
                  ? "action-card-selected border-[6px] border-[#FF4B4B] bg-[#89E586] shadow-[6px_6px_0px_#111111]"
                  : isDisabled
                    ? "action-card-disabled border-2 border-black bg-transparent opacity-45 grayscale cursor-not-allowed"
                    : "action-card-idle border-2 border-black bg-transparent hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#111111]"
              }`}
            >
              <div className="grid md:grid-cols-[11fr_9fr]">
                <div className="p-4 md:border-r-4 md:border-black sm:p-5">
                  <h3 className="font-alice text-2xl font-black leading-tight text-[#111] sm:text-[30px]">{action.title}</h3>
                  <p className="mt-3 font-sans text-[15px] font-semibold leading-relaxed text-[#111]">{action.description}</p>
                </div>
                <div className="action-card-system border-t-4 border-black p-4 sm:p-5 md:border-t-0">
                  <p className="pmbok-tag inline-flex items-center gap-1.5 border-2 border-black bg-transparent px-2 py-0.5 font-sans text-[11px] font-black">
                    <Lightbulb className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden />
                    PMBOK 지식
                  </p>
                  <p className="mt-2 font-sans text-[13px] font-black leading-snug text-[#111]">{pmbok.keyword}</p>
                  {pmbok.detail ? (
                    <p className="mt-1 font-sans text-[12px] font-semibold leading-relaxed text-[#111]">{pmbok.detail}</p>
                  ) : null}

                  <div className="mt-3 border-t-2 border-black/25 pt-3">
                    <p className="impact-tag inline-flex items-center border-2 border-black bg-transparent px-2 py-0.5 font-sans text-[11px] font-black uppercase tracking-[0.08em]">
                      Expected Impact
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
                      {action.effect.map((effect) => {
                        const meta = impactMeta(effect);
                        const ImpactArrow = meta.isUp ? ArrowUpRight : ArrowDownRight;
                        return (
                          <span key={effect} className="inline-flex items-center gap-1 font-sans text-[11px] font-black text-[#111]">
                            <meta.Icon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                            {meta.label}
                            <ImpactArrow className="h-3.5 w-3.5" strokeWidth={2.7} aria-hidden />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
