import { XClose } from "@untitledui/icons";
import { memo } from "react";
import { useTranslation } from "react-i18next";

interface DatePickerHeaderProps {
  onClose: () => void;
}

/**
 * DatePicker header komponenti
 */
export const DatePickerHeader = memo(({ onClose }: DatePickerHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="px-4 pt-4 pb-2 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">
        {t("datePicker.title")}
      </h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-full"
        aria-label="Close"
      >
        <XClose className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
});

DatePickerHeader.displayName = "DatePickerHeader";

