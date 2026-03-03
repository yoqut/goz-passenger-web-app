import { z } from "zod";

export interface IOrderType {
  from: string;
  to: string;
  countClient: string;
  isFreeCar: boolean;
  driverGender: "man" | "woman";
  isDelivery: boolean;
}

// Factory function to create schema with translations
export const createOrderSchema = (t: (key: string) => string) =>
  z.object({
    from: z.string().min(3, t("validation.fromRequired")),
    to: z.string().min(3, t("validation.toRequired")),
    client: z.string().min(1, t("validation.clientRequired")),
    route_id: z.number().optional(),
    tariff_id: z.number().optional(),
    from_city_id: z.number().optional(),
    to_city_id: z.number().optional(),
    cashback: z.number().optional(),
    isFreeCar: z.boolean(),
    passenger: z.enum(["man", "woman"]),
    plan: z.enum(["economy", "standard", "comfort", "biznes"]),
    comment: z.string().optional(),
    date: z.date().optional(),
    // Geolocation coordinates from LocationInput
    from_latitude: z.number().optional(),
    from_longitude: z.number().optional(),
  });

// Keep the old export for backward compatibility (uses English by default)
export const orderSchema = z.object({
  from: z.string().min(3, "Please enter the departure point"),
  to: z.string().min(3, "Please enter the destination"),
  client: z.string().min(1, "Please select the number of people"),
  route_id: z.number().optional(),
  tariff_id: z.number().optional(),
  from_city_id: z.number().optional(),
  to_city_id: z.number().optional(),
  cashback: z.number().optional(),
  isFreeCar: z.boolean(),
  passenger: z.enum(["man", "woman"]),
  plan: z.enum(["economy", "standard", "comfort", "biznes"]),
  comment: z.string().optional(),
  date: z.date().optional(),
  // Geolocation coordinates from LocationInput
  from_latitude: z.number().optional(),
  from_longitude: z.number().optional(),
});
