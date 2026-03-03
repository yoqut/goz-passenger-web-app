/* eslint-disable unicorn/no-null */
import { formatCustomDate } from "@/shared/lib/utils/helper";
import type { IOrdersList } from "@/shared/types/order";
import { OrderCar } from "@/shared/ui/order/car";
import { Location } from "@/shared/ui/order/location";
import { User } from "@/shared/ui/order/user";
import { useTranslation } from "react-i18next";

const Status = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  switch (status) {
    case "created": {
      return (
        <p className="text-green-500 text-md font-medium">
          {t("orders.orderStatus.created")}
        </p>
      );
    }
    case "ended": {
      return (
        <p className="text-blue-500 text-md font-medium">
          {t("orders.orderStatus.ended")}
        </p>
      );
    }
    case "rejected": {
      return (
        <p className="text-red-500 text-md font-medium">
          {t("orders.orderStatus.rejected")}
        </p>
      );
    }
    case "assigned": {
      return (
        <p className="text-blue-600 text-md font-medium">
          {t("orders.orderStatus.assigned")}
        </p>
      );
    }
    case "started": {
      return (
        <p className="text-pink-500 text-md font-medium">
          {t("orders.orderStatus.started")}
        </p>
      );
    }
    case "arrived": {
      return (
        <p className="text-yellow-500 text-md font-medium">
          {t("orders.orderStatus.arrived")}
        </p>
      );
    }
    default: {
      return null;
    }
  }
};

const Plan = ({ plan }: { plan: string }) => {
  const { t } = useTranslation();
  switch (plan) {
    case "economy": {
      return (
        <p className="bg-green-500 text-sm font-normal rounded-full px-3 py-1 text-white">
          {t("service.economy")}
        </p>
      );
    }
    case "standard": {
      return (
        <p className="bg-blue-500 text-sm font-normal rounded-full px-3 py-1 text-white">
          {t("service.standart")}
        </p>
      );
    }
    case "comfort": {
      return (
        <p className="bg-yellow-500 text-sm font-normal rounded-full px-3 py-1 text-white">
          {t("service.comfort")}
        </p>
      );
    }
    default: {
      return null;
    }
  }
};
interface CardProps extends IOrdersList {
  onClick?: () => void;
  travel_class?: string;
}

export const Card = ({
  id,
  driver_details,
  creator: { created_at },
  status,
  onClick,
  travel_class,
}: CardProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "ru" | "uz";

  const profileImage =
    driver_details &&
    import.meta.env.VITE_BASE_URL + driver_details.full_profile_image_url;
  const car = driver_details && driver_details.cars[0];
  console.log(driver_details);
  return (
    <div
      className="w-full rounded-2xl bg-white p-3 drop-shadow-xl cursor-pointer"
      onClick={onClick}
    >
      {/* order: id, status, plantype */}
      <div className="border-b pb-2 mb-2 border-gray-200 space-y-3">
        <div className="flex items-start justify-between">
          <div className="">
            <div className="flex items-center gap-2">
              <p className="text-md leading-6 font-semibold text-gray-900">
                # {id}
              </p>
              {travel_class && <Plan plan={travel_class} />}
            </div>
            <p className="text-sm text-gray-500  font-normal">
              {formatCustomDate(created_at || "")}
            </p>
          </div>
          <Status status={status} />
        </div>
        {driver_details && (
          <>
            <Location
              from={driver_details.route_id.from_city.translate[lang]}
              to={driver_details.route_id.to_city.translate[lang]}
            />
            <OrderCar
              name={car.car_model}
              number={car.car_number}
              color={car.car_color}
            />
          </>
        )}
      </div>

      {driver_details && (
        <User
          name={driver_details.full_name}
          phone={driver_details.phone}
          image={profileImage}
          rate={driver_details.rating}
        />
      )}
      {!driver_details && (
        <div className="flex items-center gap-2">
          {status === "created" && (
            <p className="text-sm text-gray-500 font-normal">
              {t("orders.waitingDrivers")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
