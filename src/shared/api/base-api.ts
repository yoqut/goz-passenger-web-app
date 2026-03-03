import { apiClient } from "./api-client";

export class BaseApi<TData = unknown, TCreate = unknown, TUpdate = unknown> {
  protected basePath: string;
  constructor(basePath: string) {
    this.basePath = basePath;
  }

  list(params?: unknown) {
    return apiClient.get<TData[]>(this.basePath, { params });
  }

  detail(id: number) {
    return apiClient.get<TData>(`${this.basePath}/${id}`);
  }

  create(data: TCreate) {
    return apiClient.post<TData>(this.basePath, data);
  }

  update(id: number, data: TUpdate) {
    return apiClient.put<TData>(`${this.basePath}/${id}`, data);
  }

  delete(id: number) {
    return apiClient.delete(`${this.basePath}/${id}`);
  }
}
