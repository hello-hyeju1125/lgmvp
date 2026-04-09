"use client";

import { useStore } from "@/store/useStore";
import type { Episode6Block } from "@/store/useStore";
import {
  ep6BoardComments,
  ep6Scene,
  ep6Block1Options,
  ep6Block2Options,
  ep6Block3Options,
} from "@/content/episode6";
import type { Ep6BoardComment, Ep6BlockOption } from "@/content/episode6";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

const EP6_REVEAL_STAGGER_MS = 110;
function ep6RevealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * EP6_REVEAL_STAGGER_MS}ms` };
}

const EP6_EMPTY_BLOCKS: Episode6Block = {
  block1: "",
  block2: "",
  block3: "",
  block4: "",
};

/** 블록 단계 라벨 — 한 줄로 읽히게, 세로 공간 최소화 */
function Ep6BlockStepBar({
  blockNum,
  children,
  style,
}: {
  blockNum: 1 | 2 | 3;
  children: ReactNode;
  style: CSSProperties;
}) {
  return (
    <div className="ep1-scene-reveal" style={style}>
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 border-b-2 border-black pb-2.5">
        <span className="shrink-0 rounded bg-[#111] px-2.5 py-1 font-sans text-[13px] font-black !text-[#ffffff] sm:text-[14px]">
          블록 {blockNum}
        </span>
        <h3 className="min-w-0 flex-1 font-sans text-[17px] font-black leading-snug tracking-tight text-[#0f172a] sm:text-[18px] md:text-[19px] [word-break:keep-all]">
          {children}
        </h3>
      </div>
    </div>
  );
}

/** 컴팩트 단일 선택 리스트 — 스캔·클릭 영역 최적화 */
function Ep6BlockPickList({
  legend,
  options,
  selectedId,
  onSelect,
  firstRowDelayStep,
}: {
  legend: string;
  options: Ep6BlockOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  firstRowDelayStep: number;
}) {
  return (
    <fieldset className="overflow-hidden rounded-lg border-2 border-black/25 bg-white shadow-[2px_2px_0_0_rgba(17,17,17,0.1)]">
      <legend className="sr-only">{legend}</legend>
      <div className="divide-y divide-black/[0.08]">
        {options.map((o, idx) => {
          const selected = selectedId === o.id;
          const ariaDetail = o.detail ? ` ${o.detail}` : "";
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={selected}
              aria-label={`${legend}: 항목 ${o.id}, ${o.headline}.${ariaDetail}`}
              style={ep6RevealDelay(firstRowDelayStep + idx)}
              className={`ep1-scene-reveal flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors sm:gap-3.5 sm:px-3.5 sm:py-3 ${
                selected
                  ? "!bg-[#fff7ed] ring-2 ring-inset ring-[#FF7A00]"
                  : "hover:bg-slate-50 active:bg-slate-100/90"
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black`}
              onClick={() => onSelect(o.id)}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-black/10 font-sans text-[12px] font-black tabular-nums sm:h-9 sm:w-9 sm:text-[14px] ${
                  selected ? "!bg-[#FF7A00] !text-black" : "bg-zinc-900 !text-[#ffffff]"
                }`}
                aria-hidden
              >
                {o.id}
              </span>
              <span className="min-w-0 flex-1 pt-0.5">
                <span className="block font-sans text-[16px] font-bold leading-snug text-[#111] sm:text-[17px] md:text-[18px] [overflow-wrap:anywhere] [word-break:keep-all]">
                  {o.headline}
                </span>
                {o.detail ? (
                  <span className="mt-1 block font-sans text-[14px] font-medium leading-snug text-[#64748b] sm:text-[15px] [overflow-wrap:anywhere] [word-break:keep-all]">
                    {o.detail}
                  </span>
                ) : null}
              </span>
              <span
                className={`mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-black/20 sm:mt-2.5 ${
                  selected ? "!border-black !bg-[#FF7A00]" : "border-zinc-300 bg-white"
                }`}
                aria-hidden
              >
                {selected ? <span className="h-2.5 w-2.5 rounded-full bg-black" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function renderDialogueBold(paragraph: string): ReactNode {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold !text-[#FF7A00]">
        {p}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function Ep6BoardCommentRow({ row, isLast }: { row: Ep6BoardComment; isLast: boolean }) {
  return (
    <article
      className={`flex gap-4 rounded-xl border border-black/[0.08] bg-white p-3.5 shadow-[0_1px_0_rgba(15,23,42,0.06)] sm:gap-5 sm:p-4 ${
        !isLast ? "mb-3" : ""
      }`}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white shadow-[0_2px_8px_rgba(15,23,42,0.12)] sm:h-20 sm:w-20">
        <Image
          src={row.avatarSrc}
          alt={row.avatarAlt}
          fill
          className="object-contain object-center"
          sizes="(max-width: 640px) 64px, 80px"
        />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <header className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-sans text-[14px] font-extrabold text-[#0f172a] sm:text-[15px]">{row.author}</span>
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-sans text-[11px] font-semibold text-slate-600 sm:text-[12px]">
            {row.role}
          </span>
          <span className="font-sans text-[11px] font-medium tabular-nums text-[#94a3b8] sm:text-[12px]">{row.timeAgo}</span>
        </header>
        <p className="mt-2 font-sans text-[14px] font-medium leading-[1.75] text-[#334155] sm:text-[15px] [overflow-wrap:anywhere] [word-break:keep-all]">
          {row.body}
        </p>
      </div>
    </article>
  );
}

interface Ep6PingpongSceneProps {
  userName: string;
}

export function Ep6PingpongScene({ userName }: Ep6PingpongSceneProps) {
  const { nickname, episode6Blocks, setEpisode6Blocks } = useStore();
  const displayName = nickname || userName || "PM";

  const b = episode6Blocks ?? EP6_EMPTY_BLOCKS;

  const patch = (partial: Partial<Episode6Block>) => {
    setEpisode6Blocks({ ...(episode6Blocks ?? EP6_EMPTY_BLOCKS), ...partial });
  };

  const boardThread = ep6BoardComments.map((c) => ({
    ...c,
    body: c.body.replace("@User_Name", displayName),
  }));

  return (
    <section className="ep1-scene-layout w-full min-w-0 max-w-none space-y-8 sm:space-y-10">
      <div className="initiation-action-page mb-8 w-full sm:mb-10">
        <div className="flex justify-center px-2">
          <p
            className="ep1-scene-reveal initiation-brief-badge w-full max-w-[min(100%,52rem)] shadow-[6px_6px_0_#111111]"
            style={ep6RevealDelay(0)}
          >
            {ep6Scene.title}
          </p>
        </div>
      </div>

      <div className="space-y-2 px-2 text-center">
        <p
          className="ep1-scene-reveal whitespace-pre-line font-sans text-[19px] font-bold leading-relaxed text-[#111] sm:text-[21px]"
          style={ep6RevealDelay(1)}
        >
          {renderDialogueBold(ep6Scene.situation)}
        </p>
      </div>

      <div
        className="ep1-scene-reveal overflow-hidden rounded-2xl border-2 border-black/10 bg-[#f1f5f9] text-left shadow-[4px_4px_0_0_#111111] sm:rounded-[14px]"
        style={ep6RevealDelay(2)}
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#111] font-sans text-[18px] text-[#ffffff] shadow-[2px_2px_0_0_rgba(0,0,0,0.15)]"
              aria-hidden
            >
              💬
            </span>
            <div className="min-w-0">
              <p className="font-sans text-[14px] font-extrabold leading-tight text-[#111] sm:text-[15px]">
                프로젝트 보드 댓글 히스토리
              </p>
              <p className="mt-0.5 font-sans text-[11px] font-medium text-[#64748b] sm:text-[12px]">
                티켓 스레드 · 최신순
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-[#E4003F]/10 px-2.5 py-1 font-sans text-[11px] font-extrabold text-[#E4003F] ring-1 ring-[#E4003F]/25">
            최근 업데이트
          </span>
        </div>
        <div className="space-y-0 px-2 py-3 sm:px-3 sm:py-4">
          {boardThread.map((row, i) => (
            <Ep6BoardCommentRow
              key={`${row.author}-${row.timeAgo}-${i}`}
              row={row}
              isLast={i === boardThread.length - 1}
            />
          ))}
        </div>
      </div>

      <div
        className="ep1-scene-reveal rounded-xl bg-[#eceeef] px-5 py-5 text-center sm:px-7 sm:py-6"
        style={ep6RevealDelay(3)}
      >
        <p className="whitespace-pre-line font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
          {renderDialogueBold(ep6Scene.systemPrompt)}
        </p>
      </div>

      <div className="space-y-3 px-1 pt-2 text-center !mt-8 sm:!mt-10 mb-8 sm:mb-10">
        <p
          className="ep1-scene-reveal font-sans text-[56px] font-black leading-none text-black sm:text-[72px]"
          style={ep6RevealDelay(4)}
        >
          Q.
        </p>
        <div
          className="ep1-scene-reveal mx-auto w-full max-w-[min(100%,96rem)] space-y-3 px-1 font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]"
          style={ep6RevealDelay(5)}
        >
          <p className="max-lg:whitespace-normal lg:whitespace-nowrap">
            누구에게, 어디서, 어떤 톤으로 전달할지 세 가지 블록을 각각 하나씩 고르세요.
          </p>
          <p className="max-lg:whitespace-normal lg:whitespace-nowrap">
            <span className="font-bold !text-[#FF7A00]">조합을 마친 뒤 다음을 눌러 결과를 확인합니다.</span>
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl space-y-5 px-1 pb-6 sm:space-y-6 sm:px-2 sm:pb-8">
        {/* 블록 1 */}
        <div className="space-y-2">
          <Ep6BlockStepBar blockNum={1} style={ep6RevealDelay(6)}>
            소통 대상 - 누구에게 연락하시겠습니까?
          </Ep6BlockStepBar>
          <Ep6BlockPickList
            legend="블록 1"
            options={ep6Block1Options}
            selectedId={b.block1}
            onSelect={(id) => patch({ block1: id })}
            firstRowDelayStep={7}
          />
        </div>

        {/* 블록 2 */}
        <div className="space-y-2 pt-1">
          <Ep6BlockStepBar blockNum={2} style={ep6RevealDelay(11)}>
            소통 채널 — 어디서 이야기하시겠습니까?
          </Ep6BlockStepBar>
          <Ep6BlockPickList
            legend="블록 2"
            options={ep6Block2Options}
            selectedId={b.block2}
            onSelect={(id) => patch({ block2: id })}
            firstRowDelayStep={12}
          />
        </div>

        {/* 블록 3 */}
        <div className="space-y-2 pt-1">
          <Ep6BlockStepBar blockNum={3} style={ep6RevealDelay(18)}>
            소통 톤 — 어떤 태도로 접근하시겠습니까?
          </Ep6BlockStepBar>
          <Ep6BlockPickList
            legend="블록 3"
            options={ep6Block3Options}
            selectedId={b.block3}
            onSelect={(id) => patch({ block3: id })}
            firstRowDelayStep={19}
          />
        </div>

      </div>
    </section>
  );
}
