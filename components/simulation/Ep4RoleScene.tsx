"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { ep4Scene, ep4Options } from "@/content/episode4";
import EpisodeScene from "@/components/shared/EpisodeScene";

interface Ep4RoleSceneProps {
  userName: string;
}

/** **text** -> <strong>text</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export function Ep4RoleScene({ userName }: Ep4RoleSceneProps) {
  const { episode4Choice, setEpisode4Choice } = useStore();
  const [isDialogueRevealed, setIsDialogueRevealed] = useState(false);

  return (
    <EpisodeScene
      title={ep4Scene.title}
      situation={ep4Scene.situation}
      dialogues={isDialogueRevealed ? ep4Scene.dialogue.map((text) => ({ speaker: "최유라 선임", text })) : []}
    >
      {!isDialogueRevealed ? <button type="button" onClick={() => setIsDialogueRevealed(true)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-black">대화 내용 펼치기</button> : null}
      <p className="text-lg font-extrabold text-black">[Action] {renderWithBold(ep4Scene.action)}</p>
      <div className="space-y-3">
        {ep4Options.map((opt) => (
          <button key={opt.id} type="button" onClick={() => setEpisode4Choice(opt.id)} className={`w-full rounded-xl border bg-white p-4 text-left ${episode4Choice === opt.id ? "border-black" : "border-gray-200"}`}>
            <p className="text-base font-bold text-black">옵션 {opt.id}. {opt.title}</p>
            <p className="mt-1 text-sm leading-7 text-black">{renderWithBold(opt.summary)}</p>
          </button>
        ))}
      </div>
    </EpisodeScene>
  );
}
