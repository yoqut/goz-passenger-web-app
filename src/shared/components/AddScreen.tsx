import { useEffect, useState } from "react";

type HomeStatus = "unknown" | "unsupported" | "missed" | "added" | string;

function isIOS() {
  const ua = navigator.userAgent || "";
  const iOSUA = /iPad|iPhone|iPod/.test(ua);
  const iPadOS =
    navigator.platform === "MacIntel" && (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 1;
  return iOSUA || iPadOS;
}

function getTg() {
  return (window as Window & { Telegram?: any }).Telegram?.WebApp;
}

export function InstallCard({ t }: { t: (k: string) => string }) {
  const [visible, setVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [homeStatus, setHomeStatus] = useState<HomeStatus>("unknown");
  const [tgReady, setTgReady] = useState(false);

  const ios = isIOS();

  const hideCard = () => {
    setIsFading(true);
    window.setTimeout(() => setVisible(false), 500);
  };

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const init = () => {
      const tg = getTg();

      if (!tg) {
        if (mounted) {
          setTgReady(false);
          setHomeStatus((prev) => (prev === "unknown" ? "missed" : prev));
        }
        return;
      }

      if (mounted) setTgReady(true);

      const onChecked = (data: any) => {
        const st = String(data?.status ?? "unknown") as HomeStatus;
        setHomeStatus(st);

        if (st === "added") {
          setVisible(false);
        } else if (ios && st === "unknown") {
          setHomeStatus("missed");
        }
      };

      const onAdded = () => {
        setHomeStatus("added");
        hideCard();
      };

      tg.onEvent?.("homeScreenChecked", onChecked);
      tg.onEvent?.("homeScreenAdded", onAdded);

      try {
        tg.checkHomeScreenStatus?.();
      } catch {
        setHomeStatus("missed");
      }

      const fallbackId = window.setTimeout(() => {
        setHomeStatus((prev) =>
          prev === "unknown" || prev === "unsupported" ? "missed" : prev,
        );
      }, 1200);

      cleanup = () => {
        window.clearTimeout(fallbackId);
        tg.offEvent?.("homeScreenChecked", onChecked);
        tg.offEvent?.("homeScreenAdded", onAdded);
      };
    };

    init();
    const retryId = window.setTimeout(init, 800);

    return () => {
      mounted = false;
      window.clearTimeout(retryId);
      cleanup?.();
    };
  }, [ios]);

  useEffect(() => {
    if (!visible || homeStatus === "added") return;

    const id = window.setTimeout(() => {
      if (homeStatus !== "added") hideCard();
    }, 10000);

    return () => window.clearTimeout(id);
  }, [visible, homeStatus]);

  const addToHome = () => {
    const tg = getTg();

    if (!tg) {
      alert(t("tgNotSupported") ?? "Telegram versiyasi qo'llab-quvvatlamaydi");
      return;
    }

    if (typeof tg.addToHomeScreen === "function") {
      tg.addToHomeScreen();
    } else {
      alert(t("tgNotSupported") ?? "Telegram versiyasi qo'llab-quvvatlamaydi");
    }
  };

  if (!visible) return null;
  if (homeStatus === "added") return null;
  if (homeStatus === "unsupported") return null;
  if (!tgReady && homeStatus === "unknown") return null;

  return (
    <div
      className={[
        "bg-white flex justify-between items-center rounded-xl shadow-xl w-full mb-4 py-4 px-5",
        "transition-all duration-500 ease-in-out",
        isFading ? "opacity-0 translate-y-2 scale-95" : "opacity-100",
      ].join(" ")}
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