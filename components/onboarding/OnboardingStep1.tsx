"use client";

import React, { useState } from "react";

export default function EmailMission({
  userName = "PM",
}: {
  onNext?: () => void;
  userName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
          <span className="font-bold w-28" style={{ color: "#555555" }}>
            보낸사람
          </span>
          <span className="font-medium">고객가치혁신팀 팀장</span>
        </div>
        <div className="border-b-2 border-black px-6 py-4 flex items-center">
          <span className="font-bold w-28" style={{ color: "#555555" }}>
            받는사람
          </span>
          <span className="font-medium">신임 프로젝트 리더(PM)</span>
        </div>
        <div className="border-b-2 border-black px-6 py-4 flex items-center">
          <span className="font-bold w-28" style={{ color: "#555555" }}>
            날짜
          </span>
          <span className="font-medium" style={{ color: "#666666" }}>
            2024.10.18 14:32 (KST)
          </span>
        </div>
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center min-w-0">
            <span className="font-bold w-28 shrink-0" style={{ color: "#555555" }}>
              제목
            </span>
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

      {isOpen ? (
        <div className="p-10 pb-24 leading-relaxed text-gray-900 text-[17px]" style={{ backgroundColor: "#ffffff" }}>
          <p className="mt-0">
            {userName} 책임님, 안녕하십니까.
          </p>
          <p className="mt-6">
            당사의 최우선 과제인 &apos;고객 가치 기반의 AX(AI Transformation)&apos; 가속화를 위해, {userName}{" "}
            님을 [글로벌 VOC 통합 분석 AI 도입]의 프로젝트 리더(PM)로 전격 발탁하게 되었습니다.
          </p>
          <p className="mt-6">
            잘 아시다시피, 현재 전 세계 각 채널에서 쏟아지는 방대한 VOC를 기존의 파편화된 방식으로 분석하고 대응하는 데에는 이미 한계에 이르렀습니다. 본 프로젝트는 흩어져 있는 고객의 목소리를 AI로 통합 분석하여, 현업의 의사결정 속도와 정확도를 혁신적으로 끌어올리는 전사 핵심 프로젝트입니다.
          </p>
          <p className="mt-6">
            그동안 {userName} 책임님이 여러 프로젝트에서 보여주신 탁월한 문제 해결 능력과 데이터 기반의 인사이트가 이번 프로젝트를 성공으로 이끌 가장 중요한 열쇠라고 판단했습니다. 이제는 뛰어난 실무자를 넘어, 팀을 조율하고 이끄는 &apos;리더&apos;로서 6개월 내에 가시적인 성과(통합 대시보드 오픈 및 현업 적용)를 창출해 주시길 기대합니다.
          </p>
          <p className="mt-6">
            처음 맡는 PM 역할과 무거운 책임감에 부담도 있겠지만, 팀장으로서 필요한 인력과 자원에 대한 전폭적인 지원을 아끼지 않겠습니다.
          </p>
          <p className="mt-6">
            다시 한번 PM 선임을 축하하며, 리더로서의 새로운 도전을 진심으로 응원합니다.
          </p>
          <p className="mt-6">감사합니다.</p>
          <p className="mt-6 font-bold">고객가치혁신팀 팀장 드림</p>
        </div>
      ) : (
        <div
          className="p-12 pb-24 text-center text-[16px] font-semibold"
          style={{ backgroundColor: "#ffffff", color: "#666666" }}
        >
          열기 버튼을 눌러 메일 본문을 확인하세요.
        </div>
      )}
    </div>
  );
}
