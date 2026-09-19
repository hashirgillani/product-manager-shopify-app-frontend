import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api/client";
import { ENDPOINTS } from "../lib/api/config";

export const useProducts = ({ status, cursor, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ["products", status, limit, cursor],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.products.list, {
        params: { status, limit, cursor },
      });
      return data.data;
    },
  });
};