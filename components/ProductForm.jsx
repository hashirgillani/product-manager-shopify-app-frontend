import { useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PRODUCT_STATUS_VALUES } from "../lib/shared/enums/index.js";
import { ProductBaseSchema } from "../lib/shared/schemas/index.js";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import MediaGallery from "./MediaGallery";

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

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

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <span className="text-slate-400">{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <div className="border-t border-slate-100 px-5 py-4">{children}</div>
      ) : null}
    </section>
  );
}

const moveItem = (array, from, to) => {
  const next = [...array];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export default function ProductForm({ product }) {
  const mutation = useUpdateProduct(product.id);
  const existingInitial = useMemo(() => {
    const fromMedia = (product.media ?? []).map((m) => ({
      key: uid(),
      url: m.url,
      file: null,
    }));
    if (fromMedia.length) return fromMedia;
    const featured = product.featuredImage?.url;
    return featured ? [{ key: uid(), url: featured, file: null }] : [];
  }, [product]);

  const [media, setMedia] = useState(existingInitial);
  const originalUrlsRef = useRef(
    existingInitial.filter((m) => !m.file).map((m) => m.url)
  );

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ProductBaseSchema),
    mode: "onTouched",
    defaultValues: {
      title: product.title ?? "",
      vendor: product.vendor ?? "",
      productType: product.productType ?? "",
      tags: "",
      body_html: "",
      handle: product.handle ?? "",
      seoTitle: product.seo?.title ?? "",
      seoDescription: product.seo?.description ?? "",
      status: product.status ?? "DRAFT",
    },
  });

  const watchedTitle = watch("title");
  const featuredUrl = media[0]?.url ?? null;
  const variant = product.variants?.[0];

  const addFiles = (files) => {
    const next = files.map((file) => ({
      key: uid(),
      url: URL.createObjectURL(file),
      file,
    }));
    setMedia((prev) => [...prev, ...next]);
  };

  const removeItem = (key) => {
    setMedia((prev) => {
      const target = prev.find((item) => item.key === key);
      if (target?.file) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.key !== key);
    });
  };

  const setFeatured = (url) => {
    setMedia((prev) => {
      const index = prev.findIndex((item) => item.url === url);
      if (index <= 0) return prev;
      return moveItem(prev, index, 0);
    });
  };

  const reorder = (from, to) => {
    setMedia((prev) => moveItem(prev, from, to));
  };

  const onSubmit = async (values) => {
    const existingUrls = media
      .filter((item) => !item.file)
      .map((item) => item.url);
    const newFiles = media.filter((item) => item.file).map((item) => item.file);
    const removed = originalUrlsRef.current.filter(
      (url) => !existingUrls.includes(url)
    );

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("vendor", values.vendor ?? "");
    formData.append("productType", values.productType ?? "");
    formData.append("tags", values.tags ?? "");
    formData.append("body_html", values.body_html ?? "");
    formData.append("handle", values.handle ?? "");
    formData.append("seoTitle", values.seoTitle ?? "");
    formData.append("seoDescription", values.seoDescription ?? "");
    formData.append("status", values.status);
    formData.append("mediaOrder", JSON.stringify(existingUrls));
    formData.append(
      "removedMedia",
      JSON.stringify(removed.map((url) => ({ url })))
    );
    formData.append("featuredImage", featuredUrl ?? "");
    for (const file of newFiles) {
      formData.append("media", file);
    }

    await mutation.mutateAsync(formData);
  };

  const saving = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="sticky top-[7.875rem] z-20 -mx-4 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="min-w-0 truncate text-base font-semibold text-slate-900">
            {watchedTitle || "Untitled product"}
          </p>
          <div className="flex items-center gap-3">
            {mutation.isError ? (
              <span className="max-w-[16rem] truncate text-xs font-medium text-red-600">
                {mutation.error?.message ?? "Failed to save."}
              </span>
            ) : null}
            {mutation.isSuccess ? (
              <span className="text-xs font-medium text-green-600">
                Saved.
              </span>
            ) : null}
            <select
              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
              {...register("status")}
            >
              {PRODUCT_STATUS_VALUES.map((value) => (
                <option key={value} value={value}>
                  {statusLabel(value)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <Section title="Media">
        <MediaGallery
          items={media}
          onAddFiles={addFiles}
          onRemove={removeItem}
          onSetFeatured={setFeatured}
          onReorder={reorder}
          featuredUrl={featuredUrl}
        />
      </Section>

      <Section title="Title and description">
        <div className="flex flex-col gap-4">
          <Field label="Title" error={errors.title?.message}>
            <input
              type="text"
              className={inputClass(Boolean(errors.title))}
              {...register("title")}
            />
          </Field>
          <Field label="Description (HTML)" error={errors.body_html?.message}>
            <textarea
              rows={5}
              className={inputClass(Boolean(errors.body_html))}
              {...register("body_html")}
            />
          </Field>
        </div>
      </Section>

      <Section title="Search engine listing">
        <div className="flex flex-col gap-4">
          <Field label="URL handle" error={errors.handle?.message}>
            <input
              type="text"
              className={inputClass(Boolean(errors.handle))}
              placeholder="my-product"
              {...register("handle")}
            />
          </Field>
          <Field label="SEO title" error={errors.seoTitle?.message}>
            <input
              type="text"
              className={inputClass(Boolean(errors.seoTitle))}
              {...register("seoTitle")}
            />
          </Field>
          <Field
            label="SEO description"
            error={errors.seoDescription?.message}
          >
            <textarea
              rows={3}
              className={inputClass(Boolean(errors.seoDescription))}
              {...register("seoDescription")}
            />
          </Field>
        </div>
      </Section>

      <Section title="Product organization">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Product type" error={errors.productType?.message}>
            <input
              type="text"
              className={inputClass(Boolean(errors.productType))}
              {...register("productType")}
            />
          </Field>
          <Field label="Vendor" error={errors.vendor?.message}>
            <input
              type="text"
              className={inputClass(Boolean(errors.vendor))}
              {...register("vendor")}
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
        </div>
      </Section>

      <Section title="Variants" defaultOpen={false}>
        <dl className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-8">
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
              {variant?.inventoryQuantity === null ||
              variant?.inventoryQuantity === undefined
                ? "Not tracked"
                : `${variant.inventoryQuantity} in stock`}
            </dd>
          </div>
        </dl>
      </Section>
    </form>
  );
}