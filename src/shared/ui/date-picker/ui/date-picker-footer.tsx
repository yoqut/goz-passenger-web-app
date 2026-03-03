import { memo } from "react";
import { useTranslation } from "react-i18next";
import DefaultButton from "../../default-button";

interface DatePickerFooterProps {
  onConfirm: () => void;
}

/**
 * DatePicker footer komponenti
 */
export const DatePickerFooter = memo(({ onConfirm }: DatePickerFooterProps) => {
  const { t } = useTranslation();

  return (
    <div className="px-4 pt-4 pb-6">
      <DefaultButton
        className="w-full"
        text={t("datePicker.select")}
        onClick={onConfirm}
      />
    </div>
  );
});

DatePickerFooter.displayName = "DatePickerFooter";

