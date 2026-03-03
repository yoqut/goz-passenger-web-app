import { CashbackIcon } from "@/app/assets";
import { ChevronRight } from "@untitledui/icons";
import { useTranslation } from "react-i18next";

interface CashbackUsageProps {
  availableAmount: number;
  onClick?: () => void;
}

export const CashbackUsage = ({
  availableAmount,
  onClick,
}: CashbackUsageProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
          <CashbackIcon />
        </div>
        <div className="flex flex-col">
          <p className="text-[16px] font-medium text-gray-900">
            {t("service.useCashback")}
          </p>
          <p className="text-sm text-gray-500">
            {t("service.availableCashback", {
              amount: availableAmount.toLocaleString(),
            })}
          </p>
        </div>
      </div>
      <ChevronRight className="text-gray-400" size={20} />
    </div>
  );
};
