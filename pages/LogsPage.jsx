import { useState } from "react";
import LogEntryCard, {
  LogEntryCardSkeleton,
} from "../components/LogEntryCard";
import { useProductLogs } from "../hooks/useProductLogs";

const LIMIT = 10;

const TIME_OPTIONS = [
  { label: "All time", value: "all" },
  { label: "Last 7 days", value: "7d" },
  { label: "Today", value: "today" },
];

const PRESET_CUTOFFS = {
  all: null,
  "7d": () => Date.now() - 7 * 24 * 60 * 60 * 1000,
  today: () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return start.getTime();
  },
};

export default function LogsPage() {
  const [page, setPage] = useState(1);
  const [preset, setPreset] = useState("all");

  const query = useProductLogs({ page, limit: LIMIT });

  const pageInfo = query.data?.pageInfo;
  const totalPages = pageInfo?.totalPages ?? 1;

  const cutoff = PRESET_CUTOFFS[preset]?.() ?? null;
  const logs = (query.data?.logs ?? []).filter(
    (log) =>
      cutoff === null || new Date(log.createdAt).getTime() >= cutoff
  );

  const goToPage = (nextPage) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      setPage(nextPage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-14 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Logs
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              {query.isLoading
                ? "Loading activity..."
                : `${logs.length} of ${pageInfo?.total ?? 0} records`}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-200/70 p-1">
            {TIME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setPreset(option.value)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  preset === option.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="text-sm text-slate-500">
              Page {pageInfo?.page ?? page} of {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || query.isFetching}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              >
                Prev
              </button>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages || query.isFetching}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {query.isError ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-12 text-center">
            <p className="text-sm font-medium text-red-700">
              Failed to load logs.
            </p>
            <button
              onClick={() => query.refetch()}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        ) : query.isLoading ? (
          <div className="mt-6 flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <LogEntryCardSkeleton key={index} />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            <p className="text-sm font-medium text-slate-700">
              {pageInfo?.total ? "No logs in this time range" : "No logs yet"}
            </p>
            <p className="max-w-md text-sm text-slate-500">
              {pageInfo?.total
                ? "Try widening the time filter or changing the page."
                : "Product updates will appear here once you edit a product."}
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {logs.map((log) => (
              <LogEntryCard key={log._id} log={log} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}