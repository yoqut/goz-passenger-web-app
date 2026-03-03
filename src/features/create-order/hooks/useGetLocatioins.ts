import { apiClient } from "@/shared/api/api-client";
import type { City, CityApiResponse, ToCityApiResponse } from "@/shared/types/order";
import { useQuery } from "@tanstack/react-query";

const fetchCities = async (): Promise<City[]> => {
  const response = await apiClient.get<CityApiResponse>("/routes/from-cities/");
  return response.data?.cities || [];
};
const fetchToCities = async (id: number | string): Promise<ToCityApiResponse['target']> => {
  const response = await apiClient.get<ToCityApiResponse>(`/routes/from-city/${id}/`);
  return response.data?.target;
};

export const useGetLocations = () => {
  return useQuery({
    queryKey: ["routes/from-cities"],
    queryFn: fetchCities,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once for locations (important data)
  });
};
export const useGetToLocations = (id: number | string) => {
  return useQuery({
    queryKey: ["routes/from-cities", id],
    queryFn: () => fetchToCities(id),
    enabled: !!id, // Faqat city_id mavjud bo'lganda so'rov yuborish
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once for locations (important data)
  });
};
