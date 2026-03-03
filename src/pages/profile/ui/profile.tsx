import { EngFlag, RusFlag, StarIcon, UzbFlag } from "@/app/assets";
import { CashbackCard } from "@/app/assets/images";
import { useGetUserCashback } from "@/entities/orders/hooks";
import { useGetCheckPassenger } from "@/entities/user/api/useGetCheckPassenger";
import { STORAGE_KEY } from "@/i18n";
import { useGetUserId } from "@/shared/lib/hooks";
import { Avatar } from "@/shared/ui/avatar/avatar";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Container } from "@/shared/ui/container/container";
import { PageLoader } from "@/shared/ui/loader";
import { RadioButton } from "@/shared/ui/radio-buttons/radio-buttons";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { ChevronRight, Globe01, LogOut01, User01 } from "@untitledui/icons";
import { useState } from "react";
import { RadioGroup } from "react-aria-components";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [openLanguage, setOpenLanguage] = useState(false);
  const { userId, userData } = useGetUserId();
  const { data: userCashback } = useGetUserCashback(userId || 942734553);
  const [logOutOpen, setLogOutOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const currentLanguage = localStorage.getItem(STORAGE_KEY);
  const navigate = useNavigate();

  // Get Telegram user data for avatar
  const launchParams = useLaunchParams();

  // Get passenger data from API
  const { data: passengerData, isLoading } = useGetCheckPassenger(
    userId ?? undefined,
  );

  // Get user photo from Telegram initData
  const initData =
    launchParams && "tgWebAppData" in launchParams
      ? (launchParams as any).tgWebAppData
      : null;
  const userPhoto = initData?.user?.photo_url || "";

  const displayName =
    passengerData?.full_name || userData?.fullName || t("user.defaultName");
  const displayImage = userPhoto || "";
  const displayRating = passengerData?.rating || 0;
  const handleChangeLang = (value: string) => {
    setOpenLanguage(false);
    i18n.changeLanguage(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  const logOut = () => {
    navigate("/auth");
    setLogOutOpen(false);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Container className=" h-full bg-white">
      <div className=" text-center py-3">
        <Avatar size="xl" src={displayImage} />
        <div className="flex justify-center items-center gap-2">
          <h1 className="text-lg font-medium">{displayName}</h1>
          <span className="flex items-center gap-1 text-sm">
            <StarIcon /> {displayRating.toFixed(1)}
          </span>
        </div>
      </div>
      {/* Cashback Card */}
      <div className="relative  rounded-xl overflow-hidden">
        <img
          src={CashbackCard}
          alt="Cashback Card"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 py-5">
          <p className="text-white/90 text-sm mb-2">
            {t("profile.accumulatedPoints")}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-white text-3xl font-bold">
              {userCashback?.amount}
            </span>
            <span className="text-white/90 text-lg">{t("currency")}</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 mt-4 flex flex-col">
        <Link to="/profile/edit">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div className="bg-gray-100 rounded-full p-3 flex items-center justify-center">
                <User01 className="text-slate-700" />
              </div>
              <h2 className="font-medium text-slate-700 text-md">
                {t("profile.account")}
              </h2>
            </div>
            <ChevronRight className="text-slate-700" />
          </div>
        </Link>
        <button
          onClick={() => setOpenLanguage(true)}
          className="flex flex-1 items-center justify-between"
        >
          <div className="flex items-center gap-2 flex-1">
            <div className="bg-gray-100 rounded-full p-3 flex items-center justify-center">
              <Globe01 className="text-slate-700" />
            </div>
            <h2 className="font-medium text-slate-700 text-md">
              {t("profile.language")}
            </h2>
          </div>
          <ChevronRight className="text-slate-700" />
        </button>
        <button
          onClick={() => setLogOutOpen(true)}
          className="flex flex-1 items-center justify-between"
        >
          <div className="flex items-center gap-2 flex-1">
            <div className="bg-gray-100 rounded-full p-3 flex items-center justify-center">
              <LogOut01 className="text-slate-700" />
            </div>
            <h2 className="font-medium text-slate-700 text-md">
              {t("profile.logout")}
            </h2>
          </div>
          <ChevronRight className="text-slate-700" />
        </button>
      </div>
      <BottomSheet
        title={t("profile.language")}
        contentClassName="px-4 pb-4"
        isOpen={openLanguage}
        onClose={() => setOpenLanguage(false)}
      >
        <RadioGroup
          className={"space-y-8"}
          aria-label="Language"
          onChange={handleChangeLang}
          defaultValue={currentLanguage}
        >
          <RadioButton
            icon={UzbFlag}
            aria-label="uz"
            label={t("language.uz")}
            size="md"
            value="uz"
          />
          <RadioButton
            icon={RusFlag}
            aria-label="ru"
            label={t("language.ru")}
            size="md"
            value="ru"
          />
          <RadioButton
            icon={EngFlag}
            aria-label="en"
            label={t("language.en")}
            size="md"
            value="en"
          />
        </RadioGroup>
      </BottomSheet>
      <BottomSheet
        title={t("profile.sure")}
        isOpen={logOutOpen}
        onClose={() => setLogOutOpen(false)}
        contentClassName="w-full pb-4 justify-between"
      >
        <div className="flex items-center gap-2">
          <button
            color="secondary"
            onClick={logOut}
            className=" border border-gray-200 rounded-xl px-3 py-2 flex-1"
          >
            {t("profile.logout")}
          </button>
          <button
            onClick={() => setLogOutOpen(false)}
            className="bg-blue-500 border text-white border-blue-500 rounded-xl px-3 py-2 flex-1"
          >
            {t("profile.not")}
          </button>
        </div>
      </BottomSheet>
    </Container>
  );
};

export default Profile;
