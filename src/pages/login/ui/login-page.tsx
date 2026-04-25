import { useUserStore } from "@/app/store/user";
import { useCreatePassenger } from "@/entities/user/api/useCreatePassenger";
import { usePassengerSendOTP } from "@/entities/user/api/useSendOtpPassenger";
import { useGetUserId, useToast } from "@/shared/lib/hooks";
import {
  formatPhoneNumber,
  isValidOTP,
  maskPhoneNumber,
} from "@/shared/lib/utils";
import type { AuthFormData } from "@/shared/types/auth-types";
import { Container } from "@/shared/ui/container/container";
import DefaultButton from "@/shared/ui/default-button";
import { Input } from "@/shared/ui/input/input";
import { PinInput } from "@/shared/ui/pin-input/pin-input";
import { PrivacyModal } from "@/shared/ui/privacy-modal/privacy-modal";
import { ChevronLeft } from "@untitledui/icons";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type AuthStep = "form" | "otp";

const OTP_LENGTH = 4;
const RESEND_TIMER_SECONDS = 60;

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { error, success } = useToast();
  const { userId: telegram_id } = useGetUserId();

  // Store
  const { setOtpData, otpCode: storedOtpCode, clearOtpData } = useUserStore();

  // API hooks
  const { mutateAsync: sendOTP, isPending: isSendingOTP } =
    usePassengerSendOTP();
  const { mutateAsync: createPassenger, isPending: isCreatingPassenger } =
    useCreatePassenger();

  // State
  const [step, setStep] = useState<AuthStep>("form");
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpError, setOtpError] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const pinInputRef = useRef<HTMLInputElement>(null);

  // Form setup
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    mode: "onBlur",
  });
  const formData = watch();

  // Resend timer effect
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-focus first OTP input when step changes to OTP
  useEffect(() => {
    if (step === "otp" && pinInputRef.current) {
      setTimeout(() => {
        pinInputRef.current?.focus();
      }, 0);
    }
  }, [step]);

  // Send OTP handler
  const handleSendOTP = async () => {
    try {
      // Clean phone number: remove spaces, dashes, and +
      const cleanPhone = +formData.phone.replace(/[\s\-+]/g, "");

      // Call API to send OTP
      const response = await sendOTP({
        phone: cleanPhone,
        telegram_id: telegram_id || 0,
        isDriver: false,
      });

      // Store OTP data in Zustand store
      if (response.result?.sms_code) {
        setOtpData(
          response.result.sms_code.toString(),
          formData.fullName,
          telegram_id || 0,
          cleanPhone,
        );
      }

      // Move to OTP step
      setStep("otp");
      setOtpCode("");
      setResendTimer(RESEND_TIMER_SECONDS);

      success(t("auth.otpSent"), {
        description: `${t("auth.otpSubtitle")} ${maskPhoneNumber(
          formData.phone,
        )}`,
      });
    } catch (err) {
      console.error("OTP send error:", err);
      error(t("auth.otpError"), {
        description: "Failed to send OTP. Please try again.",
      });
    }
  };

  // Back to form handler
  const handleBackToForm = () => {
    setStep("form");
    setOtpCode("");
    setResendTimer(0);
    setOtpError(false);
    clearOtpData();
  };

  // Resend OTP handler
  const handleResendOTP = async () => {
    try {
      // Clean phone number: remove spaces, dashes, and +
      const cleanPhone = +formData.phone.replace(/[\s\-+]/g, "");

      // Call API to resend OTP
      const response = await sendOTP({
        phone: cleanPhone,
        telegram_id: telegram_id || 0,
        isDriver: false,
      });

      // Update stored OTP code
      if (response.result?.sms_code) {
        setOtpData(
          response.result.sms_code.toString(),
          formData.fullName,
          telegram_id || 0,
          cleanPhone,
        );
      }

      setOtpCode("");
      setResendTimer(RESEND_TIMER_SECONDS);
      success(t("auth.otpResent"));

      if (pinInputRef.current) {
        pinInputRef.current.focus();
      }
    } catch (err) {
      console.error("OTP resend error:", err);
      error("Failed to resend OTP", {
        description: "Please try again later.",
      });
    }
  };

  // OTP change handler
  const handleOtpChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtpCode(numericValue);
    if (numericValue.length === OTP_LENGTH) {
      setOtpError(false);
    }
  };

  // Verify OTP handler - Local check and create passenger
  const handleVerifyOTP = async () => {
    if (!isValidOTP(otpCode)) {
      setOtpError(true);
      return;
    }

    // Check if OTP matches stored code
    if (otpCode !== storedOtpCode) {
      setOtpError(true);
      error(t("auth.otpInvalid") || "Invalid OTP code", {
        description: "Please check the code and try again",
      });
      return;
    }

    try {
      // Clean phone number: remove spaces, dashes, and +
      const cleanPhone = formData.phone.replace(/[\s\-+]/g, "");

      // OTP is correct - create passenger
      await createPassenger({
        telegram_id: telegram_id || 0,
        phone: +cleanPhone,
        full_name: formData.fullName,
      });

      // Clear OTP data
      clearOtpData();

      // Show success message
      success(t("auth.loginSuccess") || "Registration successful!", {
        description: `${t("auth.welcome") || "Welcome"} ${formData.fullName}!`,
      });

      // Navigate to home
      navigate("/");
    } catch (err: any) {
      error(t("auth.loginError"), {
        description: "Please try again later.",
      });
      setOtpError(true);

      // Show specific error message from backend if available
      const errorMessage =
        err?.response?.data?.message || err?.message || "Registration failed";
      error(errorMessage, {
        description: "Please try again later",
      });
    }
  };

  // Format timer display
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Container
        size="md"
        className="min-h-screen bg-bg-primary px-0 py-4 mx-auto flex flex-col justify-betwen "
      >
        {step === "form" ? (
          // Login Form Step
          <form
            onSubmit={handleSubmit(handleSendOTP)}
            className="flex flex-col space-y-6 items-center py-10  flex-1 justify-between"
          >
            <div className="space-y-6 w-full  flex flex-col items-center">
              {/* Title */}
              <div className="text-left w-full max-w-[343px]">
                <h1 className="text-display-sm font-semibold text-fg-primary">
                  {t("auth.title")}
                </h1>
              </div>

              {/* Full Name Input */}
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

              {/* Phone Input */}
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
                      <p className="font-normla text-xs text-gray-800 mt-1">
                        {t("auth.loginMention")}
                      </p>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className=" w-full  space-y-4">
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
              {/* <DefaultButton
                type="button"
                text={t("auth.login")}
                className="w-full"
                isLoading={isCreatingPassenger}
                isDisabled={
                  isCreatingPassenger ||
                  otpCode.length !== OTP_LENGTH ||
                  !termsAccepted
                }
                onClick={handleVerifyOTP}
              /> */}
              <DefaultButton
                type="submit"
                className="w-full"
                text={t("auth.sendOtp")}
                isLoading={isSubmitting || isSendingOTP}
                isDisabled={isSubmitting || isSendingOTP || !termsAccepted}
              />
            </div>
          </form>
        ) : (
          // OTP Verification Step
          <div className="justify-between m-0 p-0 w-full min-h-[calc(100vh-50px)] flex flex-col">
            <div>
              {/* Back Button */}
              <div className="flex w-full">
                <button
                  type="button"
                  onClick={handleBackToForm}
                  className="hover:bg-primary rounded-lg transition-colors"
                  aria-label="Go back"
                >
                  <ChevronLeft className="size-6" />
                </button>
              </div>

              {/* OTP Section */}
              <div className="flex mt-14 flex-col items-center space-y-6">
                {/* Title */}
                <div className="text-left w-full max-w-[343px]">
                  <h1 className="text-display-sm font-semibold text-fg-primary">
                    {t("auth.otpTitle")}
                  </h1>
                  <p className="mt-2 text-sm text-fg-tertiary font-medium">
                    {t("auth.otpSubtitle")}
                    <strong> {maskPhoneNumber(formData.phone)}</strong>
                  </p>
                </div>

                {/* OTP Input */}
                <div className="w-full flex flex-col space-y-4 items-center max-w-[343px]">
                  <label className="text-left w-full text-sm font-medium">
                    {t("auth.otpCode")}
                  </label>
                  <PinInput size="sm">
                    <PinInput.Group
                      maxLength={OTP_LENGTH}
                      onChange={handleOtpChange}
                      type="numeric"
                      value={otpCode}
                    >
                      <PinInput.Slot
                        className={otpError ? "border border-red-500" : ""}
                        index={0}
                        ref={pinInputRef}
                      />
                      <PinInput.Slot
                        className={otpError ? "border border-red-500" : ""}
                        index={1}
                      />
                      <PinInput.Slot
                        className={otpError ? "border border-red-500" : ""}
                        index={2}
                      />
                      <PinInput.Slot
                        className={otpError ? "border border-red-500" : ""}
                        index={3}
                      />
                    </PinInput.Group>
                  </PinInput>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    {resendTimer > 0
                      ? `${t("auth.resendOtp")} (${formatTimer(resendTimer)})`
                      : t("auth.resendOtp")}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}

            <DefaultButton
              type="button"
              text={t("auth.login")}
              className="w-full"
              isLoading={isCreatingPassenger}
              isDisabled={
                isCreatingPassenger ||
                otpCode.length !== OTP_LENGTH ||
                !termsAccepted
              }
              onClick={handleVerifyOTP}
            />
          </div>
        )}
      </Container>

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
};

export default LoginPage;
