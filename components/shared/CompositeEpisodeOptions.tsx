"use client";

import { useState } from "react";

export interface CompositeOption {
  id: string;
  label: string;
}

export interface CompositeBlock {
  id: string;
  title: string;
  options: CompositeOption[];
  defaultOptionId?: string;
}

interface CompositeEpisodeOptionsProps {
  title: string;
  blocks: CompositeBlock[];
  onSubmit: (selected: Record<string, string>) => void;
  submitLabel?: string;
}

export default function CompositeEpisodeOptions({
  title,
  blocks,
  onSubmit,
  submitLabel = "전송하기",
}: CompositeEpisodeOptionsProps) {
  const [selectedByBlock, setSelectedByBlock] = useState<Record<string, string>>(() =>
    blocks.reduce<Record<string, string>>((acc, block) => {
      acc[block.id] = block.defaultOptionId ?? block.options[0]?.id ?? "";
      return acc;
    }, {})
  );

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-bold text-black">{title}</h2>
      <div className="space-y-4">
        {blocks.map((block) => (
          <div key={block.id}>
            <p className="mb-2 text-sm font-medium text-black">{block.title}</p>
            <select
              value={selectedByBlock[block.id] ?? ""}
              onChange={(e) => setSelectedByBlock((prev) => ({ ...prev, [block.id]: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm text-black"
            >
              {block.options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSubmit(selectedByBlock)}
          className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-black"
        >
          {submitLabel}
        </button>
      </div>
    </section>
  );
}
