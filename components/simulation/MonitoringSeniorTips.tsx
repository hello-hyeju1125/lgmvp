"use client";

import { monitoringSeniorTipsCopy } from "@/content/monitoringRecap";
import SeniorTipsPanel from "@/components/shared/SeniorTipsPanel";

interface MonitoringSeniorTipsProps {
  userName: string;
}

export function MonitoringSeniorTips({ userName }: MonitoringSeniorTipsProps) {
  return (
    <SeniorTipsPanel
      title={monitoringSeniorTipsCopy.title}
      intro={monitoringSeniorTipsCopy.intro}
      stories={monitoringSeniorTipsCopy.stories}
      prompt={monitoringSeniorTipsCopy.prompt}
      placeholder={monitoringSeniorTipsCopy.placeholder}
      userName={userName}
    />
  );
}
