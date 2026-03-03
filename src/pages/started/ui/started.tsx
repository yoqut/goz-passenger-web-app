import { EngFlag, LightMainLogo, RusFlag, UzbFlag } from "@/app/assets/index";

import { useCreateClient } from "@/entities/user/api/useCreateClient";
import { useGetUser } from "@/entities/user/api/useGetClient";
import { STORAGE_KEY } from "@/i18n";
import { useGetUserId, useToast } from "@/shared/lib/hooks";
import { RoutePaths } from "@/shared/routes/route-paths";
import { Container } from "@/shared/ui/container/container";
import DefaultButton from "@/shared/ui/default-button";
import { PageLoader } from "@/shared/ui/loader";
import {
  RadioButton,
  RadioGroup,
} from "@/shared/ui/radio-buttons/radio-buttons";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Started = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { error } = useToast();
  const currentLanguage = localStorage.getItem(STORAGE_KEY);

  const handleChangeLang = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  // Get Telegram user data from hook
  const { userId, userData } = useGetUserId();

  // Check if user exists in database
  const { data: checkedUser, isLoading: isCheckingUser } = useGetUser(
    userId ?? undefined
  );

  // Auto-redirect based on user existence
  useEffect(() => {
    if (isCheckingUser || !userId) return;

    if (checkedUser && checkedUser.id) {
      localStorage.setItem(STORAGE_KEY, checkedUser.language);

      navigate(RoutePaths.ONBOARDING);
    }
    // If user doesn't exist (checkedUser is null/undefined), stay on this page
    // User will manually click button to go to onboarding
  }, [checkedUser, isCheckingUser, userId, navigate]);

  const { mutateAsync, isPending, error: clientError } = useCreateClient();

  // Handle continue button click
  const handleContinue = async () => {
    if (!checkedUser && userId && userData) {
      const response = await mutateAsync({
        telegram_id: userId,
        full_name: userData.fullName || "",
        username: userData.username || "",
        language: currentLanguage || "uz",
      });

      // Check if response status is 201 (Created)
      if (response?.status === 201 || response) {
        navigate(RoutePaths.ONBOARDING);
      }
      if (clientError) {
        error(t("client.error") || "Failed to create client", {
          description: clientError?.message || "Please try again",
        });
      }
    }
  };

  return isCheckingUser ? (
    <PageLoader />
  ) : (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <Container size="md" className="h-full flex flex-col justify-end">
        <div className="flex flex-1 items-center justify-center">
          <LightMainLogo />
        </div>
        <h2 className="mb-3 text-left text-2xl font-bold text-gray-900">
          {t("language.selectLanguage")}
        </h2>
        <RadioGroup
          className="space-y-4 py-5"
          aria-label="Language"
          onChange={handleChangeLang}
          defaultValue={currentLanguage}
        >
          <RadioButton
            icon={UzbFlag}
            aria-label="uz"
            label="Uzbek"
            value="uz"
          />
          <RadioButton
            icon={RusFlag}
            aria-label="ru"
            label="Russian"
            value="ru"
          />
          <RadioButton
            icon={EngFlag}
            aria-label="en"
            label="English"
            value="en"
          />
        </RadioGroup>
        <DefaultButton
          onClick={handleContinue}
          text={t("start")}
          isLoading={isPending}
          isDisabled={isPending}
        />
      </Container>
    </div>
  );
};

export default Started;
