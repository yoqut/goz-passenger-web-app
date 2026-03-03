import { Toggle } from "@/shared/ui/toggle/toggle";
import { CheckCircleBroken } from "@untitledui/icons";
import { useTranslation } from "react-i18next";

export const SelectToggle = ({
  freeCar,
  setFreeCar,
}: {
  setFreeCar: (value: boolean) => void;
  freeCar: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between py-4 mt-3">
      <div className="flex gap-3">
        <CheckCircleBroken />
        <h4>{t("home.freeCar")}</h4>
      </div>
      <Toggle size="md" isSelected={freeCar} onChange={setFreeCar} />
    </div>
  );
};
