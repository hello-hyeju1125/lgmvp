"use client";

import { useStore } from "@/store/useStore";
import { ep10Scene, ep10Options, type Ep10Choice } from "@/content/episode10";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { AnimationEvent, ReactNode } from "react";
import {
  TypingBody,
  usePrefersReducedMotion,
  isSeqFadeAnimation,
  stripOuterQuotes,
  revealDelay,
  renderDialogueBold,
  REVEAL_STAGGER_MS,
  TYPING_PAUSE_MS,
} from "./shared-animation";

const ACCENT = "#ef4444";

interface CharacterMeta {
  speaker: string;
  avatar: string;
  borderColor: string;
}

const CHARACTERS: Record<string, CharacterMeta> = {
  "최성민 상무": { speaker: "최성민 상무", avatar: "/choi-seongmin.jpg", borderColor: "border-[#64e87a]" },
  "김지훈 선임": { speaker: "김지훈 선임(IT)", avatar: "/kim-jihun.jpg", borderColor: "border-[#60a5fa]" },
  "박소진 책임": { speaker: "박소진 책임(마케팅)", avatar: "/park-sojin.jpg", borderColor: "border-[#f472b6]" },
  "정태영 책임": { speaker: "정태영 책임(인프라보안)", avatar: "/jeong-taeyoung.jpg", borderColor: "border-[#a78bfa]" },
};

const DIALOGUE_MAP: { charKey: string | null; avatarSrc?: string }[] = [
  { charKey: "최성민 상무", avatarSrc: "/choi-seongmin_angry.jpg" },
  { charKey: null },
  { charKey: "김지훈 선임", avatarSrc: "/LG_MVP_kim-jihun_angry.jpg" },
  { charKey: null },
  { charKey: "박소진 책임" },
  { charKey: null },
  { charKey: "정태영 책임" },
  { charKey: null },
  { charKey: "김지훈 선임", avatarSrc: "/LG_MVP_kim-jihun_upset.jpg" },
];

function CharacterBubble({
  char,
  text,
  side = "left",
  typingStartDelayMs,
  canStart,
  onTypingComplete,
}: {
  char: CharacterMeta;
  text: string;
  side?: "left" | "right";
  typingStartDelayMs: number;
  canStart?: boolean;
  onTypingComplete?: () => void;
}) {
  const body = stripOuterQuotes(text);
  const isRight = side === "right";
  return (
    <div className={`flex items-start gap-0 ${isRight ? "flex-row-reverse" : ""}`}>
      <div className="relative z-20 h-[168px] w-[168px] shrink-0 sm:h-48 sm:w-48">
        <div className={`absolute inset-0 rounded-full border-4 ${char.borderColor} bg-white p-1.5`}>
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
            <Image
              src={char.avatar}
              alt={char.speaker}
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 640px) 168px, 192px"
            />
          </div>
        </div>
      </div>
      <div
        className={`ep1-supervisor-bubble relative z-10 min-w-0 flex-1 rounded-2xl py-5 sm:py-6 ${
          isRight
            ? "-mr-10 pl-5 pr-[4.25rem] sm:-mr-14 sm:pl-6 sm:pr-[5.5rem]"
            : "-ml-10 pl-[4.25rem] pr-5 sm:-ml-14 sm:pl-[5.5rem] sm:pr-6"
        }`}
      >
        <p className={`mb-2.5 font-sans text-[15px] font-black leading-tight text-[#111] sm:text-[16px] ${isRight ? "text-right" : ""}`}>{char.speaker}</p>
        <TypingBody
          body={body}
          accentColor={ACCENT}
          typingStartDelayMs={typingStartDelayMs}
          canStart={canStart}
          onTypingComplete={onTypingComplete}
          className={`font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px] ${isRight ? "text-right" : "text-left"}`}
        />
      </div>
    </div>
  );
}

