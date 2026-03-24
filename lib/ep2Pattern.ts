import type { CharterBlockId } from "@/store/useStore";
import type { Ep2Pattern } from "@/store/useStore";
import { charterBlocks } from "@/content/episode2";

export function getEp2Pattern(selectedIds: CharterBlockId[]): Ep2Pattern {
  const count = selectedIds.length;
  const selected = charterBlocks.filter((b) => selectedIds.includes(b.id));
  const coreCount = selected.filter((b) => b.type === "core").length;
  const sensitiveCount = selected.filter((b) => b.type === "sensitive").length;
  const softCount = selected.filter((b) => b.type === "soft").length;

  if (count >= 6) return "dictator";
  if (count <= 2) return "empty-handed";
  if (count >= 2 && count <= 4 && sensitiveCount >= 2) return "line-crosser";
  if (coreCount === 0 && (softCount >= 1 || selected.some((b) => b.id === 4))) return "misaligned";
  if (count >= 2 && count <= 4 && coreCount >= 1 && coreCount <= 2 && sensitiveCount <= 1) return "strategic";

  return "empty-handed";
}
