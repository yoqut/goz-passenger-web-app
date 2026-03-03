import { InfoCircle } from "@untitledui/icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipTrigger } from "../tooltip/tooltip";

type Properties = {
  title: string;
  desc: string;
  amount: number;
  className?: string;
  onclick?: () => void;
  image?: string;
  members: number;
  cars?: string[];
};

export const TariffCard = ({
  title,
  amount,
  onclick,
  className,
  image,
  members,
  desc,
  cars = [],
}: Properties) => {
  const { t } = useTranslation();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTooltipOpen((prev) => !prev);
  };

  // Boshqa joyga bosilganda tooltip yopilishi
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        iconRef.current &&
        !iconRef.current.contains(event.target as Node) &&
        isTooltipOpen
      ) {
        setIsTooltipOpen(false);
      }
    };

    if (isTooltipOpen) {
      // Touch va click eventlarini qo'shish
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isTooltipOpen]);

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer ${className}`}
        onClick={onclick}
      >
        <div className="flex flex-col items-start gap-0.5 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-bold text-[#2299D5]">
              {title.charAt(0).toUpperCase() + title.slice(1)}
            </h3>
            {cars.length > 0 && (
              <div ref={iconRef}>
                <Tooltip
                  title={t("service.availableCars")}
                  description={cars.join(", ")}
                  placement="top"
                  arrow
                  delay={0}
                  isOpen={isTooltipOpen}
                  onOpenChange={setIsTooltipOpen}
                >
                  <TooltipTrigger onClick={handleIconClick}>
                    <InfoCircle className="size-4 text-gray-400 hover:text-[#2299D5] transition-colors" />
                  </TooltipTrigger>
                </Tooltip>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-400">
            {t(`service.${desc}`, { count: members })}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-[16px] font-semibold text-gray-900">
              {t(`service.price`, { price: amount })}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {image && (
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="w-20 h-20 object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};
