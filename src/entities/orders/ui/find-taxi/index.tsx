import { useOrderStore } from "@/app/store/order";
import { useToast } from "@/shared/lib/hooks";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { OrderCar } from "@/shared/ui/order/car";
import { Location } from "@/shared/ui/order/location";
import { User } from "@/shared/ui/order/user";
import { SwipeToCancel } from "@/shared/ui/swipe-to-cancel";
import { Loading02 } from "@untitledui/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCancelOrder } from "../../hooks";
import { CancelReasonSheet } from "../cancel-reason";

// Statuses that require cancellation reason
const STATUSES_REQUIRING_REASON = ["assigned", "arrived", "started"] as const;

export const FoundTaxi = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language as "en" | "ru" | "uz";
  const { order: driverDetails, setOrder, setOrderId } = useOrderStore();
  const toast = useToast();
  const { mutate: cancelOrder, isPending } = useCancelOrder();
  const [openCancelConfirm, setOpenCancelConfirm] = useState(false);
  const [openCancelReason, setOpenCancelReason] = useState(false);

  if (!driverDetails) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loading02 className="transform animate-spin size-10" />
      </div>
    );
  }

  const order = driverDetails.driver_details;
  const car = order?.cars?.[0];
  const orderId = driverDetails?.id;
  const passengerId = driverDetails.creator?.id;

  // Check if status requires cancellation reason
  const requiresCancelReason = () => {
    return STATUSES_REQUIRING_REASON.includes(
      driverDetails.status as (typeof STATUSES_REQUIRING_REASON)[number],
    );
  };

  const handleSwipeCancel = () => {
    if (requiresCancelReason()) {
      setOpenCancelConfirm(true);
    } else {
      handleCancelWithoutReason();
    }
  };

  // Cancel order without reason (status is "created")
  const handleCancelWithoutReason = () => {
    if (!orderId || !passengerId) return;

    cancelOrder(
      {
        order_id: orderId,
        passenger_id: passengerId,
      },
      {
        onSuccess: () => {
          toast.success(t("orders.orderCancelled"));
          resetOrderState();
        },
        onError: () => {
          toast.error(t("orders.cancelError"));
        },
      },
    );
  };

  // Cancel order with reason (status is "assigned", "arrived", or "started")
  const handleCancelWithReason = (
    selectedReason: string | null = null,
    otherReason: string = "",
  ) => {
    if (!orderId || !passengerId) return;

    const comment = selectedReason
      ? t(`order-details.${selectedReason}`)
      : otherReason || "";

    cancelOrder(
      {
        order_id: orderId,
        passenger_id: passengerId,
        comment: comment || undefined,
      },
      {
        onSuccess: () => {
          toast.success(t("orders.orderCancelled"));
          resetOrderState();
        },
        onError: () => {
          toast.error(t("orders.cancelError"));
        },
      },
    );
  };

  const resetOrderState = () => {
    setOrder(null);
    setOrderId(0);
    setOpenCancelConfirm(false);
    setOpenCancelReason(false);
  };

  const handleWarningYes = () => {
    setOpenCancelConfirm(false);
    setOpenCancelReason(true);
  };

  const handleReasonSubmit = (
    selectedReason: string | null,
    otherReason: string,
  ) => {
    handleCancelWithReason(selectedReason, otherReason);
  };
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl text-black font-semibold ">
          {driverDetails.content_object?.tariff?.translate?.[language]}
        </h1>
        <p className="font-semibold leading-8 text-blue-primary text-[22px]">
          {Number(driverDetails?.content_object?.price).toLocaleString()}{" "}
          {t("currency")}
        </p>
      </div>
      <div className="space-y-3">
        <div className="border-b py-2 border-gray-100">
          <User
            name={driverDetails?.creator?.full_name}
            image={order?.full_profile_image_url}
            rate={order?.rating || 0}
            status={order?.status as any}
            phone={driverDetails?.driver_details?.phone || ""}
          />
        </div>
        <OrderCar
          name={car.car_model}
          number={car.car_number}
          color={car.car_color}
        />
        <Location
          from={order?.route_id?.from_city?.translate?.[language] || ""}
          to={order?.route_id?.to_city?.translate?.[language] || ""}
        />
      </div>
      <p className="text-red-500 text-sm font-normal mt-5">
        {t("order-details.warn_creater")}
      </p>
      <SwipeToCancel
        onCancel={handleSwipeCancel}
        isLoading={isPending}
        disabled={isPending}
        hintText={t("order-details.swipeToCancel")}
      />
      <BottomSheet
        isOpen={openCancelConfirm}
        onClose={() => setOpenCancelConfirm(false)}
        disableDrag={true}
        headerClassName="!border-0 pb-0"
        contentClassName="!px-0 !py-0"
        closeButton={false}
      >
        <div className="flex flex-col items-center px-6 py-6">
          {/* Warning Icon */}
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-red-500 border-dashed animate-pulse"></div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {t("order-details.cancel-warning-title")}
          </h2>

          {/* Description */}
          <div className="text-center mb-6 space-y-2">
            <p className="text-base text-gray-700">
              {t("order-details.cancel-warning-desc")}
            </p>
            <p className="text-sm text-gray-500">
              {t("order-details.cancel-warning-rating")}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setOpenCancelConfirm(false)}
              className="flex-1 bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 font-semibold text-base hover:bg-gray-50 transition-colors"
            >
              {t("profile.not")}
            </button>
            <button
              onClick={handleWarningYes}
              className="flex-1 bg-blue-500 text-white rounded-xl px-4 py-3 font-semibold text-base hover:bg-blue-600 transition-colors"
            >
              {t("yes")}
            </button>
          </div>
        </div>
      </BottomSheet>
      <CancelReasonSheet
        isOpen={openCancelReason}
        onClose={() => setOpenCancelReason(false)}
        onSubmit={handleReasonSubmit}
        isLoading={isPending}
      />
    </>
  );
};
