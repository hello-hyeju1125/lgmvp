"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  children: React.ReactNode;
  /** md: 기본, lg: 넓은 본문, xl: 프로젝트 개요 등 */
  size?: "md" | "lg" | "xl";
  /** 본문 영역 패딩 (프로젝트 개요 등 풀블리드 콘텐츠는 p-0) */
  bodyClassName?: string;
};

const maxW: Record<NonNullable<Props["size"]>, string> = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/**
 * 시뮬레이션 HUD 메뉴용 — 네오 브루탈(검은 테두리·오프셋 섀도) + 다크 헤더.
 * role=dialog의 직접 자식은 섀도를 먹는 글로벌 규칙이 있어, 래퍼를 한 겹 둡니다.
 */
const defaultBodyClass = "px-5 py-5 sm:px-6 sm:py-6";

export function SimulationHudModal({
  open,
  onClose,
  title,
  titleId,
  children,
  size = "md",
  bodyClassName = defaultBodyClass,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div className={`flex max-h-[min(100dvh-2rem,880px)] w-full ${maxW[size]} flex-col justify-center`}>
        <div
          className="flex max-h-full min-h-0 flex-col rounded-md border-2 border-black bg-white shadow-[6px_6px_0_#111111]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sim-hud-modal-header flex shrink-0 items-center justify-between gap-3 bg-[#111] px-5 py-4 sm:px-6">
            <h2 id={titleId} className="font-sans text-[22px] font-extrabold leading-snug tracking-tight sm:text-[24px]" style={{ color: "#ffffff" }}>
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="neo-no-bg sim-hud-modal-close shrink-0 border-none bg-transparent p-0 transition hover:opacity-80"
              aria-label="닫기"
              style={{ color: "#ffffff" }}
            >
              <X className="h-6 w-6" strokeWidth={2.5} aria-hidden style={{ color: "#ffffff", stroke: "#ffffff" }} />
            </button>
          </div>
          <div className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${bodyClassName}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
