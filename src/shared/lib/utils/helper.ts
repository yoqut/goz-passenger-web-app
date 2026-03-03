import type { City, ToCityApiResponse } from "@/shared/types/order";
import { format } from "date-fns";

export const formatCustomDate = (dateValue: string) => {
  if (!dateValue) return;

  try {
    return format(new Date(dateValue), "dd.MM.yyyy HH:mm");
  } catch (error) {
    return;
  }
};

export const calculateTripPrice = (
  cities: City[],
  fromCityTitle: string,
  toCityTitle: string,
  travelClass: "economy" | "standard" | "comfort",
  passengerCount: number,
  toCities?: ToCityApiResponse["target"],
  options?: {
    isFreeCar?: boolean;
  },
): number => {
  // Find from city by title (from cities array)
  const fromCity = cities.find((city) => city.title === fromCityTitle);

  // Find to city from toCities array
  // Ensure toCities is an array before calling find
  const toCityItem =
    Array.isArray(toCities) && toCities.length > 0
      ? toCities.find((item) => item.to_city?.title === toCityTitle)
      : undefined;

  if (!fromCity || !toCityItem) {
    return 0;
  }

  // Get price from toCityItem.prices array based on travelClass
  // prices array'da tariff_info.title sifatida "Econom", "Standard", "Comfort" bor
  // travelClass esa "economy", "standard", "comfort" formatida
  // Mapping: backend'dan kelgan title'lar bilan travelClass'ni solishtirish
  const normalizeTitle = (title: string): string => {
    return (title || "").toLowerCase().trim().replace(/\s+/g, "");
  };

  const tariffTitleMap: Record<string, string[]> = {
    economy: ["econom", "economy"],
    standard: ["standard", "standart"],
    comfort: ["comfort"],
  };

  const possibleTitles = tariffTitleMap[travelClass] || [travelClass];

  // Backend'dan kelgan barcha prices'larni tekshirish
  // tariff_info.title ni normalize qilish va possibleTitles bilan solishtirish
  const toCityPrice = toCityItem.prices.find((price) => {
    const priceTitle = normalizeTitle(price.tariff_info?.title || "");
    // possibleTitles ichida mavjud bo'lgan variantlarni topish
    return possibleTitles.some((title) => {
      const normalizedTitle = normalizeTitle(title);
      // Aniq mos kelish ("econom" === "econom")
      if (priceTitle === normalizedTitle) return true;
      // Qisqartirilgan variant ("econom" bilan "economy" ni solishtirish - birinchi 5 harf)
      const minLength = Math.min(priceTitle.length, normalizedTitle.length);
      if (minLength >= 4) {
        return (
          priceTitle.substring(0, minLength) ===
          normalizedTitle.substring(0, minLength)
        );
      }
      return false;
    });
  });

  if (!toCityPrice) {
    return 0;
  }

  // Get from city price - fromCity endi price maydoni yo'q
  // Faqat toCityPrice ishlatamiz (toCities dan kelgan narx)
  const fromPrice = 0; // fromCity da price yo'q, faqat toCity narxi ishlatiladi
  const toPrice = toCityPrice.price;

  const totalPrice = fromPrice + toPrice;

  const multiplier =
    options?.isFreeCar &&
    (travelClass === "standard" || travelClass === "comfort")
      ? 3
      : passengerCount;

  return totalPrice * multiplier;
};

export const calculateDeliveryPrice = (
  cities: City[],
  fromCityTitle: string,
  toCityTitle: string,
  toCities?: ToCityApiResponse["target"],
): number => {
  // Find from city by title
  const fromCity = cities.find((city) => city.title === fromCityTitle);

  // Find to city from toCities array
  // Ensure toCities is an array before calling find
  const toCityItem =
    Array.isArray(toCities) && toCities.length > 0
      ? toCities.find((item) => item.to_city?.title === toCityTitle)
      : undefined;

  if (!fromCity || !toCityItem) {
    return 0;
  }

  // Get delivery price from toCityItem.prices array
  // prices array'da tariff_info.title sifatida "delivery" bor
  const deliveryPriceItem = toCityItem.prices.find(
    (price) => price.tariff_info?.title?.toLowerCase() === "delivery",
  );

  if (!deliveryPriceItem) {
    return 0;
  }

  // fromCity da price yo'q, faqat toCity narxi ishlatiladi
  const fromPrice = 0;
  const toPrice = deliveryPriceItem.price;

  return fromPrice + toPrice;
};
