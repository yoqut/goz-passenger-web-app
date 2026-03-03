import { CarIcon, CarIconSVG, StarIcon } from "@/app/assets";
import { useCancelOrder, useCreateReview } from "@/entities/orders/hooks";
import { useGetOrderById } from "@/entities/orders/hooks/useGetOrderById";
import { CancelReasonSheet } from "@/entities/orders/ui/cancel-reason";
import Loader from "@/shared/components/Loader";
import { useToast } from "@/shared/lib/hooks";
import { formatCustomDate } from "@/shared/lib/utils/helper";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Container } from "@/shared/ui/container/container";
import { OrderCar } from "@/shared/ui/order/car";
import { User } from "@/shared/ui/order/user";
import {
  AlertTriangle,
  Beaker02,
  ChevronLeft,
  FaceSmile,
  Hourglass01,
  Loading02,
  MessageChatSquare,
  ThumbsDown,
  ThumbsUp,
  Trophy01,
  XClose,
} from "@untitledui/icons";
import i18next from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";

const OrderDetails = () => {
  const language = i18next.language as "en" | "ru" | "uz";
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [openFeedBack, setOpenFeedBack] = useState(false);
  const [comment, setComment] = useState("");
  const [rate, setRate] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [openCancelConfirm, setOpenCancelConfirm] = useState(false);
  const [openCancelReason, setOpenCancelReason] = useState(false);
  const { mutate: createReview, isPending: isCreatingReview } =
    useCreateReview();

  const POSITIVE_FEEDBACK_OPTIONS = [
    {
      key: "positive-feedback-good-driver",
      label: t("order-details.positive-feedback-good-driver"),
      icon: <Trophy01 />,
    },
    {
      key: "positive-feedback-comfortable-driving",
      label: t("order-details.positive-feedback-comfortable-driving"),
      icon: <CarIcon />,
    },
    {
      key: "positive-feedback-clean",
      label: t("order-details.positive-feedback-clean"),
      icon: <Beaker02 />,
    },
    {
      key: "positive-feedback-punctual",
      label: t("order-details.positive-feedback-punctual"),
      icon: <Hourglass01 />,
    },
    {
      key: "positive-feedback-good-conversation",
      label: t("order-details.positive-feedback-good-conversation"),
      icon: <MessageChatSquare />,
    },
    {
      key: "positive-feedback-polite",
      label: t("order-details.positive-feedback-polite"),
      icon: <ThumbsUp />,
    },
    {
      key: "positive-feedback-good-mood",
      label: t("order-details.positive-feedback-good-mood"),
      icon: <FaceSmile />,
    },
  ] as const;

  const NEGATIVE_FEEDBACK_OPTIONS = [
    {
      key: "negative-feedback-bad-driver",
      label: t("order-details.negative-feedback-bad-driver"),
      icon: <AlertTriangle />,
    },
    {
      key: "negative-feedback-uncomfortable",
      label: t("order-details.negative-feedback-uncomfortable"),
      icon: <XClose />,
    },
    {
      key: "negative-feedback-dirty",
      label: t("order-details.negative-feedback-dirty"),
      icon: <Beaker02 />,
    },
    {
      key: "negative-feedback-late",
      label: t("order-details.negative-feedback-late"),
      icon: <Hourglass01 />,
    },
    {
      key: "negative-feedback-rude",
      label: t("order-details.negative-feedback-rude"),
      icon: <ThumbsDown />,
    },
    {
      key: "negative-feedback-bad-mood",
      label: t("order-details.negative-feedback-bad-mood"),
      icon: <FaceSmile />,
    },
  ] as const;

  const { data: order, isLoading } = useGetOrderById(id || "");
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const handleFeedbackChange = (feedbackKey: string) => {
    setSelectedFeedback((prev) => {
      if (prev.includes(feedbackKey)) {
        return prev.filter((f) => f !== feedbackKey);
      }
      return [...prev, feedbackKey];
    });
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    // Reset feedback when rating changes
    setSelectedFeedback([]);
  };

  const handleClose = () => {
    setOpenFeedBack(false);
    // Reset form when closing
    setRate(0);
    setSelectedFeedback([]);
    setComment("");
  };

  const handleSubmit = () => {
    // Translate feedback keys to translated text
    const translatedFeedback = selectedFeedback.map((key) =>
      t(`order-details.${key}`),
    );

    // TODO: Send feedback to API
    createReview(
      {
        order_id: order?.id,
        passenger_id: order?.creator?.id,
        comment: comment,
        rate: rate,
        feedback: translatedFeedback,
      },
      {
        onSuccess: () => {
          toast.success(t("order-details.rating-thanks"));
          handleClose();
          navigate("/");
        },
        onError: (error: any) => {
          // Check if error is "already rated"
          const errorMessage =
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            "";
          const isAlreadyRated =
            error?.response?.status === 409 ||
            error?.response?.status === 400 ||
            errorMessage?.toLowerCase().includes("already") ||
            errorMessage?.toLowerCase().includes("avval") ||
            errorMessage?.toLowerCase().includes("уже");

          if (isAlreadyRated) {
            toast.error(t("order-details.rating-already"));
          } else {
            toast.error(t("order-details.rating-error"));
          }
        },
      },
    );
  };

  const handleRejectOrder = (
    selectedReason: string | null = null,
    otherReason: string = "",
  ) => {
    if (!order) return;

    const orderId = order?.id;
    const passengerId = order.creator?.id;
    if (!orderId || !passengerId) {
      toast.error(t("order-details.rejectError"));
      return;
    }

    // Status is "assigned" - requires cancellation reason
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
          toast.success(t("order-details.rejectSuccess"));
          setOpenCancelConfirm(false);
          setOpenCancelReason(false);
          navigate("/order");
        },
        onError: () => {
          toast.error(t("order-details.rejectError"));
          setOpenCancelConfirm(false);
          setOpenCancelReason(false);
        },
      },
    );
  };

  const handleWarningYes = () => {
    // Close warning modal and open reason sheet
    setOpenCancelConfirm(false);
    setOpenCancelReason(true);
  };

  const handleReasonSubmit = (
    selectedReason: string | null,
    otherReason: string,
  ) => {
    handleRejectOrder(selectedReason, otherReason);
  };

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center h-screen">
        <Loader />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="flex items-center justify-center h-screen">
        <p>{t("order-details.notFound")}</p>
      </Container>
    );
  }

  const car = order.driver_details?.cars?.[0] || {};
  const profileImage =
    order.driver_details &&
    import.meta.env.VITE_BASE_URL + order.driver_details.full_profile_image_url;

  // Extract order details from content_object
  const orderDetails = order.content_object;
  return (
    <Container className="flex flex-col p-4 h-screen bg-primary">
      <header className="relative flex items-center ">
        <Link to="/order" className="asbolute left-0 p-2">
          <ChevronLeft />
        </Link>
        <h1 className="text-lg text-black text-center font-semibold flex-1">
          {t("order-details.title", { order: `№${order.id}` })}
        </h1>
      </header>
      <main className="space-y-3">
        <div className="w-full flex items-center justify-center text-center my-4">
          <CarIconSVG className="w-40 h-40" />
          {/* <img src={Cobalt} alt="order-car" className="w-56 h-28 mx-auto" /> */}
        </div>
        <div className="flex  items-center justify-between mb-3">
          <h1 className="text-2xl text-black font-semibold">
            {orderDetails?.tariff?.translate?.[language]}
          </h1>
          <p className="font-semibold leading-8 text-blue-primary text-[22px]">
            {orderDetails?.price || 0} {t("currency")}
          </p>
        </div>
        {car && (
          <OrderCar
            name={car.car_model}
            number={car.car_number}
            color={car.car_color}
          />
        )}
        <div className="space-y-3 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <p className="text-dm font-normal text-gray-500 ">
              {t("order-details.routeWay")}
            </p>
            <p className="text-dm font-bold text-gray-800 ">
              {orderDetails?.from_location?.city} -{" "}
              {orderDetails?.to_location?.city}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-dm font-normal text-gray-500 ">
              {t("order-details.date")}
            </p>
            <p className="text-dm font-bold text-gray-800 ">
              {formatCustomDate(
                orderDetails?.created_at || order.creator?.created_at || "",
              )}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-dm font-normal text-gray-500 ">
              {t("order-details.status")}
            </p>
            <p className="text-dm font-bold text-gray-800 capitalize">
              {order.status}
            </p>
          </div>
        </div>
        {order.driver_details && (
          <User
            name={order.driver_details?.full_name}
            image={profileImage}
            rate={order.driver_details?.rating}
            phone={order.driver_details?.phone}
          />
        )}
      </main>
      <div className="flex-1 items-center flex flex-col justify-end gap-3">
        {order.status === "assigned" && (
          <button
            onClick={() => setOpenCancelConfirm(true)}
            className="bg-red-500 w-full rounded-2xl text-white text-center py-4"
          >
            {t("order-details.rejectOrder")}
          </button>
        )}
        {order.status === "ended" && (
          <button
            onClick={() => setOpenFeedBack(true)}
            className="bg-blue-primary  w-full rounded-2xl text-white text-center py-4"
          >
            {t("order-details.feedBack")}
          </button>
        )}
      </div>
      <BottomSheet
        title={t("order-details.rateTitle")}
        isOpen={openFeedBack}
        contentClassName="p-0 pb-4"
        onClose={handleClose}
      >
        <div className="px-4">
          {/* Star Rating */}
          <div className="flex items-center gap-2 my-4 justify-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <button key={index} onClick={() => handleRateChange(index + 1)}>
                <StarIcon
                  width={32}
                  height={32}
                  fill={rate > index ? "#F8C51B" : "#D1D5DB"}
                  stroke={rate > index ? "#F8C51B" : "#D1D5DB"}
                />
              </button>
            ))}
          </div>

          {/* Feedback Options - Only show if rating >= 3 or < 3 */}
          {rate >= 3 && rate > 0 && (
            <div className="space-y-4 mb-4">
              <p className="text-base font-normal text-gray-900">
                {t("order-details.positive-feedback-question")}
              </p>
              <div className="space-y-3">
                {POSITIVE_FEEDBACK_OPTIONS.map((feedbackKey) => (
                  <label
                    key={feedbackKey.key}
                    className="flex items-center justify-between cursor-pointer py-2"
                  >
                    <div className="flex items-center gap-2">
                      {feedbackKey.icon}
                      <span className="text-base text-gray-900 flex-1">
                        {feedbackKey.label}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedFeedback.includes(feedbackKey.key)}
                      onChange={() => handleFeedbackChange(feedbackKey.key)}
                      className="w-5 h-5 rounded-sm border-gray-300 text-blue-500 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {rate > 0 && rate < 3 && (
            <div className="space-y-4 mb-4">
              <p className="text-base font-normal text-gray-900">
                {t("order-details.negative-feedback-question")}
              </p>
              <div className="space-y-3">
                {NEGATIVE_FEEDBACK_OPTIONS.map((feedbackKey) => (
                  <label
                    key={feedbackKey.key}
                    className="flex items-center justify-between cursor-pointer py-2"
                  >
                    <div className="flex items-center gap-2">
                      {feedbackKey.icon}
                      <span className="text-base text-gray-900 flex-1">
                        {feedbackKey.label}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedFeedback.includes(feedbackKey.key)}
                      onChange={() => handleFeedbackChange(feedbackKey.key)}
                      className="w-5 h-5 rounded-sm border-gray-300 text-blue-500 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Comment Section */}
          <div className="space-y-2 mb-4">
            <label className="block text-base font-normal text-gray-900">
              {t("order-details.comment")}
            </label>
            <textarea
              name="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              placeholder={t("order-details.comment-placeholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={rate === 0}
            className="bg-blue-500 w-full rounded-xl  text-white text-center py-3 flex items-center justify-center font-semibold text-base hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingReview ? (
              <Loading02 className="animate-spin " />
            ) : (
              t("order-details.done")
            )}
          </button>
        </div>
      </BottomSheet>
      {/* Warning Modal for Cancel */}
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
      {/* Cancel Reason Sheet */}
      <CancelReasonSheet
        isOpen={openCancelReason}
        onClose={() => setOpenCancelReason(false)}
        onSubmit={handleReasonSubmit}
        isLoading={isCancelling}
      />
    </Container>
  );
};

export default OrderDetails;
