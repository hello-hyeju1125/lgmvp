"use client";

import { useState } from "react";

interface SeniorTipsPanelProps {
  title: string;
  intro: string;
  stories: Array<{ title: string; text: string }>;
  prompt: string;
  placeholder: string;
  userName: string;
}

export default function SeniorTipsPanel({
  title,
  intro,
  stories,
  prompt,
  placeholder,
  userName,
}: SeniorTipsPanelProps) {
  const [openIdx, setOpenIdx] = useState<number[]>([]);
  const [note, setNote] = useState("");

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-extrabold text-black">{title}</h2>
      <p className="text-sm leading-7 text-black">{intro}</p>

      <div className="space-y-3">
        {stories.map((story, i) => (
          <article key={i} className="rounded-xl border border-gray-200 bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between p-4 text-left"
              onClick={() => setOpenIdx((prev) => (prev.includes(i) ? prev.filter((v) => v !== i) : [...prev, i]))}
            >
              <span className="text-sm font-extrabold text-black">{story.title}</span>
              <span className="text-black">{openIdx.includes(i) ? "▲" : "▼"}</span>
            </button>
            {openIdx.includes(i) ? <p className="border-t border-gray-200 p-4 text-sm leading-7 text-black">{story.text}</p> : null}
          </article>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm font-semibold text-black">{prompt.replace(/\{User_Name\}/g, userName || "리더")}</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-black outline-none"
        />
        <div className="flex justify-end">
          <button type="button" className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-black">
            제출하기
          </button>
        </div>
      </div>
    </section>
  );
}
