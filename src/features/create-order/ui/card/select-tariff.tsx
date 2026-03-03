/* eslint-disable react-refresh/only-export-components */
import { CarIconSVG } from "@/app/assets";
import { Cobalt, Malibu, Nexia } from "@/app/assets/images";
import { calculateTripPrice } from "@/shared/lib/utils/helper";
import type { City, ToCityApiResponse } from "@/shared/types/order";
import { Tooltip, TooltipTrigger } from "@/shared/ui/tooltip/tooltip";
import { InfoCircle } from "@untitledui/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export interface Tariff {
  id: string;
  title: string;
  desc: string;
  amount: number;
  icon: string;
  value: string;
  members: number;
  cars: string[];
  tariff_id?: number;
}

export const tariffes: Tariff[] = [
  {
    id: "1",
    title: "economy",
    desc: "requiredMembers",
    amount: 130000,
    icon: Nexia,
    value: "economy",
    members: 3,
    cars: ["Gentra", "Spark", "Cobalt", "Nexia 3", "Onix", "Lacetti"],
  },
  {
    id: "2",
    title: "standard",
    desc: "requiredMembers",
    amount: 150000,
    icon: Cobalt,
    value: "standard",
    members: 2,
    cars: ["Monza", "Gentra", "Onix", "Cobalt", "Byd E2", "Lasetti"],
  },
  {
    id: "3",
    title: "comfort",
    desc: "requiredMembers",
    amount: 200000,
    icon: Malibu,
    value: "comfort",
    members: 2,
    cars: [
      "Malibu",
      "Equinox",
      "Tracker 1,2",
      "Kia",
      "Captiva",
      "Byd",
      "Cherry",
      "Jetour",
      "Deepal",
    ],
  },
];

// Gorizontal tarif karta komponenti
const HorizontalTariffCard = ({
  item,
  isSelected,
  calculatedPrice,
  onClick,
}: {
  item: Tariff;
  isSelected: boolean;
  calculatedPrice: number;
  onClick: () => void;
}) => {
  const { t } = useTranslation();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTooltipOpen((prev) => !prev);
  };

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
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isTooltipOpen]);

  return (
    <div
      className={`shrink-0 w-[140px] flex flex-col items-center  cursor-pointer ${
        isSelected ? "opacity-100" : "opacity-70"
      }`}
      onClick={onClick}
    >
      <div
        className={`w-full rounded-xl border-2 p-1 pl-3 ${
          isSelected
            ? "border-[#2299D5] bg-blue-50"
            : "border-gray-200 bg-white"
        } transition-all`}
      >
        {item.icon && (
          <div className="flex justify-start  mb-1">
            {/* <img
              src={item.icon}
              alt={item.title}
              loading="lazy"
              className="w-24 h-20 object-contain"
            /> */}
            <CarIconSVG className="w-16 h-12 object-contain" />
          </div>
        )}
        <div className="flex items-center justify-start gap-2 mb-1">
          <h3 className="text-[14px] font-semibold text-[#2299D5] text-start">
            {item.title}
          </h3>
          {item.cars.length > 0 && (
            <div ref={iconRef}>
              <Tooltip
                title={t("service.availableCars")}
                description={item.cars.join(", ")}
                placement="top"
                arrow
                delay={0}
                isOpen={isTooltipOpen}
                onOpenChange={setIsTooltipOpen}
              >
                <TooltipTrigger onClick={handleIconClick}>
                  <InfoCircle className="size-4 text-gray-500 hover:text-[#2299D5] transition-colors" />
                </TooltipTrigger>
              </Tooltip>
            </div>
          )}
        </div>
        <p className="text-[12px] font-medium text-gray-900 text-start">
          {t(`service.price`, { price: calculatedPrice.toLocaleString() })}
        </p>
      </div>
    </div>
  );
};

