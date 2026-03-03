import { apiClient } from "@/shared/api/api-client";
import type { UserDataForOTP } from "@/shared/types";

import { useMutation } from "@tanstack/react-query";

const fetchingOrder = async (userData: UserDataForOTP) => {
  const response = await apiClient.post("/sms/", userData, {
    headers: {
      "Content-Type": "Application/json",
    },
  });
  return response.data;
};

export const usePassengerSendOTP = () => {
  return useMutation({
    mutationKey: ["send-otp"],
    mutationFn: fetchingOrder,
  });
};
