import { z } from "zod";

import { PRODUCT_STATUS_VALUES } from "../enums/index.js";

/**
 * @typedef {import("zod").infer<typeof ProductStatusSchema>} ProductStatus
 * @typedef {import("zod").infer<typeof ProductResponseSchema>} ProductResponse
 * @typedef {import("zod").infer<typeof ProductApiResponseSchema>} ProductApiResponse
 * @typedef {import("zod").infer<typeof ProductVariantSchema>} ProductVariant
 * @typedef {import("zod").infer<typeof ProductBaseSchema>} ProductFormInput
 * @typedef {import("zod").infer<typeof UpdateProductSchema>} UpdateProductInput
 * @typedef {import("zod").infer<typeof MediaItemSchema>} MediaItem
 */

const GID_PATTERN = /^gid:\/\/shopify\/\w+\/\d+$/;

export const ProductStatusSchema = z.enum(PRODUCT_STATUS_VALUES);

export const FeaturedImageSchema = z
  .object({
    url: z.string(),
  })
  .nullable()
  .default(null);

export const MediaItemSchema = z
  .object({
    id: z.string(),
    image: z.object({ url: z.string() }).nullable().default(null),
  })
  .transform((media) => ({ id: media.id, url: media.image?.url ?? "" }));

export const MediaConnectionSchema = z.object({
  nodes: z.array(MediaItemSchema),
});

export const ProductVariantSchema = z.object({
  id: z.string().regex(GID_PATTERN, "Invalid variant ID"),
  title: z.string(),
  price: z.string().default("0"),
  sku: z.string().nullable().default(null),
  inventoryQuantity: z.number().int().nullable().default(null),
});

const VariantsConnectionSchema = z.object({
  nodes: z.array(ProductVariantSchema),
});

export const ProductResponseSchema = z.object({
  id: z.string().regex(GID_PATTERN, "Invalid product ID"),
  title: z.string(),
  status: ProductStatusSchema,
  handle: z.string(),
  vendor: z.string().nullable().default(null),
  productType: z.string().nullable().default(null),
  seo: z
    .object({
      title: z.string().nullable().default(""),
      description: z.string().nullable().default(""),
    })
    .nullable()
    .default(null),
  featuredImage: FeaturedImageSchema,
  media: z
    .union([
      z.array(MediaItemSchema),
      MediaConnectionSchema,
    ])
    .transform((m) => (Array.isArray(m) ? m : m.nodes))
    .default([]),
  variants: z
    .union([
      z.array(ProductVariantSchema),
      VariantsConnectionSchema,
    ])
    .transform((v) => (Array.isArray(v) ? v : v.nodes))
    .default([]),
  createdAt: z.string(),
});

export const ProductApiResponseSchema = z.object({
  data: z.object({
    product: ProductResponseSchema,
  }),
});

export const ProductBaseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .transform((v) => v.trim()),
  vendor: z.string().optional(),
  productType: z.string().optional(),
  tags: z.string().optional(),
  body_html: z.string().optional(),
  handle: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: ProductStatusSchema.default("DRAFT"),
});

export const UpdateProductSchema = ProductBaseSchema.partial();