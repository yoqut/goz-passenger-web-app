import { useQuery } from "@tanstack/react-query";
import { ClientApi } from "./client-api";


export const useCheckUserExists = (telegram_id: number | undefined, enabled = true) => {
  return useQuery({
    queryKey: ["client", "check", telegram_id],
    queryFn: () => {
      if (!telegram_id) throw new Error("Telegram ID is required");
      return ClientApi.checkUserExists(telegram_id);
    },
    enabled: enabled && !!telegram_id,
    retry: false, // Do not retry on error
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};