"use client";

import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useMemo, Suspense, useEffect } from "react";
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

  /** step=1은 미사용 — URL로 들어와도 브리핑 시작(step=0)으로 보냄 */
  useEffect(() => {
    if (step === 1) {
      setOnboardingStep(0);
      router.replace("/onboarding?step=0");
    }
  }, [step, router, setOnboardingStep]);

  const goNext = () => {
    if (step < 5) {
      const nextStep = step === 0 ? 2 : step + 1;
      setOnboardingStep(nextStep);
      router.push(`/onboarding?step=${nextStep}`);
    } else {
      router.push("/simulation?phase=initiation-action");
    }
  };

  /** 이전 단계: step=2는 브리핑(step=0)으로 (step=1 미사용) */
  const prevHref =
    step <= 0 ? "/" : `/onboarding?step=${step === 2 ? 0 : step - 1}`;
  const nextHref = step < 5 ? `/onboarding?step=${step === 0 ? 2 : step + 1}` : "/simulation?phase=initiation-action";

  return (
    <main className="neo-page relative min-h-screen flex flex-col bg-white">
      <div className="relative flex min-h-0 flex-1 flex-col">
        {step === 0 && <OnboardingStep0 onNext={goNext} />}
        {step === 1 && <OnboardingStep1 onNext={goNext} userName={nickname || "PM"} />}
        {step === 2 && <OnboardingStepTeamsMessage onNext={goNext} userName={nickname || "PM"} />}
        {step === 3 && <OnboardingStepProjectOverview prevHref={prevHref} nextHref={nextHref} />}
        {step === 4 && <OnboardingStep2 onNext={goNext} userName={nickname || "PM"} prevHref={prevHref} nextHref={nextHref} />}
        {step === 5 && <OnboardingStep3 onNext={goNext} userName={nickname || "PM"} prevHref={prevHref} nextHref={nextHref} />}
      </div>
      {step !== 0 && step !== 2 && step !== 3 && step !== 4 && step !== 5 && (
        <div className="relative z-30 shrink-0">
          <PrevNextNav prevHref={prevHref} nextHref={nextHref} />
        </div>
      )}
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
