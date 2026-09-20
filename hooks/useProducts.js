import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api/client";
import { ENDPOINTS } from "../lib/api/config";
import { ProductResponseSchema } from "../lib/shared/schemas/index.js";

export const useProducts = ({ status, cursor, search, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ["products", status, limit, cursor, search],
    refetchOnMount: true,
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.products.list, {
        params: { status, limit, cursor, search },
      });
      return {
        products: data.data.products.map((product) =>
          ProductResponseSchema.parse(product)
        ),
        pageInfo: data.data.pageInfo,
      };
    },
  });
};