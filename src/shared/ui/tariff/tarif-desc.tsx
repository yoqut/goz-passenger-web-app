import { CheckCircle } from "@untitledui/icons";
import { useTranslation } from "react-i18next";

export const TarifDesc = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 my-4">
      <CheckCircle color="#2299D5" />
      <h4 className="text-[14px]">{t("service.privicy")}</h4>
    </div>
  );
};
