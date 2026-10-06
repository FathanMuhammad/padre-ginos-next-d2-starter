import type { OrderStatus } from "@/lib/orders";
import { STATUS_LABELS } from "@/lib/orders";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "text-amber-800",
  preparing: "text-blue-800",
  ready: "text-purple-800",
  delivered: "text-emerald-800",
  cancelled: "text-stone-600",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[status] ?? "bg-stone-100 text-stone-700"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