const EP10_CARD_BLOCKS: Record<Ep10Choice, { bodyParagraphs: string[]; quote: string }> = {
  A: {
    bodyParagraphs: [
      "당신은 모두가 있는 자리에서 실수의 심각성을 명확히 짚고 김지훈 선임의 작업물에 대해 꼼꼼하게 체크하기로 합니다.",
    ],
    quote:
      "사태가 수습될 때까지 김 선임이 작성하는 모든 쿼리와 아키텍처 수정안은 제가 좀 보면서 크로스 체크 한 뒤에 서버에 반영하겠습니다. 당분간 김 선임 단독 작업은 중지해주세요.",
  },
  B: {
    bodyParagraphs: [
      "당신은 해당 이슈가 팀원들 간의 책임 공방으로 번지려는 분위기를 차단합니다. 당신은 김지훈 선임이 낡은 인프라 환경에서 무리한 속도를 홀로 맞추려다 과부하가 걸렸던 구조적 원인에 주목합니다.",
    ],
    quote:
      "김 선임, 빠른 속도에 대한 압박은 제가 다시 조율하겠습니다. 대신 속도를 약간 타협하더라도 데이터 무결성을 지킬 수 있는 안전장치나 검증 프로세스를 타 부서와 협의해서 내일까지 새롭게 제안해 주세요.",
  },
  C: {
    bodyParagraphs: [
      "당신은 회의를 서둘러 일단 종료하고, 자존심이 상해 잔뜩 위축된 김 선임을 따로 부릅니다. 당신의 뼈아픈 과거 실수담으로 심리적 안전감을 부여한 뒤, 그를 위로합니다.",
    ],
    quote:
      "아까 많이 당황했겠지만 너무 마음에 담아두지 마세요. 사고는 터졌고 수습은 제가 해보겠습니다. 김 선임 실력이면 속도 저하를 최소화하면서도 장문 VOC를 전부 다 잡아내는 최적화 로직, 내일까지 완벽하게 다시 짤 수 있죠? 실력으로 다시 증명해 봅시다.",
  },
};

interface Ep10FailureSceneProps {
  userName: string;
}

