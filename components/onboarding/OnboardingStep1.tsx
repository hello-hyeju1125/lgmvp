"use client";

import React, { useState } from "react";

interface CardItem {
  id: number;
  icon: string;
  title: string;
  detail: string;
  colorClass: string;
}

const VOC_CARDS: CardItem[] = [
  {
    id: 1,
    icon: "VOC",
    title: "파편화된 VOC 대응 한계",
    detail:
      "현재 전 세계 각 채널에서 쏟아지는 방대한 VOC를 기존의 파편화된 방식으로 분석하고 대응하는 데에는 이미 한계에 이르렀습니다.",
    colorClass: "pop-bg-blue",
  },
  {
    id: 2,
    icon: "AI",
    title: "고객 목소리 통합 분석 필요",
    detail:
      "흩어져 있는 고객의 목소리를 AI로 통합 분석하여 전사적으로 활용할 수 있는 체계가 반드시 필요합니다.",
    colorClass: "pop-bg-yellow",
  },
  {
    id: 3,
    icon: "KPI",
    title: "의사결정 속도·정확도 혁신 목표",
    detail:
      "AI 기반 통합 분석을 통해 현업의 의사결정 속도와 정확도를 혁신적으로 끌어올리는 것이 이번 프로젝트의 핵심 목표입니다.",
    colorClass: "pop-bg-red",
  },
  {
    id: 4,
    icon: "DB",
    title: "6개월 내 대시보드 오픈 및 현업 적용",
    detail:
      "팀을 조율하고 이끄는 리더로서 6개월 내에 가시적인 성과(통합 대시보드 오픈 및 현업 적용)를 창출해 주시길 기대합니다.",
    colorClass: "pop-bg-green",
  },
  {
    id: 5,
    icon: "PM",
    title: "탁월한 문제 해결 능력과 데이터 인사이트",
    detail:
      "그동안 보여주신 탁월한 문제 해결 능력과 데이터 기반의 인사이트가 이번 프로젝트를 성공으로 이끌 가장 중요한 열쇠라고 판단했습니다.",
    colorClass: "pop-bg-purple",
  },
];

export default function EmailMission({ onNext }: { onNext?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<CardItem | null>(null);

  return (
    <div
      className="max-w-4xl mx-auto overflow-hidden font-sans"
      style={{
        border: "2px solid #111111",
        boxShadow: "8px 8px 0px #111111",
        backgroundColor: "#ffffff",
      }}
    >
      {/* 타이틀 바 */}
      <div
        className="border-b-2 border-black px-4 py-3 flex items-center justify-center relative"
        style={{ backgroundColor: "#F4F4F4" }}
      >
        <div className="absolute left-4 flex space-x-2">
          <span
            className="w-4 h-4 rounded-full border-2 border-black inline-block"
            style={{ backgroundColor: "#FF4B4B" }}
          />
          <span
            className="w-4 h-4 rounded-full border-2 border-black inline-block"
            style={{ backgroundColor: "#FFD12A" }}
          />
          <span
            className="w-4 h-4 rounded-full border-2 border-black inline-block"
            style={{ backgroundColor: "#89E586" }}
          />
        </div>
        <div className="font-black text-lg tracking-wide">New Message</div>
      </div>

      {/* 이메일 헤더 */}
      <div
        className="border-b-2 border-black flex flex-col text-base"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="border-b-2 border-black px-6 py-4 flex items-center">
          <span className="font-bold w-28" style={{ color: "#555555" }}>보낸사람</span>
          <span className="font-medium">고객가치혁신팀 팀장</span>
        </div>
        <div className="border-b-2 border-black px-6 py-4 flex items-center">
          <span className="font-bold w-28" style={{ color: "#555555" }}>받는사람</span>
          <span className="font-medium">신임 프로젝트 리더(PM)</span>
        </div>
        <div className="border-b-2 border-black px-6 py-4 flex items-center">
          <span className="font-bold w-28" style={{ color: "#555555" }}>날짜</span>
          <span className="font-medium" style={{ color: "#666666" }}>2024.10.18 14:32 (KST)</span>
        </div>
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center min-w-0">
            <span className="font-bold w-28 shrink-0" style={{ color: "#555555" }}>제목</span>
            <span
              className="font-bold px-2 py-1"
              style={{ backgroundColor: "rgba(51,116,246,0.15)" }}
            >
              [인사발령] 글로벌 VOC 통합 분석 AI 도입 프로젝트 리더(PM) 선임의 건
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="shrink-0 font-bold border-2 border-black px-4 py-1 transition-all hover:translate-x-[1px] hover:translate-y-[1px]"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            {isOpen ? "닫기" : "열기"}
          </button>
        </div>
      </div>

      {/* 본문: 카드 그리드 */}
      {isOpen ? (
        <div className="p-10 pb-16" style={{ backgroundColor: "#ffffff" }}>
          {/* 타이틀 박스 */}
          <div
            className="inline-block border-4 border-black px-6 py-3 mb-8"
            style={{ boxShadow: "6px 6px 0px #111111", backgroundColor: "#ffffff" }}
          >
            <span className="neo-display font-extrabold text-2xl">01 고객사의 의견</span>
          </div>

          {/* 2×2 + 하단 1 그리드 */}
          <div className="grid grid-cols-2 gap-6">
            {VOC_CARDS.slice(0, 4).map((card) => (
              <VocCard key={card.id} card={card} onOpen={setActiveCard} />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <div className="w-1/2">
              <VocCard card={VOC_CARDS[4]} onOpen={setActiveCard} />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="p-12 pb-24 text-center text-[16px] font-semibold"
          style={{ backgroundColor: "#ffffff", color: "#666666" }}
        >
          열기 버튼을 눌러 메일 본문을 확인하세요.
        </div>
      )}

      {/* 모달 */}
      {activeCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setActiveCard(null)}
        >
          <div
            className="relative max-w-lg w-full p-10 border-4 border-black"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "12px 12px 0px #111111",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={() => setActiveCard(null)}
              className="absolute top-4 right-4 w-10 h-10 border-4 border-black font-extrabold text-lg flex items-center justify-center transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "4px 4px 0px #111111",
              }}
            >
              X
            </button>

            {/* 아이콘 + 타이틀 */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className="border-4 border-black px-3 py-1 font-black text-xl tracking-widest shrink-0"
                style={{ backgroundColor: "#111111", color: "#ffffff" }}
              >
                {activeCard.icon}
              </span>
              <div className="neo-display font-extrabold text-xl leading-snug">
                {activeCard.title}
              </div>
            </div>

            <hr className="border-t-2 border-black mb-6" />

            <p className="text-lg leading-relaxed font-sans">{activeCard.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function VocCard({
  card,
  onOpen,
}: {
  card: CardItem;
  onOpen: (c: CardItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(card)}
      className={`pop-card ${card.colorClass} w-full text-left p-6 cursor-pointer flex flex-col gap-4`}
    >
      {/* 텍스트 아이콘 뱃지 */}
      <span
        className="border-4 border-black px-3 py-1 font-black text-lg tracking-widest inline-block"
        style={{
          backgroundColor: "#111111",
          color: "#ffffff",
          boxShadow: "3px 3px 0px #444444",
        }}
      >
        {card.icon}
      </span>
      <span className="neo-display font-extrabold text-lg leading-snug">{card.title}</span>
    </button>
  );
}
