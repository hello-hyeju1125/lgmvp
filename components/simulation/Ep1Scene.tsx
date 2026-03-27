"use client";

import { useStore } from "@/store/useStore";
import { ep1Scene, ep1Options } from "@/content/episode1";
import EpisodeScene from "@/components/shared/EpisodeScene";

function replaceUserName(text: string, name: string) {
  return text.replace(/\{User_Name\}/g, name);
}

/** **text** → <strong>text</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

interface Ep1SceneProps {
  userName: string;
}

export function Ep1Scene({ userName }: Ep1SceneProps) {
  const { episode1Choice, setEpisode1Choice, ep1SceneRevealedQuotes, revealEp1SceneQuote } = useStore();

  const quoteLines = (lines: string[], revealKey: "first" | "second") => {
    const isRevealed = ep1SceneRevealedQuotes[revealKey];
    return (
      <div className="rounded-2xl border border-black/10 bg-gray-50 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div className="border-l-4 border-[#E4003F] pl-4">
          <p className="text-[13px] font-extrabold text-black/85">최성민 상무</p>

          {!isRevealed ? (
            <button
              type="button"
              onClick={() => revealEp1SceneQuote(revealKey)}
              className="group relative mt-3 w-full text-left"
              aria-label="대화 펼치기"
            >
              <div className="relative overflow-hidden rounded-xl bg-white/60 px-4 py-3 ring-1 ring-black/10 transition-all group-hover:bg-white/80 group-hover:ring-[#E4003F]/35">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[14px] font-extrabold text-black/70 underline decoration-black/15 decoration-dotted underline-offset-4 group-hover:decoration-[#E4003F]/50">
                      대화 내용 펼치기
                    </p>
                    <p className="mt-1 line-clamp-2 text-[14px] leading-[1.75] text-black/40 blur-[0.6px]">
                      {renderWithBold(replaceUserName(lines[0] ?? "", userName))}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#E4003F]/10 px-3 py-1 text-[12px] font-extrabold text-[#E4003F] ring-1 ring-black/10 transition group-hover:bg-[#E4003F]/15">
                    Click
                  </span>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(280px_120px_at_18%_35%,rgba(228,0,63,0.12),transparent_60%)] opacity-70" />
              </div>
            </button>
          ) : (
            lines.map((line, i) => (
              <p key={i} className="mt-2 text-[16px] leading-[1.85] text-black/80">
                {renderWithBold(replaceUserName(line, userName))}
              </p>
            ))
          )}
        </div>
      </div>
    );
  };

  const [firstQuote, narration, secondQuote] = ep1Scene.dialogue;

  return (
    <EpisodeScene title={ep1Scene.title} situation={ep1Scene.situation}>
      {firstQuote ? quoteLines([firstQuote], "first") : null}
      {narration ? <p className="text-base leading-7 text-black">{renderWithBold(replaceUserName(narration, userName))}</p> : null}
      {secondQuote ? quoteLines([secondQuote], "second") : null}
      <p className="text-lg font-extrabold text-black">[Action] {renderWithBold(ep1Scene.action)}</p>
      <div className="space-y-3">
        {ep1Options.map((opt) => (
          <button key={opt.id} type="button" onClick={() => setEpisode1Choice(opt.id)} className={`w-full rounded-xl border bg-white p-4 text-left ${episode1Choice === opt.id ? "border-black" : "border-gray-200"}`}>
            <p className="text-base font-bold text-black">옵션 {opt.id}. {opt.title}</p>
            <p className="mt-1 text-sm leading-7 text-black">{renderWithBold(opt.summary)}</p>
          </button>
        ))}
      </div>
    </EpisodeScene>
  );
}
