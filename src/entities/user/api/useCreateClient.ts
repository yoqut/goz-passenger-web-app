import { apiClient } from "@/shared/api/api-client";
import type { ClientData } from "@/shared/types";

import { useMutation } from "@tanstack/react-query";

const createClient = async (clientData: ClientData) => {
  const response = await apiClient.post("/clients/", clientData, {
    headers: {
      "Content-Type": "Application/json",
    },
  });
  return response.data;
};

export const useCreateClient = () => {
  return useMutation({
    mutationKey: ["create-client"],
    mutationFn: createClient,
  });
};
