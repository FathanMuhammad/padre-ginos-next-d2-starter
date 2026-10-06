"use client";

import { useState } from "react";

// The only interactive part: remember whether the banner was closed
export default function DismissibleBanner({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <aside className="mb-8 flex items-center gap-4 rounded-2xl bg-brand-dark p-4 text-white shadow">
      {children}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="rounded-lg bg-white/15 px-3 py-1 text-sm font-semibold hover:bg-white/25"
      >
        Tutup
      </button>
    </aside>
  );
}