export function Ep10FailureScene({ userName }: Ep10FailureSceneProps) {
  const { episode10Choice, setEpisode10Choice } = useStore();
  const reducedMotion = usePrefersReducedMotion();

  const dialogueLength = ep10Scene.dialogue.length;

  const [dialoguePhase, setDialoguePhase] = useState(0);
  const [typingUnlockedIdx, setTypingUnlockedIdx] = useState(-1);

  const [showQ, setShowQ] = useState(false);
  const [showQWording, setShowQWording] = useState(false);
  const [optionsVisibleCount, setOptionsVisibleCount] = useState(0);

  const handleDialogueTypingComplete = useCallback(
    (idx: number) => () => {
      setDialoguePhase((p) => Math.max(p, idx + 1));
    },
    [],
  );

  const handleDialogueFadeEnd = useCallback(
    (idx: number, isCharacter: boolean) => (e: AnimationEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      if (isCharacter) {
        setTypingUnlockedIdx((v) => Math.max(v, idx));
      } else {
        setDialoguePhase((p) => Math.max(p, idx + 1));
      }
    },
    [reducedMotion],
  );

  const allDialogueDone = dialoguePhase >= dialogueLength;

  useEffect(() => {
    if (!allDialogueDone) return;
    if (reducedMotion) {
      setShowQ(true);
      setShowQWording(true);
      setOptionsVisibleCount(ep10Options.length);
    } else {
      setShowQ(true);
    }
  }, [allDialogueDone, reducedMotion]);

  const handleQFadeEnd = useCallback(
    (e: AnimationEvent<HTMLElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      setShowQWording(true);
    },
    [reducedMotion],
  );

  const handleWordingFadeEnd = useCallback(
    (e: AnimationEvent<HTMLElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      setOptionsVisibleCount(1);
    },
    [reducedMotion],
  );

  const ep10OptionCount = ep10Options.length;

  const handleOptionFadeEnd = useCallback(
    (optIdx: number) => (e: AnimationEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      if (!isSeqFadeAnimation(e)) return;
      if (optIdx < ep10OptionCount - 1) setOptionsVisibleCount(optIdx + 2);
    },
    [reducedMotion, ep10OptionCount],
  );

  useLayoutEffect(() => {
    if (!reducedMotion) return;
    setDialoguePhase(dialogueLength);
    setTypingUnlockedIdx(dialogueLength);
    setShowQ(true);
    setShowQWording(true);
    setOptionsVisibleCount(ep10OptionCount);
  }, [reducedMotion, dialogueLength, ep10OptionCount]);

  const situationStep = { current: 0 };
  const titleStep = situationStep.current++;
  const sit1Step = situationStep.current++;
  const sit2Step = situationStep.current++;
  const sit3Step = situationStep.current++;
  const firstDialogueStep = situationStep.current;

  return (
    <section className="ep1-scene-layout w-full min-w-0 max-w-none space-y-10 sm:space-y-12">
      <div className="initiation-action-page mb-8 w-full sm:mb-10">
        <div className="flex justify-center px-2">
          <p
            className="ep1-scene-reveal initiation-brief-badge w-full max-w-[min(100%,62rem)] shadow-[6px_6px_0_#111111]"
            style={revealDelay(titleStep)}
          >
            {ep10Scene.title}
          </p>
        </div>
      </div>

      <div className="space-y-2 px-2 text-center">
        <p
          className="ep1-scene-reveal font-sans text-[19px] font-bold leading-snug text-[#ef4444] sm:text-[21px]"
          style={revealDelay(sit1Step)}
        >
          마침내 AI 대시보드의 베타 테스트가 오픈되었습니다.
        </p>
        <p
          className="ep1-scene-reveal font-sans text-[19px] font-bold leading-relaxed text-[#111] sm:text-[21px]"
          style={revealDelay(sit2Step)}
        >
          핵심 이해관계자들 대상으로 런칭 반나절 만에,
        </p>
        <p
          className="ep1-scene-reveal font-sans text-[18px] font-normal leading-relaxed text-[#6b7280] sm:text-[20px]"
          style={revealDelay(sit3Step)}
        >
          최성민 상무로부터 호출이 떨어집니다.
        </p>
      </div>

      <div className="space-y-10 sm:space-y-12">
        {ep10Scene.dialogue.map((line, i) => {
          const meta = DIALOGUE_MAP[i];
          const isCharacter = meta?.charKey != null;

          if (i === 0) {
            if (isCharacter) {
              const base = CHARACTERS[meta.charKey!];
              const char: CharacterMeta = meta.avatarSrc ? { ...base, avatar: meta.avatarSrc } : base;
              const side = meta.charKey === "김지훈 선임" ? "right" as const : "left" as const;
              return (
                <div key={i} className="ep1-scene-reveal" style={revealDelay(firstDialogueStep)}>
                  <CharacterBubble
                    char={char}
                    text={line}
                    side={side}
                    typingStartDelayMs={firstDialogueStep * REVEAL_STAGGER_MS + 520}
                    canStart
                    onTypingComplete={handleDialogueTypingComplete(0)}
                  />
                </div>
              );
            }
            return (
              <div
                key={i}
                className="ep1-scene-reveal rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
                style={revealDelay(firstDialogueStep)}
              >
                <p className="font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
                  {renderDialogueBold(line, ACCENT)}
                </p>
              </div>
            );
          }

          if (dialoguePhase < i) return null;

          if (isCharacter) {
            const base = CHARACTERS[meta.charKey!];
            const char: CharacterMeta = meta.avatarSrc ? { ...base, avatar: meta.avatarSrc } : base;
            const side = meta.charKey === "김지훈 선임" ? "right" as const : "left" as const;
            return (
              <div
                key={i}
                className="ep1-dialogue-seq-fade"
                onAnimationEnd={handleDialogueFadeEnd(i, true)}
              >
                <CharacterBubble
                  char={char}
                  text={line}
                  side={side}
                  typingStartDelayMs={TYPING_PAUSE_MS}
                  canStart={typingUnlockedIdx >= i}
                  onTypingComplete={handleDialogueTypingComplete(i)}
                />
              </div>
            );
          }

          return (
            <div
              key={i}
              className="ep1-dialogue-seq-fade rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
              onAnimationEnd={handleDialogueFadeEnd(i, false)}
            >
              <p className="font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
                {renderDialogueBold(line, ACCENT)}
              </p>
            </div>
          );
        })}
      </div>

      {showQ && (
        <>
          <div className="!mt-20 mb-[3.75rem] space-y-4 px-1 pt-4 text-center sm:!mt-24 sm:mb-[4.5rem]">
            <p
              className="ep1-dialogue-seq-fade font-sans text-[56px] font-black leading-none text-black sm:text-[72px]"
              onAnimationEnd={handleQFadeEnd}
            >
              Q.
            </p>
            {showQWording && (
              <p
                className="ep1-dialogue-seq-fade mx-auto max-w-[min(100%,40rem)] font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]"
                onAnimationEnd={handleWordingFadeEnd}
              >
                김지훈 선임의 중대한 실수.
                <br />
                <br />
                <span className="font-bold text-[#ef4444]">
                  공개적으로 체면이 구겨진 팀원 앞에서
                  <br />
                  리더인 당신은 이 상황을 어떻게 수습하시겠습니까?
                </span>
              </p>
            )}
          </div>

          <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:gap-5 md:items-stretch lg:gap-6">
            {ep10Options.map((opt, optIdx) => {
              if (optionsVisibleCount <= optIdx) return null;
              const block = EP10_CARD_BLOCKS[opt.id];
              const isSelected = episode10Choice === opt.id;
              return (
                <div
                  key={opt.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Option ${opt.id}: ${opt.title}`}
                  onClick={() => setEpisode10Choice(opt.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setEpisode10Choice(opt.id);
                    }
                  }}
                  onAnimationEnd={handleOptionFadeEnd(optIdx)}
                  className={`ep1-dialogue-seq-fade ep1-option-card flex h-full w-full min-w-0 cursor-pointer flex-col overflow-visible rounded-2xl border-2 text-center outline-offset-2 transition-[border-color,box-shadow,background-color,transform] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-black ${
                    isSelected
                      ? "ep1-option-card--selected"
                      : "border-black bg-white shadow-[4px_4px_0_0_#111111] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_0_#111111]"
                  }`}
                >
                  <div className="-mt-px flex shrink-0 justify-center">
                    <div
                      className={`ep1-option-pill pointer-events-none inline-flex items-center gap-2 rounded-b-xl px-5 py-2 font-sans text-[15px] font-bold tracking-wide transition-colors duration-300 sm:text-[16px] ${
                        isSelected ? "ep1-option-pill--selected" : "bg-[#111111]"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-[22px] sm:w-[22px] ${
                          isSelected
                            ? "border-2 border-[#991b1b]/25 bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
                            : "border-2 border-white/35 bg-transparent"
                        }`}
                        aria-hidden
                      >
                        {isSelected && (
                          <svg width="12" height="10" viewBox="0 0 11 9" fill="none" aria-hidden>
                            <path
                              className="ep1-option-check-mark"
                              d="M1 4.5L3.5 7L9.5 1"
                              stroke="#991b1b"
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
                    <div className="min-h-min min-w-0 flex-1 space-y-4 break-words text-center [overflow-wrap:anywhere] sm:space-y-5">
                      {block.bodyParagraphs.map((para, idx) => (
                        <p
                          key={idx}
                          className="font-sans text-[15px] font-medium leading-[1.7] text-[#444444] sm:text-[16px]"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                    <div
                      data-ep1-opt={opt.id}
                      className="ep1-option-quote mt-auto shrink-0 rounded-xl px-4 py-4 sm:px-4 sm:py-[18px]"
                    >
                      <p className="ep1-option-quote-text font-sans text-[14px] font-medium leading-[1.75] sm:text-[15px] [overflow-wrap:anywhere] [word-break:keep-all]">
                        &ldquo;{block.quote}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
