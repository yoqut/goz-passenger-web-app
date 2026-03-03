import { apiClient } from "@/shared/api/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteOrder = async (id: number | string) => {
  await apiClient.patch(`/orders/${id}/`, { status: "rejected" });
};

export const useOrderDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

