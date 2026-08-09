import { useCallback, useEffect, useState } from "react";
import { Chamados } from "../types/chamado";
import { CHAMADOS_STORAGE_EVENT, buscarChamados } from "../services/storageService";

export function useChamadosStorage() {
    const [chamados, setChamados] = useState<Chamados[]>(() => buscarChamados());
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(() => {
        setChamados(buscarChamados());
        setLoading(false);
    }, []);

    useEffect(() => {
        refresh();

        const handleChange = () => refresh();
        window.addEventListener(CHAMADOS_STORAGE_EVENT, handleChange);

        return () => {
            window.removeEventListener(CHAMADOS_STORAGE_EVENT, handleChange);
        };
    }, [refresh]);

    return {
        chamados,
        loading,
        refresh,
    };
}
