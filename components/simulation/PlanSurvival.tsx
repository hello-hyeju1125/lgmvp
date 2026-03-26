"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";

const INTRO =
  "치열했던 기획(Planning) 단계, 무사히 넘기셨나요?\n엑셀 칸을 채우는 것보다 어려운 것이 바로 '사람의 마음을 셋팅하는 일'이죠.\n본격적인 실행을 앞둔 리더님을 위해,\n현업 선배 PM들이 현장에서 직접 부딪히며 깨달았던 경험담을 공유합니다.";

const STORY_1 = {
  title: "갈등 회피를 위한 기계적 업무 분할(1/N), 결국에는 품질 저하로 이어집니다.",
  body:
    "조직 내 이견을 봉합하기 위해 가장 쉽게 빠지는 함정이 바로 업무를 인원수대로 똑같이 나누는 '기계적 분할'입니다. 특히 데이터나 개발 업무는 일관된 품질 기준(Quality Standard)이 생명인데, 이를 여러 명이 쪼개어 작업하게 되면 추후 통합 단계에서 필연적으로 정합성 오류와 재작업이 발생합니다. 순간의 마찰이 두려워 명확한 R&R 원칙을 타협하지 마십시오. 가장 적합한 역량을 가진 담당자를 배정하고, 대신 이 업무가 그 팀원의 전문성 향상에 어떤 기여를 할 수 있는지 논리적으로 설득하는 데 리더의 시간과 에너지를 써야 합니다.",
  attribution: "(LG전자 B책임님 인터뷰 중)",
};

const STORY_2 = {
  title: "모두를 만족시키려는 '착한 리더'의 함정, 프로젝트의 방향성을 잃게 합니다.",
  body:
    "기획 회의에서 유관부서의 입장을 무조건 수용하며 마찰을 피하려다 보면, 프로젝트의 범위가 통제할 수 없이 늘어나는 오류를 범하게 됩니다. 리더는 머릿속에 프로젝트의 거시적인 방향성과 큰 그림을 쥐고, 핵심 목표에 부합하지 않는 요구사항은 단호하게 거절하며 건설적인 논쟁을 이끌어내야 합니다. 물론 각 부서의 팽팽한 이기주의 사이에서 악역을 자처하며 의견을 조율하는 과정이 당장은 벅차고 고통스러울 수 있습니다. 하지만 돌이켜보면, 그 치열했던 논의의 늪을 건너며 저 스스로도 프로젝트 전체를 관통하는 시각을 갖출 수 있게 된, 한 단계 도약할 수 있었던 값진 성장의 시간이었습니다.",
  attribution: "(LG 유플러스 A책임님 인터뷰 중)",
};

interface PlanSurvivalProps {
  userName: string;
}

interface ReflectionNote {
  id: string;
  nickname: string;
  content: string;
  likes: number;
  liked: boolean;
}

const INITIAL_REFLECTION_NOTES: ReflectionNote[] = [
  {
    id: "p1",
    nickname: "하늘PM",
    content: "갈등을 피하려고 모두의 요구를 담았더니 우선순위가 흐려졌던 경험이 떠올랐습니다. 결국 범위를 줄이고 핵심 지표에 집중하니 팀이 다시 정렬됐어요.",
    likes: 11,
    liked: false,
  },
  {
    id: "p2",
    nickname: "윤석리더",
    content: "기획 단계에서 가장 어려운 건 좋은 아이디어를 고르는 게 아니라, 지금 안 할 것을 결정하는 용기라는 걸 다시 느꼈습니다.",
    likes: 8,
    liked: false,
  },
  {
    id: "p3",
    nickname: "소연PM",
    content: "회의가 길어질수록 리더가 질문의 기준을 잡아줘야 팀이 본질로 돌아온다는 점이 인상 깊었습니다.",
    likes: 6,
    liked: false,
  },
];

function replaceUserName(text: string, name: string) {
  return text.replace(/\{User_Name\}/g, name);
}

function renderHighlightedText(text: string) {
  const patterns = [
    "갈등 회피를 위한 기계적 업무 분할\\(1/N\\), 결국에는 품질 저하로 이어집니다\\.",
    "모두를 만족시키려는 '착한 리더'의 함정, 프로젝트의 방향성을 잃게 합니다\\.",
    "리더는 머릿속에 프로젝트의 거시적인 방향성과 큰 그림을 쥐고, 핵심 목표에 부합하지 않는 요구사항은 단호하게 거절하며 건설적인 논쟁을 이끌어내야 합니다\\.",
    "업무가 그 팀원의 전문성 향상에 어떤 기여를 할 수 있는지 논리적으로 설득하는 데 리더의 시간과 에너지를 써야 합니다\\.",
  ];
  const regex = new RegExp(`(${patterns.join("|")})`, "g");
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (patterns.some((pattern) => new RegExp(`^${pattern}$`).test(part))) {
      return (
        <strong key={`${part}-${idx}`} className="font-bold text-white">
          {part}
        </strong>
      );
    }
    return <span key={`${part}-${idx}`}>{part}</span>;
  });
}

