"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Wrench,
  TrendingDown,
  Share2,
  Zap,
  Lightbulb,
  Target,
  Calendar,
  Users,
  Handshake,
} from "lucide-react";

export default function ProjectOverview({ onNext }: { onNext?: () => void }) {
  const [activeCard, setActiveCard] = useState<any>(null);

  const sections = [
    {
      title: "프로젝트 배경",
      bgColor: "bg-[#FFB8E0]",
      items: [
        { id: 1, icon: <AlertCircle size={32} />, title: "파편화된 고객 데이터", full: "전 세계 다양한 채널에서 수집되는 글로벌 VOC 데이터가 부서별로 산재되어 있어 전사적인 통합 관리가 부재한 상황입니다." },
        { id: 2, icon: <Wrench size={32} />, title: "비효율적인 수작업", full: "실무진이 방대한 양의 데이터를 일일이 수작업으로 취합하고 분류하느라 불필요한 리소스 낭비와 병목 현상이 발생하고 있습니다." },
        { id: 3, icon: <TrendingDown size={32} />, title: "시장 대응력 약화", full: "데이터 분석 지연으로 인해 급변하는 고객의 숨은 니즈를 파악하지 못하고, 글로벌 시장 트렌드 변화에 기민하게 대응하지 못하고 있습니다." }
      ]
    },
    {
      title: "프로젝트 목적",
      bgColor: "bg-[#ADF1FF]",
      items: [
        { id: 4, icon: <Share2 size={32} />, title: "AI 기반 통합 체계", full: "최신 AI 기술을 도입하여 전 세계에 흩어진 고객의 목소리를 자동으로 수집, 분류, 감성 분석하는 통합 시스템을 마련합니다." },
        { id: 5, icon: <Zap size={32} />, title: "처리 효율성 극대화", full: "기존의 수작업 위주 프로세스를 자동화하여, 현업 부서의 데이터 처리 공수를 획기적으로 단축합니다." },
        { id: 6, icon: <Lightbulb size={32} />, title: "실시간 인사이트", full: "분석된 데이터를 바탕으로 실시간 인사이트를 도출하여, 데이터 기반의 신속하고 정확한 의사결정 체계를 지원합니다." }
      ]
    }
  ];

  const kpiGroups = [
    {
      label: "Work Management",
      labelColor: "neo-bg-blue",
      surface: "work" as const,
      items: [
        {
          id: 7,
          icon: <Target size={32} />,
          title: "산출물 품질 (Quality)",
          full: "\"현업이 즉시 활용하며 만족할 수 있는 실효성 높고 완성도 있는 AI 대시보드를 구축하였는가?\" 현업(CS/마케팅)의 데이터 처리 공수를 30% 이상 단축할 수 있는 'AI VOC 대시보드' 프로토타입의 정상 구동 및 아웃풋의 완성도를 평가합니다.",
        },
        {
          id: 8,
          icon: <Calendar size={32} />,
          title: "일정 준수 (Delivery)",
          full: "\"주어진 제한 시간 내에 지연 없이 프로젝트 마일스톤을 달성하고 결과물을 적기에 납품하였는가?\" 프로젝트 착수부터 대시보드 프로토타입 오픈까지의 전체 일정을 체계적으로 관리하여, '6개월'이라는 기한 내에 목표를 완수하는 진척도 관리 역량을 평가합니다.",
        },
      ],
    },
    {
      label: "People Management",
      labelColor: "neo-bg-red",
      surface: "people" as const,
      items: [
        {
          id: 9,
          icon: <Users size={32} />,
          title: "팀 몰입도 (Team Engagement)",
          full: "\"팀원들의 잠재력을 발굴하고, 하나의 목표를 향해 자발적으로 몰입하는 팀 문화를 만들었는가?\" People Manager로서 프로젝트 팀원 개개인의 동기를 부여하고 역량을 끌어올려, '팀 몰입도 70% 이상'의 주도적이고 건강한 조직 문화를 조성하는 것을 목표로 합니다.",
        },
        {
          id: 10,
          icon: <Handshake size={32} />,
          title: "이해관계자 조율 (Stakeholder Alignment)",
          full: "\"이해관계가 얽힌 유관부서 및 상위 조직과의 갈등을 해결하고, 적극적인 협조와 지원을 이끌어냈는가?\" CS, 마케팅 등 타 부서와의 원활한 소통 및 이해관계 조율을 통해 '유관부서 협조율 80% 이상'을 달성하며, 프로젝트의 강력한 추진 동력을 확보하는 능력을 평가합니다.",
        },
      ],
    },
  ];

  return (
    <div
      className="project-overview-page min-h-screen p-8 font-sans overflow-x-hidden bg-[#F0F0F0]"
      style={{ backgroundColor: "#F0F0F0" }}
    >
      <div className="max-w-6xl mx-auto bg-white border-4 border-black shadow-[12px_12px_0px_#111111]">
        {/* 타이틀 바 */}
        <div className="bg-[#F4F4F4] border-b-4 border-black px-6 py-4 flex items-center justify-center relative">
          <div className="absolute left-6 flex space-x-2">
            <span className="w-4 h-4 rounded-full border-2 border-black bg-[#FF4B4B]"></span>
            <span className="w-4 h-4 rounded-full border-2 border-black bg-[#FFD12A]"></span>
            <span className="w-4 h-4 rounded-full border-2 border-black bg-[#89E586]"></span>
          </div>
          <h1 className="font-black text-2xl font-alice">프로젝트 개요</h1>
        </div>

        {/* 게시판 콘텐츠 */}
        <div className="p-10 space-y-16">
          {sections.map((sec, i) => (
            <div key={i}>
              <div className="inline-block bg-white border-2 border-black px-4 py-1 mb-6 shadow-[4px_4px_0px_#111111] font-black text-lg">
                {sec.title}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sec.items.map(item => (
                  <div key={item.id} onClick={() => setActiveCard(item)} className={`${sec.bgColor} border-2 border-black p-6 shadow-[6px_6px_0px_#111111] cursor-pointer hover:translate-x-1 hover:translate-y-1 transition-all`}>
                    <div className="mb-4 neo-no-bg">{item.icon}</div>
                    <h3 className="font-black text-xl leading-tight">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* KPI 섹션 (그룹화 적용) */}
          <div>
            <div className="inline-block bg-white border-2 border-black px-4 py-1 mb-6 shadow-[4px_4px_0px_#111111] font-black text-lg">
              프로젝트 성공 요건 (KPI)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {kpiGroups.map((group, i) => {
                const surfaceClass =
                  group.surface === "work" ? "kpi-surface-work" : "kpi-surface-people";
                return (
                  <div key={i} className="flex flex-col relative pt-4">
                    <div
                      className={`absolute top-0 left-6 ${group.labelColor} neo-text-white text-xs font-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#111111] z-10`}
                    >
                      {group.label}
                    </div>
                    <div
                      className={`grid grid-cols-1 gap-6 border-2 border-black p-8 ${surfaceClass}`}
                    >
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setActiveCard(item)}
                          className={`${surfaceClass} border-2 border-black p-6 h-48 flex flex-col shadow-[6px_6px_0px_#111111] cursor-pointer hover:translate-x-1 hover:translate-y-1 transition-all text-[#111111]`}
                        >
                          <div className="mb-4 neo-no-bg">{item.icon}</div>
                          <h3 className="font-black text-xl">{item.title}</h3>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 모달 — Retro Paper + deep shadow */}
      {activeCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/25 backdrop-blur-[2px]"
          onClick={() => setActiveCard(null)}
          role="presentation"
        >
          <div
            className="border-4 border-black max-w-2xl w-full mx-4 p-10 sm:p-12 shadow-[20px_20px_0px_#000000] relative"
            style={{ backgroundColor: "#FFFBEB" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-8 text-black neo-no-bg [&_svg]:block">
              {React.isValidElement(activeCard.icon) &&
                React.cloneElement(
                  activeCard.icon as React.ReactElement<{ size?: number; strokeWidth?: number }>,
                  { size: 40, strokeWidth: 2.5 }
                )}
            </div>
            <h2 className="font-black text-2xl mb-6 text-[#111111]">{activeCard.title}</h2>
            <p className="text-lg font-medium leading-relaxed mb-10 text-[#111111]">
              {activeCard.full
                .split(/(30% 이상|6개월|70% 이상|80% 이상)/g)
                .map((part: string, i: number) =>
                  ["30% 이상", "6개월", "70% 이상", "80% 이상"].includes(part) ? (
                    <span
                      key={i}
                      className="px-1 font-black"
                      style={{ backgroundColor: "#89E586", color: "#111111" }}
                    >
                      {part}
                    </span>
                  ) : (
                    part
                  )
                )}
            </p>
            <button
              type="button"
              onClick={() => setActiveCard(null)}
              className="w-full font-black py-4 border-2 border-black text-[#111111] shadow-[4px_4px_0px_#111111] transition-all duration-150 ease-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#111111] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              style={{ backgroundColor: "#89E586" }}
            >
              확인 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
