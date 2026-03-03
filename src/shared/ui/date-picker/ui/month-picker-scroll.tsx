import { memo, useEffect, useMemo, useRef } from "react";
import { CONTAINER_HEIGHT, ITEM_HEIGHT, PADDING } from "../lib/constants";
import { MonthOptionItem } from "./month-option-item";

interface MonthPickerScrollProps {
  currentMonth: Date;
}

/**
 * Month picker scroll komponenti
 * Barcha 12 oy ko'rsatiladi, faqat joriy oy tanlangan, qolganlari disabled
 */
export const MonthPickerScroll = memo(
  ({ currentMonth }: MonthPickerScrollProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const currentMonthIndex = currentMonth.getMonth();

    // 12 oy uchun Date massivini yaratish
    const months = useMemo(() => {
      const year = currentMonth.getFullYear();
      return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
    }, [currentMonth]);

    // Dastlabki scroll pozitsiyasini joriy oyga o'rnatish
    useEffect(() => {
      if (!scrollRef.current) return;

      const containerHeight =
        scrollRef.current.clientHeight || CONTAINER_HEIGHT;
      const centerOffset = (containerHeight - ITEM_HEIGHT) / 2;
      const itemTop = PADDING + currentMonthIndex * ITEM_HEIGHT;
      const scrollTop = itemTop - centerOffset;

      const totalHeight = months.length * ITEM_HEIGHT + PADDING * 2;
      const maxScrollTop = Math.max(0, totalHeight - containerHeight);

      scrollRef.current.scrollTop = Math.max(
        0,
        Math.min(scrollTop, maxScrollTop),
      );
    }, [currentMonthIndex, months.length]);

    return (
      <div className="flex-1 flex items-center justify-center relative">
        <div
          ref={scrollRef}
          className="w-full overflow-y-auto h-[240px] snap-y snap-mandatory hide-scrollbar relative pointer-events-none"
          style={{
            scrollSnapType: "y mandatory",
          }}
        >
          {/* Top padding for centering */}
          <div style={{ height: PADDING }} />

          {/* Month options */}
          {months.map((month, index) => (
            <MonthOptionItem
              key={index}
              date={month}
              isSelected={index === currentMonthIndex}
              isDisabled={index !== currentMonthIndex}
            />
          ))}

          {/* Bottom padding for centering */}
          <div style={{ height: PADDING }} />
        </div>
      </div>
    );
  },
);

MonthPickerScroll.displayName = "MonthPickerScroll";
