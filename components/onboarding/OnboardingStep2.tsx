"use client";

import { useState } from "react";
import Image from "next/image";
import { teamMembers, stakeholders } from "@/content/team";
import type { TeamMemberProfile, StakeholderProfile } from "@/content/team";

interface OnboardingStep2Props {
  onNext: () => void;
  userName: string;
}

type PersonCard = {
  id: string;
  name: string;
  roleLabel: string;
  team: string;
  quote: string;
  imagePath: string;
  group: string;
  type: "member" | "stakeholder";
  memberData?: TeamMemberProfile;
  stakeholderData?: StakeholderProfile;
};

type PopupData = PersonCard | null;

/** 2–3 paragraphs for scannability */
function splitIntoParagraphs(text: string, maxParagraphs = 3): string[] {
  const t = text.trim();
  if (!t) return [];
  const byNewline = t.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  if (byNewline.length >= 2) return byNewline.slice(0, maxParagraphs);
  const sentences = t.split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length <= 2) return [t];
  const n = Math.min(maxParagraphs, sentences.length);
  const chunk = Math.ceil(sentences.length / n);
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += chunk) {
    out.push(sentences.slice(i, i + chunk).join(" "));
  }
  return out.slice(0, maxParagraphs);
}

const avatarById: Record<string, string> = {
  kimhyukgi: "/images/characters/kimhyukgi.png",
  choisungmin: "/images/characters/choi.png",
  kimjihun: "/images/characters/kimjihun.png",
  parksojin: "/images/characters/parksojin.png",
  leeminsu: "/images/characters/leeminsu.png",
  choiyura: "/images/characters/choiyura.png",
  jungtaeyoung: "/images/characters/jungtaeyoung.png",
  sarahlee: "/images/characters/sarahlee.png",
};

const circlePalette = ["pop-bg-blue", "pop-bg-red", "pop-bg-yellow", "pop-bg-green", "pop-bg-purple", "neo-bg-blue"];

function shortRole(role: string) {
  return role.replace(/\s*\([^)]*\)\s*/g, "").trim();
}

function CharacterCard({
  card,
  index,
  cardBgClass,
  onClick,
}: {
  card: PersonCard;
  index: number;
  cardBgClass: string;
  onClick: () => void;
}) {
  const circleClass = circlePalette[index % circlePalette.length];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${cardBgClass} border-2 border-black p-6 text-center shadow-[6px_6px_0px_#111111] cursor-pointer transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_#111111]`}
      aria-label={`${card.group} ${card.name} 카드`}
    >
      <div className="flex flex-col items-center">
        <div className={`neo-no-bg relative h-24 w-24 shrink-0 rounded-full ${circleClass}`}>
          <div className="neo-no-bg absolute inset-1 overflow-hidden rounded-full border-4 border-black bg-transparent">
            <Image src={card.imagePath} alt={card.name} fill className="object-cover" />
          </div>
        </div>

        <p className="neo-display mt-4 text-2xl font-extrabold leading-none" style={{ WebkitTextStroke: "1px #111111" }}>
          {card.name}
        </p>
        <p className="mt-2 text-sm font-bold text-gray-600">{card.team}</p>
        <p className="mt-4 italic text-gray-800 leading-snug whitespace-pre-wrap">"{card.quote}"</p>
      </div>
    </button>
  );
}

