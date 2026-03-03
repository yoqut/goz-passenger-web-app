import type { IAcceptedOrder } from "@/shared/types/order";
import { create } from "zustand";

interface IOrderProps {
  searchTime: number;
  order: IAcceptedOrder | null;
  order_id: number;
  hasClosedFindTaxi: boolean;
  setSearchTime: () => void;
  clearSearchTime: () => void;
  setOrder: (order: IAcceptedOrder | null) => void;
  setOrderId: (id: number) => void;
  setHasClosedFindTaxi: (value: boolean) => void;
}

export const useOrderStore = create<IOrderProps>((set) => ({
  searchTime: 0,
  order: null,
  order_id: 0,
  hasClosedFindTaxi: false,
  setOrderId: (id) => set({ order_id: id }),
  setSearchTime: () => set((state) => ({ searchTime: state.searchTime + 1 })),
  clearSearchTime: () => set({ searchTime: 0 }),
  setOrder: (order) => set({ order }),
  setHasClosedFindTaxi: (value) => set({ hasClosedFindTaxi: value }),
}));
