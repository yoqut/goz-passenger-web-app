import { cx } from "@/shared/lib/utils/cx";
import { useMemo } from "react";

interface Tab {
  value: string;
  label: string;
}

interface TabsProperties {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, value, onChange, className }: TabsProperties) => {
  const activeIndex = useMemo(
    () => tabs.findIndex((tab) => tab.value === value),
    [tabs, value]
  );

  return (
    <div
      className={cx(
        "relative flex items-center w-full bg-gray-100 rounded-full p-1",
        className
      )}
    >
      {/* Sliding background */}
      <div
        className="absolute bg-white rounded-full transition-all duration-300 ease-in-out"
        style={{
          left: `calc(${(activeIndex * 100) / tabs.length}% + 4px)`,
          width: `calc(${100 / tabs.length}% - 8px)`,
          top: "4px",
          bottom: "4px",
        }}
      />
      {tabs.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cx(
              "relative z-10 flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ease-in-out",
              isActive ? "text-gray-900" : "text-gray-700"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
