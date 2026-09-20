import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { useProduct } from "../hooks/useProduct";
import { ProductResponseSchema } from "../lib/shared/schemas/index.js";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const query = useProduct(id);

  let content;
  if (query.isError) {
    content = (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-12 text-center">
        <p className="text-sm font-medium text-red-700">
          Failed to load product.
        </p>
        <button
          onClick={() => query.refetch()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
        >
          Retry
        </button>
      </div>
    );
  } else if (query.isLoading) {
    content = (
      <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="h-56 bg-slate-100" />
        <div className="flex flex-col gap-4 p-6">
          <div className="h-4 w-1/3 rounded bg-slate-100" />
          <div className="h-4 w-1/2 rounded bg-slate-100" />
          <div className="h-24 rounded bg-slate-100" />
        </div>
      </div>
    );
  } else {
    const parsed = ProductResponseSchema.safeParse(query.data);
    content = parsed.success ? (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProductForm product={parsed.data} />
      </div>
    ) : (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm font-medium text-red-700">
        Product data is invalid.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-14 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Product details
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              {query.isLoading ? "Loading product..." : (query.data?.title ?? "Viewing product")}
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">{content}</main>
    </div>
  );
}