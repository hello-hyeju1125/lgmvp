"use client";

import { useStore } from "@/store/useStore";
import { ep4Scene, ep4Options, type Ep4OptionBlock } from "@/content/episode4";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

const EP4_REVEAL_STAGGER_MS = 110;
function ep4RevealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * EP4_REVEAL_STAGGER_MS}ms` };
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

function stripOuterQuotes(s: string) {
  let t = s.trim();
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1);
  return t;
}

/** Ep1/Ep3 말풍선과 동일: 아바타 + `.ep1-supervisor-bubble` */
function Ep4SpeakerBubble({
  name,
  imageSrc,
  imageAlt,
  text,
  revealSteps,
}: {
  name: string;
  imageSrc: string;
  imageAlt: string;
  text: string;
  /** 지정 시 아바타·말풍선을 각각 순차 페이드인 */
  revealSteps?: { avatar: number; bubble: number };
}) {
  const body = stripOuterQuotes(text);
  const avatar = (
    <div className="relative z-20 h-[168px] w-[168px] shrink-0 sm:h-48 sm:w-48">
      <div className="absolute inset-0 rounded-full border-4 border-[color:var(--sim-accent)] bg-white p-1.5">
        <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain object-center"
            sizes="(max-width: 640px) 168px, 192px"
          />
        </div>
      </div>
    </div>
  );
  const bubble = (
    <div className="ep1-supervisor-bubble ep4-speaker-bubble relative z-10 -ml-10 min-w-0 flex-1 rounded-2xl py-5 pl-[4.25rem] pr-5 sm:-ml-14 sm:py-6 sm:pl-[5.5rem] sm:pr-6">
      <p className="mb-2.5 font-sans text-[15px] font-black leading-tight text-[#111] sm:text-[16px]">{name}</p>
      <p className="text-left font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
        {renderDialogueBold(body)}
      </p>
    </div>
  );

  if (revealSteps) {
    return (
      <div className="flex items-start gap-0">
        <div className="ep1-scene-reveal relative z-30 shrink-0" style={ep4RevealDelay(revealSteps.avatar)}>
          {avatar}
        </div>
        <div className="ep1-scene-reveal relative z-10 min-w-0 flex-1" style={ep4RevealDelay(revealSteps.bubble)}>
          {bubble}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-0">
      <div className="relative z-30 shrink-0">{avatar}</div>
      <div className="relative z-10 min-w-0 flex-1">{bubble}</div>
    </div>
  );
}

const EP4_ACTION_QUESTION = "리더인 당신은 어떻게 이 난관을 돌파하시겠습니까?";

interface Ep4RoleSceneProps {
  userName: string;
}

export function Ep4RoleScene({ userName: _userName }: Ep4RoleSceneProps) {
  const { episode4Choice, setEpisode4Choice } = useStore();

  const actionFull = ep4Scene.action;
  const qIdx = actionFull.indexOf(EP4_ACTION_QUESTION);
  const actionLead = qIdx >= 0 ? actionFull.slice(0, qIdx).trim() : actionFull;
  const showQuestionBlock = qIdx > 0 && actionLead.length > 0;
  const L = ep4Scene.dialogue.length;
  /** 화자 아바타·말풍선 분리(2,3) 후 회색 블록(2+L), Q·행동·옵션 */
  const optionRevealBase = (showQuestionBlock ? 5 : 3) + L;

  return (
    <section className="ep1-scene-layout w-full min-w-0 max-w-none space-y-10 sm:space-y-12">
      <div className="initiation-action-page mb-8 w-full sm:mb-10">
        <div className="flex justify-center px-2">
          <p
            className="ep1-scene-reveal initiation-brief-badge w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
            style={ep4RevealDelay(0)}
          >
            {ep4Scene.title}
          </p>
        </div>
      </div>

      <div className="space-y-2 px-2 text-center">
        <p
          className="ep1-scene-reveal whitespace-pre-line font-sans text-[19px] font-bold leading-relaxed text-[#111] sm:text-[21px]"
          style={ep4RevealDelay(1)}
        >
          {renderDialogueBold(ep4Scene.situation)}
        </p>
      </div>

      <div className="space-y-10 sm:space-y-12">
        <Ep4SpeakerBubble
          name="최유라 선임 (글로벌CS)"
          imageSrc="/ep4-choi-yura.svg"
          imageAlt="최유라 선임"
          text={ep4Scene.dialogue[0]}
          revealSteps={{ avatar: 2, bubble: 3 }}
        />
        <div
          className="ep1-scene-reveal rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
          style={ep4RevealDelay(2 + L)}
        >
          <p className="whitespace-pre-line font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
            {renderDialogueBold(ep4Scene.dialogue[1])}
          </p>
        </div>
      </div>

      {showQuestionBlock ? (
        <div className="space-y-4 px-1 pt-4 text-center !mt-20 sm:!mt-24 mb-[3.75rem] sm:mb-[4.5rem]">
          <p
            className="ep1-scene-reveal font-sans text-[56px] font-black leading-none text-black sm:text-[72px]"
            style={ep4RevealDelay(3 + L)}
          >
            Q.
          </p>
          <div
            className="ep1-scene-reveal mx-auto max-w-[min(100%,40rem)] space-y-4 text-center font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]"
            style={ep4RevealDelay(4 + L)}
          >
            <p>{renderDialogueBold(actionLead)}</p>
            <p>
              <span className="font-bold text-[color:var(--sim-accent)]">{EP4_ACTION_QUESTION}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-10 sm:space-y-12">
          <div
            className="ep1-scene-reveal rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
            style={ep4RevealDelay(2 + L)}
          >
            <p className="font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
              {renderDialogueBold(actionFull)}
            </p>
          </div>
        </div>
      )}

      {/* 옵션 5개 — md+: 6열 그리드, 모든 카드 너비 동일(col-span-2). 둘째 행 2개는 col-start로 가운데 정렬 */}
      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 md:grid-cols-6 md:gap-5 md:items-stretch lg:gap-6">
        {ep4Options.map((opt, optIdx) => {
          const selected = episode4Choice === opt.id;
          const optStep = optionRevealBase + optIdx;
          const row2Start =
            optIdx === 3 ? "md:col-start-2" : optIdx === 4 ? "md:col-start-4" : "";
          return (
            <div
              key={opt.id}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`Option ${opt.id}: ${opt.title}`}
              onClick={() => setEpisode4Choice(opt.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setEpisode4Choice(opt.id);
                }
              }}
              className={`ep1-scene-reveal ep1-option-card flex h-full w-full min-w-0 cursor-pointer flex-col overflow-visible rounded-2xl border-2 text-center outline-offset-2 transition-[border-color,box-shadow,background-color,transform] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-black md:col-span-2 ${row2Start} ${
                selected
                  ? "ep1-option-card--selected"
                  : "border-black bg-white shadow-[4px_4px_0_0_#111111] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_0_#111111]"
              }`}
              style={ep4RevealDelay(optStep)}
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
                  {opt.blocks.map((block: Ep4OptionBlock, i) =>
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
