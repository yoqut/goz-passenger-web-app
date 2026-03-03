import type { RefObject } from "@react-types/shared";
import { useEffect } from "react";

/**
 * Checks if the ResizeObserver API is supported.
 * @returns True if the ResizeObserver API is supported, false otherwise.
 */
function hasResizeObserver() {
  return globalThis.ResizeObserver !== undefined;
}

type useResizeObserverOptionsType<T> = {
  ref: RefObject<T | undefined | null> | undefined;

  box?: ResizeObserverBoxOptions;

  onResize: () => void;
};

export function useResizeObserver<T extends Element>(
  options: useResizeObserverOptionsType<T>
) {
  const { ref, box, onResize } = options;

  useEffect(() => {
    const element = ref?.current;
    if (!element) {
      return;
    }

    if (hasResizeObserver()) {
      const resizeObserverInstance = new globalThis.ResizeObserver(
        (entries) => {
          if (entries.length === 0) {
            return;
          }

          onResize();
        }
      );

      resizeObserverInstance.observe(element, { box });

      return () => {
        if (element) {
          resizeObserverInstance.unobserve(element);
        }
      };
    } else {
      window.addEventListener("resize", onResize, false);

      return () => {
        window.removeEventListener("resize", onResize, false);
      };
    }
  }, [onResize, ref, box]);
}
