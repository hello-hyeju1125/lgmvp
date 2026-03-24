"use client";

import { useRouter } from "next/navigation";
import { closingDDayCopy } from "@/content/closingScene";

interface ClosingSceneProps {
  userName: string;
}

export function ClosingScene({ userName }: ClosingSceneProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">{closingDDayCopy.title}</h2>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] p-4">
        <p className="text-sm text-[#6B6B6B] leading-relaxed italic">
          {closingDDayCopy.sceneDesc}
        </p>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-[#4A4A4A] mb-3">
          {closingDDayCopy.chatbotTitle}
        </p>
        <div className="space-y-3">
          {closingDDayCopy.chatbotGuide.map((line, i) => (
            <p key={i} className="text-sm text-[#6B6B6B] leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/simulation?phase=closing-result")}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A]"
        >
          {closingDDayCopy.cta}
        </button>
      </div>
    </div>
  );
}
