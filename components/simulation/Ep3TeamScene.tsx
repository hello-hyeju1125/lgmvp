"use client";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { ep3Scene, ep3Options } from "@/content/episode3";
import EpisodeScene from "@/components/shared/EpisodeScene";

interface Ep3TeamSceneProps {
  userName: string;
}

/** **text** -> <strong>text</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export function Ep3TeamScene({ userName }: Ep3TeamSceneProps) {
  const { episode3Choice, setEpisode3Choice } = useStore();
  const [isDialogueRevealed, setIsDialogueRevealed] = useState(false);
  const [firstQuote, narration] = ep3Scene.dialogue;

  return (
    <EpisodeScene
      title={ep3Scene.title}
      situation={ep3Scene.situation}
      dialogues={isDialogueRevealed ? [{ speaker: "정태영 책임", text: firstQuote ?? "" }] : []}
    >
      {!isDialogueRevealed ? (
        <button type="button" onClick={() => setIsDialogueRevealed(true)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-black">
          대화 내용 펼치기
        </button>
      ) : null}
      {narration ? <p className="text-base font-extrabold text-black">{renderWithBold(narration)}</p> : null}
      <p className="text-lg font-extrabold text-black">[Action] {renderWithBold(ep3Scene.action)}</p>
      <div className="space-y-3">
        {ep3Options.map((opt) => (
          <button key={opt.id} type="button" onClick={() => setEpisode3Choice(opt.id)} className={`w-full rounded-xl border bg-white p-4 text-left ${episode3Choice === opt.id ? "border-black" : "border-gray-200"}`}>
            <p className="text-base font-bold text-black">옵션 {opt.id}. {opt.title}</p>
            <p className="mt-1 text-sm leading-7 text-black">{renderWithBold(opt.summary)}</p>
          </button>
        ))}
      </div>
    </EpisodeScene>
  );
}
