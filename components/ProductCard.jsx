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

const placeholders = [
  { color: "bg-indigo-100" },
  { color: "bg-emerald-100" },
  { color: "bg-amber-100" },
  { color: "bg-sky-100" },
  { color: "bg-rose-100" },
  { color: "bg-violet-100" },
  { color: "bg-teal-100" },
  { color: "bg-orange-100" },
];

export default function ProductCard({ product }) {
  const price = Number(product.variants?.[0]?.price);
  const priceLabel = Number.isFinite(price) ? `$${price.toFixed(2)}` : "—";
  const inventory = product.variants?.[0]?.inventoryQuantity ?? 0;
  const status = product.status ?? "ACTIVE";

  const grade = [...(product.title ?? "")].reduce(
    (sum, ch) => sum + ch.charCodeAt(0),
    0
  );
  const { color } = placeholders[grade % placeholders.length];
  const initial = (product.title || "P").charAt(0).toUpperCase();

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex h-36 items-center justify-center overflow-hidden">
        {product.featuredImage?.url ? (
          <img
            src={product.featuredImage.url}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${color}`}
          >
            <span className="text-4xl font-bold text-slate-700">{initial}</span>
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
        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="text-base font-semibold text-slate-900">
            {priceLabel}
          </span>
          <span className="text-xs text-slate-400">{inventory} in stock</span>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="h-36 bg-slate-100" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-4 w-3/4 rounded bg-slate-100" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="h-4 w-1/4 rounded bg-slate-100" />
          <div className="h-3 w-1/4 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}