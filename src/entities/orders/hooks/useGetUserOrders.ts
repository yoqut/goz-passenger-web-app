import { apiClient } from "@/shared/api/api-client"
import { useQuery } from "@tanstack/react-query"


const fetchOrders = async (userId?: number) => {
  const response = await apiClient.get(`/orders/user/${userId}`)
  return response.data
}


export const useGetUserOrders = (userId?: number) => {

  return useQuery({
    queryKey: ["orders", "user", userId],
    queryFn: () => fetchOrders(userId),
    enabled: !!userId,
    retry: false, // Do not retry on error
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch when component mounts
    staleTime: 0, // Always consider data stale, so it refetches on mount
  })
}