export function OnboardingStep2({}: OnboardingStep2Props) {
  const [popup, setPopup] = useState<PopupData>(null);

  const fullTimeMembers = teamMembers.filter((m) => m.isFullTime);
  const partTimeMembers = teamMembers.filter((m) => !m.isFullTime);

  const leadershipCards: PersonCard[] = stakeholders.map((s) => ({
    id: s.id,
    name: `${s.name} ${s.role}`,
    roleLabel: s.id === "kimhyukgi" ? "프로젝트 스폰서 (C-Level)" : "프로젝트 챔피언 (담당 임원)",
    team: s.position,
    quote: s.quote,
    imagePath: avatarById[s.id] ?? "/images/characters/choi.png",
    group: "프로젝트 리더십",
    type: "stakeholder",
    stakeholderData: s,
  }));

  const residentCards: PersonCard[] = fullTimeMembers.map((m) => ({
    id: m.id,
    name: `${m.name} ${shortRole(m.role)}`,
    roleLabel: m.role,
    team: m.dept,
    quote: m.quote,
    imagePath: avatarById[m.id] ?? "/images/characters/choi.png",
    group: "상주 인원",
    type: "member",
    memberData: m,
  }));

  const partTimeCards: PersonCard[] = partTimeMembers.map((m) => ({
    id: m.id,
    name: `${m.name} ${shortRole(m.role)}`,
    roleLabel: m.role,
    team: m.dept,
    quote: m.quote,
    imagePath: avatarById[m.id] ?? "/images/characters/choi.png",
    group: "비상주 인원",
    type: "member",
    memberData: m,
  }));

  return (
    <div className="members-page min-h-screen p-8 bg-[#F0F0F0]">
      <div className="members-frame mx-auto max-w-7xl neo-no-bg border-4 border-black shadow-[12px_12px_0px_#111111] overflow-hidden">
        <div className="members-titlebar neo-no-bg border-b-4 border-black px-6 py-4 flex items-center justify-center relative">
          <div className="absolute left-6 flex space-x-2">
            <span className="title-dot-red h-4 w-4 rounded-full border-2 border-black" />
            <span className="title-dot-yellow h-4 w-4 rounded-full border-2 border-black" />
            <span className="title-dot-green h-4 w-4 rounded-full border-2 border-black" />
          </div>
          <h1 className="font-black text-2xl font-alice">주요 인물 소개</h1>
        </div>

        <div className="p-10 space-y-12 pb-24 bg-[#F0F0F0]">
          <section>
            <div className="inline-block leadership-sticker text-white border-2 border-black px-4 py-1 mb-6 shadow-[3px_3px_0px_#111111] font-black">
              프로젝트 리더십 (Sponsors)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {leadershipCards.map((c, idx) => (
                <CharacterCard key={c.id} card={c} index={idx} cardBgClass="pop-bg-sky-soft" onClick={() => setPopup(c)} />
              ))}
            </div>
          </section>

          <section>
            <div className="inline-block sticker-purple neo-text-white border-2 border-black px-4 py-1 mb-6 shadow-[3px_3px_0px_#111111] font-black">
              상주 인원 · 100% 투입
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {residentCards.map((c, idx) => (
                <CharacterCard key={c.id} card={c} index={idx + 2} cardBgClass="pop-bg-lilac-soft" onClick={() => setPopup(c)} />
              ))}
            </div>
          </section>

          <section>
            <div className="inline-block sticker-yellow border-2 border-black px-4 py-1 mb-6 shadow-[3px_3px_0px_#111111] font-black">
              비상주 인원 · Part-time
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partTimeCards.map((c, idx) => (
                <CharacterCard key={c.id} card={c} index={idx + 1} cardBgClass="pop-bg-yellow-soft" onClick={() => setPopup(c)} />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Comic-book panel modal */}
      {popup && (
        <div
          className="members-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPopup(null)}
          role="presentation"
        >
          <div
            className="members-popup members-popup-panel relative w-full max-w-5xl overflow-visible border-4 border-black shadow-[20px_20px_0px_#000000]"
            style={{ borderColor: "#111111", borderWidth: "4px", borderStyle: "solid" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-popup-title"
          >
            <section className="relative z-[1] flex flex-col items-stretch gap-0 lg:flex-row lg:items-end lg:pb-2 lg:pl-2 lg:pr-5 lg:pt-4">
              {/* Portrait — large, breaks out of frame on desktop */}
              <div className="relative flex shrink-0 justify-center px-4 pt-6 lg:w-[38%] lg:min-w-[220px] lg:justify-start lg:px-0 lg:pt-0">
                <div className="relative z-20 w-[78%] max-w-[280px] sm:max-w-[300px] lg:absolute lg:bottom-0 lg:left-0 lg:w-[125%] lg:max-w-[min(380px,42vw)] lg:translate-x-[-10%] lg:translate-y-[8%]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden border-4 border-black bg-[#1a1a1a] shadow-[14px_14px_0px_#000000]">
                    <Image
                      src={popup.imagePath}
                      alt={popup.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 300px, 380px"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Text stack — cream inset panel, SUIT body */}
              <div className="members-popup-comic-inner relative z-10 mx-4 mb-5 mt-2 flex min-h-0 min-w-0 flex-1 flex-col border-4 border-black p-8 shadow-[8px_8px_0px_#111111] sm:p-10 lg:mx-4 lg:mb-7 lg:mt-6 lg:ml-10">
                <p className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#2d4a6f]">{popup.group}</p>
                <h2 id="member-popup-title" className="neo-display mt-2 text-3xl font-extrabold leading-tight text-[#111] sm:text-4xl">
                  {popup.name}
                </h2>
                <p className="mt-2 font-sans text-sm font-bold text-neutral-800">{popup.roleLabel}</p>

                <div className="mt-7 space-y-6 font-sans text-lg font-medium leading-relaxed text-[#111]">
                  {splitIntoParagraphs(popup.quote, 3).map((para, i) => (
                    <p key={`q-${i}`} className="italic">
                      &ldquo;{para}&rdquo;
                    </p>
                  ))}
                </div>

                {popup.type === "member" && popup.memberData && (
                  <div className="mt-9 space-y-6 font-sans text-base font-medium leading-relaxed text-[#111]">
                    <p>
                      <span className="font-bold">기본 정보:</span>{" "}
                      {popup.memberData.age}세 / {popup.memberData.gender} / {popup.memberData.years}년 차
                    </p>
                    <p>
                      <span className="font-bold">기존 업무:</span>{" "}
                      {popup.memberData.dept} {popup.memberData.position}
                    </p>
                    {splitIntoParagraphs(popup.memberData.description, 3).map((para, i) => (
                      <p key={`d-${i}`}>
                        {i === 0 ? (
                          <>
                            <span className="font-bold">특징:</span> {para}
                          </>
                        ) : (
                          para
                        )}
                      </p>
                    ))}
                    <p>
                      <span className="font-black">#성격_해시태그:</span>{" "}
                      {popup.memberData.tags.join(" ")}
                    </p>
                  </div>
                )}

                {popup.type === "stakeholder" && popup.stakeholderData && (
                  <div className="mt-9 space-y-6 font-sans text-base font-medium leading-relaxed text-[#111]">
                    <p>
                      <span className="font-bold">소속:</span> {popup.stakeholderData.position}
                    </p>
                    {splitIntoParagraphs(popup.stakeholderData.description, 3).map((para, i) => (
                      <p key={`s-${i}`}>{para}</p>
                    ))}
                    <p>
                      <span className="font-black">#성격_해시태그:</span>{" "}
                      {popup.stakeholderData.tags.join(" ")}
                    </p>
                  </div>
                )}

                <div className="mt-10 flex justify-center border-t-2 border-dashed border-neutral-300 pt-8">
                  <button
                    type="button"
                    onClick={() => setPopup(null)}
                    className="inline-flex min-w-[200px] items-center justify-center border-4 border-black px-12 py-4 font-sans text-lg font-black text-[#111] shadow-[6px_6px_0px_#111111] transition duration-150 ease-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_#111111] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                    style={{ backgroundColor: "#89E586" }}
                  >
                    인물 파악 완료
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
