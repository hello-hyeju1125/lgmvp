"use client";

import { useState } from "react";
import Image from "next/image";
import { teamMembers, stakeholders } from "@/content/team";
import type { TeamMemberProfile, StakeholderProfile } from "@/content/team";
import { PrevNextNav } from "@/components/common/PrevNextNav";

interface OnboardingStep2Props {
  onNext: () => void;
  userName: string;
  prevHref?: string;
  nextHref?: string;
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
  kimhyukgi: "/kim-hyukki.jpg",
  choisungmin: "/choi-seongmin.jpg",
  kimjihun: "/kim-jihun.jpg",
  parksojin: "/park-sojin.jpg",
  leeminsu: "/lee-minsoo.jpg",
  choiyura: "/choi-yura.jpg",
  jungtaeyoung: "/jeong-taeyoung.jpg",
  sarahlee: "/sarah-lee.jpg",
};

function shortRole(role: string) {
  return role.replace(/\s*\([^)]*\)\s*/g, "").trim();
}

function SectionBadge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "green" | "red" }) {
  const colorClass =
    variant === "green"
      ? "s2-badge--green"
      : variant === "red"
        ? "s2-badge--red"
        : "";
  return (
    <div className={`s2-badge ${colorClass}`}>
      <span className="s2-badge-inner">• {children} •</span>
    </div>
  );
}

