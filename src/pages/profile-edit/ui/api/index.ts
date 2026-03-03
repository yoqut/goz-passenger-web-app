export const OTP_LENGTH = 4;
export const RESEND_TIMER_SECONDS = 60;

// Mock Backend Functions (Replace with actual API calls)
export const useMockApi = () => {
  return {
    // Mock API call to update only the user's name
    updateName: async () => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    // Mock API call to send OTP for phone change
    sendOtp: async (newPhone: string) => {
      // On success, returns a message or true
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (newPhone === "+998 91 157 46 65") {
            reject({ message: "Raqam allaqachon ro'yxatdan o'tgan" });
          } else {
            resolve(true);
          }
        }, 1500);
      });
    },
    // Mock API call to verify OTP
    verifyOtp: async (otp: string) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (otp === "1234") {
            resolve(true); // Success
          } else {
            reject({ message: "Noto'g'ri kod" }); // Failure
          }
        }, 1500);
      });
    },
  };
};
