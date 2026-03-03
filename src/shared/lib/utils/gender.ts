import type { GenderOption } from "@/shared/types/auth-types";

export const getGenderOptions: GenderOption[] = [
  {
    id: "1",
    label: "auth.genderSelect",
    isDisabled: true,
    value: "",
  },
  {
    id: "2",
    label: "auth.male",
    value: "male",
  },
  {
    id: "3",
    label: "auth.female",
    value: "female",
  },
];
