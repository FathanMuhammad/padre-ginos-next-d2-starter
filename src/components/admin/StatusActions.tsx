"use client";

import { useActionState } from "react";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { nextStatuses, STATUS_LABELS, type OrderStatus } from "@/lib/orders";

export default function StatusActions({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}) {
  const [state, formAction, isPending] = useActionState(
    updateOrderStatusAction,
    null,
  );

  const next = nextStatuses(status);

  if (next.length === 0) {
    return (
      <p className="text-sm text-ink/60">Status final, tidak bisa diubah lagi.</p>
    );
  }

  return (
    <div>
      <form action={formAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="id" value={orderId} />
        {next.map((s) => (
          <button
            key={s}
            type="submit"
            name="status"
            value={s}
            disabled={isPending}
            className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50 hover:opacity-90"
          >
            {isPending ? "Menyimpan…" : `Ubah ke ${STATUS_LABELS[s]}`}
          </button>
        ))}
      </form>
      {state?.error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </div>
  );
}
