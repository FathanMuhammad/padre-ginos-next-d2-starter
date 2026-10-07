"use client";

import { catchError, type ErrorInfo } from "next/error";

function WidgetErrorFallback(
  props: { title: string },
  { retry }: ErrorInfo,
) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50/60 p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold text-red-900">{props.title}</h2>
      <p className="mt-2 text-sm text-red-700">Gagal memuat data ini.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-900"
      >
        Coba lagi
      </button>
    </div>
  );
}

const WidgetErrorBoundary = catchError(WidgetErrorFallback);
export default WidgetErrorBoundary;
