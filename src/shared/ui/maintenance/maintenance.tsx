import { Cog, Hammer, Settings, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Maintenance = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 p-4 flex items-center justify-center">
      <div className="max-w-md w-full min-h-[calc(100vh-64px)] h-full flex flex-col items-center justify-between">
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-[20%] text-center">
          {/* Icon/Logo with rotating tools */}
          <div className="mb-6">
            <div className="relative w-24 h-24 mx-auto">
              {/* Main rotating settings icon */}
              <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
              {/* Rotating tools around - reverse direction */}
              <div
                className="absolute inset-0 animate-spin"
                style={{ animationDuration: "4s", animationDirection: "reverse" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Wrench className="w-5 h-5 text-blue-400" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <Hammer className="w-5 h-5 text-blue-400" />
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
                  <Cog className="w-5 h-5 text-blue-400" />
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                  <Wrench className="w-5 h-5 text-blue-400 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {t("maintenance.title")}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t("maintenance.description")}
          </p>

          {/* Progress bar animation */}
          {/* <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full"
                style={{
                  width: "0%",
                  animation: "progressBar 2s ease-in-out infinite",
                }}
              />
            </div>
            <style>
              {`
                @keyframes progressBar {
                  0% {
                    width: 0%;
                    transform: translateX(0);
                  }
                  50% {
                    width: 75%;
                    transform: translateX(0);
                  }
                  100% {
                    width: 100%;
                    transform: translateX(0);
                  }
                }
              `}
            </style>
          </div> */}

          {/* Working indicators */}
          {/* <div className="flex justify-center items-center gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute" />
                <div className="w-3 h-3 bg-green-500 rounded-full relative" />
              </div>
              <span className="font-medium">{t("maintenance.working") || "Ishlanmoqda..."}</span>
            </div>
          </div> */}

          {/* Additional info */}
          {/* <p className="text-sm text-gray-500">
            {t("maintenance.subtitle") || "Tez orada qaytamiz"}
          </p> */}
        </div>

        {/* Footer */}
        <div className="mt-auto text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {t("maintenance.footer")}
          </p>
        </div>
      </div>
    </div>
  );
};
