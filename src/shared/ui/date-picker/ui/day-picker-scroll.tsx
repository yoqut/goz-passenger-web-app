import { memo, type RefObject } from "react";
import { PADDING } from "../lib/constants";
import { DayOptionItem } from "./day-option-item";

interface DayPickerScrollProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  dateOptions: Date[];
  selectedDate: Date;
  isDayDisabled: (date: Date) => boolean;
  onDayClick: (date: Date, index: number) => void;
}

/**
 * Day picker scroll komponenti
 */
export const DayPickerScroll = memo(
  ({
    scrollRef,
    dateOptions,
    selectedDate,
    isDayDisabled,
    onDayClick,
  }: DayPickerScrollProps) => {
    return (
      <div className="flex-1 flex items-center justify-center relative">
        <div
          ref={scrollRef}
          className="w-full overflow-y-auto h-[240px] snap-y snap-mandatory hide-scrollbar relative"
          style={{
            scrollSnapType: "y mandatory",
          }}
        >
          {/* Top padding for centering */}
          <div style={{ height: PADDING }} />

          {/* Day options */}
          {dateOptions.map((date, index) => (
            <DayOptionItem
              key={index}
              date={date}
              selectedDate={selectedDate}
              isDisabled={isDayDisabled(date)}
              onClick={() => onDayClick(date, index)}
            />
          ))}

          {/* Bottom padding for centering */}
          <div style={{ height: PADDING }} />
        </div>
      </div>
    );
  },
);

DayPickerScroll.displayName = "DayPickerScroll";
