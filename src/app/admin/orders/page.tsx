import Form from "next/form";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { getOrders } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";

function parsePage(value: unknown): number {
  if (typeof value !== "string") return 1;
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

function parseDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function buildPageUrl(pageNumber: number, activeDate: string | null): string {
  const q = new URLSearchParams({
    page: String(pageNumber),
    ...(activeDate ? { date: activeDate } : {}),
  });
  return `/admin/orders?${q.toString()}`;
}

export default async function OrdersPage({
  searchParams,
}: PageProps<"/admin/orders">) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const date = parseDate(params.date);

  const { orders, totalPages } = await getOrders({ page, date });

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Order</h1>
          <p className="mt-1 text-ink/70">Daftar pesanan masuk</p>
        </div>

        <Form action="/admin/orders" className="flex items-center gap-3">
          <label htmlFor="date" className="text-sm font-medium text-ink/70">
            Filter tanggal:
          </label>
          <input
            id="date"
            type="date"
            name="date"
            defaultValue={date ?? ""}
            className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm shadow-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            Filter
          </button>
          {date && (
            <Link
              href="/admin/orders"
              className="text-sm text-brand underline hover:opacity-80"
            >
              Hapus filter
            </Link>
          )}
        </Form>
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 rounded-xl bg-white p-6 text-ink/60 shadow-sm">
          Tidak ada order yang ditemukan.
        </p>
      ) : (
        <>
          <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase text-ink/60">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Item</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-brand hover:underline"
                      >
                        #{order.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink/80">
                      {order.date} {order.time}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">{order.items}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-brand hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <p className="text-ink/60">
              Halaman <span className="font-bold text-ink">{page}</span> dari{" "}
              <span className="font-bold text-ink">{totalPages}</span>
            </p>
            <div className="flex gap-4">
              {page > 1 ? (
                <Link
                  href={buildPageUrl(page - 1, date)}
                  className="font-semibold text-brand hover:underline"
                >
                  ← Sebelumnya
                </Link>
              ) : (
                <span className="text-ink/30">← Sebelumnya</span>
              )}
              {page < totalPages ? (
                <Link
                  href={buildPageUrl(page + 1, date)}
                  className="font-semibold text-brand hover:underline"
                >
                  Berikutnya →
                </Link>
              ) : (
                <span className="text-ink/30">Berikutnya →</span>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
