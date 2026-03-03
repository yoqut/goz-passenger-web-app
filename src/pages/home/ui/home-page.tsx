/* eslint-disable react-hooks/exhaustive-deps -- watch() returns new reference each render, adding to deps causes infinite loop */
/* eslint-disable unicorn/prevent-abbreviations -- Props abbreviation is standard in React ecosystem */

import { LightMainLogo } from "@/app/assets";
import { Truck } from "@/app/assets/images";
import { useOrderStore } from "@/app/store/order";
import {
  useCancelOrder,
  useCreateDelivery,
  useCreateOrder,
  useGetUserCashback,
  useGetUserOrders,
  useSearchTaxi,
  useSearchTimer,
} from "@/entities/orders/hooks";
import { FoundTaxi } from "@/entities/orders/ui";
import { SearchDriver } from "@/entities/orders/ui/search-driver";
import {
  CountSelectRadio,
  GenderSelectRadio,
  LocationInput,
  LocationSelect,
  SelectToggle,
} from "@/features/create-order";
import {
  useGetLocations,
  useGetToLocations,
} from "@/features/create-order/hooks/useGetLocatioins";
import {
  SelectTariff,
  type Tariff,
} from "@/features/create-order/ui/card/select-tariff";
import { useGetUserId, useToast } from "@/shared/lib/hooks";
import {
  calculateDeliveryPrice,
  calculateTripPrice,
} from "@/shared/lib/utils/helper";
import type { IOrdersList, ToCity } from "@/shared/types/order";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Container } from "@/shared/ui/container/container";
import { DatePicker } from "@/shared/ui/date-picker";
import DefaultButton from "@/shared/ui/default-button";
import { SwipeToCancel } from "@/shared/ui/swipe-to-cancel";
import { Tabs } from "@/shared/ui/tabs";
import { CashbackBanner } from "@/shared/ui/tariff/cashback-banner";
import { CashbackUsage } from "@/shared/ui/tariff/cashback-usage";
import { TarifDesc } from "@/shared/ui/tariff/tarif-desc";
import { TariffCard } from "@/shared/ui/tariff/tariff-card";
import { UseCashbackSheet } from "@/shared/ui/tariff/use-cashback-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users03 } from "@untitledui/icons";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { z } from "zod";
import { createOrderSchema } from "../models";

