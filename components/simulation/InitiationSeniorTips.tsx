"use client";

import { initiationSeniorTipsCopy } from "@/content/initiationRecap";
import SeniorTipsPanel from "@/components/shared/SeniorTipsPanel";

interface InitiationSeniorTipsProps {
  userName: string;
}

export function InitiationSeniorTips({ userName }: InitiationSeniorTipsProps) {
  return (
    <SeniorTipsPanel
      title={initiationSeniorTipsCopy.title}
      intro={initiationSeniorTipsCopy.intro}
      stories={initiationSeniorTipsCopy.stories}
      prompt={initiationSeniorTipsCopy.prompt}
      placeholder={initiationSeniorTipsCopy.placeholder}
      userName={userName}
    />
  );
}
