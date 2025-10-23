import { useCallback } from "react";
import { ToastType } from "@/types";

// Sistema simple de eventos para toasts
const toastEventName = "show-toast";

export const useToast = () => {
  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      const event = new CustomEvent(toastEventName, {
        detail: { message, type, duration, id: Date.now().toString() },
      });
      window.dispatchEvent(event);
    },
    []
  );

  return { showToast };
};

// Hook para escuchar toasts (usado en ToastContainer)
export const useToastListener = (
  callback: (detail: {
    message: string;
    type: ToastType;
    duration: number;
    id: string;
  }) => void
) => {
  const handleToast = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent;
      callback(customEvent.detail);
    },
    [callback]
  );

  if (typeof window !== "undefined") {
    window.addEventListener(toastEventName, handleToast);
    return () => window.removeEventListener(toastEventName, handleToast);
  }

  return () => {};
};