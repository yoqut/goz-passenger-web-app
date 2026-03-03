import {
  bindViewportCssVars,
  disableVerticalSwipes,
  expandViewport,
  isSwipeBehaviorMounted,
  isViewportCssVarsBound,
  isViewportMounted,
  mountSwipeBehavior,
  mountViewport,
  requestFullscreen,
} from "@telegram-apps/sdk-react";
import { useEffect } from "react";

/**
 * Telegram Mini App uchun fullscreen, viewport expand va
 * vertikal swipe disable qilish hooki.
 *
 * Bu hook ilovani to'liq ekranda ochadi va foydalanuvchi
 * yuqoridan pastga surganida yopilishini oldini oladi.
 *
 * CSS o'zgaruvchilari:
 * - --tg-viewport-content-safe-area-inset-top (Telegram X button uchun)
 * - --tg-viewport-content-safe-area-inset-bottom
 * - --tg-viewport-safe-area-inset-top (qurilma notch uchun)
 * - --tg-viewport-safe-area-inset-bottom
 */
export const useTelegramWebApp = () => {
  useEffect(() => {
    const setupTelegramWebApp = async () => {
      try {
        // 1. Viewport ni mount qilamiz (agar hali mount bo'lmagan bo'lsa)
        if (!isViewportMounted()) {
          await mountViewport();
        }

        // 2. Viewport ni expand qilamiz (BottomSheet'ni to'liq ochadi)
        expandViewport();

        // 3. CSS o'zgaruvchilarni sozlaymiz (safe area insetlar uchun)
        if (!isViewportCssVarsBound()) {
          try {
            bindViewportCssVars();
          } catch {
            console.warn(
              "[TelegramWebApp] Binding viewport CSS vars is not supported",
            );
          }
        }

        // 4. Fullscreen so'raymiz (Bot API 8.0+)
        try {
          await requestFullscreen();
        } catch {
          console.warn(
            "[TelegramWebApp] Fullscreen is not supported on this platform",
          );
        }

        // 5. Swipe behavior ni mount qilamiz (agar hali mount bo'lmagan bo'lsa)
        if (!isSwipeBehaviorMounted()) {
          try {
            mountSwipeBehavior();
          } catch {
            console.warn(
              "[TelegramWebApp] Swipe behavior mount is not supported",
            );
          }
        }

        // 6. Vertikal swipeni disable qilamiz (pastga surtganida yopilmasligi uchun)
        try {
          disableVerticalSwipes();
        } catch {
          console.warn(
            "[TelegramWebApp] Disable vertical swipes is not supported",
          );
        }
      } catch (error) {
        console.error("[TelegramWebApp] Setup error:", error);
      }
    };

    setupTelegramWebApp();
  }, []);
};

export default useTelegramWebApp;
