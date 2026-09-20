import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api/client";
import { ENDPOINTS } from "../lib/api/config";
import { ProductResponseSchema } from "../lib/shared/schemas/index.js";

export const useProducts = ({ status, cursor, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ["products", status, limit, cursor],
    refetchOnMount: true,
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.products.list, {
        params: { status, limit, cursor },
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