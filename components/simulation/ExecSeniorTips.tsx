"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { executionSeniorTipsCopy } from "@/content/executionRecap";

interface ExecSeniorTipsProps {
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
    id: "e1",
    nickname: "민지PM",
    content: "텍스트로 핑퐁하던 이슈를 짧은 화상회의로 전환하니, 하루 걸릴 조율이 20분 만에 정리됐습니다.",
    likes: 12,
    liked: false,
  },
  {
    id: "e2",
    nickname: "준호리더",
    content: "완벽한 답을 주기보다 질문을 던졌더니 팀원이 스스로 기준을 만들고 훨씬 빠르게 실행하더라고요.",
    likes: 9,
    liked: false,
  },
  {
    id: "e3",
    nickname: "은서PM",
    content: "시니어의 도메인 경험을 '검수 기준' 역할로 재배치하니 팀의 품질 논의가 훨씬 명확해졌습니다.",
    likes: 7,
    liked: false,
  },
];

function replaceUserName(text: string, name: string) {
  return text.replace(/\{User_Name\}/g, name);
}

function renderHighlightedText(text: string) {
  const patterns = [
    "유관 부서에 협조를 요청할 때 두루뭉술하게 '자료 주세요'라고 하면 상대방은 주고 싶어도 못 줍니다\\.",
    "정확히 어떤 데이터의 어떤 항목이 언제까지 필요한지'를 핀셋처럼 집어서 명확하게 요청해야만 원하는 결과를 빠르게 얻어낼 수 있습니다\\.",
    "현재 단계에서 중요 포인트들이 합격 수준이라면, 부족한 10~20%는 후속 단계에서 보완하겠다는 결단을 내리고 과감하게 해당 단계를 '클로징'하고 넘어가야 프로젝트가 굴러갑니다\\.",
    "위기 상황에서는 명확하게 사실관계를 밝히고 이슈를 공론화하여 억지로라도 의사결정을 이끌어내는 단호함이 필요합니다\\.",
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

export function ExecSeniorTips({ userName }: ExecSeniorTipsProps) {
  const { nickname } = useStore();
  const [openStoryIndexes, setOpenStoryIndexes] = useState<number[]>([]);
  const [experience, setExperience] = useState("");
  const [reflectionNotes, setReflectionNotes] = useState<ReflectionNote[]>(INITIAL_REFLECTION_NOTES);

  const displayName = nickname || userName || "리더";

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
            <p className="text-[12px] font-extrabold tracking-[0.35em] text-amber-200 sm:text-[13px]">CHAPTER 03 · EXECUTION</p>
            <h2 className="mt-5 bg-gradient-to-b from-white via-white to-white/85 bg-clip-text text-[30px] font-extrabold leading-[1.15] tracking-tight text-transparent sm:text-[40px]">
              실행 단계 선배 PM의 노하우
            </h2>
            <p className="mx-auto mt-5 max-w-3xl whitespace-pre-line text-[15px] leading-[1.95] text-white/88 sm:text-[16px]">
              {executionSeniorTipsCopy.intro}
            </p>
            <div className="mx-auto mt-10 h-px max-w-xs bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          </div>

          <section className="mt-14 space-y-7">
            {executionSeniorTipsCopy.stories.map((story, i) => (
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
                  <p className="text-[15px] font-extrabold leading-[1.5] text-amber-100 sm:text-[16px]">{story.title}</p>
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
                    <p className="text-[15px] leading-[1.95] text-white/88 sm:text-[16px]">{renderHighlightedText(story.text)}</p>
                  </div>
                )}
              </article>
            ))}
          </section>

          <div className="mb-6 mt-16 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <section className="relative overflow-hidden rounded-md border border-white/12 bg-[linear-gradient(145deg,rgba(35,18,33,0.82),rgba(13,16,26,0.92))] p-7 ring-1 ring-white/10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#E4003F]/12 blur-3xl" />
            <p className="relative mb-2 text-[12px] font-extrabold tracking-[0.22em] text-white/68">REFLECTION NOTE</p>
            <p className="text-[15px] font-bold text-white/92 sm:text-[16px]">
              {replaceUserName(executionSeniorTipsCopy.prompt, displayName)}
            </p>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder={executionSeniorTipsCopy.placeholder}
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
