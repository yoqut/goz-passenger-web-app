import { useCallback, useMemo } from "react";
import { DAYS_IN_ADVANCE } from "../constants";

/**
 * Joriy oyning barcha kunlarini yaratish
 * Faqat bugun va keyingi DAYS_IN_ADVANCE kun tanlash mumkin
 */
export const useDateOptions = () => {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const dateOptions = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    // Oyning oxirgi kunini topish
    const totalDays = new Date(year, month + 1, 0).getDate();

    return Array.from(
      { length: totalDays },
      (_, i) => new Date(year, month, i + 1),
    );
  }, [today]);

  const isDayDisabled = useCallback(
    (date: Date): boolean => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);

      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + DAYS_IN_ADVANCE);

      return d < today || d > maxDate;
    },
    [today],
  );

  return { dateOptions, isDayDisabled };
};
