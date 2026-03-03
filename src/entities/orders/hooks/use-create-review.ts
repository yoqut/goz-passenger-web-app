import { apiClient } from "@/shared/api/api-client";
import type { ICancelOrder } from "@/shared/types/order";
import { useMutation } from "@tanstack/react-query";

/**
 * Creates a new travel order
 * @returns Mutation for creating orders
 */
const createReview = async (review: ICancelOrder) => {
  const response = await apiClient.post("/orders/review/", review);
  return response.data;
};

export const useCreateReview = () => {
  return useMutation({
    mutationKey: ["create-review"],
    mutationFn: createReview,
  });
};

// Backward compatibility
export { useCreateReview as useOrderCreateReview };
