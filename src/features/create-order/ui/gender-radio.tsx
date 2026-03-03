import {
  RadioButton,
  RadioGroup,
} from "@/shared/ui/radio-buttons/radio-buttons";
import { useTranslation } from "react-i18next";

export const GenderSelectRadio = ({
  setsetGender,
  gender,
}: {
  setsetGender: (value: string) => void;
  gender: string;
}) => {
  const { t } = useTranslation();

  const handleChange = (value: string) => {
    setsetGender(value);
  };

  return (
    <RadioGroup
      aria-label="gender"
      className="flex flex-row  w-full"
      defaultValue="man"
      value={gender}
      onChange={handleChange}
    >
      <RadioButton
        label={t("home.man")}
        value="man"
        className={
          "flex flex-row-reverse w-1/2 items-start justify-end  text-2xl font-normal"
        }
      />
      <RadioButton
        label={t("home.woman")}
        value="woman"
        className={"flex flex-row-reverse  w-1/2 items-start justify-end"}
      />
    </RadioGroup>
  );
};
