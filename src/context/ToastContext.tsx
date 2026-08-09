import { createContext, useContext, useState, useCallback } from "react";
import Aviso from "../Components/layout/alertComponent";

type Toast = {
    id: number;
    message: string;
    type: "info" | "error" | "success" | "default";
    color: "#18ca00" | "#bd0000" | "#ff5100" | "#f3f3f3";
    duration?: number;
};

type ToastContextType = {
    showToast: (message: string, duration?: number, type?: Toast['type'], color?: Toast['color']) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, duration = 4000, type?: Toast['type'], color?: Toast['color']) => {
        const id = Date.now();

        setToasts((old) => [...old, { id, message, type: type ?? "default", color: color ?? "#f3f3f3", duration }]);

        setTimeout(() => {
            setToasts((old) => old.filter((t) => t.id !== id));
        }, duration);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Renderiza sempre na tela principal */}
            <div
                style={{
                    position: "fixed",
                    right: 16,
                    bottom: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    zIndex: 9999
                }}
            >
                {toasts.map((t) => (
                    <Aviso
                        key={t.id}
                        message={t.message}
                        color={t.color ?? "#f3f3f3"}
                        type={t.type ?? "default"}
                        duration={t.duration}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast deve estar dentro do ToastProvider");
    return ctx;
}
