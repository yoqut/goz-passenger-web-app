import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Toggle } from "@/shared/ui/toggle/toggle";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface UseCashbackSheetProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount: number;
  maxAmount: number;
  onConfirm: (amount: number) => void;
}

export const UseCashbackSheet = ({
  isOpen,
  onClose,
  availableAmount,
  maxAmount,
  onConfirm,
}: UseCashbackSheetProps) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>("");
  const [useAll, setUseAll] = useState(false);

  const handleUseAllToggle = (value: boolean) => {
    setUseAll(value);
    if (value) {
      // Use minimum of available and max
      const useAmount = Math.min(availableAmount, maxAmount);
      setAmount(useAmount.toString());
    } else {
      setAmount("");
    }
  };

  const handleConfirm = () => {
    const finalAmount = useAll
      ? Math.min(availableAmount, maxAmount)
      : Number.parseInt(amount || "0", 10);
    if (finalAmount > 0) {
      onConfirm(finalAmount);
      // Reset form
      setAmount("");
      setUseAll(false);
      onClose();
    }
  };

  const currentAmount = useAll
    ? Math.min(availableAmount, maxAmount)
    : Number.parseInt(amount || "0", 10);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t("service.useCashbackTitle")}
      disableDrag={false}
      closeButton={true}
    >
      <div className="space-y-6 pb-4">
        {/* Available cashback info */}
        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
          <p className="text-sm text-gray-600">
            {t("service.availableCashback", {
              amount: availableAmount.toLocaleString(),
            })}
          </p>
          <p className="text-sm text-gray-600">
            {t("service.useCashbackMax", {
              amount: Math.min(maxAmount, availableAmount).toLocaleString(),
            })}
          </p>
        </div>

        {/* Amount input */}
        <div className="relative">
          <input
            type="number"
            value={currentAmount > 0 ? currentAmount : ""}
            onChange={(e) => {
              const value = e.target.value;
              if (useAll) {
                setUseAll(false);
              }
              if (value === "") {
                setAmount("");
              } else {
                const numValue = Number.parseInt(value, 10);
                if (!Number.isNaN(numValue)) {
                  // Mavjud cashback va safar narxidan katta bo'lmasin
                  const maxAllowed = Math.min(maxAmount, availableAmount);
                  if (numValue <= maxAllowed) {
                    setAmount(numValue.toString());
                  } else {
                    setAmount(maxAllowed.toString());
                  }
                }
              }
            }}
            placeholder="0"
            min="0"
            max={Math.min(maxAmount, availableAmount)}
            inputMode="numeric"
            className="w-full text-4xl font-bold text-gray-900 text-center bg-gray-50 rounded-xl px-4 py-6 border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
          />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-gray-500">
            {t("currency")}
          </div>
        </div>

        {/* Use all toggle */}
        <div className="flex items-center justify-between py-2">
          <span className="text-base text-gray-900">
            {t("service.useAllCashback")}
          </span>
          <Toggle isSelected={useAll} onChange={handleUseAllToggle} size="md" />
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={currentAmount === 0}
          className="w-full bg-blue-500 text-white rounded-xl px-4 py-4 font-semibold text-base hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentAmount > 0
            ? t("service.useCashbackButton", {
                amount: currentAmount.toLocaleString(),
              })
            : t("service.useCashbackTitle")}
        </button>
      </div>
    </BottomSheet>
  );
};
