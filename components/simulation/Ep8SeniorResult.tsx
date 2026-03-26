"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";

interface Ep8SeniorResultProps {
  userName: string;
}

type CoachingFeedItem = {
  id: string;
  author: string;
  text: string;
  likes: number;
};

const MOCK_FEED: CoachingFeedItem[] = [
  {
    id: "c1",
    author: "참가자 A",
    text: "민수 책임님 경험은 기술의 반대편이 아니라 기술의 방향키입니다. 다음 회의부터 '고객이 실제로 불편해하는 순간'을 먼저 짚어주세요. 그 기준이 AI 분류 로직의 정답률을 끌어올리는 핵심 앵커가 됩니다.",
    likes: 18,
  },
  {
    id: "c2",
    author: "참가자 B",
    text: "기술 용어를 모두 이해하려고 하기보다, 고객 언어를 기술 언어로 바꾸는 브릿지 역할을 맡아주세요. 회의마다 5분만 '현장 관점 체크'를 운영하면 팀 의사결정 품질이 크게 좋아집니다.",
    likes: 24,
  },
  {
    id: "c3",
    author: "참가자 C",
    text: "이번 주부터 민수 책임님이 엣지 케이스 리뷰 오너를 맡아주세요. 애매한 사례 10건만 선별해도 분류 기준의 일관성이 살아납니다. 이 영역은 시니어의 도메인 감각이 가장 큰 차이를 만듭니다.",
    likes: 12,
  },
  {
    id: "c4",
    author: "참가자 D",
    text: "기술 설명을 이해하려 애쓰기보다 '이 기능이 고객 문제를 실제로 해결하는가'를 판단해 주세요. 민수 책임님의 질문 한 줄이 기능 우선순위를 바꿀 수 있습니다.",
    likes: 15,
  },
  {
    id: "c5",
    author: "참가자 E",
    text: "회의마다 마지막 3분은 민수 책임님이 '현장 기준 체크리스트'를 읽어주는 방식으로 운영해보면 좋아요. 팀 전체가 고객 관점을 잃지 않게 됩니다.",
    likes: 20,
  },
  {
    id: "c6",
    author: "참가자 F",
    text: "이번 스프린트에서는 민수 책임님이 분류 기준의 예외 규칙 담당을 맡아주세요. 기술팀은 그 규칙을 모델 로직에 반영해 학습 품질을 안정화할 수 있습니다.",
    likes: 14,
  },
];

export function Ep8SeniorResult({ userName }: Ep8SeniorResultProps) {
  const { episode8CoachingText } = useStore();
  const [likedById, setLikedById] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="mx-auto w-full max-w-4xl" aria-labelledby="ep8-result-title">
      <div className="rounded-xl border border-white/15 bg-white/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
        <p className="text-center text-[12px] font-extrabold tracking-[0.18em] text-[#E4003F]">E8 RESULT</p>
        <h2 id="ep8-result-title" className="mt-2 text-center text-2xl font-extrabold tracking-tight text-black/90 sm:text-3xl">
          E8. 고연차 팀원의 속사정 – 결과
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article className="relative rotate-[-0.8deg] rounded-sm border border-[#E7CF8B] bg-[#FFF9C4] p-4 shadow-[0_16px_28px_rgba(0,0,0,0.14)]">
            <span className="pointer-events-none absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rounded-sm bg-white/65 shadow-[0_2px_6px_rgba(0,0,0,0.15)]" />
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[14px] font-extrabold text-black/85">{userName}</p>
                {(() => {
                  const liked = !!likedById.me;
                  const count = 31 + (liked ? 1 : 0);
                  return (
                    <button
                      type="button"
                      onClick={() => toggleLike("me")}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-extrabold transition ${
                        liked ? "bg-[#E4003F]/10 text-[#E4003F]" : "bg-black/5 text-black/55 hover:text-[#E4003F]"
                      }`}
                      aria-label="좋아요"
                    >
                      <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
                      {count}
                    </button>
                  );
                })()}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-[15px] leading-[1.8] text-black/80">
                {episode8CoachingText || "(작성된 내용 없음)"}
              </p>
            </div>
          </article>

          {MOCK_FEED.map((item) => {
            const liked = !!likedById[item.id];
            const count = item.likes + (liked ? 1 : 0);
            const stickerStyle = [
              "rotate-[1.2deg] border-[#D9C2F5] bg-[#F4EFFF]",
              "rotate-[-1deg] border-[#BFE4EA] bg-[#EFFFF6]",
              "rotate-[0.8deg] border-[#F3C8CC] bg-[#FFF1F3]",
            ];
            const style = stickerStyle[Number(item.id.slice(-1)) % stickerStyle.length];
            return (
              <article
                key={item.id}
                className={`relative rounded-sm border p-4 shadow-[0_16px_28px_rgba(0,0,0,0.14)] ${style}`}
              >
                <span className="pointer-events-none absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rounded-sm bg-white/65 shadow-[0_2px_6px_rgba(0,0,0,0.15)]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[14px] font-extrabold text-black/85">{item.author}</p>
                    <button
                      type="button"
                      onClick={() => toggleLike(item.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-extrabold transition ${
                        liked ? "bg-[#E4003F]/10 text-[#E4003F]" : "bg-black/5 text-black/55 hover:text-[#E4003F]"
                      }`}
                      aria-label="좋아요"
                    >
                      <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
                      {count}
                    </button>
                  </div>
                  <p className="mt-2 text-[15px] leading-[1.8] text-black/75">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
