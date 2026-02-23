import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "warning" | "error" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  closing?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, closing: true } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type} ${toast.closing ? "closing" : ""}`}
          >
            <div className="toast-icon" style={{ marginTop: 2 }}>
              {toast.type === "success" && (
                <CheckCircle size={20} className="text-accent-teal" />
              )}
              {toast.type === "warning" && (
                <AlertTriangle size={20} className="text-accent-amber" />
              )}
              {toast.type === "error" && (
                <XCircle size={20} className="text-accent-rose" />
              )}
              {toast.type === "info" && (
                <Info size={20} className="text-primary-color" />
              )}
            </div>
            <div
              className="toast-content"
              style={{ flex: 1, fontSize: 14, lineHeight: 1.4 }}
            >
              {toast.message}
            </div>
            <button
              className="btn-icon"
              style={{ padding: 4 }}
              onClick={() => removeToast(toast.id)}
            >
              <X size={16} />
            </button>
            <div className="toast-progress" />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
