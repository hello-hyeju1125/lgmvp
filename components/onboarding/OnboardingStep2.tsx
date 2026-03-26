"use client";

import { useState } from "react";
import Image from "next/image";
import { teamMembers, stakeholders } from "@/content/team";
import type { TeamMemberProfile } from "@/content/team";
import type { StakeholderProfile } from "@/content/team";

interface OnboardingStep2Props {
  onNext: () => void;
  userName: string;
}

/** DiceBear Lorelei – 일러스트 캐릭터 (동일 seed = 동일 캐릭터) */
function getAvatarUrl(seed: string, size = 120): string {
  return `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(seed)}&size=${size}`;
}

const fullTimeMembers = teamMembers.filter((m) => m.isFullTime);
const partTimeMembers = teamMembers.filter((m) => !m.isFullTime);

function normalizeTeamName(teamName: string) {
  return teamName.replace(/^\((.*)\)$/, "$1");
}

function stripParens(text: string) {
  return text.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
}

function MemberCard({
  member,
  badge,
  onClick,
}: {
  member: TeamMemberProfile;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#E0E0E0] bg-white text-left shadow-sm transition-all hover:border-[#C5C5C5] hover:shadow-md"
    >
      <div className="relative flex flex-col items-center bg-gradient-to-b from-[#F8F9FC] to-white pt-5 pb-3">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white shadow-md ring-1 ring-[#E5E5E5]">
          <Image
            src={getAvatarUrl(member.id)}
            alt=""
            width={96}
            height={96}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
        {badge && (
          <span className="absolute right-2 top-2 rounded bg-[#6B7280] px-2 py-0.5 text-[10px] font-medium text-white">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col items-center gap-1.5 px-3 pb-4 pt-2 text-center">
        <p className="text-[16px] font-extrabold tracking-tight text-[#1F2937]">
          {member.name}
        </p>
        <p className="text-[13px] font-semibold text-[#6B7280]">
          {normalizeTeamName(member.dept)}
        </p>
        <p className="line-clamp-2 text-[13px] leading-snug text-[#6B7280] italic">
          &quot;{member.quote}&quot;
        </p>
      </div>
    </button>
  );
}

function StakeholderCard({
  stakeholder,
  label,
  onClick,
}: {
  stakeholder: StakeholderProfile;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#E0E0E0] bg-white text-left shadow-sm transition-all hover:border-[#C5C5C5] hover:shadow-md"
    >
      <div className="relative flex flex-col items-center bg-gradient-to-b from-[#F8F9FC] to-white pt-5 pb-3">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white shadow-md ring-1 ring-[#E5E5E5]">
          <Image
            src={getAvatarUrl(stakeholder.id)}
            alt=""
            width={96}
            height={96}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center gap-1.5 px-3 pb-4 pt-2 text-center">
        <p className="text-[16px] font-extrabold tracking-tight text-[#1F2937]">
          {stakeholder.name} {stakeholder.role}
        </p>
        <p className="text-[13px] font-semibold text-[#6B7280]">
          {label}
        </p>
        <p className="line-clamp-2 text-[13px] leading-snug text-[#6B7280] italic">
          &quot;{stakeholder.quote}&quot;
        </p>
      </div>
    </button>
  );
}

export function OnboardingStep2({}: OnboardingStep2Props) {
  const [popup, setPopup] = useState<
    | { type: "member"; data: TeamMemberProfile }
    | { type: "stakeholder"; data: StakeholderProfile; label: string }
    | null
  >(null);

  const headerTheme =
    popup?.type === "stakeholder"
      ? {
          headerClass: "bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F]",
          nameClass: "text-white",
          subClass: "text-white/85",
          avatarClass: "border-white/40 shadow-lg",
        }
      : popup?.type === "member"
        ? {
            headerClass:
              "bg-[#6b6b6b] bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.16),transparent_60%),linear-gradient(120deg,rgba(0,0,0,0.12),rgba(0,0,0,0.0))]",
            nameClass: "text-white",
            subClass: "text-white/85",
            avatarClass: "border-white/50 shadow-lg",
          }
        : {
            headerClass: "bg-gradient-to-b from-[#F8F9FC] to-white",
            nameClass: "text-[#1F2937]",
            subClass: "text-[#666]",
            avatarClass: "border-white shadow-md ring-2 ring-[#E5E5E5]",
          };

  return (
    <div className="flex flex-col bg-transparent">
      <header className="flex-shrink-0 border-b border-white/10 bg-black/45 px-6 backdrop-blur-md">
        <div className="mx-auto w-full max-w-4xl py-4">
          <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)]">
            프로젝트 구성원
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-2xl border border-[#E4003F]/25 bg-white/90 px-4 py-3 text-center shadow-[0_18px_60px_rgba(0,0,0,0.25)] backdrop-blur-md">
            <p className="text-[14px] sm:text-[15px] font-semibold text-black/85">
              아래 프로필 카드를 클릭하여, <span className="font-extrabold text-[#E4003F]">핵심 인물</span>의 정보를 숙지합니다.
            </p>
          </div>
          <section className="rounded-3xl border border-white/15 bg-white/95 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-[#E4003F]">
                  상주 인원 <span className="font-semibold text-black/55">· 100% 투입 (4명)</span>
                </h2>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {fullTimeMembers.map((m) => (
                <MemberCard key={m.id} member={m} onClick={() => setPopup({ type: "member", data: m })} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/15 bg-white/95 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-[#E4003F]">
                  비상주 인원 <span className="font-semibold text-black/55">· 주 1~2회 Part-time 투입 (2명)</span>
                </h2>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {partTimeMembers.map((m) => (
                <MemberCard key={m.id} member={m} onClick={() => setPopup({ type: "member", data: m })} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/15 bg-white/95 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-[#E4003F]">
                  관련 임원 <span className="font-semibold text-black/55">· Key Stakeholders</span>
                </h2>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stakeholders.map((s, i) => {
                const label = i === 0 ? "프로젝트 스폰서 (C-Level)" : "프로젝트 챔피언 (담당 임원)";
                return (
                  <StakeholderCard
                    key={s.id}
                    stakeholder={s}
                    label={label}
                    onClick={() => setPopup({ type: "stakeholder", data: s, label })}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {popup && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPopup(null)}
          role="dialog"
          aria-modal="true"
          aria-label="구성원 상세 정보"
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${headerTheme.headerClass} px-6 pt-6 pb-8`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`overflow-hidden rounded-full border-4 ${headerTheme.avatarClass}`}
                >
                  <Image
                    src={getAvatarUrl(popup.data.id, 160)}
                    alt=""
                    width={160}
                    height={160}
                    className="h-40 w-40 object-cover"
                    unoptimized
                  />
                </div>
                <p
                  className={`mt-3 text-center text-[24px] font-bold tracking-tight ${headerTheme.nameClass}`}
                >
                  {popup.type === "member"
                    ? stripParens(`${popup.data.name} ${popup.data.role}`)
                    : `${popup.data.name} ${popup.data.role}`}
                </p>
                {popup.type === "member" && (
                  <p className={`mt-1 text-[14px] ${headerTheme.subClass}`}>
                    {normalizeTeamName(popup.data.dept)}
                  </p>
                )}
                <p
                  className={`mt-4 text-center text-[15px] italic leading-[1.6] ${headerTheme.subClass}`}
                >
                  &quot;{popup.data.quote}&quot;
                </p>
              </div>
            </div>

            <div className="border-t border-[#eaeaea]" />

            <div className="space-y-4 px-6 py-5">
              {popup.type === "member" ? (
                <>
                  <div className="rounded-xl bg-[#f8f9fa] p-4">
                    <dl>
                      <div className="mb-4">
                        <dt className="text-[13px] font-bold text-[#1e293b]">기본 정보</dt>
                        <dd className="mt-1.5 text-[15px] leading-[1.6] text-[#333]">
                        {popup.data.age}세 / {popup.data.gender} / {popup.data.years}년 차
                        </dd>
                      </div>
                      <div className="mb-4">
                        <dt className="text-[13px] font-bold text-[#1e293b]">기존 업무</dt>
                        <dd className="mt-1.5 text-[15px] leading-[1.6] text-[#333]">
                        {normalizeTeamName(popup.data.dept)} {popup.data.position}
                        </dd>
                      </div>
                      <div className="mb-4">
                        <dt className="text-[13px] font-bold text-[#1e293b]">특징</dt>
                        <dd className="mt-1.5 whitespace-pre-line text-[15px] leading-[1.6] text-[#333]">
                        {popup.data.description}
                        </dd>
                      </div>
                      <div>
                        <dd className="flex flex-wrap gap-2">
                          {popup.data.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-[16px] bg-[#f1f3f5] px-[10px] py-1 text-[13px] font-semibold text-[#555]"
                            >
                              {t}
                            </span>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-[#f8f9fa] p-4">
                    <dl>
                      <div className="mb-4">
                        <dt className="text-[13px] font-bold text-[#1e293b]">소속</dt>
                        <dd className="mt-1.5 text-[15px] leading-[1.6] text-[#333]">{popup.data.position}</dd>
                      </div>
                      <div className="mb-4">
                        <dt className="text-[13px] font-bold text-[#1e293b]">특징</dt>
                        <dd className="mt-1.5 whitespace-pre-line text-[15px] leading-[1.6] text-[#333]">
                        {popup.data.description}
                        </dd>
                      </div>
                      <div>
                        <dd className="flex flex-wrap gap-2">
                          {popup.data.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-[16px] bg-[#f1f3f5] px-[10px] py-1 text-[13px] font-semibold text-[#555]"
                            >
                              {t}
                            </span>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => setPopup(null)}
                className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white text-[14px] font-semibold text-[#374151] transition hover:bg-[#F3F4F6] active:scale-[0.99]"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
