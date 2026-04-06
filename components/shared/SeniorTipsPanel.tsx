"use client";

import { useState, useCallback, type ReactNode } from "react";
import { ChevronDown, Heart, User } from "lucide-react";

export interface StoryItem {
  title?: string;
  text?: string;
  quoteTitle?: string;
  body?: string;
  source?: string;
}

export interface PostItNote {
  id: string;
  nickname: string;
  text: string;
}

interface SeniorTipsPanelProps {
  title: string;
  intro: string;
  stories: StoryItem[];
  prompt: string;
  placeholder: string;
  userName: string;
  postItNotes?: PostItNote[];
}

const MAX_POSTITS = 9;

const DEFAULT_NOTES: PostItNote[] = [
  { id: "s1", nickname: "실전파PM", text: "저도 첫 프로젝트 때 탑다운 목표를 그대로 받아서 팀원들이 3개월 만에 지쳐 나갔어요. 현실화 조율이 진짜 중요합니다." },
  { id: "s2", nickname: "조율왕", text: "R&R 안 정하고 시작했다가 프로젝트 후반에 서로 '그건 내 일이 아닌데'가 난무했습니다. 킥오프 때 경계 합의 꼭 하세요." },
  { id: "s3", nickname: "현장밀착러", text: "경영진 기대치 조율할 때 '안 됩니다'가 아니라 '이 범위까지는 확실히 됩니다'로 말하니까 오히려 신뢰를 얻었어요." },
  { id: "s4", nickname: "7년차리더", text: "스트레치 골 자체가 나쁜 건 아닌데, 리더가 그걸 팀에 어떻게 번역하느냐가 핵심이더라고요. 목표의 현실화가 리더의 역량입니다." },
  { id: "s5", nickname: "실수에서배운PM", text: "분위기 좋게 넘어가려고 R&R 논의를 미뤘는데, 결국 프로젝트 끝나고 성과 분배에서 큰 갈등이 터졌습니다." },
  { id: "s6", nickname: "데이터기반리더", text: "착수 단계에서 데이터로 현실 가능한 범위를 보여주니 경영진도 납득하더라고요. 감이 아닌 근거가 설득의 무기입니다." },
  { id: "s7", nickname: "소통러PM", text: "킥오프 때 팀원 한 명 한 명과 1:1로 역할 기대치를 확인했더니 이후 업무 충돌이 거의 없었습니다." },
  { id: "s8", nickname: "전략가리더", text: "목표를 세울 때 '왜 이 수치인가'를 팀원들에게 설명할 수 있어야 해요. 납득 없는 목표는 동기부여가 안 됩니다." },
];

const POSTIT_COLORS = [
  "bg-[#e8eaf6]", "bg-[#e8f5e9]", "bg-[#fff3e0]",
  "bg-[#e3f2fd]", "bg-[#fce4ec]", "bg-[#f0f4c3]",
] as const;

const POSTIT_ROTATE = [
  "rotate-[-1deg]", "rotate-[0.6deg]", "rotate-[1deg]",
  "rotate-[-0.6deg]", "rotate-[0deg]", "rotate-[1.2deg]",
] as const;

function renderMarkedText(raw: string): ReactNode[] {
  const segments = raw.split(/(==.+?==|\*\*.+?\*\*)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith("==") && seg.endsWith("==")) {
      const inner = seg.slice(2, -2);
      return (
        <span key={i} className="senior-tips-highlight">
          {inner}
        </span>
      );
    }
    if (seg.startsWith("**") && seg.endsWith("**")) {
      return <strong key={i}>{seg.slice(2, -2)}</strong>;
    }
    return <span key={i}>{seg}</span>;
  });
}

