import { useOrderStore } from "@/app/store/order";

export const SearchTimer = () => {
  const { searchTime } = useOrderStore();
  return (
    <div>
      {Math.floor(searchTime / 60)}:{String(searchTime % 60).padStart(2, "0")}
    </div>
  );
};
