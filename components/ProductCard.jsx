const statusStyles = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  DRAFT: "bg-amber-50 text-amber-700 ring-amber-600/20",
  ARCHIVED: "bg-slate-100 text-slate-500 ring-slate-500/20",
};

const statusLabels = {
  ACTIVE: "Active",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};

export default function ProductCard({ product, onClick }) {
  const status = product.status ?? "ACTIVE";
  const image = product.featuredImage?.url ?? product.media?.[0]?.url ?? null;
  const initial = (product.title || "P").charAt(0).toUpperCase();

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <span className="text-4xl font-bold text-slate-400">{initial}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-1 font-medium text-slate-900">
            {product.title}
          </h2>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
          >
            {statusLabels[status]}
          </span>
        </div>
        <p className="text-sm text-slate-500">{product.vendor}</p>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[4/3] bg-slate-100" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 rounded bg-slate-100" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
    </div>
  );
}