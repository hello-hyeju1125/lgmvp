"use client";

import { ArrowDownRight, ArrowUpRight, Calendar, Check, Handshake, Target, Users, Zap } from "lucide-react";
import { Fragment, useMemo, useState, type CSSProperties, type ReactNode } from "react";

const INIT_REVEAL_STAGGER_MS = 120;
function initiationRevealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * INIT_REVEAL_STAGGER_MS}ms` };
}

export type PhaseActionInstructionLine = {
  line1Prefix: string;
  highlight: string;
  line1Suffix: string;
  line2: string;
};

export type PhaseActionItemModel = {
  id: string;
  title: string;
  description: string;
  pmbok: string;
  effect: string[];
};

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

/** 본문에서만 사용: {{WBS}} → 형광펜 스타일 + CSS 호버 툴팁(globals에서 span 투명 처리 예외 클래스 필요) */
function SprintAbbrevMark() {
  return (
    <span
      className="group relative inline cursor-help align-baseline [-webkit-box-decoration-break:clone] [box-decoration-break:clone]"
      tabIndex={0}
    >
      <span className="sprint-term-highlight rounded-[2px] px-[0.18em] py-[0.06em] font-extrabold text-black shadow-none">
        스프린트
      </span>
      <span
        role="tooltip"
        className="sprint-term-tooltip pointer-events-none absolute left-1/2 top-full z-[80] mt-2 w-[min(calc(100vw-2rem),18.5rem)] -translate-x-1/2 rounded-xl border-2 border-black bg-[#111827] px-3 py-2.5 text-left opacity-0 shadow-[4px_4px_0_#111] transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <span className="block font-sans text-[13px] font-extrabold leading-snug text-[#7dd3fc]">Sprint</span>
        <span className="mt-0.5 block font-sans text-[12px] font-semibold text-white/90">스프린트</span>
        <span className="mt-2 block border-t border-white/15 pt-2 font-sans text-[12px] font-medium leading-relaxed text-white/88">
          스프린트(Sprint)란, 규모가 큰 프로젝트를 1~2주 단위의 짧은 주기로 쪼개어 구체적인 산출물을 집중적으로 개발하고, 수시로 방향을 점검하여 리스크를 최소화하는 애자일(Agile) 핵심 업무 방식입니다.
        </span>
      </span>
    </span>
  );
}

function WbsAbbrevMark() {
  return (
    <span
      className="group relative inline cursor-help align-baseline [-webkit-box-decoration-break:clone] [box-decoration-break:clone]"
      tabIndex={0}
    >
      <span className="wbs-term-highlight rounded-[2px] px-[0.18em] py-[0.06em] font-extrabold text-black shadow-none">
        WBS
      </span>
      <span
        role="tooltip"
        className="wbs-term-tooltip pointer-events-none absolute left-1/2 top-full z-[80] mt-2 w-[min(calc(100vw-2rem),18.5rem)] -translate-x-1/2 rounded-xl border-2 border-black bg-[#111827] px-3 py-2.5 text-left opacity-0 shadow-[4px_4px_0_#111] transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <span className="block font-sans text-[13px] font-extrabold leading-snug text-[#d9f99d]">
          Work Breakdown Structure
        </span>
        <span className="mt-0.5 block font-sans text-[12px] font-semibold text-white/90">작업 분류 구조도</span>
        <span className="mt-2 block border-t border-white/15 pt-2 font-sans text-[12px] font-medium leading-relaxed text-white/88">
          프로젝트 전체 범위를 단계적으로 세분화하여 산출물·작업 단위로 나누고, 계층적으로 정리한 작업 분류 체계입니다.
        </span>
      </span>
    </span>
  );
}

const SCENARIO_TOKEN_SPLIT = /(\{\{WBS\}\}|\{\{SPRINT\}\})/;

function renderScenarioRichText(line: string): ReactNode {
  if (!line.includes("{{WBS}}") && !line.includes("{{SPRINT}}")) {
    return renderGreenEmphasis(line);
  }
  const parts = line.split(SCENARIO_TOKEN_SPLIT);
  return parts.map((part, i) => {
    if (part === "{{WBS}}") return <WbsAbbrevMark key={`wbs-${i}`} />;
    if (part === "{{SPRINT}}") return <SprintAbbrevMark key={`spr-${i}`} />;
    return <Fragment key={`txt-${i}`}>{renderGreenEmphasis(part)}</Fragment>;
  });
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

/** [지식영역] 본문 — 앞에 이모지·접두어가 있어도 첫 `[...]` 기준으로 분리 */
function splitPmbokText(raw: string): { keyword: string; detail: string } {
  const open = raw.indexOf("[");
  if (open === -1) return { keyword: raw, detail: "" };
  const close = raw.indexOf("]", open);
  if (close === -1) return { keyword: raw, detail: "" };
  const keyword = raw.slice(open + 1, close);
  let detail = raw.slice(close + 1).trim();
  detail = detail.replace(/^[-–—]\s*/, "").trim();
  return { keyword, detail };
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

const HOURS_PER_TOGGLE = 8;

export type InitiationStyleActionPhaseProps = {
  userName: string;
  briefingBadge: string;
  scenarioLines: string[];
  /** null이면 안내 블록 생략 */
  instructionLine: PhaseActionInstructionLine | null;
  /** 빈 배열이면 Tip 박스 생략 */
  tipBullets: string[];
  actions: PhaseActionItemModel[];
  hoursByAction: Record<string, number>;
  onToggleAction: (actionId: string) => void;
  /** 미지정이면 선택 개수 제한 없음 */
  maxSelected?: number;
  showActionCards: boolean;
  /** 지정 시 액션 카드를 페이지당 N개만 표시(실행 단계 10개 → 5+5) */
  actionsPageSize?: number;
};

/**
 * 착수 액션(initiation-action)과 동일한 레이아웃·클래스.
 * 기획/실행 액션 배분 등에서 콘텐츠만 바꿔 재사용.
 */
export function InitiationStyleActionPhase({
  userName,
  briefingBadge,
  scenarioLines,
  instructionLine,
  tipBullets,
  actions,
  hoursByAction,
  onToggleAction,
  maxSelected,
  showActionCards,
  actionsPageSize,
}: InitiationStyleActionPhaseProps) {
  const [actionsPageIndex, setActionsPageIndex] = useState(0);
  const totalActionPages = actionsPageSize
    ? Math.max(1, Math.ceil(actions.length / actionsPageSize))
    : 1;
  const visibleActions = useMemo(() => {
    if (!actionsPageSize) return actions;
    const start = actionsPageIndex * actionsPageSize;
    return actions.slice(start, start + actionsPageSize);
  }, [actions, actionsPageIndex, actionsPageSize]);

  const selectedCount = actions.filter((a) => (hoursByAction[a.id] ?? 0) > 0).length;
  const instructionRevealStep = 2 + scenarioLines.length;

  const toggle = (actionId: string) => {
    const current = hoursByAction[actionId] ?? 0;
    const isSelected = current > 0;
    if (!isSelected && maxSelected !== undefined && selectedCount >= maxSelected) return;
    onToggleAction(actionId);
  };

  return (
    <div className="initiation-action-page initiation-v0-main flex w-full flex-col">
      <div className="mb-8 flex justify-center sm:mb-10">
        <p
          className="initiation-action-reveal initiation-brief-badge w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
          style={initiationRevealDelay(0)}
        >
          {briefingBadge}
        </p>
      </div>

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
              key={`${line.slice(0, 48)}-${i}`}
              className="initiation-action-reveal initiation-brief-copy initiation-scenario-copy"
              style={initiationRevealDelay(2 + i)}
            >
              {renderScenarioRichText(line.replace("{User_Name}", userName))}
            </p>
          ))}
        </div>
      </div>

      {instructionLine ? (
        <p
          className="initiation-action-reveal initiation-instruction-line mb-12 mt-2 text-center sm:mb-16"
          style={initiationRevealDelay(instructionRevealStep)}
        >
          <span className="inline-block max-w-[min(100%,68ch)]">
            {instructionLine.line1Prefix}
            <span className="font-extrabold text-[#2563eb]">{instructionLine.highlight}</span>
            {instructionLine.line1Suffix}
            <br />
            <span className="mt-2 inline-block font-extrabold text-[#222]">{instructionLine.line2}</span>
          </span>
        </p>
      ) : null}

      {tipBullets.length > 0 ? (
        <div className="mb-9 flex w-full justify-center sm:mb-10">
          <div className="initiation-tip-box w-full max-w-xl border-2 border-black shadow-[4px_4px_0_#111111] sm:max-w-2xl">
            <div className="initiation-tip-header w-full">
              <span className="initiation-tip-pill font-sans">Tip</span>
            </div>
            <ul className="initiation-tip-list">
              {tipBullets.map((text) => (
                <li key={text.slice(0, 80)}>
                  <span className="initiation-tip-bullet inline-block" aria-hidden />
                  <span className="whitespace-pre-line">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {showActionCards ? (
        <div className="flex flex-col gap-3.5">
          {actionsPageSize && totalActionPages > 1 ? (
            <div className="mb-1 flex flex-wrap items-center justify-center gap-3 sm:justify-between">
              <button
                type="button"
                disabled={actionsPageIndex <= 0}
                onClick={() => setActionsPageIndex((p) => Math.max(0, p - 1))}
                className="inline-flex min-h-[44px] min-w-[100px] items-center justify-center rounded-xl border-2 border-black bg-white px-4 py-2 font-sans text-[14px] font-extrabold text-black shadow-[3px_3px_0_#111] transition hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                ← 이전 {actionsPageSize}개
              </button>
              <p className="font-sans text-[13px] font-extrabold tabular-nums text-black/70" aria-live="polite">
                액션 {actionsPageIndex * actionsPageSize + 1}–{Math.min((actionsPageIndex + 1) * actionsPageSize, actions.length)} / 전체 {actions.length}
              </p>
              <button
                type="button"
                disabled={actionsPageIndex >= totalActionPages - 1}
                onClick={() => setActionsPageIndex((p) => Math.min(totalActionPages - 1, p + 1))}
                className="inline-flex min-h-[44px] min-w-[100px] items-center justify-center rounded-xl border-2 border-black bg-white px-4 py-2 font-sans text-[14px] font-extrabold text-black shadow-[3px_3px_0_#111] transition hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                다음 {actionsPageSize}개 →
              </button>
            </div>
          ) : null}
          {visibleActions.map((action) => {
            const isSelected = (hoursByAction[action.id] ?? 0) > 0;
            const isDisabled = !isSelected && maxSelected !== undefined && selectedCount >= maxSelected;
            const pmbok = splitPmbokText(action.pmbok);
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => toggle(action.id)}
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
                  <div className="flex min-w-0 flex-col gap-2 border-b border-[#e5e7eb] px-4 py-4 sm:border-b-0 sm:border-r sm:px-5 sm:py-5">
                    <span className="pmbok-tag inline-flex w-fit font-sans">PMBOK 지식</span>
                    <p className="action-card-pmbok-keyword">{pmbok.keyword}</p>
                    {pmbok.detail ? <p className="action-card-pmbok-detail">{pmbok.detail}</p> : null}
                  </div>
                  <div className="flex min-w-0 flex-col gap-2.5 px-4 py-4 sm:px-5 sm:py-5">
                    <span className="impact-tag inline-flex w-fit font-sans">Expected Impact</span>
                    <div className="flex flex-col gap-2.5">
                      {action.effect.map((effect) => {
                        const meta = impactMeta(effect);
                        const ImpactArrow = meta.isUp ? ArrowUpRight : ArrowDownRight;
                        return (
                          <span key={effect} className="action-card-impact-label flex w-full items-center gap-2">
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
      ) : null}
    </div>
  );
}

export { HOURS_PER_TOGGLE };
