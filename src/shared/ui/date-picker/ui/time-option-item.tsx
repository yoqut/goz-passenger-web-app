import { memo } from "react";
import { ITEM_HEIGHT } from "../lib/constants";
import { formatTime, isSameTime } from "../lib/utils";

interface TimeOptionItemProps {
  time: Date;
  selectedTime: Date;
  isDisabled: boolean;
  onClick: () => void;
}

/**
 * Time option item komponenti
 */
export const TimeOptionItem = memo(
  ({ time, selectedTime, isDisabled, onClick }: TimeOptionItemProps) => {
    const isSelected = isSameTime(time, selectedTime);

    const getClassName = () => {
      const baseClasses =
        "flex items-center justify-center relative z-0 snap-center";

      if (isDisabled) {
        return `${baseClasses} text-gray-300 text-sm cursor-not-allowed opacity-50`;
      }

      if (isSelected) {
        return `${baseClasses} text-gray-900 font-bold text-xl z-20 cursor-pointer hover:bg-gray-50/50 active:bg-gray-100/50`;
      }

      return `${baseClasses} text-gray-400 text-sm cursor-pointer hover:bg-gray-50/50 active:bg-gray-100/50`;
    };

    return (
      <div
        onClick={onClick}
        className={getClassName()}
        style={{ height: ITEM_HEIGHT }}
      >
        <span className="relative">{formatTime(time)}</span>
      </div>
    );
  },
);

TimeOptionItem.displayName = "TimeOptionItem";
