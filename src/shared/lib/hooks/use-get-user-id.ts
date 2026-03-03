import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useMemo } from "react";

export type TelegramUserData = {
  id: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
};

export type UseGetUserIdResult = {
  userId: number | null;
  userData: TelegramUserData | null;
  isLoading: boolean;
  error: Error | null;
};

/**
 * Hook to get Telegram user data from launch parameters
 * @returns {UseGetUserIdResult} User ID, user data, loading state, and error
 * @example
 * ```tsx
 * const { userId, userData, isLoading, error } = useGetUserId();
 *
 * if (isLoading) return <Loader />;
 * if (error) return <Error message={error.message} />;
 * if (!userId) return <NotAuthorized />;
 *
 * return <div>Welcome, {userData?.fullName}!</div>;
 * ```
 */
export const useGetUserId = (): UseGetUserIdResult => {
  const launchParams = useLaunchParams();

  const result = useMemo(() => {
    try {
      // Type-safe way to access tgWebAppData
      const initData =
        launchParams && "tgWebAppData" in launchParams
          ? (launchParams as any).tgWebAppData
          : null;

      if (!initData?.user) {
        return {
          userId: null,
          userData: null,
          isLoading: false,
          error: new Error("No Telegram user data available"),
        };
      }

      const user = initData.user;

      // Build full name from available parts
      const fullName =
        [user.first_name, user.last_name].filter(Boolean).join(" ") || null;

      const userData: TelegramUserData = {
        id: user.id,
        username: user.username || null,
        firstName: user.first_name || null,
        lastName: user.last_name || null,
        fullName,
      };

      return {
        userId: user.id,
        userData,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      console.error("[useGetUserId] Failed to retrieve user data:", error);

      return {
        userId: null,
        userData: null,
        isLoading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to retrieve user data"),
      };
    }
  }, [launchParams]);

  return result;
};

// Backward compatibility - default export
export default useGetUserId;
