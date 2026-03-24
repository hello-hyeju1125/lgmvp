"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getEp4Result } from "@/content/episode4";

/** **text** → <strong>text</strong> */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

const EP4_INTRO =
  "선택이 완료되었습니다. 리더가 무심코 던진 업무 할당 방식 하나가 팀원의 잠재력을 증폭시킬수도, 팀 전체를 단순 노동의 늪으로 빠뜨릴 수도 있습니다. 과거 리더님의 준비(액션 아이템 투자)와 지금의 의사결정이 만나 어떤 결과를 도출했는지 확인해 보십시오.";

interface Ep4RoleResultProps {
  userName: string;
}

export function Ep4RoleResult({ userName }: Ep4RoleResultProps) {
  const router = useRouter();
  const { episode4Choice, initiationActionHours } = useStore();
  const choice = episode4Choice ?? "A";
  const result = getEp4Result(choice, initiationActionHours["team_profile"] ?? 0);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">E4. &quot;이게 왜 제 일입니까?&quot; – 결과</h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">{EP4_INTRO}</p>

      <p className="text-sm font-medium text-[#4A4A4A]">나의 의사결정 결과 확인하기</p>

      <div className="rounded-xl border border-[#E5E5E5] overflow-hidden bg-white">
        <div className="p-4 space-y-4 bg-[#FAFAFA] border-b border-[#E5E5E5]">
          <p className="text-sm font-medium text-[#4A4A4A]">
            결과 {choice}. {result.optionTitle}
          </p>
          <p className="text-sm text-[#4A4A4A] leading-relaxed">{renderWithBold(result.text)}</p>
          <div className="flex flex-wrap gap-2">
            {result.kpiLabels.map((label) => (
              <span
                key={label}
                className={`rounded px-2 py-1 text-xs font-medium ${
                  label.includes("▼") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                [{label}]
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border-t border-[#E5E5E5] bg-white p-4">
          <p className="text-xs font-medium text-[#4A4A4A] mb-3">챗봇 선배 PM의 조언</p>
          <div className="flex gap-3">
            <div className="shrink-0 w-9 h-9 rounded-full bg-[#E8EBFA] flex items-center justify-center text-[#464775] font-bold text-sm">
              PM
            </div>
            <div className="space-y-2 min-w-0">
              {result.adviceParagraphs.map((para, i) => (
                <p key={i} className="text-sm text-[#6B6B6B] leading-relaxed">
                  {renderWithBold(para)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
