import { z } from "zod";

export const ProductLogChangeSchema = z.object({
  field: z.string(),
  label: z.string(),
  before: z.unknown().nullable().default(null),
  after: z.unknown().nullable().default(null),
});

export const ProductLogSchema = z.object({
  _id: z.string(),
  productId: z.string().nullable().default(null),
  productTitle: z.string().default(""),
  source: z.enum(["app", "shopify"]).default("app"),
  changes: z.array(ProductLogChangeSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ProductLogsPageInfoSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});