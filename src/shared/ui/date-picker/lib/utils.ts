/**
 * Vaqtni format qilish (HH : mm)
 */
export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours} : ${minutes}`;
};

/**
 * Ikki vaqtning soat va daqiqasi bir xilligini tekshirish
 */
export const isSameTime = (time1: Date, time2: Date): boolean => {
  return (
    time1.getHours() === time2.getHours() &&
    time1.getMinutes() === time2.getMinutes()
  );
};

/**
 * Vaqt indexini topish
 */
export const findTimeIndex = (times: Date[], targetTime: Date): number => {
  return times.findIndex((time) => isSameTime(time, targetTime));
};

/**
 * Oyni format qilish (Fevral)
 */
const MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

export const formatMonth = (date: Date): string => {
  return MONTHS[date.getMonth()];
};

/**
 * Kunni format qilish (15)
 */
export const formatDay = (date: Date): string => {
  return date.getDate().toString().padStart(2, "0");
};

/**
 * Ikki sananing kun, oy, yil bir xilligini tekshirish (vaqtsiz)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
