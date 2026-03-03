import { apiClient } from "@/shared/api/api-client";
import type { PostData } from "@/shared/types";

import { useMutation } from "@tanstack/react-query";

const fetchingOrder = async (postData: PostData) => {
  const response = await apiClient.post("/posts/", postData, {
    headers: {
      "Content-Type": "Application/json",
    },
  });
  return response.data;
};

export const useCreateDelivery = () => {
  return useMutation({
    mutationKey: ["create-post"],
    mutationFn: fetchingOrder,
  });
};
