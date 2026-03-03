import { useOrderStore } from "@/app/store/order";
import { useCancelOrder } from "@/entities/orders/hooks";
import { useGetUserOrders } from "@/entities/orders/hooks/useGetUserOrders";
import { Card } from "@/entities/orders/ui";
import { SearchDriver } from "@/entities/orders/ui/search-driver";
import Loader from "@/shared/components/Loader";
import { useGetUserId, useToast } from "@/shared/lib/hooks";
import type { IOrdersList } from "@/shared/types/order";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Container } from "@/shared/ui/container/container";
import { Input } from "@/shared/ui/input/input";
import { SwipeToCancel } from "@/shared/ui/swipe-to-cancel";
import { SearchSm } from "@untitledui/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const OrdersPage = () => {
  const { t } = useTranslation();
  const { userId } = useGetUserId();
  const toast = useToast();
  const navigate = useNavigate();
  const { setOrder, setOrderId, order_id } = useOrderStore();
  const { data, isFetching, refetch } = useGetUserOrders(userId || 942734553);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const [isSearching, setIsSearching] = useState(false);

  const handleCardClick = (order: IOrdersList) => {
    // If status is "created", open search bottom sheet with polling
    if (order.status === "created") {
      setOrderId(order.id);
      // Type assertion: IOrdersList is compatible with the order store type
      setOrder(order as any);
      setIsSearching(true);
      return;
    }

    // If status is "rejected" and no driver (cancelled before driver accepted), don't navigate
    if (order.status === "rejected" && !order.driver_details) {
      return;
    }

    // For other statuses (assigned, arrived, started, ended, rejected with driver), go to order detail page
    navigate(`/order/${order.id}`);
  };

  const handleCloseSearch = () => {
    if (!order_id) {
      setIsSearching(false);
      return;
    }

    // Get order details to find passenger_id
    const currentOrder = data?.find(
      (order: IOrdersList) => order.id === order_id,
    );
    const orderId = currentOrder?.id;
    const passengerId =
      currentOrder?.creator?.user_id || currentOrder?.creator?.user_id;

    if (!orderId || !passengerId) {
      toast.error(t("orders.cancelError"));
      setIsSearching(false);
      return;
    }
    // Cancel order without reason (status is "created" - driver hasn't accepted yet)
    cancelOrder(
      {
        order_id: orderId,
        passenger_id: passengerId,
      },
      {
        onSuccess: () => {
          toast.success(t("orders.orderCancelled"));
          resetSearchState();
          refetch();
        },
        onError: () => {
          toast.error(t("orders.cancelError"));
          resetSearchState();
        },
      },
    );
  };

  const resetSearchState = () => {
    setIsSearching(false);
    setOrderId(0);
    setOrder(null);
  };

  return (
    <Container className=" p-0 h-full flex flex-col overflow-y-hidden">
      <div className="py-3 space-y-2">
        <header className="text-center">
          <h1 className="text-[20px] font-semibold text-gray-900">
            {t("orders.title")}
          </h1>
        </header>
        <Input
          icon={SearchSm}
          className={"px-3  "}
          wrapperClassName="focus-within:ring-blue-primary"
          placeholder={t("orders.searchPlaceholder")}
        />
      </div>
      {isFetching ? (
        <Loader />
      ) : data ? (
        <div className="px-3 space-y-3 pb-4 flex-1 overflow-y-auto">
          {data.count === 0 ? (
            <div>
              <h1 className="text-[20px] font-semibold text-gray-900">
                {t("orders.noOrders")}
              </h1>
            </div>
          ) : (
            data?.map((item: IOrdersList) => (
              <Card
                key={item.id}
                {...item}
                travel_class={item.content_object?.travel_class}
                onClick={() => handleCardClick(item)}
              />
            ))
          )}
        </div>
      ) : (
        <Loader />
      )}

      {/* Searching for driver */}
      <BottomSheet
        headerClassName="p-1"
        contentClassName="px-4 pb-6"
        isOpen={isSearching}
        closeButton={false}
        disableDrag={true}
        onClose={() => setIsSearching(false)}
      >
        <SearchDriver />
        <SwipeToCancel
          onCancel={handleCloseSearch}
          isLoading={isCancelling}
          disabled={isCancelling}
          hintText={t("order-details.swipeToCancel")}
        />
      </BottomSheet>
    </Container>
  );
};
