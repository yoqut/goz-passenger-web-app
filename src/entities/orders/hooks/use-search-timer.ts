import { useOrderStore } from "@/app/store/order";
import { useEffect, useState } from "react";

/**
 * Hook for managing the search timer when looking for a driver
 * Increments a timer every second while searching is active
 * @returns Timer state and control functions
 */
export const useSearchTimer = () => {
  const { setSearchTime, searchTime, clearSearchTime } = useOrderStore();
  const [isSearching, setIsSearching] = useState(false);
  const [isTaxiFound, setIsTaxiFound] = useState(false);

  useEffect(() => {
    if (isSearching) {
      // Increment search time every second while searching
      const interval = setInterval(() => {
        setSearchTime();
      }, 1000);

      // TODO: Auto-stop search after timeout (commented out for now)
      // if (searchTime == 10) {
      //   setIsSearching(false);
      //   setIsTaxiFound(true);
      // }

      return () => {
        clearInterval(interval);
      };
    }
  }, [isSearching, searchTime, setSearchTime]);

  /**
   * Resets the search state
   */
  const clearSearch = () => {
    setIsSearching(false);
    setIsTaxiFound(false);
  };

  return {
    setIsSearching,
    isSearching,
    isTaxiFound,
    setIsTaxiFound,
    setSearchTime,
    clearSearchTime,
    clearSearch,
  };
};
