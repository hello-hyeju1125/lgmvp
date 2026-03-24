"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ep10Options, getEp10Result } from "@/content/episode10";

const RESULT_INTRO =
  "선택이 완료되었습니다. 모두의 앞에서 뼈아픈 실수가 드러났을 때 리더가 보여주는 태도는, 팀원의 의욕을 꺾어버릴 수도 있고 반대로 한계를 뛰어넘게 만드는 성장의 분수령이 되기도 합니다. 당신의 선택에 따른 결과를 살펴보시겠습니다.";

interface Ep10ResultProps {
  userName: string;
}

export function Ep10Result({ userName }: Ep10ResultProps) {
  const router = useRouter();
  const { episode10Choice } = useStore();
  const chosen = episode10Choice ? ep10Options.find((o) => o.id === episode10Choice) : null;
  const result = episode10Choice ? getEp10Result(episode10Choice) : null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">
        E10. 드러난 치명적 결함, 실패를 다루는 리더의 방식 – 결과
      </h2>

      <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{RESULT_INTRO}&quot;</p>

      {result && chosen && (
        <>
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
            <p className="text-sm font-semibold text-[#4A4A4A]">
              결과 {chosen.id}: {result.optionTitle}
            </p>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">{result.text}</p>
            {result.kpiLabels.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {result.kpiLabels.map((label, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-[#E8EBFA] px-2.5 py-1 text-xs font-medium text-[#464775]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-[#F9FAFB] p-4">
            <p className="text-sm font-semibold text-[#4A4A4A] mb-3">
              결과 {chosen.id}: {result.optionTitle} [챗봇 선배 PM의 조언]
            </p>
            <ul className="space-y-2">
              {result.adviceParagraphs.map((para, i) => (
                <li key={i} className="text-sm text-[#6B6B6B] leading-relaxed">
                  {para}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

    </div>
  );
}
