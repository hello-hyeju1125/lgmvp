"use client";

interface CompositeEpisodeResultProps {
  title: string;
  endingTitle: string;
  body: string;
  kpiLabels: string[];
}

function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export default function CompositeEpisodeResult({
  title,
  endingTitle,
  body,
  kpiLabels,
}: CompositeEpisodeResultProps) {
  return (
    <section className="mx-auto w-full max-w-4xl" aria-label={title}>
      <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <h2 className="text-center text-2xl font-extrabold text-black sm:text-3xl">{title}</h2>
        <div className="text-center">
          <span className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-1.5 text-base font-extrabold text-black">
            {endingTitle}
          </span>
        </div>
        <p className="text-sm leading-7 text-black">{renderWithBold(body)}</p>
        {kpiLabels.length ? (
          <div className="flex flex-wrap gap-2">
            {kpiLabels.map((label) => (
              <span key={label} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-extrabold text-black">
                [{label}]
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
