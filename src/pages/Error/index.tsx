import { AlertTriangle } from "@untitledui/icons";
import { useTranslation } from "react-i18next";

const PermissionError = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <AlertTriangle size={80} color="red" />
      <h1 className="text-2xl font-bold text-red-500">
        {t("error.permissionTitle")}
      </h1>
      <h2 className="mt-5 text-center text-lg font-semibold">
        {t("error.telegramOnly")}
      </h2>
    </div>
  );
};

export default PermissionError;
