import { useOrderStore } from "@/app/store/order";
import { apiClient } from "@/shared/api/api-client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Fetches order details by ID
 */
const fetchOrderDetails = async (id: number) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

/**
 * Polls for taxi/driver assignment to an order
 * Automatically refetches every 5 seconds until a driver is assigned
 * @returns void - Updates order store when driver is found
 */
export const useSearchTaxi = () => {
  const { order_id, setOrder, order } = useOrderStore();

  const { data } = useQuery({
    queryKey: ["search-taxi", order_id],
    queryFn: () => fetchOrderDetails(order_id!),
    enabled: order_id !== 0 && !order?.driver,
    refetchInterval: (query) => {
      // Stop refetching if driver is found
      const currentData = query.state.data;
      if (currentData?.driver || order?.driver) {
        return false;
      }
      // Poll every 5 seconds
      return 5000;
    },
  });

  useEffect(() => {
    if (data?.driver) {
      setOrder(data);
    }
  }, [data, setOrder]);
};