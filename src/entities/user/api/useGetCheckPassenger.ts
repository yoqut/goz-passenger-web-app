import { apiClient } from "@/shared/api/api-client";
import { useQuery } from "@tanstack/react-query";

const fetchOrders = async (telegram_id?: number) => {
  const response = await apiClient.get(`/passengers/user/${telegram_id}`);
  return response.data;
};

export const useGetCheckPassenger = (telegram_id?: number) => {
  return useQuery({
    queryKey: ["passenger", "check", telegram_id],
    queryFn: () => fetchOrders(telegram_id),
    enabled: !!telegram_id,
    retry: false, // Do not retry on error
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
};
