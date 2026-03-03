import { toast as sonnerToast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  duration?: number;
  description?: string;
}

/**
 * Custom hook for toast notifications
 * Wraps sonner toast with custom styling and defaults
 */
export const useToast = () => {
  return {
    /**
     * Show success toast (green)
     */
    success: (message: string, options?: ToastOptions) => {
      sonnerToast.success(message, {
        duration: options?.duration ?? 3000,
        description: options?.description,
        style: {
          background: "#10b981",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
        },
      });
    },

    /**
     * Show error toast (red)
     */
    error: (message: string, options?: ToastOptions) => {
      sonnerToast.error(message, {
        duration: options?.duration ?? 4000,
        description: options?.description,
        style: {
          background: "#ef4444",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
        },
      });
    },

    /**
     * Show warning toast (yellow/amber)
     */
    warning: (message: string, options?: ToastOptions) => {
      sonnerToast.warning(message, {
        duration: options?.duration ?? 3000,
        description: options?.description,
        style: {
          background: "#f59e0b",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)",
        },
      });
    },

    /**
     * Show info toast (blue)
     */
    info: (message: string, options?: ToastOptions) => {
      sonnerToast.info(message, {
        duration: options?.duration ?? 3000,
        description: options?.description,
        style: {
          background: "#3b82f6",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
        },
      });
    },

    /**
     * Show loading toast
     */
    loading: (message: string) => {
      return sonnerToast.loading(message, {
        style: {
          background: "#6b7280",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(107, 114, 128, 0.2)",
        },
      });
    },

    /**
     * Update existing toast
     */
    update: (
      toastId: string | number,
      message: string,
      type: ToastType = "info"
    ) => {
      sonnerToast(message, {
        id: toastId,
        duration: 3000,
        style: {
          background: type === "error" ? "#ef4444" : "#10b981",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: `0 4px 12px rgba(${
            type === "error" ? "239, 68, 68" : "16, 185, 129"
          }, 0.2)`,
        },
      });
    },

    /**
     * Dismiss toast
     */
    dismiss: (toastId?: string | number) => {
      sonnerToast.dismiss(toastId);
    },
  };
};
