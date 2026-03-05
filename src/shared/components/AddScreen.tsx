import { useEffect, useMemo, useState } from "react";

type HomeStatus = "unknown" | "unsupported" | "not_added" | "added" | string;

function getTg() {
  return (window as any).Telegram?.WebApp;
}

function isIOS() {
  const ua = navigator.userAgent || "";
  const iOSUA = /iPad|iPhone|iPod/.test(ua);
  const iPadOS =
    navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1;
  return iOSUA || iPadOS;
}

function isInTelegram() {
  const ua = navigator.userAgent || "";
  return /Telegram/i.test(ua) || !!(window as any).Telegram?.WebApp;
}

const STORAGE_KEY = "homescreen_prompted";

export function InstallCard({ t }: { t: (k: string) => string }) {
  const [visible, setVisible] = useState(false); // default false, useEffect ochadi
  const [isFading, setIsFading] = useState(false);
  const [homeStatus, setHomeStatus] = useState<HomeStatus>("unknown");
  const [iosModalOpen, setIosModalOpen] = useState(false);

  const tg = useMemo(() => getTg(), []);
  const ios = useMemo(() => isIOS(), []);
  const inTg = useMemo(() => isInTelegram(), []);

  const hideCard = () => {
    setIsFading(true);
    window.setTimeout(() => setVisible(false), 500);
  };

  // Auto-hide after 10s
  useEffect(() => {
    if (!visible) return;
    if (homeStatus === "added") return;

    const id = window.setTimeout(() => {
      if (homeStatus !== "added") hideCard();
    }, 10000);

    return () => window.clearTimeout(id);
  }, [visible, homeStatus]);

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert(t("copied") ?? "Link nusxalandi");
    } catch {
      prompt(t("copyManually") ?? "Linkni qo'lda nusxalang:", url);
    }
  };

  const addToHome = () => {
    if (ios) {
      setIosModalOpen(true);
      return;
    }

    if (!tg) return;

    if (typeof tg.addToHomeScreen === "function") {
      tg.addToHomeScreen();
    } else {
      alert(t("tgNotSupported") ?? "Telegram versiyasi qo'llab-quvvatlamaydi");
    }
  };

  useEffect(() => {
    // iOS da homeScreenChecked event ishlamaydi — alohida handle qilamiz
    if (ios) {
      const alreadyPrompted = localStorage.getItem(STORAGE_KEY);
      if (!alreadyPrompted) {
        setHomeStatus("not_added");
        setVisible(true);
      }
      return;
    }

    // Android / Desktop — Telegram event orqali
    if (!tg?.onEvent) {
      setHomeStatus("unsupported");
      // unsupported bo'lsa ham ko'rsatmaymiz
      return;
    }

    const onChecked = (data: any) => {
      const st = String(data?.status ?? "unknown") as HomeStatus;
      setHomeStatus(st);

      if (st === "added") {
        setVisible(false);
      } else if (st === "unknown" || st === "missed" || st === "not_added") {
        // "unknown" ham ko'rsatamiz — Android ba'zan "unknown" qaytarishi mumkin
        setVisible(true);
      }
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
  }, [tg, ios]);

  // iOS modaldan "Yopish" bosganda — prompted deb belgilaymiz, keyingi kirganida so'ramaymiz
  const handleIosModalClose = () => {
    setIosModalOpen(false);
    localStorage.setItem(STORAGE_KEY, "true");
    hideCard();
  };

  if (!visible) return null;
  if (homeStatus === "added") return null;

  return (
    <>
      <div
        className={[
          "bg-white flex justify-between items-center rounded-xl shadow-xl w-full mb-4 py-4 px-5",
          "transition-all duration-500 ease-in-out",
          isFading ? "opacity-0 translate-y-2 scale-95" : "opacity-100",
        ].join(" ")}
      >
        <div>
          <p className="font-semibold">{t("installApp")}</p>
          <p className="font-normal text-sm">
            {ios ? t("iosStep1") : t("fromScreen")}
          </p>
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

      {/* iOS modal */}
      {iosModalOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          onMouseDown={handleIosModalClose}
        >
          <div className="absolute inset-0 bg-black/50" />

          <div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-5"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold">{t("installation")}</p>
                <p className="text-sm text-slate-600 mt-1">
                  {inTg
                    ? (t("iosTgHint") ??
                      "Telegram ichida install bo'lmaydi. Safari'da ochib qo'shing.")
                    : t("iosStep1")}
                </p>
              </div>
              <button
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
                onClick={handleIosModalClose}
              >
                ✕
              </button>
            </div>

            <ol className="mt-4 space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>{t("iosStep1")}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>{t("iosStep2")}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>{t("iosStep3")}</span>
              </li>
              {inTg && (
                <li className="flex gap-2">
                  <span className="font-bold">※</span>
                  <span>
                    {t("iosTgExtra") ??
                      "Agar Safari ochilmasa: pastdagi (⋯) menyudan "Open in Safari" tanlang."}
                  </span>
                </li>
              )}
            </ol>

            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={handleIosModalClose}
                className="rounded-xl px-4 py-2 font-semibold bg-slate-100 hover:bg-slate-200 transition"
              >
                {t("close") ?? "Yopish"}
              </button>

              <button
                onClick={copyLink}
                className="rounded-xl px-4 py-2 font-semibold bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                {t("copyLink") ?? "Linkni nusxalash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}