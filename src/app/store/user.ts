import { create } from "zustand";

interface IUserProps {
  name: string;
  phone: number;
  image: string;
  // OTP verification data
  otpCode: string | null;
  fullName: string | null;
  telegram_id: number | null;
  setUser: ({
    name,
    phone,
    image,
  }: Partial<
    Omit<IUserProps, "setUser" | "setOtpData" | "clearOtpData">
  >) => void;
  // Store OTP data from SendOTP response
  setOtpData: (
    otpCode: string,
    fullName: string,
    telegram_id: number,
    phone: number
  ) => void;
  // Clear OTP data after verification
  clearOtpData: () => void;
}

export const useUserStore = create<IUserProps>((set) => ({
  name: "Абдуллаев Темур",
  phone: 998911574665,
  image: "https://www.untitledui.com/images/avatars/abraham-baker",
  otpCode: null,
  fullName: null,
  telegram_id: null,
  setUser: (changes) => set((state) => ({ ...state, ...changes })),
  setOtpData: (otpCode, fullName, telegram_id, phone) =>
    set({ otpCode, fullName, telegram_id, phone }),
  clearOtpData: () => set({ otpCode: null, fullName: null, telegram_id: null }),
}));
