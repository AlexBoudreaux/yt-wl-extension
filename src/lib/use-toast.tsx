import { useCallback, useState } from "react";

export interface ToastMessage {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly variant?: "default" | "success" | "error" | "warning";
  readonly duration?: number;
}

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = `toast-${++toastId}`;
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      variant: "default",
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      return addToast(toast);
    },
    [addToast],
  );

  return {
    toasts,
    toast,
    removeToast,
  };
};

// Simple Toast component for the extension
export const Toast = ({
  toast,
  onClose,
}: {
  toast: ToastMessage;
  onClose: () => void;
}) => {
  const getVariantStyles = () => {
    switch (toast.variant) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200";
      case "error":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200";
      default:
        return "bg-white border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200";
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border shadow-lg mb-2 ${getVariantStyles()}`}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-medium text-sm">{toast.title}</div>
          {toast.description && (
            <div className="text-xs mt-1 opacity-80">{toast.description}</div>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-xs opacity-60 hover:opacity-100"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast container component
export const ToastContainer = ({
  toasts,
  onRemoveToast,
}: {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[10001] max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
};
