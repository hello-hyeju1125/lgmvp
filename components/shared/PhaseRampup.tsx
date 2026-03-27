"use client";

interface PhaseRampupProps {
  title: string;
  intro: string;
  phases: Array<{ label: string; text: string; state: "done" | "next" | "upcoming" }>;
  outro: string;
  userName: string;
}

export default function PhaseRampup({ title, intro, phases, outro, userName }: PhaseRampupProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-extrabold text-black">{title}</h2>
      <p className="text-sm font-semibold text-black">{userName}님, 다음 여정이 시작됩니다.</p>
      <p className="whitespace-pre-line text-sm leading-7 text-black">{intro}</p>

      <ul className="space-y-3">
        {phases.map((phase) => (
          <li key={`${phase.label}-${phase.text}`} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-extrabold text-black">
              [{phase.state.toUpperCase()}] {phase.label}
            </p>
            <p className="mt-1 text-sm leading-7 text-black">{phase.text}</p>
          </li>
        ))}
      </ul>

      <p className="whitespace-pre-line text-sm leading-7 text-black">{outro}</p>
    </section>
  );
}
