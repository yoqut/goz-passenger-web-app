import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Container } from "@/shared/ui/container/container";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CancelReasonSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedReason: string | null, otherReason: string) => void;
  isLoading?: boolean;
}

const CANCEL_REASONS = [
  "cancel-reason-changed-mind",
  "cancel-reason-driver-rating",
  "cancel-reason-wrong-direction",
  "cancel-reason-driver-asked",
  "cancel-reason-cant-contact",
] as const;

export const CancelReasonSheet = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CancelReasonSheetProps) => {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState("");

  const handleCheckboxChange = (reasonKey: string) => {
    // If clicking on already selected checkbox, uncheck it
    if (selectedReason === reasonKey) {
      setSelectedReason(null);
    } else {
      // Otherwise, select this one (only one can be selected)
      setSelectedReason(reasonKey);
      // Clear other reason when selecting a predefined reason
      setOtherReason("");
    }
  };

  const handleOtherReasonChange = (value: string) => {
    setOtherReason(value);
    // If user starts typing in other reason, select "other" option
    if (value.trim()) {
      setSelectedReason(null);
    }
  };

  const handleSubmit = () => {
    // If other reason is filled, use it; otherwise use selected reason
    const reason = otherReason.trim() ? null : selectedReason;
    const reasonText = otherReason.trim() || "";
    onSubmit(reason, reasonText);
    // Reset form after submission
    setSelectedReason(null);
    setOtherReason("");
  };

  const handleClose = () => {
    // Reset form when closing
    setSelectedReason(null);
    setOtherReason("");
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={t("order-details.cancel-reason-title")}
      disableDrag={false}
    >
      <Container>
        {/* Checkbox options */}
        <div>
          {CANCEL_REASONS.map((reasonKey) => (
            <label
              key={reasonKey}
              className="flex items-center justify-between cursor-pointer py-2 border-b border-gray-200 pb-4"
            >
              <span className="text-base text-gray-900 flex-1">
                {t(`order-details.${reasonKey}`)}
              </span>
              <input
                type="checkbox"
                checked={selectedReason === reasonKey}
                onChange={() => handleCheckboxChange(reasonKey)}
                className="w-5 h-5 rounded-sm border-gray-300 text-blue-500 focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
            </label>
          ))}
        </div>

        {/* Other reason textarea */}
        <div className="space-y-2 ">
          <label className="block text-base font-medium text-gray-900">
            {t("order-details.cancel-reason-other")}
          </label>
          <textarea
            value={otherReason}
            onChange={(e) => handleOtherReasonChange(e.target.value)}
            placeholder={t("order-details.cancel-reason-other-placeholder")}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || (!selectedReason && !otherReason.trim())}
          className="w-full bg-blue-500 text-white rounded-xl px-4 py-3 font-semibold text-base hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? t("order-details.rejecting") : t("order-details.done")}
        </button>
      </Container>
    </BottomSheet>
  );
};