export function PlanSurvival({ userName }: PlanSurvivalProps) {
  const { nickname } = useStore();
  const [openStoryIndexes, setOpenStoryIndexes] = useState<number[]>([]);
  const [experience, setExperience] = useState("");
  const [reflectionNotes, setReflectionNotes] = useState<ReflectionNote[]>(INITIAL_REFLECTION_NOTES);

  const displayName = nickname || userName || "리더";
  const stories = [STORY_1, STORY_2];

  const handleSubmitReflection = () => {
    const value = experience.trim();
    if (!value) return;
    const newNote: ReflectionNote = {
      id: `${Date.now()}`,
      nickname: displayName,
      content: value,
      likes: 0,
      liked: false,
    };
    setReflectionNotes((prev) => [newNote, ...prev]);
    setExperience("");
  };

  const handleToggleLike = (id: string) => {
    setReflectionNotes((prev) =>
      prev.map((note) => {
        if (note.id !== id) return note;
        const nextLiked = !note.liked;
        return {
          ...note,
          liked: nextLiked,
          likes: nextLiked ? note.likes + 1 : Math.max(0, note.likes - 1),
        };
      })
    );
  };

  return (
    <div className="-mx-6 -mb-6">
      <div className="relative overflow-hidden rounded-none bg-[#070A12] sm:mx-0 sm:mb-0 sm:rounded-lg">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(920px 460px at 16% 2%, rgba(228,0,63,0.14), transparent 55%), radial-gradient(760px 420px at 90% 14%, rgba(255,106,138,0.10), transparent 52%), radial-gradient(130% 90% at 50% 100%, rgba(15,23,42,0.9), #070A12)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_30%,transparent_72%,rgba(0,0,0,0.45))]" />

        <div className="relative px-6 py-10 sm:px-10 sm:py-12">
          <div className="text-center">
            <p className="text-[12px] font-extrabold tracking-[0.35em] text-amber-200 sm:text-[13px]">CHAPTER 02 · PLANNING</p>
            <h2 className="mt-5 bg-gradient-to-b from-white via-white to-white/85 bg-clip-text text-[30px] font-extrabold leading-[1.15] tracking-tight text-transparent sm:text-[40px]">
              기획 단계 선배 PM의 노하우
            </h2>
            <p className="mx-auto mt-5 max-w-3xl whitespace-pre-line text-[15px] leading-[1.95] text-white/88 sm:text-[16px]">
              {INTRO}
            </p>
            <div className="mx-auto mt-10 h-px max-w-xs bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          </div>

          <section className="mt-14 space-y-7">
            {stories.map((story, i) => (
              <article key={i} className="rounded-md bg-white/[0.06] ring-1 ring-white/10">
                <button
                  type="button"
                  onClick={() =>
                    setOpenStoryIndexes((prev) =>
                      prev.includes(i) ? prev.filter((idx) => idx !== i) : [...prev, i]
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                  aria-expanded={openStoryIndexes.includes(i)}
                >
                  <p className="text-[15px] font-extrabold leading-[1.5] text-amber-100 sm:text-[16px]">
                    Story {i + 1}. {story.title}
                  </p>
                  <span
                    className={`shrink-0 text-[18px] font-bold text-white/80 transition-transform ${
                      openStoryIndexes.includes(i) ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ˅
                  </span>
                </button>
                {openStoryIndexes.includes(i) && (
                  <div className="border-t border-white/10 px-6 pb-6 pt-4">
                    <p className="text-[15px] leading-[1.95] text-white/88 sm:text-[16px]">{renderHighlightedText(story.body)}</p>
                    <p className="mt-3 text-[13px] italic text-white/60">{story.attribution}</p>
                  </div>
                )}
              </article>
            ))}
          </section>

          <div className="mt-16 mb-6 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <section className="relative overflow-hidden rounded-md border border-white/12 bg-[linear-gradient(145deg,rgba(35,18,33,0.82),rgba(13,16,26,0.92))] p-7 ring-1 ring-white/10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#E4003F]/12 blur-3xl" />
            <p className="relative mb-2 text-[12px] font-extrabold tracking-[0.22em] text-white/68">REFLECTION NOTE</p>
            <p className="text-[15px] font-bold text-white/92 sm:text-[16px]">
              {replaceUserName("혹시 {User_Name}님의 경험담도 공유해주실 수 있나요?", displayName)}
            </p>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="느낀 점이나 실제 사례를 자유롭게 작성해 주세요."
              rows={5}
              className="relative mt-5 w-full rounded-md border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] px-4 py-3 text-[15px] leading-relaxed text-white/92 placeholder:text-white/45 outline-none backdrop-blur-sm transition focus:border-[#E4003F]/60 focus:ring-2 focus:ring-[#E4003F]/20"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitReflection}
                disabled={!experience.trim()}
                className="inline-flex items-center rounded-md bg-[#E4003F] px-4 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#f01856] disabled:cursor-not-allowed disabled:opacity-45"
              >
                제출하기
              </button>
            </div>
          </section>

          <section className="mt-8 rounded-md bg-white/[0.04] p-6 ring-1 ring-white/10">
            <p className="mb-4 text-[12px] font-extrabold tracking-[0.22em] text-white/62">OTHER REFLECTION NOTES</p>
            <ul className="space-y-4">
              {reflectionNotes.map((note) => (
                <li key={note.id} className="rounded-md bg-black/25 p-4 ring-1 ring-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[14px] font-extrabold text-amber-100">{note.nickname}</p>
                      <p className="mt-1 text-[15px] leading-[1.85] text-white/88">{note.content}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleLike(note.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-bold transition ${
                        note.liked ? "bg-[#E4003F]/20 text-[#ff8cab]" : "bg-white/8 text-white/70 hover:bg-white/12"
                      }`}
                      aria-pressed={note.liked}
                    >
                      <span aria-hidden="true">{note.liked ? "♥" : "♡"}</span>
                      <span>{note.likes}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-12 text-center text-[15px] font-bold leading-relaxed text-white/88 sm:text-[16px]">
            선배 PM의 실제 사례를 내 상황에 대입해 보며, 다음 단계 의사결정의 기준을 점검해보세요.
          </p>
        </div>
      </div>
    </div>
  );
}
