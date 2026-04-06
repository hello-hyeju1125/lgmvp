"use client";

import { Suspense } from "react";
import SimulationEngine from "@/components/simulation/SimulationEngine";

export default function EnginePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white text-[#6B6B6B]">
          로딩 중...
        </main>
      }
    >
      <SimulationEngine />
    </Suspense>
  );
}