function StoryCard({
  storyNumber,
  quoteTitle,
  bodyText,
  sourceName,
  isOpen,
  onToggle,
}: {
  storyNumber: number;
  quoteTitle: string;
  bodyText: string;
  sourceName: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const bodyLines = bodyText.split("\n");

  return (
    <article className="senior-story-card stips-scale relative overflow-hidden rounded-xl border-2 border-black bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)]" style={{ animationDelay: `${storyNumber * 200 + 600}ms` }}>
      {/* Story label */}
      <div
        className="senior-story-label-pill absolute left-5 z-10 rounded-md bg-[#4ADE5E] px-4 py-2 font-sans text-[16px] font-bold text-white"
        style={{ top: "-14px" }}
      >
        Story <span className="font-black">{storyNumber}.</span>
      </div>

      {/* Quote header — clickable */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="senior-tips-quote-header flex w-full cursor-pointer items-center gap-2 bg-[#2d2d2d] px-6 pb-5 pt-8 text-left sm:px-10"
      >
        <p className="senior-tips-quote-text min-w-0 flex-1 text-center font-sans text-[22px] leading-snug sm:text-[26px]">
          {quoteTitle}
        </p>
        <ChevronDown
          className={`ml-1 h-6 w-6 shrink-0 text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {/* Body — collapsible */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4 pt-7 sm:px-10">
          <div className="space-y-0 text-center font-sans text-[16px] leading-[2] text-[#222] sm:text-[17px]">
            {bodyLines.map((line, i) => (
              <p key={i}>{renderMarkedText(line)}</p>
            ))}
          </div>

          {/* Source */}
          {sourceName && (
            <div className="mt-6 flex items-center justify-center gap-2 pb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d1d5db]">
                <User className="h-4 w-4 text-[#6b7280]" strokeWidth={2} />
              </div>
              <span className="font-sans text-[15px] text-[#888]">{sourceName}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function SeniorTipsPanel({
  title,
  intro,
  stories,
  prompt,
  placeholder,
  userName,
  postItNotes,
}: SeniorTipsPanelProps) {
  const othersNotes = postItNotes ?? DEFAULT_NOTES;
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [openIdxSet, setOpenIdxSet] = useState<Set<number>>(() => new Set());

  const handleSubmit = useCallback(() => {
    if (!note.trim()) return;
    setSubmitted(true);
  }, [note]);

  const toggleLike = useCallback((id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const introLines = intro.split("\n");

  return (
    <section
      className="senior-tips-page min-h-full w-full"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="mx-auto max-w-[1080px] px-4 py-12 sm:px-6 sm:py-16">
        {/* Title badge — initiation-brief-badge 스타일 + 보라색 배경 */}
        <div className="stips-scale mb-10 flex justify-center" style={{ animationDelay: "0ms" }}>
          <p
            className="senior-tips-title-badge m-0 shadow-[6px_6px_0_#111111]"
          >
            {title}
          </p>
        </div>

        {/* Intro text */}
        <div className="mb-12 text-center font-sans text-[17px] leading-[2] text-[#111] sm:text-[19px]">
          {introLines.map((line, i) => (
            <p key={i} className="stips-reveal" style={{ animationDelay: `${150 + i * 120}ms` }}>{renderMarkedText(line)}</p>
          ))}
        </div>

        {/* Story cards */}
        <div className="space-y-10">
          {stories.map((story, i) => {
            const qt = story.quoteTitle ?? story.title?.replace(/^Story\s*\d+\.\s*"?|"?\s*$/g, "") ?? "";
            const bd = story.body ?? story.text ?? "";
            const src = story.source ?? "";

            return (
              <StoryCard
                key={i}
                storyNumber={i + 1}
                quoteTitle={qt}
                bodyText={bd}
                sourceName={src}
                isOpen={openIdxSet.has(i)}
                onToggle={() => setOpenIdxSet((prev) => {
                  const next = new Set(prev);
                  if (next.has(i)) next.delete(i);
                  else next.add(i);
                  return next;
                })}
              />
            );
          })}
        </div>

        {/* User input — Ep8 코칭 메시지 카드 스타일 */}
        {prompt && (
          <div className="stips-scale mt-14 overflow-visible rounded-2xl border-2 border-black bg-white text-center shadow-[4px_4px_0_0_#111111]" style={{ animationDelay: `${stories.length * 200 + 1000}ms` }}>
            <div className="-mt-px flex shrink-0 justify-center px-1">
              <div className="senior-tips-input-pill inline-flex max-w-[min(100%,28rem)] items-center justify-center gap-2 rounded-b-xl bg-[#111111] px-4 py-2 text-center font-sans text-[13px] font-bold leading-snug tracking-wide sm:px-5 sm:text-[16px] sm:leading-normal">
                <span className="font-sans font-bold text-white [word-break:keep-all]">{prompt.replace(/\{User_Name\}/g, userName || "리더")}</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 px-5 pb-6 pt-6 text-left sm:gap-5 sm:px-6 sm:pb-6">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={placeholder}
                rows={9}
                disabled={submitted}
                className={`senior-tips-reflect-field min-h-[220px] w-full resize-y rounded-xl border-2 border-black/10 bg-white px-4 py-3 font-sans text-[15px] font-medium leading-[1.75] text-[#111] placeholder:text-[#9ca3af] focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 sm:text-[16px] ${submitted ? "opacity-60 cursor-not-allowed" : ""}`}
              />
              {!submitted && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!note.trim()}
                    className="senior-tips-submit-btn rounded-lg border-2 border-black bg-black px-6 py-2.5 font-sans text-[15px] font-bold text-white shadow-[3px_3px_0_#111] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#111] disabled:cursor-not-allowed disabled:opacity-40 sm:text-[16px]"
                  >
                    제출하기
                  </button>
                </div>
              )}
              {submitted && (
                <p className="senior-tips-submit-complete text-center font-sans text-[14px] font-bold text-[#059669]">제출이 완료되었습니다.</p>
              )}
            </div>
          </div>
        )}

        {/* 포스트잇 — 제출 후에만 노출 */}
        {submitted && (
          <div className="stips-scale mt-14" style={{ animationDelay: "0ms" }}>
            <p className="mb-8 text-center font-sans text-[16px] font-medium text-[#555] sm:text-[17px]">
              다른 참석자들이 남긴 경험담도 함께 확인해 보세요.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
              {/* 내 포스트잇 */}
              <article
                className="stips-scale relative flex min-h-[188px] flex-col border border-black/15 bg-[#FFF9C4] p-4 shadow-[3px_5px_14px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.65)] rotate-[-0.5deg] sm:min-h-[200px]"
                style={{ animationDelay: "100ms" }}
              >
                <span className="pointer-events-none absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rounded-sm bg-white/65 shadow-[0_2px_6px_rgba(0,0,0,0.15)]" />
                <div className="mb-2 flex items-start justify-between gap-2 border-b border-black/10 pb-2">
                  <p className="min-w-0 flex-1 font-sans text-[12px] font-extrabold tracking-wide text-[#111]/85 sm:text-[13px]">
                    나의 경험담
                  </p>
                  <span className="senior-tips-postit-my-badge shrink-0 rounded bg-[#059669] px-1.5 py-0.5 font-sans text-[10px] font-bold text-white">MY</span>
                </div>
                <p className="flex-1 font-sans text-[13px] font-medium leading-[1.7] text-[#1a1a1a] sm:text-[14px] [overflow-wrap:anywhere] [word-break:keep-all]">
                  {note}
                </p>
              </article>

              {/* 다른 참석자 포스트잇 (내 것 1개 제외, 최대 MAX_POSTITS-1개) */}
              {othersNotes.slice(0, MAX_POSTITS - 1).map((n, i) => {
                const bg = POSTIT_COLORS[i % POSTIT_COLORS.length];
                const rot = POSTIT_ROTATE[i % POSTIT_ROTATE.length];
                const liked = !!likedIds[n.id];
                return (
                  <article
                    key={n.id}
                    className={`stips-scale relative flex min-h-[188px] flex-col border border-black/15 ${bg} p-4 shadow-[3px_5px_14px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.65)] ${rot} sm:min-h-[200px]`}
                    style={{ animationDelay: `${200 + i * 100}ms` }}
                  >
                    <span className="pointer-events-none absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rounded-sm bg-white/65 shadow-[0_2px_6px_rgba(0,0,0,0.15)]" />
                    <div className="mb-2 flex items-start justify-between gap-2 border-b border-black/10 pb-2">
                      <p className="min-w-0 flex-1 font-sans text-[12px] font-extrabold tracking-wide text-[#111]/85 sm:text-[13px]">
                        {n.nickname}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleLike(n.id)}
                        aria-pressed={liked}
                        aria-label={`${n.nickname} 좋아요`}
                        className={`senior-tips-like-btn shrink-0 rounded-md p-1 transition-colors ${liked ? "text-rose-500" : "text-zinc-400 hover:text-rose-400"}`}
                      >
                        <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} strokeWidth={2} />
                      </button>
                    </div>
                    <p className="flex-1 font-sans text-[13px] font-medium leading-[1.7] text-[#1a1a1a] sm:text-[14px] [overflow-wrap:anywhere] [word-break:keep-all]">
                      {n.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
