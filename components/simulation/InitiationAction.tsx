"use client";

import { useStore } from "@/store/useStore";
import { initiationActions, initiationScreenCopy } from "@/content/initiationActions";
import { ArrowDownRight, ArrowUpRight, Calendar, Check, Handshake, Target, Users, Zap } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

interface InitiationActionProps {
  userName: string;
  stage?: "intro" | "alloc";
}

const HOURS_PER_SELECTED_ACTION = 8;
const MAX_SELECTED = 2;

/** KpiGauges 바와 동일: duration-1000 ease-out 느낌 + 순차 delay(ms) */
const INIT_REVEAL_STAGGER_MS = 120;
function initiationRevealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * INIT_REVEAL_STAGGER_MS}ms` };
}

function renderGreenEmphasis(line: string): ReactNode {
  const parts = line.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, idx) =>
    idx % 2 === 1 ? (
      <strong key={`${part}-${idx}`} className="initiation-brief-em">
        {part}
      </strong>
    ) : (
      <span key={`${part}-${idx}`}>{part}</span>
    ),
  );
}

function CardSelectIcon({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <span
        className="card-select-icon card-select-icon--selected flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[color:var(--sim-accent)] text-[color:var(--sim-accent-cta-text)] shadow-[2px_2px_0_#111]"
        aria-hidden
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="card-select-icon card-select-icon--idle h-6 w-6 shrink-0 rounded-full border-2 border-black bg-white" aria-hidden />
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

/**
 * 레이아웃: 배너 → Q/시나리오(박스 없음) → 안내 문장 → 팁 → 카드 열.
 * 박스: globals .initiation-*, .action-card-* (게임/웹툰 네오 스타일 유지).
 */
export function InitiationAction({ userName, stage: _stage = "alloc" }: InitiationActionProps) {
  const { initiationActionHours, setInitiationActionHours } = useStore();
  const selectedCount = initiationActions.filter((a) => (initiationActionHours[a.id] ?? 0) > 0).length;

  const toggleAction = (actionId: string) => {
    const current = initiationActionHours[actionId] ?? 0;
    const isSelected = current > 0;
    if (!isSelected && selectedCount >= MAX_SELECTED) return;
    setInitiationActionHours({
      ...initiationActionHours,
      [actionId]: isSelected ? 0 : HOURS_PER_SELECTED_ACTION,
    });
  };

  const instr = initiationScreenCopy.instructionLine;
  const scenarioLines = initiationScreenCopy.scenarioLines;
  const instructionRevealStep = 2 + scenarioLines.length;

  return (
    <div className="initiation-action-page initiation-v0-main flex w-full flex-col">
      {/* 상황 배너 (중앙) */}
      <div className="mb-8 flex justify-center sm:mb-10">
        <p
          className="initiation-action-reveal initiation-brief-badge w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
          style={initiationRevealDelay(0)}
        >
          {initiationScreenCopy.briefingBadge}
        </p>
      </div>

      {/* Q + 시나리오 (테두리 박스 없음) */}
      <div className="initiation-scenario-block mb-8 text-center sm:mb-10">
        <p
          className="initiation-action-reveal mb-5 font-sans text-[68px] font-black leading-none text-black sm:mb-6 sm:text-[82px]"
          style={initiationRevealDelay(1)}
        >
          Q.
        </p>
        <div className="space-y-5 sm:space-y-6">
          {scenarioLines.map((line, i) => (
            <p
              key={line}
              className="initiation-action-reveal initiation-brief-copy initiation-scenario-copy"
              style={initiationRevealDelay(2 + i)}
            >
              {renderGreenEmphasis(line.replace("{User_Name}", userName))}
            </p>
          ))}
        </div>
      </div>

      {/* 안내 문장 — Tip과 여백으로 구분 */}
      <p
        className="initiation-action-reveal initiation-instruction-line mb-12 mt-2 text-center sm:mb-16"
        style={initiationRevealDelay(instructionRevealStep)}
      >
        <span className="inline-block max-w-[min(100%,68ch)]">
          {instr.line1Prefix}
          <span className="font-extrabold text-[#2563eb]">{instr.highlight}</span>
          {instr.line1Suffix}
          <br />
          <span className="mt-2 inline-block font-extrabold text-[#222]">{instr.line2}</span>
        </span>
      </p>

      {/* 팁 박스 — 액션 카드보다 좁게(가독·구분), 중앙 정렬 */}
      <div className="mb-9 flex w-full justify-center sm:mb-10">
        <div className="initiation-tip-box w-full max-w-xl border-2 border-black shadow-[4px_4px_0_#111111] sm:max-w-2xl">
          <div className="initiation-tip-header w-full">
            <span className="initiation-tip-pill font-sans">Tip</span>
          </div>
          <ul className="initiation-tip-list">
            {initiationScreenCopy.tipBullets.map((text) => (
              <li key={text}>
                <span className="initiation-tip-bullet inline-block" aria-hidden />
                <span className="whitespace-pre-line">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 액션 카드 — 세로 스택 (gap 14px) */}
      <div className="flex flex-col gap-3.5">
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
              className={`action-card-wrap w-full text-left transition-transform ${
                isSelected
                  ? "action-card-selected"
                  : isDisabled
                    ? "action-card-disabled cursor-not-allowed opacity-45 grayscale"
                    : "action-card-idle hover:translate-x-px hover:translate-y-px"
              }`}
            >
              <div className="action-card-body">
                <div className="flex gap-3 sm:gap-4">
                  <CardSelectIcon selected={isSelected} />
                  <div className="min-w-0 flex-1">
                    <h3 className="action-card-title">{action.title}</h3>
                    <p className="action-card-desc mt-3">{action.description}</p>
                  </div>
                </div>
              </div>

              <div className="action-card-footer grid w-full grid-cols-1 sm:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] sm:items-stretch">
                {/* 왼쪽 ~75%: PMBOK */}
                <div className="flex min-w-0 flex-col gap-2 border-b border-[#e5e7eb] px-4 py-4 sm:border-b-0 sm:border-r sm:px-5 sm:py-5">
                  <span className="pmbok-tag inline-flex w-fit font-sans">PMBOK 지식</span>
                  <p className="action-card-pmbok-keyword">{pmbok.keyword}</p>
                  {pmbok.detail ? <p className="action-card-pmbok-detail">{pmbok.detail}</p> : null}
                </div>
                {/* 오른쪽 ~25%: Expected Impact */}
                <div className="flex min-w-0 flex-col gap-2.5 px-4 py-4 sm:px-5 sm:py-5">
                  <span className="impact-tag inline-flex w-fit font-sans">Expected Impact</span>
                  <div className="flex flex-col gap-2.5">
                    {action.effect.map((effect) => {
                      const meta = impactMeta(effect);
                      const ImpactArrow = meta.isUp ? ArrowUpRight : ArrowDownRight;
                      return (
                        <span
                          key={effect}
                          className="action-card-impact-label flex w-full items-center gap-2"
                        >
                          <meta.Icon
                            className="h-[18px] w-[18px] shrink-0 text-[#9ca3af]"
                            strokeWidth={2.2}
                            aria-hidden
                          />
                          <span className="min-w-0 flex-1 text-left">{meta.label}</span>
                          <ImpactArrow
                            className={`action-card-impact-arrow h-4 w-4 shrink-0 ${
                              meta.isUp ? "action-card-impact-up" : "text-[#9ca3af]"
                            }`}
                            strokeWidth={2.5}
                            aria-hidden
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
