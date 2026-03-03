import { useMemo } from "react";
import { HOURS_PER_DAY, TIME_INTERVAL } from "../constants";
import { isSameDay } from "../utils";

interface UseDateTimeOptionsProps {
  selectedDate: Date;
}

/**
 * Tanlangan kunga qarab vaqt optionslarini yaratish
 * Bugun uchun — faqat hozirgi vaqtdan keyingi vaqtlar
 * Keyingi kunlar uchun — barcha vaqtlar (00:00 dan)
 */
export const useDateTimeOptions = ({
  selectedDate,
}: UseDateTimeOptionsProps) => {
  return useMemo(() => {
    const times: Date[] = [];
    const now = new Date();
    const isToday = isSameDay(selectedDate, now);

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    for (let hour = 0; hour < HOURS_PER_DAY; hour++) {
      for (let interval = 0; interval < 2; interval++) {
        const minutes = interval * TIME_INTERVAL;
        const time = new Date(year, month, day, hour, minutes);

        if (isToday && time <= now) continue;

        times.push(time);
      }
    }

    return times;
  }, [selectedDate]);
};
