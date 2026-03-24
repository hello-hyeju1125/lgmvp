"use client";

import { useRouter } from "next/navigation";
import { initiationRampupCopy } from "@/content/initiationRecap";

interface InitiationRampupProps {
  userName: string;
}

export function InitiationRampup({ userName }: InitiationRampupProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">{initiationRampupCopy.title}</h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">{initiationRampupCopy.intro}</p>
      <p className="text-sm text-[#6B6B6B]">{initiationRampupCopy.body}</p>

      <ul className="space-y-2 text-sm text-[#6B6B6B]">
        {initiationRampupCopy.phases.map((phase, i) => (
          <li key={i} className="rounded-lg border border-[#E5E5E5] bg-[#F9FAFB] p-3 leading-relaxed">
            {phase}
          </li>
        ))}
      </ul>

      <p className="text-sm text-[#6B6B6B]">{initiationRampupCopy.outro}</p>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/simulation?phase=plan-action")}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A]"
        >
          {initiationRampupCopy.cta}
        </button>
      </div>
    </div>
  );
}
