import { Logo, Malibu, Nexia, Onboarding } from "@/app/assets/images";
import { useGetUserId, useToast } from "@/shared/lib/hooks";
import { RoutePaths } from "@/shared/routes/route-paths";
import { Container } from "@/shared/ui/container/container";
import { PageLoader } from "@/shared/ui/loader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Onborading = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { error: showError } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  // Get Telegram user data
  const { userId: telegram_id } = useGetUserId();

  // Handle continue button click
  const handleContinue = async () => {
    if (!telegram_id) {
      // If no telegram_id, go to login
      navigate(RoutePaths.LOGIN);
      return;
    }

    setIsChecking(true);

    try {
      // Call the API to check passenger
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API}/passengers/user/${telegram_id}`,
        {
          headers: {
            Authorization: `Token ${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        // Data exists - go to home
        await response.json();
        navigate(RoutePaths.HOME);
      } else if (response.status === 404) {
        // 404 error - go to login
        navigate(RoutePaths.LOGIN);
      } else {
        // Other errors - go to login
        navigate(RoutePaths.LOGIN);
      }
    } catch (error) {
      showError(t("auth.loginError"), {
        description: "Please try again later.",
      });
      // On error, go to login
      navigate(RoutePaths.LOGIN);
    } finally {
      setIsChecking(false);
    }
  };

  return isChecking ? (
    <PageLoader />
  ) : (
    <div className="relative h-screen bg-white overflow-hidden">
      {/* Background gradient */}
      <div className="onboarding absolute top-1/2 h-screen w-full" />

      <Container className="relative flex flex-col h-screen">
        {/* Header Text */}
        <div className="pt-6 sm:pt-12 pb-4 sm:pb-6 px-4 text-center z-10">
          <p className="text-sm sm:text-base font-normal text-gray-800 leading-relaxed">
            <img
              src={Logo}
              alt="goz logo"
              className="w-8 h-4 sm:w-12 sm:h-6 inline-block mx-1"
            />
            <span className="mx-1">—</span>
            {t("orboarding.header")}
          </p>
        </div>

        {/* Phone Mockup with Cards */}
        <div className="flex-1 flex items-center justify-center px-3 sm:px-4 pb-20 sm:pb-24 relative z-10">
          <div className="relative w-full max-w-[280px] sm:max-w-sm">
            {/* Phone Frame */}
            <div className="relative">
              <img
                src={Onboarding}
                alt="phone mockup"
                className="w-full h-auto max-h-[450px] sm:max-h-[600px] object-contain"
              />

              {/* Cards overlaying the phone - positioned to match Figma */}
              <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] space-y-2 sm:space-y-4">
                {/* Standart Card */}
                <div className="bg-white shadow-md rounded-xl sm:rounded-2xl p-2 sm:p-4 flex items-center justify-between">
                  <h2 className="text-blue-primary font-medium text-sm sm:text-lg">
                    {t("orboarding.plans.standart")}
                  </h2>
                  <img
                    src={Nexia}
                    alt="standart car"
                    className="w-16 h-8 sm:w-24 sm:h-12 object-contain"
                  />
                </div>

                {/* Comfort Card */}
                <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-2 sm:p-4 flex items-center justify-between">
                  <h2 className="text-blue-primary font-medium text-sm sm:text-lg">
                    {t("orboarding.plans.comfort")}
                  </h2>
                  <img
                    src={Malibu}
                    alt="comfort car"
                    className="w-16 h-8 sm:w-24 sm:h-12 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white z-20">
          <button
            onClick={handleContinue}
            disabled={isChecking}
            className="w-full py-4 rounded-2xl bg-blue-primary text-white text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isChecking
              ? t("loading") || "Checking..."
              : t("orboarding.button")}
          </button>
        </div>
      </Container>
    </div>
  );
};

export default Onborading;
