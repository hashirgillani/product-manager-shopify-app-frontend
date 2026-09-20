import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api/client";
import { ENDPOINTS } from "../lib/api/config";
import { ProductLogSchema } from "../lib/shared/schemas/index.js";

export const useProductLogs = ({ page = 1, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ["productLogs", page, limit],
    refetchOnMount: true,
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.products.logs, {
        params: { page, limit },
      });
      return {
        logs: data.data.logs.map((log) => ProductLogSchema.parse(log)),
        pageInfo: data.data.pageInfo,
      };
    },
  });
};