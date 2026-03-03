import { XClose } from "@untitledui/icons";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";

interface SwipeToCancelProps {
  onCancel: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  cancelText?: string;
  hintText?: string;
}

export const SwipeToCancel = ({
  onCancel,
  isLoading = false,
  disabled = false,
  cancelText,
  hintText,
}: SwipeToCancelProps) => {
  const { t } = useTranslation();
  const swipeRef = useRef<HTMLDivElement>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [deltaX, setDeltaX] = useState(0);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (disabled || isLoading || !swipeRef.current) return;

      const container = swipeRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;

      // Faqat o'ngga swipe qilish (deltaX musbat)
      if (eventData.dir === "Left" || eventData.deltaX <= 0) {
        setSwipeProgress(0);
        setDeltaX(0);
        return;
      }

      // Progress va deltaX ni saqlash
      const progress = Math.min((eventData.deltaX / containerWidth) * 100, 100);
      setSwipeProgress(progress);
      setDeltaX(Math.min(eventData.deltaX, containerWidth));
    },
    onSwiped: (eventData) => {
      if (disabled || isLoading || !swipeRef.current) return;

      const container = swipeRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;

      // Faqat o'ngga swipe qilingan bo'lsa
      if (eventData.dir !== "Right" || eventData.deltaX <= 0) {
        setSwipeProgress(0);
        setDeltaX(0);
        return;
      }

      const finalProgress = (eventData.deltaX / containerWidth) * 100;

      // Agar 80% dan ko'p bo'lsa, cancel qilish
      if (finalProgress >= 80) {
        onCancel();
      }

      // Reset progress
      setTimeout(() => {
        setSwipeProgress(0);
        setDeltaX(0);
      }, 100);
    },
    trackMouse: true, // Desktop uchun mouse support
    preventScrollOnSwipe: true,
    trackTouch: true,
    delta: 5, // Minimum swipe distance
  });

  return (
    <div className="mt-8 mb-4">
      <div
        {...handlers}
        ref={(el) => {
          swipeRef.current = el;
          if (handlers.ref) {
            handlers.ref(el);
          }
        }}
        className="relative flex items-center gap-3 bg-gray-200 rounded-full px-2 py-2.5 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "pan-y" }}
      >
        {/* Progress indicator - background */}
        {swipeProgress > 0 && (
          <div
            className="absolute inset-y-0 left-0 bg-gray-700 transition-all duration-75 ease-out rounded-full"
            style={{ width: `${swipeProgress}%` }}
          >
            <p className="text-md text-white mt-5 text-center ">
              {t("service.cancelHintText")}
            </p>
          </div>
        )}

        {/* X button va text - background bilan birga to'liq suriladi */}
        <div
          className="relative z-10 flex items-center gap-3 w-full transition-transform duration-75 ease-out"
          style={{
            transform: deltaX > 0 ? `translateX(${deltaX}px)` : undefined,
          }}
        >
          {/* X button */}
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 text-white shrink-0 transition-transform duration-100 ${
              swipeProgress > 0 ? "scale-110" : ""
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <XClose size={20} className="text-white" />
            )}
          </div>

          {/* Cancel text */}
          <div className="flex-1 text-left min-w-0 pr-[10%]">
            <p className="font-semibold text-gray-900 text-[16px] text-center leading-tight">
              {cancelText || t("cancel")}
            </p>
            {hintText && (
              <p className="text-xs text-gray-600 mt-2 text-center ">
                {hintText}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
