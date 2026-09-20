import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api/client";
import { ENDPOINTS } from "../lib/api/config";
import { toNumericShopifyId } from "../lib/shared/utils/index.js";

export const useUpdateProduct = (id) => {
  const queryClient = useQueryClient();
  const endpointId = toNumericShopifyId(id);

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await apiClient.patch(
        ENDPOINTS.products.update(endpointId),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data.data.product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", endpointId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productLogs"] });
    },
  });
};