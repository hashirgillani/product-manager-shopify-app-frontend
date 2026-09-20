import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api/client";
import { ENDPOINTS } from "../lib/api/config";
import { toNumericShopifyId } from "../lib/shared/utils/index.js";

export const useProduct = (id) => {
  const endpointId = toNumericShopifyId(id);

  return useQuery({
    queryKey: ["product", endpointId],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.products.detail(endpointId));
      return data.data.product;
    },
    enabled: Boolean(endpointId),
  });
};