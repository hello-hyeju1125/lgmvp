"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ep8Scene,
  ep8OthersPostItNotes,
  type Ep8PostItNote,
} from "@/content/episode8";

interface Ep8SeniorResultProps {
  userName: string;
}

const POSTIT_BG = [
  "bg-[#e8eaf6]",
  "bg-[#e8f5e9]",
  "bg-[#fff3e0]",
  "bg-[#e3f2fd]",
  "bg-[#fce4ec]",
  "bg-[#f0f4c3]",
] as const;
const POSTIT_ROTATE = [
  "rotate-[-1deg]",
  "rotate-[0.6deg]",
  "rotate-[1deg]",
  "rotate-[-0.6deg]",
  "rotate-[0deg]",
  "rotate-[1.2deg]",
] as const;
const POSTITS_PER_PAGE = 6;

function PostItCard({
  note,
  index,
  liked,
  onToggleLike,
}: {
  note: Ep8PostItNote;
  index: number;
  liked: boolean;
  onToggleLike: () => void;
}) {
  const bg = POSTIT_BG[index % POSTIT_BG.length];
  const rot = POSTIT_ROTATE[index % POSTIT_ROTATE.length];

  return (
    <article
      className={`ep1-result-postit relative flex min-h-[188px] flex-col border border-black/15 ${bg} p-4 shadow-[3px_5px_14px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.65)] sm:min-h-[200px] ${rot}`}
    >
      <span className="pointer-events-none absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rounded-sm bg-white/65 shadow-[0_2px_6px_rgba(0,0,0,0.15)]" />
      <div className="mb-2 flex items-start justify-between gap-2 border-b border-black/10 pb-2">
        <p className="min-w-0 flex-1 font-sans text-[12px] font-extrabold tracking-wide text-[#111]/85 sm:text-[13px]">
          {note.nickname}
        </p>
        <button
          type="button"
          onClick={onToggleLike}
          aria-pressed={liked}
          aria-label={`${note.nickname} 메모 좋아요`}
          className={`shrink-0 rounded-md p-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
            liked ? "!text-rose-600" : "text-zinc-400 hover:text-rose-500"
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
            <path
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </button>
      </div>
      <p className="flex-1 font-sans text-[13px] font-medium leading-[1.7] text-[#1a1a1a] sm:text-[14px] [overflow-wrap:anywhere] [word-break:keep-all]">
        {note.text}
      </p>
    </article>
  );
}

export function Ep8SeniorResult({}: Ep8SeniorResultProps) {
  const [likedById, setLikedById] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(0);

  const toggleLike = (id: string) => {
    setLikedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const notes = ep8OthersPostItNotes;
  const totalPages = Math.max(1, Math.ceil(notes.length / POSTITS_PER_PAGE));
  const safePage = Math.min(Math.max(0, page), totalPages - 1);
  const start = safePage * POSTITS_PER_PAGE;
  const pageNotes = notes.slice(start, start + POSTITS_PER_PAGE);

  const episodeTitle = ep8Scene.title;

  return (
    <section
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-transparent px-5 pb-16 pt-10 font-sans sm:px-8 sm:pb-20 sm:pt-12"
      aria-label={`${episodeTitle} 결과`}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* 스탬프 헤더 */}
        <div className="initiation-action-page mb-5 w-full sm:mb-6">
          <div className="flex justify-center px-2">
            <p
              className="ep1-scene-reveal ep1-result-page-stamp initiation-brief-badge m-0 w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
              style={{ animationDelay: "0ms" }}
              role="status"
              aria-label="다른 참석자들이 남긴 코칭 메모"
            >
              다른 참석자들이 남긴 코칭 메모
            </p>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="mb-9 mt-10 text-center sm:mt-12">
          <p className="m-0 text-[19px] font-bold text-[#111] sm:text-[20px]">
            다른 참석자들의 코칭 메모도 함께 확인해 보십시오.
          </p>
        </div>

        {/* 다른 참석자 코칭 메모 */}
        <div className="mt-10 sm:mt-12">

          <div className="mt-8 sm:mt-10">
            <div className="ep1-result-accordion-card overflow-hidden rounded-none border-2 border-black bg-white">
              <div className="bg-white px-6 pb-8 pt-6 sm:px-8 sm:pb-10 sm:pt-8">
                <div
                  className="grid min-h-0 w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:gap-6"
                  aria-live="polite"
                >
                  {pageNotes.map((note, i) => (
                    <PostItCard
                      key={note.id}
                      note={note}
                      index={start + i}
                      liked={!!likedById[note.id]}
                      onToggleLike={() => toggleLike(note.id)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="mt-8 pt-1" aria-label="코칭 메모 페이지">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        disabled={safePage <= 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        className="ep1-result-show-others-btn rounded-none border-2 border-black bg-white px-4 py-2 font-sans text-[13px] font-bold text-[#111] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-[14px]"
                      >
                        이전
                      </button>
                      <ol className="flex items-center gap-1.5 sm:gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <li key={i}>
                            <button
                              type="button"
                              onClick={() => setPage(i)}
                              className={`flex h-8 min-w-[2rem] items-center justify-center rounded-none border-2 font-sans text-[12px] font-extrabold tabular-nums sm:h-9 sm:min-w-[2.25rem] sm:text-[13px] ${
                                i === safePage
                                  ? "border-black bg-[#d97706] text-black shadow-[2px_2px_0_#111]"
                                  : "border-black/20 bg-white text-[#111] hover:border-black/40"
                              }`}
                              aria-current={i === safePage ? "page" : undefined}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                      </ol>
                      <button
                        type="button"
                        disabled={safePage >= totalPages - 1}
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        className="ep1-result-show-others-btn rounded-none border-2 border-black bg-white px-4 py-2 font-sans text-[13px] font-bold text-[#111] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-[14px]"
                      >
                        다음
                      </button>
                    </div>
                  </nav>
                )}
              </div>

              {/* 챗봇 피드백 */}
              <div className="ep1-result-feedback-panel border-0 bg-[#F7FBFF] px-6 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8">
                <div className="mb-5 flex items-center gap-3 sm:mb-6">
                  <div className="ep1-result-feedback-avatar h-14 w-14 shrink-0 overflow-hidden rounded-full border-0 bg-white sm:h-16 sm:w-16">
                    <Image src="/LG_MVP_chatbot.jpg" alt="챗봇 선배 PM" width={64} height={64} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="ep1-result-feedback-label inline-flex items-center rounded-none bg-[#d97706] px-4 py-1.5 text-[14px] font-extrabold tracking-wide sm:text-[15px]">
                      챗봇 선배 PM의 피드백
                    </span>
                  </div>
                </div>
                <div className="ep1-result-feedback-bubble relative rounded-2xl bg-white px-5 py-5 sm:px-6 sm:py-6">
                  <div className="ep1-result-feedback-notch absolute -top-2 left-10 h-4 w-4 rotate-45 bg-white" aria-hidden />
                  <div className="relative space-y-3 text-left text-[15px] leading-[1.9] text-[#333] sm:text-[16px]">
                    <p className="m-0">
                      고연차 팀원의 도메인 지식은 프로젝트의 <span className="font-bold text-[#d97706]">숨은 자산</span>입니다.
                      기술 용어를 모두 이해시키려 하기보다, <span className="font-bold text-[#d97706]">현장 경험을 프로젝트의 품질 기준으로 연결</span>해 주는 것이 리더의 역할입니다.
                    </p>
                    <p className="m-0">
                      <span className="font-bold text-[#d97706]">&lsquo;고객 관점 체크&rsquo;</span>라는 명확한 역할을 부여하면,
                      시니어는 자신감을 회복하고 팀은 현장 감각을 잃지 않게 됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
