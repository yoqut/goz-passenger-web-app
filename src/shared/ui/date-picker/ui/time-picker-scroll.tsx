import { memo, type RefObject } from "react";
import { PADDING } from "../lib/constants";
import { TimeOptionItem } from "./time-option-item";

interface TimePickerScrollProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  timeOptions: Date[];
  selectedTime: Date;
  isTimeDisabled: (time: Date) => boolean;
  onTimeClick: (time: Date, index: number) => void;
}

/**
 * Time picker scroll komponenti
 */
export const TimePickerScroll = memo(
  ({
    scrollRef,
    timeOptions,
    selectedTime,
    isTimeDisabled,
    onTimeClick,
  }: TimePickerScrollProps) => {
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

          {/* Time options */}
          {timeOptions.map((time, index) => (
            <TimeOptionItem
              key={index}
              time={time}
              selectedTime={selectedTime}
              isDisabled={isTimeDisabled(time)}
              onClick={() => onTimeClick(time, index)}
            />
          ))}

          {/* Bottom padding for centering */}
          <div style={{ height: PADDING }} />
        </div>
      </div>
    );
  },
);

TimePickerScroll.displayName = "TimePickerScroll";
