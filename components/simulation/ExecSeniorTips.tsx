"use client";

import { executionSeniorTipsCopy } from "@/content/executionRecap";
import SeniorTipsPanel from "@/components/shared/SeniorTipsPanel";

interface ExecSeniorTipsProps {
  userName: string;
}

export function ExecSeniorTips({ userName }: ExecSeniorTipsProps) {
  return (
    <SeniorTipsPanel
      title={executionSeniorTipsCopy.title}
      intro={executionSeniorTipsCopy.intro}
      stories={executionSeniorTipsCopy.stories}
      prompt={executionSeniorTipsCopy.prompt}
      placeholder={executionSeniorTipsCopy.placeholder}
      userName={userName}
      postItNotes={executionSeniorTipsCopy.postItNotes}
    />
  );
}
