"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { charterBlocks, ep2Dialogue, ep2Patterns } from "@/content/episode2";
import { getEp2Pattern } from "@/lib/ep2Pattern";

interface Ep2CharterProps {
  userName: string;
}

export function Ep2Charter({ userName }: Ep2CharterProps) {
  const router = useRouter();
  const { episode2SelectedBlocks, toggleEpisode2Block, setEpisode2Pattern, applyKpiDelta } = useStore();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">Ep 2 불분명한 책임과 권한 – R&R의 안개</h2>
      <p className="text-sm text-[#6B6B6B]">[상황] 프로젝트 정의서(Charter)에 [PM의 권한 및 책임 범위]를 채우고, 최대 4개의 권한 블록만 선택할 수 있습니다.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border border-[#E5E5E5] min-h-[120px]">
          <p className="text-xs font-medium text-[#4A4A4A]">프로젝트 정의서 – PM 권한 영역</p>
          <p className="text-sm text-[#6B6B6B] mt-2">선택한 블록: {episode2SelectedBlocks.length} / 4</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {episode2SelectedBlocks.map((id) => {
              const b = charterBlocks.find((x) => x.id === id);
              return b ? <span key={id} className="text-xs bg-[#E5E5E5] text-[#6B6B6B] px-2 py-0.5 rounded">{b.label.slice(0, 20)}…</span> : null;
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-[#4A4A4A]">권한 블록 (클릭하여 선택/해제, 최대 4개)</p>
          {charterBlocks.map((b) => {
            const selected = episode2SelectedBlocks.includes(b.id);
            const disabled = !selected && episode2SelectedBlocks.length >= 4;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => !disabled && toggleEpisode2Block(b.id)}
                disabled={disabled}
                className={`w-full text-left p-2 rounded-lg border text-sm transition-colors ${
                  selected ? "border-[#6B6B6B] bg-[#F3F4F6]" : "border-[#E5E5E5] hover:border-[#6B6B6B]/50"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="text-[#4A4A4A]">블록 {b.id}</span>
                <span className="text-[#6B6B6B]"> – {b.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F9FAFB]">
        <p className="text-xs font-medium text-[#4A4A4A] mb-2">최성민 상무 1:1 화상 통화</p>
        <p className="text-sm text-[#6B6B6B]">&quot;{ep2Dialogue.choi1}&quot;</p>
        <p className="text-sm text-[#6B6B6B] mt-2">PM: &quot;{ep2Dialogue.pm}&quot;</p>
        <p className="text-sm text-[#6B6B6B] mt-2">최성민 상무: &quot;{ep2Dialogue.choi2}&quot;</p>
      </div>

      {/* Navigation handled by global Prev/Next footer */}
    </div>
  );
}
