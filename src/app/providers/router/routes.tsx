import HomePage from "@/pages/home/ui/home-page";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "@/app/layouts/auth-layout";
import MainLayout from "@/app/layouts/main-layout";
import { ChatDetailsPage, ChatsPage, OrdersPage } from "@/pages";
import PermissionError from "@/pages/Error";
import LoginPage from "@/pages/login/ui/login-page";
import { NotiicatioPpage } from "@/pages/notification/ui/notiication-page";
import Onborading from "@/pages/onboarding/ui";
import OrderDetails from "@/pages/order-details/ui";
import EditProfile from "@/pages/profile-edit/ui/edit-profile";
import Profile from "@/pages/profile/ui/profile";
import Started from "@/pages/started/ui/started";
import { RoutePaths } from "@/shared/routes/route-paths";

export const router = createBrowserRouter([
  {
    path: RoutePaths.AUTH,
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Started />,
      },
      {
        path: RoutePaths.ONBOARDING,
        element: <Onborading />,
      },
      {
        path: RoutePaths.LOGIN,
        element: <LoginPage />,
      },
      {
        path: RoutePaths.ERROR,
        element: <PermissionError />,
      },
    ],
  },
  {
    path: RoutePaths.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: RoutePaths.ORDER,
        element: <OrdersPage />,
      },
      {
        path: RoutePaths.CHAT,
        element: <ChatsPage />,
      },
      {
        path: RoutePaths.PROFILE,
        element: <Profile />,
      },
      {
        path: RoutePaths.NOTIFICATION,
        element: <NotiicatioPpage />,
      },
    ],
  },
  {
    path: RoutePaths.CHAT_USER,
    element: <ChatDetailsPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
  {
    path: RoutePaths.ORDER_DETAILS,
    element: <OrderDetails />,
  },
  {
    path: RoutePaths.EDIT_PROFILE,
    element: <EditProfile />,
  },
]);
