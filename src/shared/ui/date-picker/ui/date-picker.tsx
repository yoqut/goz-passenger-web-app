import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useDateOptions,
  useDateTimeOptions,
  useTimeScroll,
} from "../lib/hooks";
import { findTimeIndex } from "../lib/utils";
import type { DatePickerProperties } from "../types";
import { DatePickerFooter } from "./date-picker-footer";
import { DatePickerHeader } from "./date-picker-header";
import { DayPickerScroll } from "./day-picker-scroll";
import { MonthPickerScroll } from "./month-picker-scroll";
import { TimePickerScroll } from "./time-picker-scroll";

/**
 * DatePicker component - oy, kun va vaqtni tanlash uchun
 */
export const DatePicker = ({
  isOpen,
  onClose,
  onSelect,
}: DatePickerProperties) => {
  const { dateOptions, isDayDisabled } = useDateOptions();
  const currentMonth = useMemo(() => new Date(), []);
  const hasInitializedRef = useRef(false);

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const timeOptions = useDateTimeOptions({ selectedDate });

  const [selectedTime, setSelectedTime] = useState<Date>(() => {
    return timeOptions.length > 0 ? timeOptions[0] : new Date();
  });

  // Scroll hooks
  const { scrollRef: timeScrollRef, scrollToIndex: scrollToTimeIndex } =
    useTimeScroll({
      timeOptions,
      isTimeDisabled: () => false,
      onTimeChange: setSelectedTime,
    });

  const { scrollRef: dayScrollRef, scrollToIndex: scrollToDayIndex } =
    useTimeScroll({
      timeOptions: dateOptions,
      isTimeDisabled: isDayDisabled,
      onTimeChange: setSelectedDate,
    });

  // Kun o'zgarganda time ni birinchi mavjud vaqtga reset qilish
  useEffect(() => {
    if (timeOptions.length > 0) {
      setSelectedTime(timeOptions[0]);
      setTimeout(() => scrollToTimeIndex(0), 50);
    }
  }, [timeOptions]);

  // Birinchi ochilganda scroll pozitsiyasini to'g'rilash
  useEffect(() => {
    if (!isOpen) {
      hasInitializedRef.current = false;
      return;
    }
    if (hasInitializedRef.current) return;

    const timer = setTimeout(() => {
      if (dayScrollRef.current) {
        scrollToDayIndex(new Date().getDate() - 1);
      }
      if (timeScrollRef.current && timeOptions.length > 0) {
        const timeIndex = findTimeIndex(timeOptions, selectedTime);
        scrollToTimeIndex(timeIndex >= 0 ? timeIndex : 0);
      }
      hasInitializedRef.current = true;
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleDayClick = useCallback(
    (date: Date, index: number) => {
      if (isDayDisabled(date)) return;
      setSelectedDate(date);
      scrollToDayIndex(index);
    },
    [scrollToDayIndex, isDayDisabled],
  );

  const handleTimeClick = useCallback(
    (time: Date, index: number) => {
      setSelectedTime(time);
      scrollToTimeIndex(index);
    },
    [scrollToTimeIndex],
  );

  const handleConfirm = useCallback(() => {
    const finalDateTime = new Date(selectedDate);
    finalDateTime.setHours(selectedTime.getHours());
    finalDateTime.setMinutes(selectedTime.getMinutes());
    onSelect(finalDateTime);
    onClose();
  }, [selectedDate, selectedTime, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full">
      <DatePickerHeader onClose={onClose} />

      <div className="flex-1 flex">
        <div className="flex-1">
          <MonthPickerScroll currentMonth={currentMonth} />
        </div>
        <div className="flex-1">
          <DayPickerScroll
            scrollRef={dayScrollRef}
            dateOptions={dateOptions}
            selectedDate={selectedDate}
            isDayDisabled={isDayDisabled}
            onDayClick={handleDayClick}
          />
        </div>
        <div className="flex-1">
          <TimePickerScroll
            scrollRef={timeScrollRef}
            timeOptions={timeOptions}
            selectedTime={selectedTime}
            isTimeDisabled={() => false}
            onTimeClick={handleTimeClick}
          />
        </div>
      </div>

      <DatePickerFooter onConfirm={handleConfirm} />
    </div>
  );
};
