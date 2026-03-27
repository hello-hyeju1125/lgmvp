"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { ep7Scene, ep7Options } from "@/content/episode7";
import { useEffect } from "react";
import EpisodeScene from "@/components/shared/EpisodeScene";

interface Ep7PassionSceneProps {
  userName: string;
}

/** **text** -> <strong>text</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export function Ep7PassionScene({ userName }: Ep7PassionSceneProps) {
  const { episode7Choice, setEpisode7Choice } = useStore();
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(episode7Choice);
  const [isDialogueRevealed, setIsDialogueRevealed] = useState(false);
  useEffect(() => {
    setEpisode7Choice(selected);
  }, [selected, setEpisode7Choice]);

  return (
    <EpisodeScene
      title={ep7Scene.title}
      situation={ep7Scene.situation}
      dialogues={isDialogueRevealed ? ep7Scene.dialogue.map((text) => ({ speaker: "최유라 선임", text })) : []}
    >
      {!isDialogueRevealed ? <button type="button" onClick={() => setIsDialogueRevealed(true)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-black">대화 내용 펼치기</button> : null}
      <p className="text-lg font-extrabold text-black">[Action] {renderWithBold(ep7Scene.action)}</p>
      <div className="space-y-3">
        {ep7Options.map((opt) => (
          <button key={opt.id} type="button" onClick={() => setSelected(opt.id)} className={`w-full rounded-xl border bg-white p-4 text-left ${selected === opt.id ? "border-black" : "border-gray-200"}`}>
            <p className="text-base font-bold text-black">옵션 {opt.id}. {opt.title}</p>
            <p className="mt-1 text-sm leading-7 text-black">{renderWithBold(opt.summary)}</p>
          </button>
        ))}
      </div>
    </EpisodeScene>
  );
}
