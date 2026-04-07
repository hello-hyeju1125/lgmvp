"use client";

import { useStore } from "@/store/useStore";
import {
  ep5MeetingIntro,
  ep5MeetingStances,
  ep5Scene,
  ep5Options,
  type Ep5MeetingStance,
  type Ep5OptionBlock,
} from "@/content/episode5";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

const EP5_REVEAL_STAGGER_MS = 110;
function ep5RevealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * EP5_REVEAL_STAGGER_MS}ms` };
}

function renderDialogueBold(paragraph: string): ReactNode {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-[color:var(--sim-accent)]">
        {p}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

const EP5_ACTION_QUESTION =
  "리더인 당신은 이 팽팽한 긴장감 속에서\n프로젝트의 뼈대가 될 핵심 전략을 어떤 방식으로 수립하시겠습니까?";

function Ep5StanceCard({ row }: { row: Ep5MeetingStance }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-4 sm:gap-5">
      <div className="relative h-[160px] w-[160px] shrink-0 sm:h-[180px] sm:w-[180px]">
        <div className="absolute inset-0 rounded-full border-4 border-[color:var(--sim-accent)] bg-white p-1.5">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
            <Image
              src={row.imageSrc}
              alt={row.imageAlt}
              fill
              className="object-contain object-center"
              sizes="(max-width: 640px) 160px, 180px"
            />
          </div>
        </div>
      </div>
      <div className="space-y-1 text-center">
        <p className="font-sans text-[20px] font-black leading-tight text-[#111] sm:text-[22px]">{row.name}</p>
        <p className="font-sans text-[15px] font-semibold tracking-wide text-[#555] sm:text-[17px]">{row.team}</p>
      </div>
      <div className="ep1-supervisor-bubble ep5-stance-bubble w-full min-w-0 rounded-2xl px-4 py-4 text-center sm:px-5 sm:py-[18px]">
        <p className="font-sans text-[15px] font-medium leading-relaxed text-[#111] sm:text-[16px] [word-break:keep-all]">
          {renderDialogueBold(row.stance)}
        </p>
      </div>
    </div>
  );
}

interface Ep5BlueprintSceneProps {
  userName: string;
}

export function Ep5BlueprintScene({ userName: _userName }: Ep5BlueprintSceneProps) {
  const { episode5Choice, setEpisode5Choice } = useStore();

  const actionFull = ep5Scene.action;
  const qIdx = actionFull.indexOf(EP5_ACTION_QUESTION);
  const actionLead = qIdx >= 0 ? actionFull.slice(0, qIdx).trim() : actionFull;
  const showQuestionBlock = qIdx > 0 && actionLead.length > 0;
  const meetingStanceCount = ep5MeetingStances.length;
  /** 도입(2) + 참석자 카드(3 …) 이후 Q·행동·옵션 */
  const postMeetingStep = 3 + meetingStanceCount;
  const optionRevealBase = postMeetingStep + (showQuestionBlock ? 2 : 1);

  return (
    <section className="ep1-scene-layout w-full min-w-0 max-w-none space-y-10 sm:space-y-12">
      <div className="initiation-action-page mb-8 w-full sm:mb-10">
        <div className="flex justify-center px-2">
          <p
            className="ep1-scene-reveal initiation-brief-badge w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
            style={ep5RevealDelay(0)}
          >
            {ep5Scene.title}
          </p>
        </div>
      </div>

      <div className="space-y-2 px-2 text-center">
        <p
          className="ep1-scene-reveal whitespace-pre-line font-sans text-[19px] font-bold leading-relaxed text-[#111] sm:text-[21px]"
          style={ep5RevealDelay(1)}
        >
          {renderDialogueBold(ep5Scene.situation)}
        </p>
      </div>

      {/* 회의실: 도입 + 인물별 아바타 + 네온 그린 입장 박스 */}
      <div className="space-y-10 sm:space-y-12">
        <div className="rounded-xl bg-[#eceeef] px-4 py-6 text-center sm:px-7 sm:py-8">
          <p
            className="ep1-scene-reveal mb-8 font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:mb-10 sm:text-[21px]"
            style={ep5RevealDelay(2)}
          >
            {renderDialogueBold(ep5MeetingIntro)}
          </p>
          <div className="mx-auto grid w-full max-w-[min(100%,85rem)] grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:gap-x-10">
            {ep5MeetingStances.map((row: Ep5MeetingStance, stanceIdx: number) => (
              <div key={row.id} className="ep1-scene-reveal" style={ep5RevealDelay(3 + stanceIdx)}>
                <Ep5StanceCard row={row} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showQuestionBlock ? (
        <div className="space-y-4 px-1 pt-4 text-center !mt-20 sm:!mt-24 mb-[3.75rem] sm:mb-[4.5rem]">
          <p
            className="ep1-scene-reveal font-sans text-[56px] font-black leading-none text-black sm:text-[72px]"
            style={ep5RevealDelay(postMeetingStep)}
          >
            Q.
          </p>
          <div
            className="ep1-scene-reveal mx-auto max-w-[min(100%,40rem)] space-y-4 text-center font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]"
            style={ep5RevealDelay(postMeetingStep + 1)}
          >
            <p className="whitespace-pre-line">{renderDialogueBold(actionLead)}</p>
            <p className="whitespace-pre-line">
              <span className="font-bold text-[color:var(--sim-accent)]">{EP5_ACTION_QUESTION}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-10 sm:space-y-12">
          <div
            className="ep1-scene-reveal rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
            style={ep5RevealDelay(postMeetingStep)}
          >
            <p className="font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
              {renderDialogueBold(actionFull)}
            </p>
          </div>
        </div>
      )}

      {/* 옵션 4개 — Ep3와 동일: md+ 2열×2행 */}
      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:gap-5 md:items-stretch lg:gap-6">
        {ep5Options.map((opt, optIdx) => {
          const selected = episode5Choice === opt.id;
          const optStep = optionRevealBase + optIdx;
          return (
            <div
              key={opt.id}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`Option ${opt.id}: ${opt.title}`}
              onClick={() => setEpisode5Choice(opt.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setEpisode5Choice(opt.id);
                }
              }}
              className={`ep1-scene-reveal ep1-option-card flex h-full w-full min-w-0 cursor-pointer flex-col overflow-visible rounded-2xl border-2 text-center outline-offset-2 transition-[border-color,box-shadow,background-color,transform] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-black ${
                selected
                  ? "ep1-option-card--selected"
                  : "border-black bg-white shadow-[4px_4px_0_0_#111111] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_0_#111111]"
              }`}
              style={ep5RevealDelay(optStep)}
            >
              <div className="-mt-px flex shrink-0 justify-center">
                <div
                  className={`ep1-option-pill pointer-events-none inline-flex items-center gap-2 rounded-b-xl px-5 py-2 font-sans text-[15px] font-bold tracking-wide transition-colors duration-300 sm:text-[16px] ${
                    selected ? "ep1-option-pill--selected" : "bg-[#111111]"
                  }`}
                >
                  <span
                    className={`ep1-option-check-ring flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-[22px] sm:w-[22px] ${
                      selected
                        ? "border-2 border-[#14532d]/25 bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
                        : "border-2 border-white/35 bg-transparent"
                    }`}
                    aria-hidden
                  >
                    {selected && (
                      <svg width="12" height="10" viewBox="0 0 11 9" fill="none" aria-hidden>
                        <path
                          className="ep1-option-check-mark"
                          d="M1 4.5L3.5 7L9.5 1"
                          stroke="#14532d"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="font-sans font-bold">Option {opt.id}</span>
                </div>
              </div>

              <div className="flex min-h-min min-w-0 flex-1 flex-col gap-6 overflow-visible px-5 pb-6 pt-4 text-left sm:gap-7 sm:px-6 sm:pb-6">
                <h2 className="shrink-0 text-center font-sans text-[19px] font-extrabold leading-snug tracking-tight text-[#111111] sm:text-[21px]">
                  {opt.title}
                </h2>
                <div className="min-h-min min-w-0 w-full flex-1 space-y-6 break-words text-center [overflow-wrap:anywhere] sm:space-y-7">
                  {opt.blocks.map((block: Ep5OptionBlock, i) =>
                    block.type === "text" ? (
                      <p
                        key={`${opt.id}-b-${i}`}
                        className="font-sans text-[15px] font-medium leading-[1.7] text-[#444444] sm:text-[16px]"
                      >
                        {renderDialogueBold(block.text)}
                      </p>
                    ) : (
                      <div
                        key={`${opt.id}-b-${i}`}
                        data-ep1-opt={opt.id}
                        className="ep1-option-quote shrink-0 rounded-xl px-4 py-4 sm:px-4 sm:py-[18px]"
                      >
                        <p className="ep1-option-quote-text font-sans text-[14px] font-medium leading-[1.75] sm:text-[15px] [overflow-wrap:anywhere] [word-break:keep-all]">
                          {"\u201c"}
                          {renderDialogueBold(block.text)}
                          {"\u201d"}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
