import type { ToCity, ToCityApiResponse } from "@/shared/types/order";
import { Select, type SelectItemType } from "@/shared/ui/select/select";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface LocationSelectProperties {
  locations: ToCityApiResponse["target"];
  value: string;
  setValue: (value: ToCity) => void;
  onLocationSelect?: (location: string) => void;
  isLoading?: boolean;
}

export const LocationSelect = ({
  locations,
  value,
  setValue,
  onLocationSelect,
  isLoading = false,
}: LocationSelectProperties) => {
  const { t, i18n } = useTranslation();
  // Select items - to_city translate ga qarab ko'rsatiladi
  const selectItems: SelectItemType[] = useMemo(() => {
    return locations.map((item) => ({
      id: String(item.to_city.city_id),
      label:
        item.to_city.translate[
          i18n.language as keyof typeof item.to_city.translate
        ],
      supportingText: "",
    }));
  }, [locations, i18n.language]);

  // Selected key - value (to_city.title) ga qarab city_id ni topish
  const selectedKey = useMemo(() => {
    if (!value) return null;
    const selectedItem = locations.find(
      (item) => item.to_city?.title === value,
    );
    return selectedItem ? String(selectedItem.to_city.city_id) : null;
  }, [value, locations]);

  const handleChange = (key: string | number | null) => {
    if (key === null) {
      onLocationSelect?.("");
      return;
    }

    const keyString = String(key);
    const selectedItem = locations.find(
      (item) => String(item.to_city.city_id) === keyString,
    );
    if (selectedItem?.to_city?.title) {
      onLocationSelect?.(selectedItem.to_city.title);
      setValue(selectedItem);
    }
  };

  return (
    <Select
      className={"w-full"}
      isRequired
      items={selectItems}
      aria-label={t("location.selectLabel")}
      placeholder={isLoading ? t("loading") : t("home.where")}
      allowClear={!isLoading}
      value={selectedKey}
      onChange={handleChange}
      isDisabled={isLoading}
    >
      {(item) => (
        <Select.Item
          id={item.id}
          supportingText={item.supportingText}
          isDisabled={item.isDisabled}
          icon={item.icon}
        >
          {item.label}
        </Select.Item>
      )}
    </Select>
  );
};