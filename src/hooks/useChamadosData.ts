import { useCallback, useEffect, useState } from "react";
import axios from 'axios'
import { api } from "../services/api";

export function useChamados() {
    const [chamados, setChamados] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [erro, setError] = useState<string | null>(null)

    const fetchChamados = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const { data } = await api.get('/noc/chamados')
            console.log(data)
            setChamados(data)
        } catch (error) {
            setError('Erro ao buscar chamados')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchChamados()
    }, [fetchChamados])

    return {
        chamados, loading, erro, refetch: fetchChamados
    }
}