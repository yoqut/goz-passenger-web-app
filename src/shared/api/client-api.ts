import { apiClient } from "./api-client";

// Client API response types
export interface ClientUser {
  id: number;
  telegram_id: number;
  username: string;
  full_name: string;
  is_banned: boolean;
}

export interface ClientListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClientUser[];
}

export class ClientApi {
  private static readonly BASE_PATH = "/clients/by-telegram-id";

  static async checkUserExists(
    telegram_id: number
  ): Promise<ClientListResponse> {
    const response = await apiClient.get<ClientListResponse>(
      `${this.BASE_PATH}/`,
      {
        headers: {
          telegram_id: telegram_id.toString(),
        },
      }
    );
    return response.data;
  }

  /**
   * Get client by ID
   */
  static async getClient(id: number): Promise<ClientUser> {
    const response = await apiClient.get<ClientUser>(
      `${this.BASE_PATH}/${id}/`
    );
    return response.data;
  }
}