/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prevent-abbreviations */
import { useGetCheckPassenger } from "@/entities/user/api/useGetCheckPassenger";
import { usePassengerSendOTP } from "@/entities/user/api/useSendOtpPassenger";
import { useUpdatePassenger } from "@/entities/user/api/useUpdatePassenger";
import { useGetUserId, useToast } from "@/shared/lib/hooks";
import { formatPhoneNumber, maskPhoneNumber } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui/avatar/avatar";
import { Container } from "@/shared/ui/container/container";
import DefaultButton from "@/shared/ui/default-button";
import { Input } from "@/shared/ui/input/input";
import { PageLoader } from "@/shared/ui/loader";
import { PinInput } from "@/shared/ui/pin-input/pin-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { ChevronLeft } from "@untitledui/icons";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { OTP_LENGTH, RESEND_TIMER_SECONDS } from "./api";

const editschema = z.object({
  name: z.string().min(4, "Iltimos, ismingizni kiriting"),
  phone: z.string().min(13, "Iltimos, yaroqli telefon raqamingizni kiriting"),
});
type EditFormData = z.infer<typeof editschema>;

const EditProfile = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { t } = useTranslation();

  // Get Telegram user data
  const { userId: telegram_id } = useGetUserId();
  const launchParams = useLaunchParams();

  // Get passenger data from API
  const { data: passengerData, isLoading: isLoadingPassenger } =
    useGetCheckPassenger(telegram_id ?? undefined);

  // API hooks
  const { mutateAsync: sendOTP, isPending: isSendingOTP } =
    usePassengerSendOTP();
  const { mutateAsync: updatePassenger, isPending: isUpdatingPassenger } =
    useUpdatePassenger();

  // Get user photo from Telegram initData
  const initData =
    launchParams && "tgWebAppData" in launchParams
      ? (launchParams as any).tgWebAppData
      : null;
  const userPhoto = initData?.user?.photo_url || "";

  const [step, setStep] = useState<"form" | "verify">("form");
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [isPhoneChanged, setIsPhoneChanged] = useState(false);
  const [storedOtpCode, setStoredOtpCode] = useState<string>("");
  const nameRef = useRef<HTMLInputElement>(null);
  const pinInputRef = useRef<HTMLInputElement>(null);
  const formInitialized = useRef(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    getValues,
    reset,
  } = useForm<EditFormData>({
    resolver: zodResolver(editschema),
    defaultValues: {
      name: passengerData?.full_name || "",
      phone: passengerData?.phone?.toString() || "",
    },
  });

  // Update form when passenger data loads (only once)
  useEffect(() => {
    if (passengerData && !formInitialized.current) {
      reset({
        name: passengerData.full_name || "",
        phone: passengerData.phone?.toString() || "",
      });
      formInitialized.current = true;
    }
  }, [passengerData, reset]);

  // Cleaned phone number for comparison and API use (removing all non-digits)
  const watchedName = watch("name");
  const watchedPhone = watch("phone");

  useEffect(() => {
    if (!passengerData) return;
    // Remove ALL non-digit characters from both for proper comparison
    const cleanedWatchedPhone = watchedPhone?.replace(/[^\d]/g, "") || "";
    const originalPhone =
      passengerData.phone?.toString().replace(/[^\d]/g, "") || "";
    const isNameChanged = passengerData.full_name !== watchedName;
    const isPhoneChanged = originalPhone !== cleanedWatchedPhone;
    setIsNameChanged(isNameChanged);
    setIsPhoneChanged(isPhoneChanged);
  }, [watchedName, watchedPhone, passengerData]);

  // --- OTP Timer Logic ---
  useEffect(() => {
    let timerId: number;
    if (resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000) as unknown as number;
    }
    return () => clearInterval(timerId);
  }, [resendTimer]);

  // --- Backend Interaction Handlers ---

  // 1. Handles form submission: checks for change type and executes the corresponding action.
  const onSubmit = async (data: EditFormData): Promise<void> => {
    if (!passengerData || !telegram_id) return;

    clearErrors();
    setApiError(null);

    // Case 1: Only Name Changed (Phone is the same)
    if (isNameChanged && !isPhoneChanged) {
      try {
        await updatePassenger({
          id: passengerData.id,
          passengerData: { full_name: data.name },
        });
        success(t("profile.nameUpdated"));
        navigate("/profile");
      } catch (error: any) {
        toastError(t("profile.updateError"));
        setApiError(error?.response?.data?.message || t("profile.updateError"));
      }
    }

    // Case 2: Phone Changed (with or without Name change)
    else if (isPhoneChanged) {
      const newPhone = watchedPhone?.replace(/[^\d]/g, "");
      try {
        const response = await sendOTP({
          phone: +newPhone,
          telegram_id: telegram_id,
          isDriver: false,
        });

        // Store OTP code from response
        if (response.result?.sms_code) {
          setStoredOtpCode(response.result.sms_code.toString());
        }

        setStep("verify");
        setResendTimer(RESEND_TIMER_SECONDS);
        success(t("auth.otpSent"));
      } catch (error: any) {
        setError("phone", {
          message: error?.response?.data?.message || t("auth.otpSendError"),
        });
      }
    }
  };

  // 2. Resends OTP code.
  const resendOtp = async () => {
    if (resendTimer > 0 || !telegram_id) return;
    setApiError(null);
    const newPhone = watchedPhone?.replace(/[^\d]/g, "");
    try {
      const response = await sendOTP({
        phone: +newPhone,
        telegram_id: telegram_id,
        isDriver: false,
      });

      // Store new OTP code from response
      if (response.result?.sms_code) {
        setStoredOtpCode(response.result.sms_code.toString());
      }

      setResendTimer(RESEND_TIMER_SECONDS);
      success(t("auth.otpResent"));
    } catch (error: any) {
      setApiError(error?.response?.data?.message || t("auth.otpSendError"));
    }
  };

  // OTP change handler
  const handleOtpChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtpCode(numericValue);
  };

  // 3. Verifies the OTP code and updates both name and phone if successful.
  const handleVerifyOtp = async () => {
    if (otpCode.length !== OTP_LENGTH || !passengerData) return;
    setApiError(null);

    const { name: newName, phone: newPhoneFormatted } = getValues();
    const newPhoneClean = newPhoneFormatted.replace(/[^\d]/g, "");

    // Verify OTP matches the stored code from API
    if (otpCode !== storedOtpCode) {
      setApiError(t("auth.invalidOtp"));
      return;
    }

    try {
      // Update passenger with new phone and/or name
      await updatePassenger({
        id: passengerData.id,
        passengerData: {
          full_name: newName,
          phone: +newPhoneClean,
        },
      });

      success(t("profile.updated"));
      navigate("/profile");
    } catch (error: any) {
      setApiError(error?.response?.data?.message || t("auth.verifyError"));
    }
  };

  // Focus on name input on mount
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  if (isLoadingPassenger) {
    return <PageLoader />;
  }

  if (!passengerData) {
    return (
      <Container className="h-screen flex items-center justify-center">
        <p>{t("profile.noData")}</p>
      </Container>
    );
  }

  const displayName = passengerData.full_name || "";
  const displayImage = userPhoto || "";

  return (
    <Container className="h-screen flex flex-col bg-primary">
      {/* -------------------- STEP 1: FORM -------------------- */}
      {step === "form" ? (
        <>
          <div className="flex items-center mb-10">
            <Link to="/profile">
              <ChevronLeft />
            </Link>
            <h1 className="text-xl flex-1 text-center text-gray-900 font-normal">
              {t("profile.editProfile")}
            </h1>
          </div>
          <div className=" text-center py-3">
            <Avatar size="2xl" src={displayImage} />
            <h1 className="text-lg font-medium">{displayName}</h1>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-6 items-center flex-1 justify-between"
          >
            <div className="space-y-6 w-full flex flex-col items-center">
              {/* Full Name Input */}
              <div className="w-full max-w-[343px]">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      ref={nameRef}
                      wrapperClassName="focus-within:ring-blue-primary"
                      label={t("auth.fullName")}
                      placeholder={t("auth.fullNamePlaceholder")}
                      isInvalid={!!errors.name}
                      hint={
                        errors.name?.message
                          ? t(errors.name.message)
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
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        value={
                          field.value
                            ? formatPhoneNumber(field.value)
                            : field.value
                        }
                        label={t("auth.phone")}
                        placeholder={t("auth.phonePlaceholder")}
                        wrapperClassName="focus-within:ring-blue-primary"
                        isInvalid={!!errors.phone}
                        hint={
                          errors.phone?.message
                            ? t(errors.phone.message)
                            : undefined
                        }
                        size="md"
                        type="tel"
                        // Handle formatting on change
                        onChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            {(isNameChanged || isPhoneChanged) && (
              <DefaultButton
                type="submit"
                className="w-full"
                text={
                  isPhoneChanged ? t("auth.sendOtp") : t("auth.saveChanges")
                }
                isLoading={isSubmitting || isUpdatingPassenger || isSendingOTP}
                isDisabled={isSubmitting || isUpdatingPassenger || isSendingOTP}
              />
            )}
          </form>
        </>
      ) : (
        // -------------------- STEP 2: VERIFY OTP --------------------
        <>
          <div className="justify-between m-0 p-0 w-full flex-1 flex flex-col">
            <div>
              {/* OTP Section */}
              <div className="flex mt-14 flex-col items-center space-y-6">
                {/* Title */}
                <div className="text-left w-full max-w-[343px]">
                  <h1 className="text-display-sm font-semibold text-fg-primary">
                    {t("auth.otpTitle")}
                  </h1>
                  <p className="mt-2 text-sm text-fg-tertiary font-medium">
                    {t("auth.otpSubtitle")}
                    <strong> {maskPhoneNumber(watchedPhone)}</strong>
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
                      <PinInput.Slot index={0} ref={pinInputRef} />
                      <PinInput.Slot index={1} />
                      <PinInput.Slot index={2} />
                      <PinInput.Slot index={3} />
                    </PinInput.Group>
                  </PinInput>

                  {/* Resend Timer/Button */}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                    onClick={resendOtp}
                    disabled={resendTimer > 0}
                  >
                    {resendTimer > 0
                      ? t("auth.resendCodeIn", { seconds: resendTimer }) // Using t() for translation
                      : t("auth.resendOtp")}
                  </button>

                  {/* API Error Message */}
                  {apiError && (
                    <p className="text-red-500 text-sm font-medium text-center w-full max-w-[343px]">
                      {apiError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className=" w-full  space-y-4">
              <DefaultButton
                type="button"
                text={t("auth.verify")}
                className="w-full bg-blue-primary"
                onClick={handleVerifyOtp}
                isLoading={isUpdatingPassenger}
                isDisabled={
                  otpCode.length !== OTP_LENGTH || isUpdatingPassenger
                }
              />
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default EditProfile;
