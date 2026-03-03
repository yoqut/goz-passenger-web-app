import { apiClient } from "./api-client";

// Auth API request/response types
export interface SendOTPRequest {
  phone: string;
  full_name: string;
  telegram_id: number;
}

export interface SendOTPResult {
  id: string;
  message: string;
  status: string;
  sms_code: number;
}

export interface SendOTPResponse {
  status: string;
  result: SendOTPResult;
  message: string;
  telegram_id: number;
}

export class AuthApi {
  private static readonly BASE_PATH = "/otp";

  /**
   * Send OTP code to user's phone number
   * Endpoint: POST /otp/send/
   */
  static async sendOTP(data: SendOTPRequest): Promise<SendOTPResponse> {
    const response = await apiClient.post<SendOTPResponse>(
      `${this.BASE_PATH}/send/`,
      data
    );
    return response.data;
  }
}
