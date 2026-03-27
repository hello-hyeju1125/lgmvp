"use client";

import { useStore } from "@/store/useStore";
import { ep2AlignScene, ep2AlignOptions } from "@/content/episode2Align";
import EpisodeScene from "@/components/shared/EpisodeScene";

interface Ep2AlignSceneProps {
  userName: string;
}

/** **text** → <strong>text</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export function Ep2AlignScene({ userName: _userName }: Ep2AlignSceneProps) {
  const { episode2AlignChoice, setEpisode2AlignChoice } = useStore();

  return (
    <EpisodeScene
      title={ep2AlignScene.title}
      situation={ep2AlignScene.situation}
      dialogues={ep2AlignScene.dialogue.map((text) => ({ speaker: "회의 중", text }))}
    >
      <p className="text-lg font-extrabold text-black">
        [Action] {renderWithBold(ep2AlignScene.action)}
      </p>
      <div className="space-y-3">
        {ep2AlignOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setEpisode2AlignChoice(opt.id)}
            className={`w-full rounded-xl border bg-white p-4 text-left ${
              episode2AlignChoice === opt.id ? "border-black" : "border-gray-200"
            }`}
          >
            <p className="text-base font-bold text-black">옵션 {opt.id}. {opt.title}</p>
            <p className="mt-1 text-sm leading-7 text-black">{renderWithBold(opt.summary)}</p>
          </button>
        ))}
      </div>
    </EpisodeScene>
  );
}
