import { useTranslation } from "react-i18next";

export const SearchDriver = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start  ">
      <div className="flex items-center justify-between w-full">
        <h4 className="font-semibold text-[18px] mb-3 text-gray-900">
          {t("order-details.search-taxi")}
        </h4>
        {/* <SearchTimer /> */}
      </div>
      <p className="font-normal text-[12px] leading-[18px]  mb-3 p-0">
        {t("order-details.search-comment")}
      </p>
    </div>
  );
};
