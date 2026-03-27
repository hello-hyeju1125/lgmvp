"use client";

import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useMemo, Suspense } from "react";
import { OnboardingStep0 } from "@/components/onboarding/OnboardingStep0";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import { OnboardingStepTeamsMessage } from "@/components/onboarding/OnboardingStepTeamsMessage";
import OnboardingStepProjectOverview from "@/components/onboarding/OnboardingStepProjectOverview";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import { OnboardingStep3 } from "@/components/onboarding/OnboardingStep3";
import { PrevNextNav } from "@/components/common/PrevNextNav";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { nickname, setOnboardingStep } = useStore();

  const step = useMemo(() => {
    const s = searchParams.get("step");
    const n = s ? parseInt(s, 10) : 0;
    return Number.isNaN(n) ? 0 : Math.max(0, Math.min(5, n));
  }, [searchParams]);

  const goNext = () => {
    if (step < 5) {
      setOnboardingStep(step + 1);
      router.push(`/onboarding?step=${step + 1}`);
    } else {
      router.push("/simulation?phase=initiation-action");
    }
  };

  const prevHref = step > 0 ? `/onboarding?step=${step - 1}` : "/";
  const nextHref = step < 5 ? `/onboarding?step=${step + 1}` : "/simulation?phase=initiation-action";

  return (
    <main className="neo-page relative min-h-screen flex flex-col bg-white">
      <div className="relative flex-1">
        {step === 0 && <OnboardingStep0 onNext={goNext} />}
        {step === 1 && <OnboardingStep1 onNext={goNext} />}
        {step === 2 && <OnboardingStepTeamsMessage onNext={goNext} userName={nickname || "PM"} />}
        {step === 3 && <OnboardingStepProjectOverview onNext={goNext} />}
        {step === 4 && <OnboardingStep2 onNext={goNext} userName={nickname || "PM"} />}
        {step === 5 && <OnboardingStep3 onNext={goNext} userName={nickname || "PM"} />}
      </div>
      <div className="relative z-30">
        <PrevNextNav prevHref={prevHref} nextHref={nextHref} />
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-white flex items-center justify-center text-[#6B6B6B]">로딩 중...</main>}>
      <OnboardingContent />
    </Suspense>
  );
}
