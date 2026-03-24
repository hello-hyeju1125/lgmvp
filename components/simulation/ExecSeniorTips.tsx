"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { executionSeniorTipsCopy } from "@/content/executionRecap";

interface ExecSeniorTipsProps {
  userName: string;
}

function replaceUserName(text: string, name: string) {
  return text.replace(/\{User_Name\}/g, name || "리더");
}

export function ExecSeniorTips({ userName }: ExecSeniorTipsProps) {
  const router = useRouter();
  const [experience, setExperience] = useState("");

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#4A4A4A]">{executionSeniorTipsCopy.title}</h2>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">{executionSeniorTipsCopy.intro}</p>

      <div className="space-y-4">
        {executionSeniorTipsCopy.stories.map((story, i) => (
          <div key={i} className="rounded-xl border border-[#E5E5E5] bg-[#F9FAFB] p-4">
            <p className="text-sm font-medium text-[#4A4A4A] mb-2">{story.title}</p>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">{story.text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#E5E5E5] p-4">
        <p className="text-sm font-medium text-[#4A4A4A] mb-2">
          {replaceUserName(executionSeniorTipsCopy.prompt, userName)}
        </p>
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder={executionSeniorTipsCopy.placeholder}
          rows={4}
          className="w-full rounded-lg border border-[#E5E5E5] p-3 text-sm text-[#4A4A4A] placeholder:text-[#9CA3AF] focus:border-[#6B6B6B] focus:outline-none"
        />
      </div>

    </div>
  );
}
