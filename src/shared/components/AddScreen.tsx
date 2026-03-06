import { useEffect, useMemo, useState } from "react";

type HomeStatus = "unknown" | "unsupported" | "not_added" | "added";

function getTg() {
  return (window as any).Telegram?.WebApp;
}

export function InstallCard({ t }: { t: (k: string) => string }) {
  const [visible, setVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [homeStatus, setHomeStatus] = useState<HomeStatus>("unknown");

  const tg = useMemo(() => getTg(), []);

  const hideCard = () => {
    setIsFading(true);
    setTimeout(() => setVisible(false), 300);
  };

  const addToHome = () => {
    if (!tg) return;
    if (typeof tg.addToHomeScreen === "function") {
      tg.addToHomeScreen();
    } else {
      alert("Telegram versiyasi qo'llab-quvvatlamaydi");
    }
  };

  useEffect(() => {
    if (!tg?.onEvent) {
      setHomeStatus("unsupported");
      return;
    }

    const onChecked = (data: any) => {
      const st = String(data?.status ?? "unknown") as HomeStatus;
      setHomeStatus(st);
      if (st === "added") setVisible(false);
    };

    const onAdded = () => {
      setHomeStatus("added");
      hideCard();
    };

    tg.onEvent("homeScreenChecked", onChecked);
    tg.onEvent("homeScreenAdded", onAdded);

    try {
      tg.checkHomeScreenStatus?.();
    } catch {
      setHomeStatus("unsupported");
    }

    return () => {
      tg.offEvent?.("homeScreenChecked", onChecked);
      tg.offEvent?.("homeScreenAdded", onAdded);
    };
  }, [tg]);

  // 10 sekunddan keyin avtomatik o'chish
  useEffect(() => {
    if (homeStatus !== "not_added" && homeStatus !== "unsupported") return;

    const timer = setTimeout(() => {
      hideCard();
    }, 10000);

    return () => clearTimeout(timer);
  }, [homeStatus]);

  if (!visible) return null;
  if (homeStatus === "unknown") return null;
  if (homeStatus === "added") return null;

  return (
    <div
      className={`bg-white flex justify-between items-center rounded-xl shadow-xl w-full mb-4 py-4 px-5
      transition-all duration-500 ease-in-out
      ${isFading ? "opacity-0 translate-y-2 scale-95" : "opacity-100"}`}
    >
      <div>
        <p className="font-semibold">{t("installApp")}</p>
        <p className="font-normal text-sm">{t("fromScreen")}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={addToHome}
          className="bg-blue-500 text-white rounded-xl px-4 py-3 font-semibold text-base hover:bg-blue-600 transition-colors"
        >
          {t("installation")}
        </button>

      </div>
    </div>
  );
}