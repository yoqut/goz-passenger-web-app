import { apiClient } from "@/shared/api/api-client";
import type { UserData } from "@/shared/types";

import { useMutation } from "@tanstack/react-query";

const fetchingOrder = async (userData: UserData) => {
  const response = await apiClient.post("/passengers/", userData, {
    headers: {
      "Content-Type": "Application/json",
    },
  });
  return response.data;
};

export const useCreatePassenger = () => {
  return useMutation({
    mutationKey: ["send-otp"],
    mutationFn: fetchingOrder,
  });
};
