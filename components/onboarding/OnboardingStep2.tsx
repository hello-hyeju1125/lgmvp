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

      {/* Floating popup */}
      {popup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-[2px]"
          onClick={() => setPopup(null)}
          role="dialog"
          aria-modal="true"
          aria-label="인물 상세 정보"
        >
          <div
            className="members-popup max-w-4xl w-[96%] bg-white border-4 border-black shadow-[20px_20px_0px_#111111] p-8"
            style={{ borderColor: "#111111", borderWidth: "4px", borderStyle: "solid" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-bold text-gray-600">{popup.group}</p>
            <h3 className="neo-display mt-1 text-4xl font-extrabold">{popup.name}</h3>
            <p className="mt-2 text-lg font-bold text-gray-600">{popup.roleLabel}</p>
            <p className="mt-5 italic text-xl text-gray-800 leading-relaxed whitespace-pre-wrap">"{popup.quote}"</p>

            {popup.type === "member" && popup.memberData && (
              <div className="mt-6 space-y-3 text-base text-gray-800 leading-relaxed">
                <p><strong>기본 정보:</strong> {popup.memberData.age}세 / {popup.memberData.gender} / {popup.memberData.years}년 차</p>
                <p><strong>기존 업무:</strong> {popup.memberData.dept} {popup.memberData.position}</p>
                <p><strong>특징:</strong> {popup.memberData.description}</p>
                <p><strong>#성격_해시태그:</strong> {popup.memberData.tags.join(" ")}</p>
              </div>
            )}

            {popup.type === "stakeholder" && popup.stakeholderData && (
              <div className="mt-6 space-y-3 text-base text-gray-800 leading-relaxed">
                <p><strong>소속:</strong> {popup.stakeholderData.position}</p>
                <p><strong>특징:</strong> {popup.stakeholderData.description}</p>
                <p><strong>#성격_해시태그:</strong> {popup.stakeholderData.tags.join(" ")}</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
