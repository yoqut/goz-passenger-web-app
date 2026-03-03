import { useCallback, useEffect, useRef } from "react";
import { CONTAINER_HEIGHT, ITEM_HEIGHT, PADDING } from "../constants";

interface UseTimeScrollProps {
  timeOptions: Date[];
  isTimeDisabled: (time: Date) => boolean;
  onTimeChange: (time: Date) => void;
}

const SCROLL_DEBOUNCE_MS = 100;
const SNAP_ANIMATION_MS = 500;

/**
 * Scroll hook - scroll-snap markazlashtirish va disabled item snap-back
 */
export const useTimeScroll = ({
  timeOptions,
  isTimeDisabled,
  onTimeChange,
}: UseTimeScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSnappingRef = useRef(false);

  /** Scroll pozitsiyasidan markaz indeksini hisoblash */
  const getIndexFromScroll = useCallback(
    (scrollTop: number): number => {
      const h = scrollRef.current?.clientHeight || CONTAINER_HEIGHT;
      const center = (h - ITEM_HEIGHT) / 2;
      const idx = Math.round((scrollTop + center - PADDING) / ITEM_HEIGHT);
      return Math.max(0, Math.min(timeOptions.length - 1, idx));
    },
    [timeOptions.length],
  );

  /** Indeksga mos scroll pozitsiyasini hisoblash (markazlashtirish) */
  const getScrollForIndex = useCallback(
    (index: number): number => {
      const h = scrollRef.current?.clientHeight || CONTAINER_HEIGHT;
      const center = (h - ITEM_HEIGHT) / 2;
      const target = PADDING + index * ITEM_HEIGHT - center;
      const max = Math.max(
        0,
        timeOptions.length * ITEM_HEIGHT + PADDING * 2 - h,
      );
      return Math.max(0, Math.min(target, max));
    },
    [timeOptions.length],
  );

  /** Eng yaqin enabled indeksni topish */
  const findNearestEnabled = useCallback(
    (fromIndex: number): number => {
      if (!isTimeDisabled(timeOptions[fromIndex])) return fromIndex;

      for (let offset = 1; offset < timeOptions.length; offset++) {
        const after = fromIndex + offset;
        const before = fromIndex - offset;
        if (after < timeOptions.length && !isTimeDisabled(timeOptions[after]))
          return after;
        if (before >= 0 && !isTimeDisabled(timeOptions[before])) return before;
      }
      return fromIndex;
    },
    [timeOptions, isTimeDisabled],
  );

  /** Scroll tugaganda — disabled bo'lsa snap-back, aks holda state update */
  const handleScrollEnd = useCallback(() => {
    if (!scrollRef.current) return;

    const index = getIndexFromScroll(scrollRef.current.scrollTop);
    if (index < 0 || index >= timeOptions.length) return;

    if (isTimeDisabled(timeOptions[index])) {
      const enabledIdx = findNearestEnabled(index);

      isSnappingRef.current = true;
      scrollRef.current.scrollTo({
        top: getScrollForIndex(enabledIdx),
        behavior: "smooth",
      });
      setTimeout(() => {
        isSnappingRef.current = false;
      }, SNAP_ANIMATION_MS);

      onTimeChange(timeOptions[enabledIdx]);
    } else {
      onTimeChange(timeOptions[index]);
    }
  }, [
    timeOptions,
    getIndexFromScroll,
    getScrollForIndex,
    isTimeDisabled,
    onTimeChange,
    findNearestEnabled,
  ]);

  /** Debounced scroll handler */
  const handleScroll = useCallback(() => {
    if (isSnappingRef.current) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(handleScrollEnd, SCROLL_DEBOUNCE_MS);
  }, [handleScrollEnd]);

  /** Event listener */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [handleScroll]);

  /** Scroll to index (instant, no animation) */
  const scrollToIndex = useCallback(
    (index: number) => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTop = getScrollForIndex(index);
    },
    [getScrollForIndex],
  );

  return { scrollRef, scrollToIndex };
};
