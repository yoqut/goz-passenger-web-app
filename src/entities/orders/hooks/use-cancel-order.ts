import { apiClient } from "@/shared/api/api-client";
import type { ICancelOrder } from "@/shared/types/order";
import { useMutation } from "@tanstack/react-query";

/**
 * Creates a new travel order
 * @returns Mutation for creating orders
 */
const cancelOrder = async (order: ICancelOrder) => {
  const response = await apiClient.post("/orders/reject/", order, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useCancelOrder = () => {
  return useMutation({
    mutationKey: ["cancel-order"],
    mutationFn: cancelOrder,
  });
};

// Backward compatibility
export { useCancelOrder as useOrderCancel };
