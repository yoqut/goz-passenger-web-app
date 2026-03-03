import { apiClient } from "@/shared/api/api-client";
import type { ICreateOrder } from "@/shared/types/order";
import { useMutation } from "@tanstack/react-query";

/**
 * Creates a new travel order
 * @returns Mutation for creating orders
 */
const createOrder = async (order: ICreateOrder) => {
  const response = await apiClient.post("/travels/", order, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useCreateOrder = () => {
  return useMutation({
    mutationKey: ["create-order"],
    mutationFn: createOrder,
  });
};

// Backward compatibility
export { useCreateOrder as useOrderCreate };
