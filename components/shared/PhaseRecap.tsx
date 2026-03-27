"use client";

interface PhaseRecapProps {
  title: string;
  intro: string;
  summaryTitle: string;
  summaryItems: string[];
  decisionsTitle: string;
  decisions: Array<{ label: string; value: string }>;
  dashboardTitle: string;
  kpis: Array<{ label: string; value: number }>;
  footer?: string;
}

export default function PhaseRecap({
  title,
  intro,
  summaryTitle,
  summaryItems,
  decisionsTitle,
  decisions,
  dashboardTitle,
  kpis,
  footer,
}: PhaseRecapProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-extrabold text-black">{title}</h2>
      <p className="text-sm leading-7 text-black">{intro}</p>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm font-extrabold text-black">{summaryTitle}</p>
        <ul className="mt-3 space-y-2">
          {summaryItems.map((item) => (
            <li key={item} className="text-sm leading-7 text-black">
              - {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm font-extrabold text-black">{decisionsTitle}</p>
        <ul className="mt-3 space-y-3">
          {decisions.map((d) => (
            <li key={d.label} className="text-sm leading-7 text-black">
              <strong>{d.label}</strong> {d.value}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm font-extrabold text-black">{dashboardTitle}</p>
        <ul className="mt-3 space-y-1">
          {kpis.map((kpi) => (
            <li key={kpi.label} className="text-sm text-black">
              {kpi.label}: {kpi.value}
            </li>
          ))}
        </ul>
      </div>

      {footer ? <p className="text-sm font-medium text-black">{footer}</p> : null}
    </section>
  );
}
