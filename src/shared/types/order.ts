export declare interface City {
  city_id: number;
  title: string;
  translate: {
    en: string;
    ru: string;
    uz: string;
  };
}
export declare interface Translate {
  en: string;
  ru: string;
  uz: string;
}
export declare interface TariffInfo {
  tariff_id: number;
  title: string;
  translate: Translate;
}

export declare interface Prices {
  price: number;
  tariff_id: number;
  tariff_info: TariffInfo;
}
export declare interface CityApiResponse {
  count: number;
  cities: City[];
  next: string | null;
  previous: string | null;
}
export declare interface ToCity {
  route_id: number | string;
  cashback: number;
  city_id: number;
  title: string;
  to_city: City;
  prices: Prices[];
}
export declare interface ToCityApiResponse {
  target: ToCity[];
}
// Location with coordinates
export interface ILocationWithCoords {
  city_id: number;
  location: {
    latitude: number | null;
    longitude: number | null;
  };
}

// order request type
export interface ICreateOrder {
  user: number;
  from_location: ILocationWithCoords;
  to_location: ILocationWithCoords;
  route_id: number;
  tariff_id: number;
  start_time: string | null;
  passenger: number;
  cashback: number;
  comment?: string | null;
  has_woman: boolean;
}

export interface ICancelOrder {
  order_id: number;
  passenger_id: number;
  comment?: string;
  rate?: number;
  feedback?: string[];
}

// order response type
export interface IResponseOrder {
  id: number;
  user: number;
  order_id: number;
  rate: number;
  from_location: ICity;
  to_location: ICity;
  from_city: string;
  to_city: string;
  travel_class: string;
  passenger: number;
  tariff: TariffInfo;
  price: number;
  has_woman: boolean;
  created_at: string;
}

interface ICity {
  city: string;
  location: null | number;
}

export interface IAcceptedOrder {
  passenger_id: number;
  id: number;
  user: number;
  creator: ICreator;
  driver: number;
  driver_details: IDriverDetails;
  status: string;
  order_type: string;
  content_object: IResponseOrder;
  content_type_name: string;
}

export interface IOrdersList {
  id: number;
  user: number;
  creator: ICreator;
  driver: number;
  driver_details: IDriverDetails;
  status: string;
  object_id: number;
  order_type: string;
  content_object?: IResponseOrder;
}

export interface ICreator {
  id: number;
  telegram_id: number;
  language: string;
  full_name: string;
  total_rides: number;
  phone: string;
  rating: number;
  created_at?: string;
}

export interface IDriverDetails {
  id: number;
  telegram_id: number;
  full_name: string;
  total_rides: number;
  full_profile_image_url: string;
  phone: string;
  rating: number;
  route_id: {
    from_city: {
      translate: Translate;
    };
    to_city: {
      translate: Translate;
    };
  };
  from_location: string;
  to_location: string;
  status: string;
  amount: number;
  cars: ICar[];
  status_display: string;
}

export interface ICar {
  id: number;
  car_number: string;
  car_model: string;
  car_color: string;
}
