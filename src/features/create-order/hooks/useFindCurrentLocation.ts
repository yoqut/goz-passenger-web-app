import { apiClient } from "@/shared/api/api-client";
import type { FindLocation } from "@/shared/types";

import { useMutation } from "@tanstack/react-query";

const findingLocation = async (locationData: FindLocation) => {
  const response = await apiClient.post(
    "/cities/check-location/",
    locationData,
    {
      headers: {
        "Content-Type": "Application/json",
      },
    }
  );
  return response.data;
};

export const useFindCurrentLocation = () => {
  return useMutation({
    mutationKey: ["find-location"],
    mutationFn: findingLocation,
  });
};
