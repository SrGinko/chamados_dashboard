import { useEffect, useRef } from "react";
import { CircleX, CircleCheckBig, CircleQuestionMark } from 'lucide-react'

type AvisoProps = {
    message: string;
    duration?: number;
    type: "info" | "error" | "success" | "default";
    color: "#18ca00" | "#bd0000" | "#ff5100" | "#f3f3f3";
    onClose?: () => void;
};

export default function Aviso({
    message,
    duration = 4000,
    color,
    type,
    onClose
}: AvisoProps) {
    const timerRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        timerRef.current = window.setTimeout(() => {
            onClose?.();
        }, duration);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [duration, onClose]);

    return (
        <div className="aviso-container" style={{ borderColor: color, borderWidth: 1, borderStyle: 'solid' }}>
            <div className="aviso-content">
                {type === "error" ? <CircleX size={16} color={color} /> : type === "success" ? <CircleCheckBig size={16} color={color} /> : type === "info" ? <CircleQuestionMark size={16} color={color} /> : null}
                <span style={{ marginLeft: 8 }}>{message}</span>
            </div>

            <div className="aviso-progress">
                <div
                    className="aviso-progress-bar"
                    style={{ animationDuration: `${duration}ms` }}
                />
            </div>
        </div>
    );
}
