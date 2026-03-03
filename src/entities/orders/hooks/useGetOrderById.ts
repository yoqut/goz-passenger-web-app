import { apiClient } from "@/shared/api/api-client";
import { useQuery } from "@tanstack/react-query";

const fetchOrderById = async (orderId: number | string) => {
  const response = await apiClient.get(`/orders/${orderId}/`);
  return response.data;
};

export const useGetOrderById = (orderId: number | string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
