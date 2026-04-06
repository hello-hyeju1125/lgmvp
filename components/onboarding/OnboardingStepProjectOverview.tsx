"use client";

import React from "react";
import { PrevNextNav } from "@/components/common/PrevNextNav";
import {
  AlertCircle,
  Wrench,
  TrendingDown,
  Sparkles,
  Zap,
  Lightbulb,
} from "lucide-react";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="po-section-badge mb-6 flex justify-center">
      <span className="po-section-badge-inner inline-block rounded-none border-[2px] px-7 py-2.5 font-sans text-[20px] font-bold tracking-wide sm:px-9 sm:py-3 sm:text-[23px]">
        • {children} •
      </span>
    </div>
  );
}

interface OnboardingStepProjectOverviewProps {
  prevHref?: string;
  nextHref?: string;
}

const backgroundItems = [
  {
    icon: <AlertCircle size={26} strokeWidth={2.25} />,
    title: "파편화된 고객 데이터",
    desc: "전 세계 다양한 채널에서 수집되는 글로벌 VOC 데이터가 부서별로 산재되어 있어 전사적인 통합 관리가 부재한 상황입니다.",
  },
  {
    icon: <Wrench size={26} strokeWidth={2.25} />,
    title: "비효율적인 수작업",
    desc: "실무진이 방대한 양의 데이터를 일일이 수작업으로 취합하고 분류하느라 불필요한 리소스 낭비와 병목 현상이 발생하고 있습니다.",
  },
  {
    icon: <TrendingDown size={26} strokeWidth={2.25} />,
    title: "시장 대응력 약화",
    desc: "데이터 분석 지연으로 인해 급변하는 고객의 숨은 니즈를 파악하지 못하고, 글로벌 시장 트렌드 변화에 기민하게 대응하지 못하고 있습니다.",
  },
];

const purposeItems = [
  {
    icon: <Sparkles size={26} strokeWidth={2.25} />,
    title: "AI 기반 통합 체계",
    desc: "최신 AI 기술을 도입하여 전 세계에 흩어진 고객의 목소리를 자동으로 수집, 분류, 감성 분석하는 통합 시스템을 마련합니다.",
  },
  {
    icon: <Zap size={26} strokeWidth={2.25} />,
    title: "처리 효율성 극대화",
    desc: "기존의 수작업 위주 프로세스를 자동화하여, 현업 부서의 데이터 처리 공수를 획기적으로 단축합니다.",
  },
  {
    icon: <Lightbulb size={26} strokeWidth={2.25} />,
    title: "실시간 인사이트",
    desc: "분석된 데이터를 바탕으로 실시간 인사이트를 도출하여, 데이터 기반의 신속하고 정확한 의사결정 체계를 지원합니다.",
  },
];

const kpiGroups = [
  {
    label: "Work Management",
    tone: "work" as const,
    items: [
      {
        subtitle: "Quality",
        title: "산출물 품질",
        desc: "\"현업이 즉시 활용하며 만족할 수 있는 실효성 높고 완성도 있는 AI 대시보드를 구축하였는가?\" 현업(CS/마케팅)의 데이터 처리 공수를 30% 이상 단축할 수 있는 'AI VOC 대시보드' 프로토타입의 정상 구동 및 아웃풋의 완성도를 평가합니다.\n\u00a0",
      },
      {
        subtitle: "Delivery",
        title: "일정 준수",
        desc: "\"주어진 제한 시간 내에 지연 없이 프로젝트 마일스톤을 달성하고 결과물을 적기에 납품하였는가?\" 프로젝트 착수부터 대시보드 프로토타입 오픈까지의 전체 일정을 체계적으로 관리하여, '6개월'이라는 기한 내에 목표를 완수하는 진척도 관리 역량을 평가합니다.",
      },
    ],
  },
  {
    label: "People Management",
    tone: "people" as const,
    items: [
      {
        subtitle: "Team Engagement",
        title: "팀 몰입도",
        desc: "\"팀원들의 잠재력을 발굴하고, 하나의 목표를 향해 자발적으로 몰입하는 팀 문화를 만들었는가?\" People Manager로서 프로젝트 팀원 개개인의 동기를 부여하고 역량을 끌어올려, '팀 몰입도 80% 이상'의 주도적이고 건강한 조직 문화를 조성하는 것을 목표로 합니다.",
      },
      {
        subtitle: "Stakeholder Alignment",
        title: "이해관계자 조율",
        desc: "\"이해관계가 얽힌 유관부서 및 상위 조직과의 갈등을 해결하고, 적극적인 협조와 지원을 이끌어냈는가?\" CS, 마케팅 등 타 부서와의 원활한 소통 및 이해관계 조율을 통해 '유관부서 협조율 80% 이상'을 달성하며, 프로젝트의 강력한 추진 동력을 확보하는 능력을 평가합니다.",
      },
    ],
  },
];

