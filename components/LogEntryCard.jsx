import { formatDateTime } from "../lib/shared/utils/index.js";

export default function LogEntryCard({ log }) {
  const hasChanges = log.changes && log.changes.length > 0;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-1 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium text-slate-900">{log.productTitle}</h3>
          {log.source === "shopify" && (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
              Shopify Admin
            </span>
          )}
        </div>
        <time className="shrink-0 text-xs text-slate-500 sm:text-sm">
          {formatDateTime(log.createdAt)}
        </time>
      </div>

      {hasChanges ? (
        <ul className="divide-y divide-slate-100">
          {log.changes.map((change, index) => (
            <li
              key={`${change.field}-${index}`}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-3"
            >
              <span className="w-32 shrink-0 text-sm font-medium text-slate-500">
                {change.label}
              </span>
              {change.before === null && change.after === null ? (
                <p className="text-sm italic text-slate-400">
                  No previous data available — recorded from Shopify Admin.
                </p>
              ) : (
                <span className="flex flex-1 flex-wrap items-center gap-2 text-sm">
                  <span className="min-w-0 rounded-lg bg-slate-100 px-2 py-1 text-slate-600 line-through decoration-slate-400">
                    {String(change.before ?? "—")}
                  </span>
                  <svg
                    className="h-4 w-4 shrink-0 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12l-7.5 7.5M21 12H3"
                    />
                  </svg>
                  <span className="min-w-0 rounded-lg bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                    {String(change.after ?? "—")}
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-3 text-sm text-slate-500">
          No field changes recorded for this update.
        </p>
      )}
    </article>
  );
}

export function LogEntryCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-4 w-1/3 rounded bg-slate-100" />
        <div className="h-3 w-24 rounded bg-slate-100" />
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="h-4 w-1/2 rounded bg-slate-100" />
        <div className="h-4 w-2/3 rounded bg-slate-100" />
      </div>
    </div>
  );
}