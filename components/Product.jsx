const products = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    vendor: "Urban Threads",
    price: 89.0,
    status: "Active",
    inventory: 42,
    color: "bg-indigo-100",
    initial: "V",
  },
  {
    id: 2,
    title: "Organic Cotton Tee",
    vendor: "Pure Basics",
    price: 24.0,
    status: "Active",
    inventory: 128,
    color: "bg-emerald-100",
    initial: "O",
  },
  {
    id: 3,
    title: "Leather Crossbody Bag",
    vendor: "Urban Threads",
    price: 129.0,
    status: "Draft",
    inventory: 8,
    color: "bg-amber-100",
    initial: "L",
  },
  {
    id: 4,
    title: "Minimalist Watch",
    vendor: "Nordic Goods",
    price: 199.0,
    status: "Active",
    inventory: 15,
    color: "bg-sky-100",
    initial: "M",
  },
  {
    id: 5,
    title: "Wool Blend Scarf",
    vendor: "Nordic Goods",
    price: 45.0,
    status: "Archived",
    inventory: 0,
    color: "bg-rose-100",
    initial: "W",
  },
  {
    id: 6,
    title: "Ceramic Coffee Mug",
    vendor: "Pure Basics",
    price: 18.0,
    status: "Active",
    inventory: 256,
    color: "bg-violet-100",
    initial: "C",
  },
  {
    id: 7,
    title: "Canvas Tote Bag",
    vendor: "Urban Threads",
    price: 32.0,
    status: "Draft",
    inventory: 64,
    color: "bg-teal-100",
    initial: "C",
  },
  {
    id: 8,
    title: "Stainless Water Bottle",
    vendor: "Pure Basics",
    price: 28.0,
    status: "Active",
    inventory: 92,
    color: "bg-orange-100",
    initial: "S",
  },
];

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Draft: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Archived: "bg-slate-100 text-slate-500 ring-slate-500/20",
};

export default function Product() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Products
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              8 products
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New product
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="flex gap-1 rounded-lg bg-slate-200/70 p-1">
            {["All", "Active", "Draft", "Archived"].map((tab) => (
              <button
                key={tab}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  tab === "All"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div
                className={`flex h-36 items-center justify-center ${product.color}`}
              >
                <span className="text-4xl font-bold text-slate-700">
                  {product.initial}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="line-clamp-1 font-medium text-slate-900">
                    {product.title}
                  </h2>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[product.status]}`}
                  >
                    {product.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{product.vendor}</p>
                <div className="mt-auto flex items-end justify-between pt-2">
                  <span className="text-base font-semibold text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {product.inventory} in stock
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}