function highlightNumbers(text: string) {
  return text.split(/(30% 이상|6개월|70% 이상|80% 이상)/g).map((part, i) =>
    ["30% 이상", "6개월", "70% 이상", "80% 이상"].includes(part) ? (
      <span key={i} className="po-num-highlight">{part}</span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

export default function ProjectOverview({ prevHref, nextHref }: OnboardingStepProjectOverviewProps) {
  const showFooterNav = Boolean(prevHref && nextHref);
  const outerClass = showFooterNav ? "flex min-h-0 flex-1 flex-col" : "relative flex min-h-0 flex-1 flex-col overflow-hidden";

  return (
    <div
      className={outerClass}
      style={{
        backgroundImage: "url('/bg_pattern_opt.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        className="project-overview-page relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-6 py-8 font-sans sm:px-10 sm:py-10"
      >
        <div className="mx-auto w-full max-w-6xl">
          {/* Title */}
          <div className="po-anim mb-8 flex justify-center" style={{ animationDelay: "0ms" }}>
            <p className="po-title-box m-0">프로젝트 개요</p>
          </div>

          {/* Main Content Card */}
          <div className="po-anim po-content-card px-5 py-8 sm:px-8 sm:py-10" style={{ animationDelay: "150ms" }}>

            {/* ── 프로젝트 배경 ── */}
            <section className="po-content-section-rule pb-10">
              <SectionLabel>프로젝트 배경</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-3">
                {backgroundItems.map((item, i) => (
                  <div key={i} className="po-bg-card flex flex-col items-center px-5 py-6 text-center">
                    <span className="po-card-icon mb-3 shrink-0 text-[#111] [&_svg]:block">
                      {React.cloneElement(item.icon, { size: 28, strokeWidth: 2 })}
                    </span>
                    <h3 className="mb-2.5 text-[17px] font-extrabold leading-snug text-[#111] sm:text-[19px]">
                      {item.title}
                    </h3>
                    <p className="text-[13px] font-medium leading-[1.8] text-[#555] sm:text-[14px]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 프로젝트 목적 ── */}
            <section className="po-content-section-rule py-10">
              <SectionLabel>프로젝트 목적</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-3">
                {purposeItems.map((item, i) => (
                  <div key={i} className="po-purpose-card flex flex-col items-center px-5 py-6 text-center">
                    <span className="po-card-icon mb-3 shrink-0 text-[#111] [&_svg]:block">
                      {React.cloneElement(item.icon, { size: 28, strokeWidth: 2 })}
                    </span>
                    <h3 className="mb-2.5 text-[17px] font-extrabold leading-snug text-[#111] sm:text-[19px]">
                      {item.title}
                    </h3>
                    <p className="text-[13px] font-medium leading-[1.8] text-[#555] sm:text-[14px]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 프로젝트 성공 요건 (KPI) ── */}
            <section className="pt-10">
              <SectionLabel>프로젝트 성공 요건 (KPI)</SectionLabel>
              <div className="grid gap-4 md:grid-cols-2">
                {kpiGroups.map((group) => (
                  <div key={group.label} className="po-kpi-group-container flex flex-col overflow-hidden">
                    <div className={`po-kpi-group-header px-4 py-3 text-center font-sans text-[16px] font-extrabold tracking-wide sm:text-[17px] ${
                      group.tone === "people" ? "po-kpi-group-header--people" : ""
                    }`}>
                      {group.label}
                    </div>
                    <div className="po-kpi-group-body flex flex-col divide-y divide-[#e5e7eb]">
                      {group.items.map((item, idx) => (
                        <div key={idx} className="px-5 py-5 sm:px-6 sm:py-6">
                          <div className="mb-1 text-center">
                            <span className="po-kpi-subtitle text-[11px] font-semibold uppercase tracking-widest sm:text-[12px]">
                              {item.subtitle}
                            </span>
                          </div>
                          <h4 className="mb-3 text-center text-[20px] font-black leading-snug text-[#111] sm:text-[22px]">
                            {item.title}
                          </h4>
                          <p className="whitespace-pre-line text-[13px] font-medium leading-[1.9] text-[#444] sm:text-[14px]">
                            {highlightNumbers(item.desc)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 리더의 에너지 — Work/People 두 박스와 동일 가로 폭 */}
              <div className="mt-4 po-kpi-group-container flex flex-col overflow-hidden">
                <div className="po-kpi-group-header po-kpi-group-header--energy px-4 py-3 text-center font-sans text-[16px] font-extrabold tracking-wide sm:text-[17px]">
                  Limited Resource
                </div>
                <div className="po-kpi-group-body px-5 py-5 sm:px-6 sm:py-6">
                  <div className="mb-1 text-center">
                    <span className="po-kpi-subtitle text-[11px] font-semibold uppercase tracking-widest sm:text-[12px]">
                      Leader&apos;s Energy
                    </span>
                  </div>
                  <h4 className="mb-3 text-center text-[20px] font-black leading-snug text-[#111] sm:text-[22px]">
                    리더 에너지
                  </h4>
                  <p className="whitespace-pre-line text-center text-[13px] font-medium leading-[1.9] text-[#444] sm:text-[14px]">
                    &quot;프로젝트를 끝까지 이끌어갈 리더 자신의 에너지를 전략적으로 관리하였는가?&quot;{"\n"}리더가 장기간의 프로젝트를 지속적으로 드라이브하기 위해 자신의 체력·감정·집중력을 효과적으로 관리하고, 번아웃 없이 팀에 긍정적 에너지를 전파하는 역량을 평가합니다.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {showFooterNav && (
        <div className="po-footer-bar po-footer-bar--transparent relative z-30 shrink-0">
          <PrevNextNav prevHref={prevHref!} nextHref={nextHref!} />
        </div>
      )}
    </div>
  );
}
