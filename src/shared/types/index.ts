export type Gender = "male" | "female" | "";

export interface AuthFormData {
  fullName: string;
  phone: string;
  gender: Gender;
}

export interface FormValidationErrors extends Partial<AuthFormData> {
  [key: string]: string | undefined;
}

export interface UserDataForOTP {
  telegram_id: number;
  phone: number;
  isDriver: boolean;
}
export interface UserData {
  telegram_id: number;
  phone: number;
  full_name: string;
}
export interface ClientData {
  telegram_id: number;
  language: string;
  full_name: string;
  username: string;
}
export interface FindLocation {
  latitude: number;
  longitude: number;
  max_distance_km: number;
}
export interface PostData {
  user: number;
  from_location: {
    city_id: number;
    location?: {
      latitude: number | null;
      longitude: number | null;
    };
  };
  to_location?: {
    city_id: number;
    location?: {
      latitude: number | null;
      longitude: number | null;
    };
  };
  route_id: number;
  tariff_id: number;
  cashback: number;
  comment?: string | null;
  price?: number | null;
}
export interface PassengerData {
  full_name?: string;
  phone?: number;
}
