import { useMutation } from "@tanstack/react-query";
import { AuthApi, type SendOTPRequest } from "./auth-api";

/**
 * Hook for sending OTP to user's phone
 * Usage:
 * const { mutateAsync: sendOTP, isPending } = useSendOTP();
 * await sendOTP({ phone: "+998901234567", full_name: "John Doe", telegram_id: 123456 });
 */
export const useSendOTP = () => {
  return useMutation({
    mutationFn: (data: SendOTPRequest) => AuthApi.sendOTP(data),
    onError: (error) => {
      console.error("Failed to send OTP:", error);
    },
  });
};
