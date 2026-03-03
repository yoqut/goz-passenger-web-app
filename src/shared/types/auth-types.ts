export type Gender = "male" | "female" | "";

export interface AuthFormData {
  fullName: string;
  phone: string;
}

export interface FormValidationErrors extends Partial<AuthFormData> {
  [key: string]: string | undefined;
}
export interface GenderOption {
  label: string;
  value: Gender;
  isDisabled?: boolean;
  id: string;
}
