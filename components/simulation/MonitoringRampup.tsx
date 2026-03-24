"use client";

import { useRouter } from "next/navigation";
import { monitoringRampupCopy } from "@/content/monitoringRecap";

interface MonitoringRampupProps {
  userName: string;
}

export function MonitoringRampup({ userName }: MonitoringRampupProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">{monitoringRampupCopy.title}</h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">&quot;{monitoringRampupCopy.intro}&quot;</p>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">{monitoringRampupCopy.body1}</p>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">{monitoringRampupCopy.body2}</p>

      <ul className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-4">
        {monitoringRampupCopy.phases.map((phase, i) => (
          <li key={i} className="text-sm text-[#6B6B6B]">
            <span
              className={`font-medium ${"isCurrent" in phase && phase.isCurrent ? "text-[#464775]" : "text-[#4A4A4A]"}`}
            >
              • {phase.label}
            </span>
            <p className="mt-0.5 leading-relaxed">{phase.text}</p>
          </li>
        ))}
      </ul>

      <p className="text-sm text-[#6B6B6B] leading-relaxed font-medium">
        &quot;{monitoringRampupCopy.outro}&quot;
      </p>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/simulation?phase=closing-scene")}
          className="px-6 py-2.5 rounded-xl bg-[#6B6B6B] text-white text-sm font-medium hover:bg-[#4A4A4A]"
        >
          {monitoringRampupCopy.cta}
        </button>
      </div>
    </div>
  );
}
