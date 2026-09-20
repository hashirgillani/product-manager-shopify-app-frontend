import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard, {
  ProductCardSkeleton,
} from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { toNumericShopifyId } from "../lib/shared/utils/index.js";

const TABS = ["All", "Active", "Draft", "Archived"];

const STATUS_MAP = {
  All: undefined,
  Active: "ACTIVE",
  Draft: "DRAFT",
  Archived: "ARCHIVED",
};

const LIMIT = 10;

export default function ProductListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [cursor, setCursor] = useState(null);
  const [products, setProducts] = useState([]);

  const status = STATUS_MAP[activeTab];
  const query = useProducts({ status, cursor, limit: LIMIT });

  useEffect(() => {
    if (!query.data) return;
    setProducts((prev) =>
      cursor === null ? query.data.products : [...prev, ...query.data.products]
    );
  }, [query.data, cursor]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCursor(null);
    setProducts([]);
  };

  const loadMore = () => {
    if (query.data?.pageInfo?.hasNextPage) {
      setCursor(query.data.pageInfo.endCursor);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Products
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              {query.isLoading
                ? "Loading products..."
                : `${products.length} products`}
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
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {query.isError && products.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-12 text-center">
            <p className="text-sm font-medium text-red-700">
              Failed to load products.
            </p>
            <button
              onClick={() => query.refetch()}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        ) : query.isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">
              No products found
            </p>
            <p className="text-sm text-slate-500">
              Create a product or switch to another status tab.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() =>
                    navigate(`/products/${toNumericShopifyId(product.id)}`)
                  }
                />
              ))}
            </div>
            {query.data?.pageInfo?.hasNextPage && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={query.isFetching}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
                >
                  {query.isFetching ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}