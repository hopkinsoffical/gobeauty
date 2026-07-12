import type { CommercialStatus } from "@/lib/marketplace/types";
import { COMMERCIAL_STATUS_LABEL } from "@/lib/marketplace/types";

const STYLES: Record<CommercialStatus, string> = {
  available: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  not_available: "bg-surface-soft text-ink-muted ring-line",
  pending: "bg-amber-50 text-amber-900 ring-amber-200",
};

export default function StatusPill({ status }: { status: CommercialStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ring-1 ${STYLES[status]}`}
    >
      {COMMERCIAL_STATUS_LABEL[status]}
    </span>
  );
}
