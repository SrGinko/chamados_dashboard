import { api } from '../services/api'
import { useCallback, useEffect, useState } from "react"
import { useToast } from "../context/ToastContext"
import { on } from "events"
import { Escalate } from "../enums/escalate"

export function useChamadoController(id: number) {
    const [titulo, setTitulo] = useState("")
    const [chId, setId] = useState<any>()
    const [descricao, setDescricao] = useState("")
    const [inicio, setInicio] = useState("")
    const [classificacao, setClassificacao] = useState("")
    const [proxEscalonamento, setProxEscalonamento] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const { showToast } = useToast()

    function toInputDate(value: string) {
        const d = new Date(value)

        const pad = (n: number) => String(n).padStart(2, "0")

        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    }

    async function deleteChamado(id: number) {
        try {
            await api.delete(`/noc/chamados/${id}`)
        } catch (error) {
            showToast("Erro ao encerrar o chamado!", 3000, "error", "#bd0000")
        }
    }

    async function handleSumit(e?: React.FormEvent) {
        e?.preventDefault()
        try {
            setLoading(true)
            await api.patch(`/noc/chamados/${id}`, {
                id: chId,
                titulo: titulo,
                descricao: descricao,
                inicioEvento: new Date(inicio).toISOString(),
                classificacao: classificacao,
                proxEscalonamento: proxEscalonamento === null || proxEscalonamento === undefined || proxEscalonamento === "" || classificacao === "Catástofre" ? null : new Date(proxEscalonamento).toISOString()
            })

        } catch (error) {
            showToast("Erro ao atualizar o Chamado!", 3000, "error", "#bd0000")
        } finally {
            setLoading(false)
        }
    }

    const fetchChamado = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const { data } = await api.get(`/noc/chamados/${id}`)

            setId(data.id)
            setTitulo(data.titulo)
            setDescricao(data.descricao)
            setInicio(toInputDate(data.inicioEvento))
            setClassificacao(data.classificacao)
            setProxEscalonamento(data.proxEscalonamento ? toInputDate(data.proxEscalonamento) : "")

        } catch (error) {
            showToast("Erro ao carregar o chamado!", 3000, "error", "#bd0000")
        } finally {
            setLoading(false)
        }
    }, [id])

    return {
        chId,
        setId,
        titulo,
        setTitulo,
        descricao,
        setDescricao,
        inicio,
        setInicio,
        classificacao,
        setClassificacao,
        proxEscalonamento,
        setProxEscalonamento,
        loading,
        setLoading,
        deleteChamado,
        fetchChamado,
        handleSumit,
        showToast,
        toInputDate
    }
}   