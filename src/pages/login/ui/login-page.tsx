import { useCreatePassenger } from "@/entities/user/api/useCreatePassenger";
import { useGetUserId, useToast } from "@/shared/lib/hooks";
import { formatPhoneNumber } from "@/shared/lib/utils";
import type { AuthFormData } from "@/shared/types/auth-types";
import { Container } from "@/shared/ui/container/container";
import DefaultButton from "@/shared/ui/default-button";
import { Input } from "@/shared/ui/input/input";
import { PrivacyModal } from "@/shared/ui/privacy-modal/privacy-modal";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { error, success } = useToast();
  const { userId: telegram_id } = useGetUserId();

  // API hooks
  const { mutateAsync: createPassenger, isPending: isCreatingPassenger } =
    useCreatePassenger();

  // State
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Form setup
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    mode: "onBlur",
  });

  // Submit handler — to'g'ridan-to'g'ri ro'yxatdan o'tkazish
  const handleRegister = async (data: AuthFormData) => {
    try {
      const cleanPhone = +data.phone.replace(/[\s\-+]/g, "");

      await createPassenger({
        telegram_id: telegram_id || 0,
        phone: cleanPhone,
        full_name: data.fullName,
      });

      success(t("auth.loginSuccess") || "Ro'yxatdan o'tildi!", {
        description: `${t("auth.welcome") || "Xush kelibsiz"} ${data.fullName}!`,
      });

      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Ro'yxatdan o'tishda xatolik";
      error(t("auth.loginError"), {
        description: errorMessage,
      });
    }
  };

  return (
    <>
      <Container
        size="md"
        className="min-h-screen bg-bg-primary px-0 py-4 mx-auto flex flex-col justify-between"
      >
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col space-y-6 items-center py-10 flex-1 justify-between"
        >
          <div className="space-y-6 w-full flex flex-col items-center">
            {/* Sarlavha */}
            <div className="text-left w-full max-w-[343px]">
              <h1 className="text-display-sm font-semibold text-fg-primary">
                {t("auth.title")}
              </h1>
            </div>

            {/* Ism maydoni */}
            <div className="w-full max-w-[343px]">
              <Controller
                name="fullName"
                control={control}
                rules={{
                  required: "auth.fullNameRequired",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    label={t("auth.fullName")}
                    placeholder={t("auth.fullNamePlaceholder")}
                    wrapperClassName="focus-within:ring-blue-primary"
                    isInvalid={!!errors.fullName}
                    hint={
                      errors.fullName?.message
                        ? t(errors.fullName.message)
                        : undefined
                    }
                    size="md"
                  />
                )}
              />
            </div>

            {/* Telefon maydoni */}
            <div className="w-full max-w-[343px]">
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "auth.phoneRequired",
                  validate: (value) => {
                    if (!value) return true;
                    const formatted = formatPhoneNumber(value);
                    return (
                      formatted.replaceAll(/\D/g, "").length === 12 ||
                      "auth.phoneInvalid"
                    );
                  },
                }}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      label={t("auth.phone")}
                      placeholder={t("auth.phonePlaceholder")}
                      isInvalid={!!errors.phone}
                      isRequired
                      hint={
                        errors.phone?.message
                          ? t(errors.phone.message)
                          : undefined
                      }
                      size="md"
                      wrapperClassName="focus-within:ring-blue-primary"
                      type="tel"
                      onChange={(value) => {
                        field.onChange(formatPhoneNumber(value));
                      }}
                    />
                    <p className="font-normal text-xs text-gray-800 mt-1">
                      {t("auth.loginMention")}
                    </p>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Pastki qism: checkbox + tugma */}
          <div className="w-full space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-500 text-sm">
                {t("auth.terms")}{" "}
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-blue-600 hover:underline"
                >
                  {t("auth.privacyPolicy")}
                </button>
              </span>
            </label>

            <DefaultButton
              type="submit"
              className="w-full"
              text={t("auth.continue") || "Davom etish"}
              isLoading={isSubmitting || isCreatingPassenger}
              isDisabled={isSubmitting || isCreatingPassenger || !termsAccepted}
            />
          </div>
        </form>
      </Container>

      {/* Maxfiylik siyosati modali */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
};

export default LoginPage;
