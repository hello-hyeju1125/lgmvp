"use client";

import React from "react";

export interface SceneDialogue {
  speaker: string;
  text: string;
}

interface EpisodeSceneProps {
  title: string;
  situation: string;
  dialogues?: SceneDialogue[];
  onNext?: () => void;
  children?: React.ReactNode;
}

function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export default function EpisodeScene({
  title,
  situation,
  dialogues = [],
  onNext,
  children,
}: EpisodeSceneProps) {
  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-black sm:text-3xl">{title}</h2>
      <p className="text-lg font-extrabold leading-8 text-black">
        <span>[Situation]</span> {renderWithBold(situation)}
      </p>

      {dialogues.length ? (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5">
          {dialogues.map((d, idx) => (
            <div key={`${d.speaker}-${idx}`} className="space-y-1 border-l border-gray-200 pl-4">
              <p className="text-sm font-extrabold text-black">{d.speaker}</p>
              <p className="text-base leading-8 text-black">{renderWithBold(d.text)}</p>
            </div>
          ))}
        </div>
      ) : null}

      {children}

      {onNext ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-black"
          >
            다음
          </button>
        </div>
      ) : null}
    </section>
  );
}
