export default function LogsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-14 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Logs
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              Activity history for your products
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
          <p className="text-sm font-medium text-slate-700">No logs yet</p>
          <p className="max-w-md text-sm text-slate-500">
            Activity from product updates will appear here once logging is
            connected.
          </p>
        </div>
      </main>
    </div>
  );
}