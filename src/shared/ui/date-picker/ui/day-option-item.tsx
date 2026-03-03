import { memo } from "react";
import { ITEM_HEIGHT } from "../lib/constants";
import { formatDay, isSameDay } from "../lib/utils";

interface DayOptionItemProps {
  date: Date;
  selectedDate: Date;
  isDisabled: boolean;
  onClick: () => void;
}

/**
 * Day option item komponenti
 */
export const DayOptionItem = memo(
  ({ date, selectedDate, isDisabled, onClick }: DayOptionItemProps) => {
    const isSelected = !isDisabled && isSameDay(date, selectedDate);

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
        onClick={isDisabled ? undefined : onClick}
        className={getClassName()}
        style={{ height: ITEM_HEIGHT }}
      >
        <span className="relative">{formatDay(date)}</span>
      </div>
    );
  },
);

DayOptionItem.displayName = "DayOptionItem";
