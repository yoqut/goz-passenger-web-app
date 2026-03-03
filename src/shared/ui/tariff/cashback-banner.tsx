import { useTranslation } from "react-i18next";

interface CashbackBannerProps {
  amount: number;
}

export const CashbackBanner = ({ amount }: CashbackBannerProps) => {
  const { t, i18n } = useTranslation();

  const formattedAmount = `${amount.toLocaleString()} ${t("currency")}`;

  // Translation stringni to'g'ridan-to'g'ri resources dan olish (interpolation-siz)
  // Bu orqali {{amount}} placeholder qoladi
  const currentLanguage = i18n.language || "uz";

  // To'g'ridan-to'g'ri translation resources dan olish
  const getRawTemplate = (): string => {
    try {
      const resources = i18n.getResourceBundle(currentLanguage, "translation");
      return (
        (resources?.service?.cashbackBanner as string) ||
        t("service.cashbackBanner", { amount: "" })
      );
    } catch {
      return t("service.cashbackBanner", { amount: "" });
    }
  };

  const rawTemplate = getRawTemplate();

  // {{amount}} ni topib bold span bilan almashtirish
  const renderBanner = () => {
    // {{amount}} placeholder ni qidirish
    if (rawTemplate && rawTemplate.includes("{{amount}}")) {
      const parts = rawTemplate.split("{{amount}}");
      return (
        <>
          {parts[0] && <span>{parts[0]}</span>}
          <span className="font-bold text-green-800">{formattedAmount}</span>
          {parts[1] && <span>{parts[1]}</span>}
        </>
      );
    }

    // Agar {{amount}} topilmasa, oxiriga qo'shish (fallback)
    return (
      <>
        <span>
          {rawTemplate || t("service.cashbackBanner", { amount: "" })}{" "}
        </span>
        <span className="font-bold text-green-800">{formattedAmount}</span>
      </>
    );
  };

  return (
    <div className="bg-green-100 border border-green-100 rounded-xl p-2 mb-4">
      <p className="text-sm text-green-700 text-center">{renderBanner()}</p>
    </div>
  );
};
