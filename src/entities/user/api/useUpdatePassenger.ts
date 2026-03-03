import { apiClient } from "@/shared/api/api-client";
import type { PassengerData } from "@/shared/types";

import { useMutation } from "@tanstack/react-query";

const updatePassenger = async ({
  id,
  passengerData,
}: {
  id: number;
  passengerData: PassengerData;
}) => {
  const response = await apiClient.patch(`/passengers/${id}/`, passengerData, {
    headers: {
      "Content-Type": "Application/json",
    },
  });
  return response.data;
};

export const useUpdatePassenger = () => {
  return useMutation({
    mutationKey: ["update-passenger"],
    mutationFn: updatePassenger,
  });
};
