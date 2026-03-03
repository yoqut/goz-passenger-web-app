import { formatCustomDate } from "@/shared/lib/utils/helper";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface INotificationCard {
  message: string;
  date: string;
  orderNumber: string;
  unread: boolean;
}

export const NotificationCard = ({
  orderNumber,
  message,
  date,
  unread,
}: INotificationCard) => {
  const { t } = useTranslation();
  const [openDetails, setOpenDetails] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpenDetails(!openDetails)}
        className={`p-4 bg-[#f3f5f7] rounded-xl  ${
          unread === true ? "border-b-2 border-blue-primary" : ""
        }`}
      >
        <h1 className="font-semibold text-start text-[14px] text-gray-800 leading-6">
          {t("notification.newNotification", { order: orderNumber })}
        </h1>
        <p
          className={`text-sm text-start font-normal text-gray-500 leading-5 ${
            openDetails ? "" : "line-clamp-1"
          }`}
        >
          {message}
        </p>
        <p className="text-sm text-start font-normal text-gray-500 leading-5 line-clamp-1">
          {formatCustomDate(date)}
        </p>
      </button>
    </>
  );
};