export const SelectTariff = ({
  selectedTariff,
  handleChange,
  cities,
  fromCity,
  toCity,
  passengerCount,
  isFreeCar,
  toCities,
}: {
  selectedTariff: Tariff | null;
  handleChange: (value: Tariff) => void;
  cities: City[];
  fromCity: string;
  toCity: string;
  passengerCount: number;
  isFreeCar: boolean;
  toCities?: ToCityApiResponse["target"];
}) => {
  const { i18n } = useTranslation();

  // toCities dan kelgan prices array'idan tariflar ro'yxatini yaratish
  // delivery tarifi bundan tashqari (faqat travel tariflari)
  const availableTariffs = useMemo(() => {
    if (!toCities || !Array.isArray(toCities) || toCities.length === 0) {
      return [];
    }

    // toCity ga mos item ni topish
    const toCityItem = toCities.find((item) => item.to_city?.title === toCity);

    if (!toCityItem || !toCityItem.prices) {
      return [];
    }

    // prices array'idan delivery bo'lmagan tariflarni olish
    const travelPrices = toCityItem.prices.filter(
      (price) => price.tariff_info?.title?.toLowerCase() !== "delivery",
    );

    // Tariff title'ni travelClass'ga o'tkazish mapping
    const titleToValueMap: Record<string, string> = {
      economy: "economy",
      standard: "standard",
      comfort: "comfort",
    };
    // Har bir price uchun Tariff obyektini yaratish
    const tariffs = travelPrices.map((price, index) => {
      const priceTitle = (price.tariff_info?.title || "").toLowerCase().trim();
      const tariffValue =
        titleToValueMap[priceTitle] || priceTitle || "economy";

      // Icons mapping (default icon sifatida Nexia)
      const iconMap: Record<string, string> = {
        economy: Nexia,
        standard: Cobalt,
        comfort: Malibu,
      };

      // Cars list (default)
      const carsMap: Record<string, string[]> = {
        economy: ["Gentra", "Spark", "Cobalt", "Nexia 3", "Onix", "Lacetti"],
        standard: ["Monza", "Gentra", "Onix", "Cobalt", "Byd E2", "Lasetti"],
        comfort: [
          "Malibu",
          "Equinox",
          "Tracker 1,2",
          "Kia",
          "Captiva",
          "Byd",
          "Cherry",
          "Jetour",
          "Deepal",
        ],
      };

      // Members count
      const membersMap: Record<string, number> = {
        economy: 3,
        standard: 2,
        comfort: 2,
      };

      return {
        id: `tariff-${index}-${tariffValue}`,
        title: priceTitle,
        desc: "requiredMembers",
        amount: price.price,
        icon: iconMap[tariffValue] || Nexia,
        value: tariffValue,
        members: membersMap[tariffValue] || 3,
        cars: carsMap[tariffValue] || [],
        tariff_id: price.tariff_info?.tariff_id,
        translate: price.tariff_info?.translate,
      } as Tariff & { translate?: { en: string; ru: string; uz: string } };
    });

    // Sort tariffs by price (ascending: kamdan ko'pga)
    return tariffs.sort((a, b) => a.amount - b.amount);
  }, [toCities, toCity, i18n.language]);

  // Agar tariflar bo'lmasa, bo'sh ro'yxat qaytarish
  if (availableTariffs.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
      <div className="flex gap-3 min-w-max">
        {availableTariffs.map((item) => {
          const passengerForTariff = isFreeCar
            ? item.value === "standard" || item.value === "comfort"
              ? 3
              : 4
            : passengerCount;

          const calculatedPrice = calculateTripPrice(
            cities,
            fromCity,
            toCity,
            item.value as "economy" | "standard" | "comfort",
            passengerForTariff,
            toCities || [],
            { isFreeCar },
          );

          // Tarif nomini translate'dan olish
          const tariffName =
            item.translate?.[i18n.language as keyof typeof item.translate] ||
            "";
          const tariffItem: Tariff = {
            ...item,
            title: tariffName,
          };

          return (
            <div key={item.id} className="snap-start shrink-0">
              <HorizontalTariffCard
                item={tariffItem}
                isSelected={selectedTariff?.value === item.value}
                calculatedPrice={calculatedPrice}
                onClick={() => handleChange(item)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
