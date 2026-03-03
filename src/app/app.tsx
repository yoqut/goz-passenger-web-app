// import PermissionError from "@/pages/Error";
import { useTelegramWebApp } from "@/shared/lib/hooks";
// import { useLaunchParams } from "@telegram-apps/sdk-react";
import { Toaster } from "sonner";
import { QueryProvider } from "./providers/query";
import { AppRouter } from "./providers/router";

// Maintenance mode - false qilganda ilova ishlaydi
// const MAINTENANCE_MODE = false;

const App = () => {
  // Telegram Web App: fullscreen, expand viewport, disable vertical swipes
  useTelegramWebApp();

  // const launchParams = useLaunchParams();

  // // Router mount bo'lmasdan oldin Navigate ishlamaydi - shuning uchun PermissionError ni to'g'ridan-to'g'ri render qilamiz
  // if (launchParams?.tgWebAppPlatform === "web") {
  //   return <PermissionError />;
  // }

  // // Maintenance mode yoqilgan bo'lsa, faqat Maintenance komponentini ko'rsatish
  // if (MAINTENANCE_MODE) {
  //   return <Maintenance />;
  // }

  return (
    <QueryProvider>
      <Toaster position="top-center" />
      <AppRouter />
    </QueryProvider>
  );
};

export default App;
