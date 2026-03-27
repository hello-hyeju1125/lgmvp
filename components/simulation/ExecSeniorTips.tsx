"use client";

import { executionSeniorTipsCopy } from "@/content/executionRecap";
import SeniorTipsPanel from "@/components/shared/SeniorTipsPanel";

interface ExecSeniorTipsProps {
  userName: string;
}

export function ExecSeniorTips({ userName }: ExecSeniorTipsProps) {
  return (
    <SeniorTipsPanel
      title="실행 단계 선배 PM의 노하우"
      intro={executionSeniorTipsCopy.intro}
      stories={executionSeniorTipsCopy.stories}
      prompt={executionSeniorTipsCopy.prompt}
      placeholder={executionSeniorTipsCopy.placeholder}
      userName={userName}
    />
  );
}
