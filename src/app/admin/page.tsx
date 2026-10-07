import Link from "next/link";
import { Suspense } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import WidgetErrorBoundary from "@/components/admin/WidgetErrorBoundary";
import {
  getLatestDay,
  getStatusCounts,
  getTopPizzas,
} from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/orders";

export default function AdminOverviewPage() {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Overview</h1>
          <p className="mt-1 text-ink/70">Ringkasan performa dan operasional</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-stone-50"
          >
            Kelola produk →
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-stone-50"
          >
            Lihat order →
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Widget 1: Hari Terakhir */}
        <Suspense fallback={<WidgetSkeleton title="Hari Terakhir" />}>
          <LatestDayWidget />
        </Suspense>

        {/* Widget 2: Status Hari Terakhir */}
        <WidgetErrorBoundary title="Status Hari Terakhir">
          <Suspense fallback={<WidgetSkeleton title="Status Hari Terakhir" />}>
            <StatusCountsWidget />
          </Suspense>
        </WidgetErrorBoundary>

        {/* Widget 3: Terlaris Sepanjang Masa */}
        <Suspense fallback={<WidgetSkeleton title="Terlaris Sepanjang Masa" />}>
          <TopPizzasWidget />
        </Suspense>
      </div>
    </section>
  );
}

function WidgetSkeleton({ title }: { title: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-4 animate-pulse text-sm text-ink/60">Memuat data…</p>
    </div>
  );
}

// Widget 1 (Hari Terakhir): Live stream via Suspense tanpa cache agar staf selalu melihat metrik hari terakhir yang aktual dan tidak memblokir widget lain.
async function LatestDayWidget() {
  const day = await getLatestDay();
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">Hari Terakhir</h2>
      <p className="text-sm text-ink/60">Tanggal {day.date}</p>
      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-stone-50 p-3">
          <dt className="text-xs font-semibold uppercase text-ink/60">Order</dt>
          <dd className="mt-1 text-2xl font-black">
            {day.orders.toLocaleString("en-US")}
          </dd>
        </div>
        <div className="rounded-xl bg-stone-50 p-3">
          <dt className="text-xs font-semibold uppercase text-ink/60">Pendapatan</dt>
          <dd className="mt-1 text-2xl font-black">
            {formatPrice(day.revenue)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

// Widget 2 (Status Order): Live stream dengan Error Boundary khusus (WidgetErrorBoundary) agar kegagalan query status (misal server error) tidak merusak widget lain dan bisa dicoba ulang (retry).
async function StatusCountsWidget() {
  const counts = await getStatusCounts();
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">Status Hari Terakhir</h2>
      <p className="text-sm text-ink/60">Distribusi pesanan hari terakhir</p>
      <ul className="mt-4 space-y-2">
        {ORDER_STATUSES.map((status) => (
          <li key={status} className="flex items-center justify-between text-sm">
            <StatusBadge status={status} />
            <span className="font-bold">{counts[status].toLocaleString("en-US")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Widget 3 (Terlaris Sepanjang Masa): Di-cache menggunakan "use cache" dengan cacheLife("hours") di admin-data.ts karena agregasi seluruh riwayat penjualan bersifat mahal (agregat berat) dan data historis tidak berubah drastis setiap menit.
async function TopPizzasWidget() {
  const topPizzas = await getTopPizzas();
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">Terlaris Sepanjang Masa</h2>
      <p className="text-sm text-ink/60">5 pizza paling banyak dipesan</p>
      <ol className="mt-4 space-y-3">
        {topPizzas.map((p, idx) => (
          <li key={p.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-ink/70">
                {idx + 1}
              </span>
              <Link
                href={`/admin/products/${p.id}`}
                className="font-medium text-brand hover:underline"
              >
                {p.name}
              </Link>
            </div>
            <div className="text-right">
              <span className="font-bold">{p.sold.toLocaleString("en-US")} terjual</span>
              <span className="block text-xs text-ink/50">{formatPrice(p.revenue)}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}