/* eslint-disable unicorn/prevent-abbreviations */
import { useToast } from "@/shared/lib/hooks";
import type { City } from "@/shared/types/order";
import { locationManager } from "@telegram-apps/sdk";
import { NavigationPointer01 } from "@untitledui/icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFindCurrentLocation } from "../hooks/useFindCurrentLocation";

interface LocationInputProperties {
  locations: City[];
  value: string;
  onLocationSelect?: (location: string) => void;
  onCitySelect?: (
    city: City,
    coordinates?: { latitude: number; longitude: number },
  ) => void;
}

export const LocationInput = ({
  locations: items,
  value,
  onLocationSelect,
  onCitySelect,
}: LocationInputProperties) => {
  const { t, i18n } = useTranslation();
  const { error: showError } = useToast();
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputReference = useRef<HTMLInputElement>(null);
  const { mutate: findLocation, isPending } = useFindCurrentLocation();
  const mountingRef = useRef<boolean>(false); // Mount qilish jarayonini kuzatish

  // Mount location manager on component load - faqat bir marta
  useEffect(() => {
    const mountLocationManager = async () => {
      // Agar allaqachon mount qilinayotgan yoki mounted bo'lsa, skip qilish
      if (mountingRef.current || locationManager.isMounted()) {
        return;
      }

      try {
        if (
          locationManager.isSupported() &&
          !locationManager.isMounted() &&
          locationManager.mount.isAvailable()
        ) {
          mountingRef.current = true; // Mount qilish jarayonini belgilash
          await locationManager.mount();
        }
      } catch (error) {
        showError(t("location.not_supported"), {
          description: t("location.not_supported_description"),
        });
        // Xatolik bo'lganda, ref ni reset qilish - keyinroq qayta urinish mumkin bo'lishi uchun
        mountingRef.current = false;
      }
    };

    mountLocationManager();
  }, []);

  const filteredDistricts = items.filter((item) => {
    if (value === "") {
      return true;
    }
    return value === "tashkent"
      ? item.title.toLocaleLowerCase() !== value
      : item.title.toLocaleLowerCase().includes("tashkent");
  });

  const handleGetLocation = async () => {
    // Check if geolocation is supported
    if (!locationManager.isMounted()) {
      showError(t("location.not_supported"), {
        description: t("location.not_supported_description"),
      });
      return;
    }

    if (locationManager.requestLocation.isAvailable()) {
      const location = await locationManager.requestLocation();
      findLocation(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          max_distance_km: 15,
        },
        {
          onSuccess: (data) => {
            // Check if city exists in response
            if (data?.city?.title) {
              // Call onLocationSelect with city title
              onLocationSelect?.(data.city.title);

              // Call onCitySelect with city object and coordinates
              onCitySelect?.(data.city, {
                latitude: location.latitude,
                longitude: location.longitude,
              });

              // Update selected value with translated city name
              const translatedName =
                data.city.translate[
                  i18n.language as keyof typeof data.city.translate
                ];
              setSelectedValue(translatedName);
            }
          },
          onError: (error: any) => {
            showError(t("location.find_failed"), {
              description: error?.message || t("location.try_again"),
            });
          },
        },
      );
    }
  };

  const handleInputChange = (value: string) => {
    setIsOpen(true);
    setHighlightedIndex(-1);
    onLocationSelect?.(value);
    setSelectedValue(value);
  };

  const handleSelectDistrict = (district: City) => {
    setIsOpen(false);
    onLocationSelect?.(district.title ?? "");
    onCitySelect?.(district);
    setSelectedValue(
      district?.translate[i18n.language as keyof typeof district.translate],
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredDistricts.length === 0) return;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setHighlightedIndex((previous) =>
          previous < filteredDistricts.length - 1 ? previous + 1 : previous,
        );
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((previous) => (previous > 0 ? previous - 1 : -1));
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectDistrict(filteredDistricts[highlightedIndex]);
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        setIsOpen(false);
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <div className="w-full relative">
      <div className="relative flex w-full h-[52px] items-center p-1 rounded-lg bg-primary shadow-xs ring-1 ring-primary outline-hidden transition-shadow duration-100 ease-linear ring-inset focus-within:ring-2 focus-within:ring-[#2299D5]">
        <input
          ref={inputReference}
          type="text"
          id="location"
          value={selectedValue}
          autoComplete="off"
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 50);
          }}
          placeholder={t("home.searchplaceholder")}
          aria-label={t("location.selectLabel")}
          className="flex-1 bg-transparent px-3 py-2  text-md outline-none placeholder:text-placeholder"
        />
        <button
          type="button"
          disabled={isPending}
          className=" size-10  rounded-lg mr-1 bg-gray-100 border-0 hover:bg-gray-100 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGetLocation}
        >
          {isPending ? (
            <div className="size-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <NavigationPointer01 strokeWidth={1.4} color="#000" />
          )}
        </button>
      </div>
      {isOpen && filteredDistricts.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-primary shadow-lg rounded-lg border border-primary z-50"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="max-h-48 overflow-y-auto">
            {filteredDistricts.map((district, index) => (
              <button
                key={district.city_id}
                type="button"
                onClick={() => handleSelectDistrict(district)}
                className={`w-full text-left px-3 py-2 transition-colors ${
                  index === highlightedIndex
                    ? "bg-[#2299D5] text-[#2299D5"
                    : "hover:bg-primary_hover"
                }`}
              >
                <div className="text-md font-medium capitalize">
                  {
                    district?.translate[
                      i18n.language as keyof typeof district.translate
                    ]
                  }
                </div>
                {/* {district.supportingText && (
                  <div className="text-sm text-tertiary">
                    {district.supportingText}
                  </div>
                )} */}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