const HomePage = () => {
  const { t } = useTranslation();
  const { userId } = useGetUserId();
  const toast = useToast();
  const { clearSearchTime, setIsSearching, isSearching } = useSearchTimer();
  const { data: cities } = useGetLocations();
  const { data: userOrders } = useGetUserOrders(userId || 942734553);
  const { data: userCashback } = useGetUserCashback(userId || 942734553);
  const { mutate, isPending } = useCreateOrder();
  const { mutate: createDelivery, isPending: isDeliveryPending } =
    useCreateDelivery();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const {
    setOrderId,
    setOrder,
    order_id,
    order,
    hasClosedFindTaxi,
    setHasClosedFindTaxi,
  } = useOrderStore();
  useSearchTaxi();

  const [previousCountClient, setPreviousCountClient] = useState<string>("1");
  const [isSearchTaxi, setIsSearchTaxi] = useState<boolean>(false);
  const [isViewRates, setIsViewRates] = useState<boolean>(false);
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);
  const [findTaxiOpen, setFindTaxiOpen] = useState(false);
  const [delivaryOpen, setDelivaryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"trip" | "delivery">("trip");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [cashbackSheetOpen, setCashbackSheetOpen] = useState(false);
  const [usedCashback, setUsedCashback] = useState<number>(0);
  const [openCancelConfirm, setOpenCancelConfirm] = useState(false);

  // Create schema with translation function
  const orderSchema = useMemo(() => createOrderSchema(t), [t]);

  const {
    control,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),

    defaultValues: {
      from: "",
      to: "",
      client: "1",
      route_id: 0,
      tariff_id: 0,
      from_city_id: 0,
      to_city_id: 0,
      cashback: 0,
      isFreeCar: false,
      passenger: "man",
      plan: "economy",
      comment: "",
      date: undefined,
      from_latitude: undefined,
      from_longitude: undefined,
    },
  });

  const fromValue = watch("from");
  const selectedFromCity = cities?.find((city) => city.title === fromValue);
  const fromCityId = selectedFromCity?.city_id || "";
  const { data: toCities, isFetching: isToCitiesLoading } =
    useGetToLocations(fromCityId);

  const { totalPrice, availableCashback } = useMemo(() => {
    const available = userCashback?.amount || 0;
    if (
      activeTab === "trip" &&
      watch("from") &&
      watch("to") &&
      selectedTariff
    ) {
      const passengerForTariff = watch("isFreeCar")
        ? selectedTariff.value === "standard" ||
          selectedTariff.value === "comfort"
          ? 3
          : 4
        : Number(watch("client"));
      const calculatedPrice = calculateTripPrice(
        cities || [],
        watch("from"),
        watch("to"),
        selectedTariff.value as "economy" | "standard" | "comfort",
        passengerForTariff,
        toCities || [],
        { isFreeCar: watch("isFreeCar") },
      );
      return { totalPrice: calculatedPrice, availableCashback: available };
    }
    return { totalPrice: 0, availableCashback: available };
  }, [
    activeTab,
    watch("from"),
    watch("to"),
    watch("client"),
    watch("isFreeCar"),
    selectedTariff,
    cities,
    toCities,
    userCashback?.amount,
  ]);

  // Calculate delivery price and available cashback
  const { deliveryPrice, deliveryAvailableCashback } = useMemo(() => {
    const available = userCashback?.amount || 0;
    if (activeTab === "delivery" && watch("from") && watch("to")) {
      const calculatedPrice = calculateDeliveryPrice(
        cities || [],
        watch("from"),
        watch("to"),
        toCities || [],
      );
      return {
        deliveryPrice: calculatedPrice,
        deliveryAvailableCashback: available,
      };
    }
    return { deliveryPrice: 0, deliveryAvailableCashback: available };
  }, [
    activeTab,
    watch("from"),
    watch("to"),
    cities,
    toCities,
    userCashback?.amount,
  ]);

  const handleCountClientChange = (value: string) => {
    setPreviousCountClient(value);
  };

  const handleFreeCarChange = (value: boolean) => {
    if (value) {
      setValue("client", "0");
    } else {
      setValue("client", previousCountClient);
    }
  };

  useEffect(() => {
    handleFreeCarChange(watch("isFreeCar"));
  }, [watch("isFreeCar")]);

  // Sync activeTab with client field on mount
  useEffect(() => {
    if (watch("client") === "delivery") {
      setActiveTab("delivery");
    } else {
      setActiveTab("trip");
    }
  }, []);

  // Clear order store if order is completed/rejected when component mounts or order changes
  useEffect(() => {
    if (order && order.status) {
      const completedStatuses = ["ended", "rejected"];
      if (completedStatuses.includes(order.status)) {
        setOrder(null);
        setOrderId(0);
        setIsSearchTaxi(false);
        setIsSearching(false);
        setFindTaxiOpen(false);
      }
    }
  }, [order, setOrder, setOrderId]);

  // Date ni backend uchun format qilish - "2026-01-27 00:00" formatida
  const formatDateForBackend = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const onSubmit = (data: z.infer<typeof orderSchema>) => {
    const activeStatuses = ["created", "assigned", "arrived", "started"];
    if (userOrders && Array.isArray(userOrders) && userOrders.length > 0) {
      const hasActiveOrder = userOrders.some((order: IOrdersList) => {
        return activeStatuses.includes(order.status);
      });

      if (hasActiveOrder) {
        toast.error(t("orders.hasActiveOrder"));
        return;
      }
    }

    // Clear previous order from store before creating new one
    setOrder(null);
    setHasClosedFindTaxi(false); // Reset flag for new order

    // Handle delivery orders separately
    if (activeTab === "delivery") {
      // const deliveryPrice = calculateDeliveryPrice(
      //   cities || [],
      //   data.from,
      //   data.to,
      //   toCities || []
      // );

      const deliveryOrder = {
        user: userId ? userId : 0,
        route_id: data.route_id || 0,
        cashback: usedCashback,
        from_location: {
          city_id: data.from_city_id || 0,
          location: {
            latitude: data.from_latitude || null,
            longitude: data.from_longitude || null,
          },
        },
        to_location: {
          city_id: data.to_city_id || 0,
          location: {
            latitude: null,
            longitude: null,
          },
        },
        // price: deliveryPrice,
        tariff_id: data.tariff_id || 0,
        comment: data.comment || null,
        start_time: data.date ? formatDateForBackend(data.date) : null,
      };

      createDelivery(deliveryOrder, {
        onSuccess: (response) => {
          setOrderId(response.order_id);
          setDelivaryOpen(false);
          setIsSearching(true);
          setIsSearchTaxi(true);
        },
      });
      return;
    }

    // Handle regular taxi orders
    if (!data.tariff_id || data.tariff_id === 0) {
      toast.error(t("service.selectTariff"));
      return;
    }

    const passengerCount = data.isFreeCar
      ? data.plan === "standard" || data.plan === "comfort"
        ? 3
        : 4
      : Number(data.client);

    const order = {
      user: userId || 942734553,
      from_location: {
        city_id: data.from_city_id || 0,
        location: {
          latitude: data.from_latitude || null,
          longitude: data.from_longitude || null,
        },
      },
      to_location: {
        city_id: data.to_city_id || 0,
        location: {
          latitude: null,
          longitude: null,
        },
      },
      route_id: data.route_id || 0,
      tariff_id: data.tariff_id || 0,
      start_time: data.date ? formatDateForBackend(data.date) : null,
      passenger: passengerCount,
      cashback: usedCashback,
      comment: data.comment || null,
      has_woman: watch("passenger") === "woman",
    };

    mutate(order, {
      onSuccess: (response) => {
        setOrder({
          ...response,
          passenger_id: response.creator?.user_id || response.creator?.id,
        });
        setOrderId(response.order_id);
        setIsViewRates(false);
        setIsSearching(true);
        setIsSearchTaxi(true);
      },
    });
  };

  const handleShowPlans = (_data: z.infer<typeof orderSchema>) => {
    if (!isSearching) {
      // Birinchi DatePicker ochiladi
      setDatePickerOpen(true);
    } else {
      setIsSearchTaxi(true);
    }
  };

  const handleDateSelect = (date: Date) => {
    setValue("date", date);
    setDatePickerOpen(false);
    if (activeTab === "delivery") {
      // Find delivery tariff from toCities and set tariff_id
      const selectedToCity = (toCities || []).find(
        (item) => item.to_city?.title === watch("to"),
      );
      const deliveryTariff = selectedToCity?.prices.find(
        (price) => price.tariff_info?.title?.toLowerCase() === "delivery",
      );
      console.log(deliveryTariff?.tariff_info?.tariff_id);

      if (deliveryTariff?.tariff_info?.tariff_id) {
        setValue("tariff_id", deliveryTariff.tariff_info?.tariff_id);
      }
      setDelivaryOpen(true);
    } else if (activeTab === "trip") {
      setSelectedTariff(null);
      setUsedCashback(0);
      setValue("tariff_id", 0);
      setIsViewRates(true);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "trip" | "delivery");
    // Reset cashback when switching tabs
    setUsedCashback(0);
    if (value === "delivery") {
      setValue("client", "delivery");
    } else {
      setValue("client", previousCountClient);
    }
  };

  const handleCloseSearch = () => {
    if (!order_id) {
      resetSearchState();
      return;
    }

    // Find order from userOrders to get order_id and passenger_id

    const orderId = order_id;
    const passengerId = order?.passenger_id || userId;

    console.log("Cancel Order Debug:", {
      orderId,
      passengerId,
      order,
      userId,
    });

    if (!orderId || !passengerId) {
      toast.error(t("orders.cancelError"));
      resetSearchState();
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
          setOrder(null);
          setOrderId(0);
          setHasClosedFindTaxi(false);
          setIsSearching(false);
          setIsSearchTaxi(false);
          setFindTaxiOpen(false);
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
    setIsSearchTaxi(false);
    setIsViewRates(false);
    setOrderId(0);
    setHasClosedFindTaxi(false);
    clearSearchTime();
  };

  useEffect(() => {
    // Check if order exists and has driver, and order is still active (not ended or rejected)
    if (order && order.status) {
      const activeStatuses = ["created", "assigned", "arrived", "started"];
      const completedStatuses = ["ended", "rejected"];

      // If order is completed/rejected, clear it
      if (completedStatuses.includes(order.status)) {
        setIsSearching(false);
        setIsSearchTaxi(false);
        setFindTaxiOpen(false);
        setOrder(null);
        setOrderId(0);
        setHasClosedFindTaxi(false);
        return;
      }

      // If order has driver and is active, show FindTaxi bottomsheet only if it hasn't been closed
      if (
        order.driver &&
        activeStatuses.includes(order.status) &&
        !hasClosedFindTaxi
      ) {
        setIsSearching(false);
        setIsSearchTaxi(false);
        setFindTaxiOpen(true);
        return;
      }

      // If order is created but no driver yet, show search taxi bottomsheet
      if (order.status === "created" && !order.driver && order_id) {
        setIsSearching(true);
        setIsSearchTaxi(true);
        setFindTaxiOpen(false);
        setHasClosedFindTaxi(false); // Reset flag when searching for new taxi
        return;
      }
    }

    // If order_id exists but order is not in store yet (just created), show search taxi bottomsheet
    if (order_id && !order) {
      setIsSearching(true);
      setIsSearchTaxi(true);
      setFindTaxiOpen(false);
      setHasClosedFindTaxi(false);
      return;
    }

    // No order or order doesn't match any condition, close all bottomsheets only if no order_id
    if (!order_id) {
      setIsSearching(false);
      setIsSearchTaxi(false);
      setFindTaxiOpen(false);
    }
  }, [order, order_id, hasClosedFindTaxi, setOrder, setOrderId]);
  return (
    <Container>
      <section className="space-y-3 h-[80vh]">
        <div className=" mt-3 flex flex-col items-start gap-4">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="cursor-pointer">
              <LightMainLogo width={"60px"} height={"30px"} />
            </Link>

            {/* <div className="relative">
              <Link
                to="/notification"
                className="cursor-pointer relative inline-block"
              >
                <BellRinging01 />
              </Link>
              <span className="absolute right-0 top-.5 size-3 border-2 border-white bg-blue-primary rounded-full" />
            </div> */}
          </div>
          {/* <div className="flex items-center gap-x-2 sm:gap-x-4 mt-1">
            <CarIcon className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-lg sm:text-[20px] font-semibold">
              {t("home.title")}
            </h1>
          </div> */}
        </div>
        <form className="space-y-6 mt-2  pb-5">
          <div className="mb-4">
            <Tabs
              tabs={[
                { value: "trip", label: t("home.trip") },
                { value: "delivery", label: t("home.delivery") },
              ]}
              value={activeTab}
              onChange={handleTabChange}
            />
          </div>
          <div className="flex flex-col w-full space-y-3 border-b border-gray-200 pb-4">
            <Controller
              control={control}
              name="from"
              render={({ field: { onChange } }) => (
                <div>
                  <LocationInput
                    locations={cities || []}
                    value={watch("to")}
                    onLocationSelect={onChange}
                    onCitySelect={(city, coordinates) => {
                      setValue("from_city_id", city.city_id);
                      if (coordinates) {
                        setValue("from_latitude", coordinates.latitude);
                        setValue("from_longitude", coordinates.longitude);
                      }
                    }}
                  />
                  {errors.from?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.from?.message as string}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="to"
              render={({ field: { onChange } }) => (
                <div>
                  <LocationSelect
                    value={watch("to")}
                    locations={toCities || []}
                    setValue={(value: ToCity) => {
                      setValue("route_id", Number(value?.route_id) || 0);
                      setValue("to_city_id", value?.to_city?.city_id || 0);
                    }}
                    onLocationSelect={onChange}
                    isLoading={isToCitiesLoading}
                  />
                  {errors.to?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.to.message as string}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          {activeTab === "trip" && (
            <>
              <div className="flex items-center gap-x-4 w-full">
                <Users03 />
                <h2 className="text-[16px] font-medium">
                  {t("home.passengers")}
                </h2>
              </div>
              <div className="w-full border-b border-gray-200 pb-3">
                <Controller
                  control={control}
                  name="client"
                  render={({ field: { onChange, value } }) => (
                    <CountSelectRadio
                      countClient={value}
                      setCountClient={(returnValue) => {
                        handleCountClientChange(returnValue);
                        onChange(returnValue);
                        setValue("isFreeCar", false);
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="isFreeCar"
                  render={({ field: { onChange, value } }) => (
                    <SelectToggle
                      setFreeCar={(returnValue) => {
                        onChange(returnValue);
                        handleFreeCarChange(returnValue);
                      }}
                      freeCar={value}
                    />
                  )}
                />
              </div>
              <div className="flex items-center border-b border-gray-200 pb-4 gap-4 w-full">
                <Controller
                  control={control}
                  name="passenger"
                  render={({ field: { onChange, value } }) => (
                    <GenderSelectRadio gender={value} setsetGender={onChange} />
                  )}
                />
              </div>
            </>
          )}
          <>
            <div className="flex items-center gap-x-3 mb-2 w-full">
              <h2 className="text-[16px] font-medium">{t("home.comment")}</h2>
            </div>
            <div className="w-full ">
              <Controller
                control={control}
                name="comment"
                render={({ field: { onChange, value } }) => (
                  <textarea
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t("home.commentPlaceholder")}
                    rows={3}
                    className="w-full bg-gray-50 resize-none outline-none placeholder:text-gray-400 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-primary focus:border-transparent"
                  />
                )}
              />
            </div>
          </>
          <DefaultButton
            type="submit"
            className="mt-auto w-full"
            text={t("home.selectTime")}
            onClick={handleSubmit(handleShowPlans)}
          />

          {/* DatePicker BottomSheet */}
          <BottomSheet
            isOpen={datePickerOpen}
            onClose={() => setDatePickerOpen(false)}
            contentClassName="px-4 pb-6 pt-0"
            disableDrag={true}
            closeButton={false}
          >
            <DatePicker
              isOpen={datePickerOpen}
              onClose={() => setDatePickerOpen(false)}
              onSelect={handleDateSelect}
            />
          </BottomSheet>

          <BottomSheet
            isOpen={isViewRates}
            onClose={() => {
              setIsViewRates(false);
              setDatePickerOpen(false);
            }}
            title={t("service.title")}
            contentClassName="px-4 pb-6"
          >
            <Controller
              control={control}
              name="plan"
              render={({ field: { onChange } }) => {
                const availableCashbackAmount = userCashback?.amount || 0;
                const hasTariffSelected = !!selectedTariff;

                return (
                  <>
                    {hasTariffSelected && (
                      <CashbackBanner
                        amount={Math.round(
                          totalPrice *
                            (((toCities || []).find(
                              (item) => item.to_city?.title === watch("to"),
                            )?.cashback || 0) /
                              100),
                        )}
                      />
                    )}
                    <SelectTariff
                      selectedTariff={selectedTariff}
                      handleChange={(plan) => {
                        setSelectedTariff(plan);
                        onChange(plan.value);
                        if (plan.tariff_id) {
                          setValue("tariff_id", plan.tariff_id);
                        }
                      }}
                      cities={cities || []}
                      fromCity={watch("from")}
                      toCity={watch("to")}
                      passengerCount={Number(watch("client"))}
                      isFreeCar={watch("isFreeCar")}
                      toCities={toCities || []}
                    />
                    {!hasTariffSelected && (
                      <p className="text-sm text-amber-600 mb-4">
                        {t("service.selectTariff")}
                      </p>
                    )}
                    <TarifDesc />
                    {hasTariffSelected && (
                      <CashbackUsage
                        availableAmount={availableCashbackAmount}
                        onClick={() => setCashbackSheetOpen(true)}
                      />
                    )}
                    <DefaultButton
                      className="w-full flex items-center justify-between px-4"
                      text={
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {hasTariffSelected
                              ? t("service.order")
                              : t("service.selectTariff")}
                          </span>
                          {hasTariffSelected && (
                            <div className="flex items-center gap-2">
                              {usedCashback > 0 && (
                                <span className="font-semibold line-through text-white/70">
                                  {totalPrice.toLocaleString()} {t("currency")}
                                </span>
                              )}
                              <span className="font-semibold">
                                {(totalPrice - usedCashback).toLocaleString()}{" "}
                                {t("currency")}
                              </span>
                            </div>
                          )}
                        </div>
                      }
                      isLoading={isPending}
                      isDisabled={!hasTariffSelected}
                      onClick={
                        hasTariffSelected ? handleSubmit(onSubmit) : undefined
                      }
                    />
                  </>
                );
              }}
            />
          </BottomSheet>
          {/* delivary */}
          <BottomSheet
            isOpen={delivaryOpen}
            contentClassName="px-4 pb-6 pt-0"
            onClose={() => {
              setDelivaryOpen(false);
              setDatePickerOpen(false);
            }}
            title={t("service.deliveryTitle")}
          >
            <div className="  mt-3 border-gray-200">
              <TariffCard
                className={`mb-4 border-2 border-blue-primary`}
                onclick={() => {}}
                title={t("service.deliveryTitle")}
                desc={t("service.deliveryDesc", { count: 50 })}
                amount={calculateDeliveryPrice(
                  cities || [],
                  watch("from"),
                  watch("to"),
                  toCities || [],
                )}
                image={Truck}
                members={20}
              />
            </div>
            {/* Cashback Banner for Delivery */}
            {deliveryPrice > 0 &&
              (() => {
                const selectedToCity = (toCities || []).find(
                  (item) => item.to_city?.title === watch("to"),
                );
                const cashbackPercentage = selectedToCity?.cashback || 0;
                const cashbackAmount = Math.round(
                  deliveryPrice * (cashbackPercentage / 100),
                );
                return <CashbackBanner amount={cashbackAmount} />;
              })()}
            <TarifDesc />
            {/* Cashback Usage for Delivery */}
            {deliveryPrice > 0 && (
              <CashbackUsage
                availableAmount={deliveryAvailableCashback}
                onClick={() => setCashbackSheetOpen(true)}
              />
            )}
            <DefaultButton
              className="w-full flex items-center justify-between px-4"
              text={
                <div className="flex items-center justify-between w-full">
                  <span>{t("service.order")}</span>
                  <div className="flex items-center gap-2">
                    {usedCashback > 0 && (
                      <span className="font-semibold line-through text-white/70">
                        {deliveryPrice.toLocaleString()} {t("currency")}
                      </span>
                    )}
                    <span className="font-semibold">
                      {(deliveryPrice - usedCashback).toLocaleString()}{" "}
                      {t("currency")}
                    </span>
                  </div>
                </div>
              }
              isLoading={isDeliveryPending}
              onClick={handleSubmit(onSubmit)}
            />
          </BottomSheet>
        </form>

        {/* searching */}
        <BottomSheet
          headerClassName="p-1"
          contentClassName="px-4 pb-6"
          isOpen={isSearchTaxi}
          closeButton={false}
          disableDrag={true}
          onClose={() => setIsSearchTaxi(false)}
        >
          <SearchDriver />
          <SwipeToCancel
            onCancel={() => setOpenCancelConfirm(true)}
            isLoading={isCancelling}
            disabled={isCancelling}
            hintText={t("order-details.swipeToCancel")}
          />
        </BottomSheet>

        {/* Cancel Confirmation BottomSheet */}
        <BottomSheet
          isOpen={openCancelConfirm}
          onClose={() => setOpenCancelConfirm(false)}
          disableDrag={true}
          headerClassName="!border-0 pb-0"
          contentClassName="!px-0 !py-0"
          closeButton={false}
        >
          <div className="flex flex-col items-center px-6 py-6">
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
                onClick={() => {
                  setOpenCancelConfirm(false);
                  handleCloseSearch();
                }}
                disabled={isCancelling}
                className="flex-1 bg-blue-500 text-white rounded-xl px-4 py-3 font-semibold text-base hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isCancelling ? "..." : t("yes")}
              </button>
            </div>
          </div>
        </BottomSheet>
        {/* found taxi */}
        <BottomSheet
          onClose={() => {
            setFindTaxiOpen(false);
            setHasClosedFindTaxi(true); // Mark as closed so it won't reopen
          }}
          closeButton={false}
          contentClassName=" pb-10"
          isOpen={findTaxiOpen}
          disableDrag={false}
          title=""
        >
          <FoundTaxi />
        </BottomSheet>
        {activeTab === "trip" && (
          <UseCashbackSheet
            isOpen={cashbackSheetOpen}
            onClose={() => setCashbackSheetOpen(false)}
            availableAmount={availableCashback}
            maxAmount={totalPrice}
            onConfirm={(amount) => {
              setUsedCashback(amount);
              setCashbackSheetOpen(false);
              // TODO: Handle cashback confirmation
            }}
          />
        )}
        {activeTab === "delivery" && (
          <UseCashbackSheet
            isOpen={cashbackSheetOpen}
            onClose={() => setCashbackSheetOpen(false)}
            availableAmount={deliveryAvailableCashback}
            maxAmount={deliveryPrice}
            onConfirm={(amount) => {
              setUsedCashback(amount);
              setCashbackSheetOpen(false);
              // TODO: Handle cashback confirmation for delivery
            }}
          />
        )}
      </section>
    </Container>
  );
};

export default HomePage;