function SponsorCard({ card, onClick }: { card: PersonCard; onClick: () => void }) {
  return (
    <div className="relative mt-[60px]">
      <button
        type="button"
        onClick={onClick}
        className="s2-sponsor-card group relative flex w-full flex-col items-center overflow-visible text-center"
        aria-label={`${card.name} 상세 보기`}
      >
        <div className="s2-avatar s2-avatar--sponsor absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
          <Image src={card.imagePath} alt={card.name} fill className="object-cover" sizes="140px" />
        </div>
        <div className="s2-sponsor-body flex flex-1 flex-col items-center pt-[78px]">
          <h3 className="text-[20px] font-black text-[#111] sm:text-[22px]">{card.name}</h3>
          <p className="mt-1 text-[13px] font-semibold text-[#666] sm:text-[14px]">{card.team}</p>
          <div className="s2-quote s2-quote--sponsor mt-4 w-full">
            <p className="text-[13px] font-semibold leading-[1.7] text-[#333] sm:text-[14px]">
              &ldquo;{card.quote}&rdquo;
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

function MemberCard({ card, onClick, quoteTone }: { card: PersonCard; onClick: () => void; quoteTone: "blue" | "yellow" }) {
  return (
    <div className="relative mt-[50px]">
      <button
        type="button"
        onClick={onClick}
        className={`s2-member-card s2-member-card--${quoteTone} group relative flex w-full flex-col items-center overflow-visible text-center`}
        aria-label={`${card.name} 상세 보기`}
      >
        <div className={`s2-avatar s2-avatar--member s2-avatar--${quoteTone} absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2`}>
          <Image src={card.imagePath} alt={card.name} fill className="object-cover" sizes="120px" />
        </div>
        <div className="s2-member-body flex flex-1 flex-col items-center pt-[62px]">
          <h3 className="text-[18px] font-black text-[#111] sm:text-[20px]">{card.name}</h3>
          <p className="mt-1 text-[12px] font-semibold text-[#888] sm:text-[13px]">{card.team}</p>
          <div className={`s2-quote s2-quote--${quoteTone} mt-3 w-full`}>
            <p className="text-[12px] font-semibold leading-[1.7] text-[#444] sm:text-[13px]">
              &ldquo;{card.quote}&rdquo;
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

export function OnboardingStep2({ prevHref, nextHref }: OnboardingStep2Props) {
  const showFooterNav = Boolean(prevHref && nextHref);
  const [popup, setPopup] = useState<PopupData>(null);

  const fullTimeMembers = teamMembers.filter((m) => m.isFullTime);
  const partTimeMembers = teamMembers.filter((m) => !m.isFullTime);

  const leadershipCards: PersonCard[] = stakeholders.map((s) => ({
    id: s.id,
    name: `${s.name} ${s.role}`,
    roleLabel: s.id === "kimhyukgi" ? "프로젝트 스폰서 (C-Level)" : "프로젝트 챔피언 (담당 임원)",
    team: s.position,
    quote: s.quote,
    imagePath: avatarById[s.id] ?? "/choi-seongmin.jpg",
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
    imagePath: avatarById[m.id] ?? "/choi-seongmin.jpg",
    group: "상주 팀원",
    type: "member",
    memberData: m,
  }));

  const partTimeCards: PersonCard[] = partTimeMembers.map((m) => ({
    id: m.id,
    name: `${m.name} ${shortRole(m.role)}`,
    roleLabel: m.role,
    team: m.dept,
    quote: m.quote,
    imagePath: avatarById[m.id] ?? "/choi-seongmin.jpg",
    group: "비상주 팀원",
    type: "member",
    memberData: m,
  }));

  return (
    <div className="s2-page-wrapper flex min-h-0 flex-1 flex-col">
    <div className="s2-page relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6 sm:px-10">
      <div className="s2-inner mx-auto w-full max-w-6xl py-8 sm:py-10">
        {/* Title */}
        <div className="s2-anim mb-8 flex justify-center" style={{ animationDelay: "0ms" }}>
          <h1 className="s2-title-box inline-block border-2 border-black px-7 py-2.5 text-center font-sans text-[28px] font-extrabold text-black sm:px-10 sm:py-3 sm:text-[34px]">
            주요 인물 소개
          </h1>
        </div>
      </div>

      {/* Main content card — full width aligned with footer buttons */}
      <div className="mx-auto w-full max-w-6xl pb-8 sm:pb-10">
        <div className="s2-anim s2-content-card" style={{ animationDelay: "150ms" }}>

          {/* ── 프로젝트 리더십 ── */}
          <section className="s2-section px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12">
            <SectionBadge>프로젝트 리더십{"  "}</SectionBadge>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              {leadershipCards.map((c) => (
                <SponsorCard key={c.id} card={c} onClick={() => setPopup(c)} />
              ))}
            </div>
          </section>

          {/* ── 상주 팀원 + 비상주 팀원 ── */}
          <section className="px-5 pb-10 pt-4 sm:px-8 sm:pb-12">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
              {/* Left: 상주 팀원 */}
              <div>
                <SectionBadge variant="green">상주 팀원</SectionBadge>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {residentCards.map((c) => (
                    <MemberCard key={c.id} card={c} onClick={() => setPopup(c)} quoteTone="blue" />
                  ))}
                </div>
              </div>

              {/* Right: 비상주 팀원 */}
              <div>
                <div className="flex justify-center">
                  <SectionBadge variant="red">비상주 팀원</SectionBadge>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-4">
                  {partTimeCards.map((c) => (
                    <MemberCard key={c.id} card={c} onClick={() => setPopup(c)} quoteTone="yellow" />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Modal ── */}
      {popup && (
        <div
          className="s2-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPopup(null)}
          role="presentation"
        >
          <div
            className="s2-modal s2-anim relative w-full max-w-2xl overflow-hidden rounded-2xl border-[2.5px] border-[#222]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="s2-modal-title"
            style={{ animationDelay: "0ms" }}
          >
            {/* Header */}
            <div className="s2-modal-header ds-white-text flex items-center gap-5 px-6 py-5 sm:px-8 sm:py-6">
              <div className="s2-avatar s2-avatar--modal relative shrink-0">
                <Image src={popup.imagePath} alt={popup.name} fill className="object-cover" sizes="120px" />
              </div>
              <div className="min-w-0">
                <p className="ds-white-text text-[11px] font-bold uppercase tracking-widest sm:text-[12px]" style={{ opacity: 0.7 }}>{popup.group}</p>
                <h2 id="s2-modal-title" className="ds-white-text mt-1 text-[24px] font-black leading-tight sm:text-[28px]">
                  {popup.name}
                </h2>
                <p className="ds-white-text mt-1 text-[13px] font-semibold sm:text-[14px]" style={{ opacity: 0.8 }}>{popup.roleLabel}</p>
              </div>
            </div>

            {/* Body */}
            <div className="s2-modal-body px-6 py-6 sm:px-8 sm:py-7">
              {/* Quote */}
              <div className="s2-modal-quote-box mb-6">
                {splitIntoParagraphs(popup.quote, 3).map((para, i) => (
                  <p key={`q-${i}`} className="text-[15px] font-semibold italic leading-[1.8] text-[#333] sm:text-[16px]">
                    &ldquo;{para}&rdquo;
                  </p>
                ))}
              </div>

              {/* Info */}
              <div className="space-y-4 text-[14px] font-medium leading-[1.8] text-[#333] sm:text-[15px]">
                {popup.type === "member" && popup.memberData && (
                  <>
                    <div className="s2-modal-info-row">
                      <span className="s2-modal-label">기본 정보</span>
                      <span>{popup.memberData.age}세 / {popup.memberData.gender} / {popup.memberData.years}년 차</span>
                    </div>
                    <div className="s2-modal-info-row">
                      <span className="s2-modal-label">기존 업무</span>
                      <span>{popup.memberData.position}</span>
                    </div>
                    <div className="s2-modal-info-row">
                      <span className="s2-modal-label">특징</span>
                      <span>{popup.memberData.description}</span>
                    </div>
                    <div className="s2-modal-tags">
                      {popup.memberData.tags.map((tag, i) => (
                        <span key={i} className="s2-tag">{tag}</span>
                      ))}
                    </div>
                  </>
                )}

                {popup.type === "stakeholder" && popup.stakeholderData && (
                  <>
                    <div className="s2-modal-info-row">
                      <span className="s2-modal-label">소속</span>
                      <span>{popup.stakeholderData.position}</span>
                    </div>
                    <div className="s2-modal-info-row">
                      <span className="s2-modal-label">특징</span>
                      <span>{popup.stakeholderData.description}</span>
                    </div>
                    <div className="s2-modal-tags">
                      {popup.stakeholderData.tags.map((tag, i) => (
                        <span key={i} className="s2-tag">{tag}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Close */}
              <div className="mt-7 flex justify-center border-t border-[#e5e7eb] pt-6">
                <button
                  type="button"
                  onClick={() => setPopup(null)}
                  className="s2-modal-close-btn inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl border-2 border-black px-8 py-3 font-sans text-[15px] font-extrabold text-black shadow-[4px_4px_0_#111] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111]"
                >
                  인물 파악 완료 ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

      {showFooterNav && (
        <div className="relative z-30 shrink-0">
          <PrevNextNav prevHref={prevHref!} nextHref={nextHref!} />
        </div>
      )}
    </div>
  );
}
