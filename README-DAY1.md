# Day 1 — The Server–Client Boundary

Central question: **what should run on the server, and what should run in the browser?**

## Step map

| Tag | What changes | Who |
|---|---|---|
| `d1-start` | Working app, everything client-side (`useEffect` + `fetch` to route handlers) | — |
| `d1-01` | Menu data read in a Server Component, streamed with `<Suspense>` | Instructor |
| `d1-02` | `"use cache"` on the menu (static shell), favorites streamed with `use()` | Instructor |
| `d1-03` | **P1 solution:** detail page on the server, prerendered per pizza | Students |
| `d1-04` | Favorite becomes a Server Action with `useOptimistic`; header renders on the server | Instructor |
| `d1-05` | **P2 solution:** rating becomes a form Server Action with an optimistic summary | Students |
| `d1-p3-start` | Pizza of the Day banner from a teammate — **does not build on purpose** | Students |
| `d1-06` | **P3 solution:** banner split into server data + client shell | Students |
| `d1-end` = `d2-start` | Day 1 finished state | — |

Practice: `git checkout d1-pN-start`, compare with `d1-pN-solution`.

## Measured (production build, `next start`)

| Tag | Menu content in HTML | API calls on menu load | Heart changes after click | Rating changes after click |
|---|---|---|---|---|
| `d1-start` | never (only "Memuat menu…") | 2 | ~910 ms | ~1.9 s |
| `d1-01` | after ~320 ms (streamed) | 1 | ~910 ms | ~1.9 s |
| `d1-02` | ~5 ms (static shell) | 1 | ~910 ms | ~1.9 s |
| `d1-04` | ~7 ms | 0 | ~55 ms (optimistic) | ~1.9 s |
| `d1-05` | ~7 ms | 0 | ~55 ms | ~40 ms (optimistic) |

Client JS stays ~515–518 KB (decoded, all chunks including the framework) at every step.
Server Components keep *our* data code off the client; they do not shrink the framework.

Artificial latency: reads 300 ms, writes 800 ms (`DEMO_READ_LATENCY_MS`, `DEMO_WRITE_LATENCY_MS`).
