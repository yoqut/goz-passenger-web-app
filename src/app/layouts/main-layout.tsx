import { useGetCheckPassenger } from "@/entities/user/api/useGetCheckPassenger";
import { useGetUser } from "@/entities/user/api/useGetClient";
import { useGetUserId } from "@/shared/lib/hooks";
import { RoutePaths } from "@/shared/routes/route-paths";
import { Container } from "@/shared/ui/container/container";
import { PageLoader } from "@/shared/ui/loader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { FileIcon, NavLogo, UserIcon } from "../assets";

const getActiveFromPathname = (path: string): string => {
  if (!path || path === "main") return "main";
  return path;
};

const MainLayout = () => {
  const { t } = useTranslation();
  const pathname = useLocation().pathname.slice(1);

  const [isActive, setIsActive] = useState(() =>
    getActiveFromPathname(pathname),
  );

  // Get Telegram user data
  const { userId } = useGetUserId();
  const telegram_id = userId ?? undefined;

  // Check if user exists in clients table
  const {
    data: clientData,
    isLoading: isLoadingClient,
    error: clientError,
  } = useGetUser(telegram_id);

  // Check if user is a passenger
  const {
    data: passengerData,
    isLoading: isLoadingPassenger,
    error: passengerError,
  } = useGetCheckPassenger(telegram_id);

  useEffect(() => {
    setIsActive(getActiveFromPathname(pathname));
  }, [pathname]);

  // Show loader while checking both client and passenger status
  if (isLoadingClient || isLoadingPassenger) {
    return <PageLoader />;
  }

  // Determine navigation based on both checks
  const hasClient = clientData && !clientError;
  const hasPassenger = passengerData && !passengerError;

  // If both exist → allow access to home
  if (hasClient && hasPassenger) {
    // User is fully registered, allow access
  } else if (hasClient && !hasPassenger) {
    // Client exists but not passenger → redirect to login
    return <Navigate to={RoutePaths.LOGIN} replace />;
  } else if (!hasClient && hasPassenger) {
    // Passenger exists but not client → redirect to auth/started
    return <Navigate to={RoutePaths.AUTH} replace />;
  } else {
    // Neither exists → redirect to auth/started
    return <Navigate to={RoutePaths.AUTH} replace />;
  }

  return (
    <div className="flex flex-col bg-primary justify-between h-dvh overflow-hidden safe-area-top">
      <div className="overflow-auto flex-1 scroll-container">
        <Outlet />
      </div>
      <Container className=" bg-primary border-t rounded-t-2xl shadow shadow-gray-400 border-gray-200 safe-area-bottom">
        <div className=" flex items-center justify-around mb-4">
          <Link
            className="flex flex-col items-center gap-1"
            to={RoutePaths.HOME}
            onClick={() => setIsActive("main")}
          >
            <NavLogo
              strokeColor={isActive === "main" ? "#2299D5" : "#98A2B3"}
            />
            <h4 style={{ color: isActive === "main" ? "#2299D5" : "#98A2B3" }}>
              {t("navbar.home")}
            </h4>
          </Link>
          <Link
            to={RoutePaths.ORDER}
            className="flex flex-col items-center gap-1"
            onClick={() => setIsActive("order")}
          >
            <FileIcon
              strokeColor={isActive === "order" ? "#2299D5" : "#98A2B3"}
            />
            <h4 style={{ color: isActive === "order" ? "#2299D5" : "#98A2B3" }}>
              {t("navbar.order")}
            </h4>
          </Link>

          {/* <Link
            to={RoutePaths.CHAT}
            className="flex flex-col items-center gap-1"
            onClick={() => setIsActive("chat")}
          >
            <ChatIcon
              strokeColor={isActive === "chat" ? "#2299D5" : "#98A2B3"}
            />
            <h4
              className={`text-[${
                isActive === "chat" ? "#2299D5" : "#98A2B3"
              }] `}
            >
              {t("navbar.chat")}
            </h4>
          </Link> */}
          <Link
            to={RoutePaths.PROFILE}
            className="flex flex-col items-center gap-1"
            onClick={() => setIsActive("profile")}
          >
            <UserIcon
              strokeColor={isActive === "profile" ? "#2299D5" : "#98A2B3"}
            />
            <h4
              style={{ color: isActive === "profile" ? "#2299D5" : "#98A2B3" }}
            >
              {t("navbar.profile")}
            </h4>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default MainLayout;
