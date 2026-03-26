"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import {
  ep6Scene,
  ep6Block1Options,
  ep6Block2Options,
  ep6Block3Options,
  ep6Block4Options,
} from "@/content/episode6";
import { useEffect } from "react";

interface Ep6PingpongSceneProps {
  userName: string;
}

export function Ep6PingpongScene({ userName }: Ep6PingpongSceneProps) {
  const { nickname, episode6Blocks, setEpisode6Blocks } = useStore();
  const [b1, setB1] = useState(episode6Blocks?.block1 ?? "B");
  const [b2, setB2] = useState(episode6Blocks?.block2 ?? "E");
  const [b3, setB3] = useState(episode6Blocks?.block3 ?? "D");
  const [b4, setB4] = useState(episode6Blocks?.block4 ?? "B");

  const displayName = nickname || userName || "PM";
  const commentsWithName = ep6Scene.comments.map((line) =>
    line.replace("@User_Name", displayName)
  );

  function renderWithBold(paragraph: string) {
    const parts = paragraph.split(/\*\*(.+?)\*\*/g);
    return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
  }

  useEffect(() => {
    setEpisode6Blocks({ block1: b1, block2: b2, block3: b3, block4: b4 });
  }, [b1, b2, b3, b4, setEpisode6Blocks]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black/90">{ep6Scene.title}</h2>
      <p className="text-[18px] font-extrabold leading-[1.85] text-black/90">
        <span className="text-black/90">[Situation]</span> {renderWithBold(ep6Scene.situation)}
      </p>

      <div className="rounded-2xl border border-black/10 bg-gray-50 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-extrabold text-black/85">프로젝트 보드 댓글 히스토리</p>
          <span className="rounded-full bg-[#E4003F]/10 px-2.5 py-1 text-[11px] font-extrabold text-[#E4003F] ring-1 ring-[#E4003F]/20">
            최근 업데이트
          </span>
        </div>
        <div className="mt-3 space-y-2.5">
          {commentsWithName.map((line, i) => {
            const payload = line.replace(/^💬\s*/, "");
            const sepIdx = payload.indexOf(":");
            const head = sepIdx >= 0 ? payload.slice(0, sepIdx).trim() : payload;
            const body = sepIdx >= 0 ? payload.slice(sepIdx + 1).trim() : "";
            const timeMatch = head.match(/\(([^)]+)\)\s*$/);
            const meta = timeMatch?.[1] ?? "";
            const author = head.replace(/\s*\([^)]+\)\s*$/, "").trim();
            const initial = author.charAt(0) || "U";
            return (
              <div key={i} className="flex items-start gap-3 px-1 py-2">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E4003F]/12 text-[12px] font-extrabold text-[#A2002D] ring-1 ring-[#E4003F]/20">
                  {initial}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-[13px] font-extrabold text-black/85">{author}</p>
                    {meta && <p className="text-[12px] font-medium text-black/45">{meta}</p>}
                  </div>
                  <p className="mt-1 text-[14px] leading-[1.75] text-black/75">{body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[18px] font-extrabold leading-[1.85] text-black/90">{renderWithBold(ep6Scene.systemPrompt)}</p>

      <div className="py-[1.8rem] flex items-center" aria-hidden="true">
        <div className="h-px w-full bg-black/10" />
      </div>

      <p className="text-[18px] font-extrabold leading-[1.85] text-black/90">
        <span className="text-black/90">[Action]</span> 블록을 조합해 커뮤니케이션 전략을 완성하세요.
      </p>

      <div className="space-y-10">
        <section>
          <p className="mb-3 text-[16px] font-extrabold text-black/85">블록 1. 누구에게 연락하시겠습니까?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {ep6Block1Options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setB1(o.id)}
                className={`w-full rounded-2xl border-2 bg-white p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${
                  b1 === o.id ? "border-[#E4003F] shadow-[0_14px_50px_rgba(228,0,63,0.14)]" : "border-black/10 hover:border-[#E4003F]"
                }`}
              >
                <p className="text-[16px] font-bold text-gray-900">블록 1-{o.id}</p>
                <p className="mt-1 text-[15px] leading-[1.75] text-gray-600">{o.label}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 text-[16px] font-extrabold text-black/85">블록 2. 소통 채널 - 어디서 이야기하시겠습니까?</p>
          <div className="space-y-3">
            {ep6Block2Options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setB2(o.id)}
                className={`w-full rounded-2xl border-2 bg-white p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${
                  b2 === o.id ? "border-[#E4003F] shadow-[0_14px_50px_rgba(228,0,63,0.14)]" : "border-black/10 hover:border-[#E4003F]"
                }`}
              >
                <p className="text-[16px] font-bold text-gray-900">블록 2-{o.id}</p>
                <p className="mt-1 text-[15px] leading-[1.75] text-gray-600">{o.label}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 text-[16px] font-extrabold text-black/85">블록 3. 소통 톤 - 어떤 태도로 접근하시겠습니까?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {ep6Block3Options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setB3(o.id)}
                className={`w-full rounded-2xl border-2 bg-white p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${
                  b3 === o.id ? "border-[#E4003F] shadow-[0_14px_50px_rgba(228,0,63,0.14)]" : "border-black/10 hover:border-[#E4003F]"
                }`}
              >
                <p className="text-[16px] font-bold text-gray-900">블록 3-{o.id}</p>
                <p className="mt-1 text-[15px] leading-[1.75] text-gray-600">{o.label}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 text-[16px] font-extrabold text-black/85">블록 4. 소통 내용 - 핵심 지시/요청 사항은 무엇입니까?</p>
          <div className="space-y-3">
            {ep6Block4Options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setB4(o.id)}
                className={`w-full rounded-2xl border-2 bg-white p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${
                  b4 === o.id ? "border-[#E4003F] shadow-[0_14px_50px_rgba(228,0,63,0.14)]" : "border-black/10 hover:border-[#E4003F]"
                }`}
              >
                <p className="text-[16px] font-bold text-gray-900">블록 4-{o.id}</p>
                <p className="mt-1 text-[15px] leading-[1.75] text-gray-600">{o.label}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
