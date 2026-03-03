import { apiClient } from "@/shared/api/api-client";
import { useQuery } from "@tanstack/react-query";

interface CashbackResponse {
    data:{

        amount: number;
        telegram_id: number;
        id: number;
    }

}

const fetchUserCashback = async (userId: number): Promise<CashbackResponse> => {
  const response = await apiClient.get<CashbackResponse>(
    `/cashback/user/${userId}/`
  );
  return response.data;
};

/**
 * Hook to get user's cashback balance
 * @param userId - User's telegram ID
 * @returns Query result with cashback balance
 */
export const useGetUserCashback = (userId?: number) => {
  return useQuery({
    queryKey: ["cashback", "user", userId],
    queryFn: () => fetchUserCashback(userId!),
    enabled: !!userId,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
