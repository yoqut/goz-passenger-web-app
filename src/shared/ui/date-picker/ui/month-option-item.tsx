import { memo } from "react";
import { ITEM_HEIGHT } from "../lib/constants";
import { formatMonth } from "../lib/utils";

interface MonthOptionItemProps {
  date: Date;
  isSelected: boolean;
  isDisabled: boolean;
}

/**
 * Month option item komponenti
 */
export const MonthOptionItem = memo(
  ({ date, isSelected, isDisabled }: MonthOptionItemProps) => {
    const getClassName = () => {
      const baseClasses =
        "flex items-center justify-center relative z-0 snap-center";

      if (isDisabled) {
        return `${baseClasses} text-gray-300 text-sm cursor-not-allowed opacity-50`;
      }

      if (isSelected) {
        return `${baseClasses} text-gray-900 font-bold text-xl z-20`;
      }

      return `${baseClasses} text-gray-400 text-sm`;
    };

    return (
      <div className={getClassName()} style={{ height: ITEM_HEIGHT }}>
        <span className="relative">{formatMonth(date)}</span>
      </div>
    );
  },
);

MonthOptionItem.displayName = "MonthOptionItem";
