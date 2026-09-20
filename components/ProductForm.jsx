import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PRODUCT_STATUS_VALUES } from "../lib/shared/enums/index.js";
import { ProductBaseSchema } from "../lib/shared/schemas/index.js";

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-slate-400 focus:ring-slate-200"
  }`;

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    {children}
    {error ? <p className="text-xs text-red-600">{error}</p> : null}
  </div>
);

const statusLabel = (value) =>
  value.charAt(0) + value.slice(1).toLowerCase();

export default function ProductForm({ product }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProductBaseSchema),
    mode: "onTouched",
    defaultValues: {
      title: product.title ?? "",
      vendor: product.vendor ?? "",
      productType: product.productType ?? "",
      tags: "",
      body_html: "",
      status: product.status ?? "DRAFT",
    },
  });

  const variant = product.variants?.[0];

  const onSubmit = (values) => {
    console.info("Product update not implemented yet", values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 md:flex-row">
        {product.featuredImage?.url ? (
          <img
            src={product.featuredImage.url}
            alt={product.title}
            className="h-40 w-40 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-4xl font-bold text-slate-700">
            {(product.title || "P").charAt(0).toUpperCase()}
          </div>
        )}
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium text-slate-500">Handle</dt>
            <dd className="text-slate-900">{product.handle}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-slate-500">Price</dt>
            <dd className="text-slate-900">
              {variant?.price ? `$${variant.price}` : "—"}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-slate-500">SKU</dt>
            <dd className="text-slate-900">{variant?.sku ?? "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-slate-500">Inventory</dt>
            <dd className="text-slate-900">
              {variant?.inventoryQuantity ?? 0} in stock
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Title" error={errors.title?.message}>
          <input
            type="text"
            className={inputClass(Boolean(errors.title))}
            {...register("title")}
          />
        </Field>

        <Field label="Status" error={errors.status?.message}>
          <select
            className={inputClass(Boolean(errors.status))}
            {...register("status")}
          >
            {PRODUCT_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {statusLabel(value)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Vendor" error={errors.vendor?.message}>
          <input
            type="text"
            className={inputClass(Boolean(errors.vendor))}
            {...register("vendor")}
          />
        </Field>

        <Field label="Product type" error={errors.productType?.message}>
          <input
            type="text"
            className={inputClass(Boolean(errors.productType))}
            {...register("productType")}
          />
        </Field>

        <Field label="Tags" error={errors.tags?.message}>
          <input
            type="text"
            className={inputClass(Boolean(errors.tags))}
            placeholder="Comma separated"
            {...register("tags")}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Description (HTML)" error={errors.body_html?.message}>
            <textarea
              rows={4}
              className={inputClass(Boolean(errors.body_html))}
              {...register("body_html")}
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}