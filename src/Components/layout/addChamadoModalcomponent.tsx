import React, { useRef, useState } from "react"
import { Captions, Upload } from "lucide-react"
import { useToast } from "../../context/ToastContext"
import { BounceLoader } from 'react-spinners'
import CustomSelect from "../ItensEstilizados/dropDownComponent"
import { mesclarChamados, salvarChamado } from "../../services/storageService"
import { importarChamadosCSV } from "../../utils/chamadosCsv"

type Props = {
    open: boolean
    onClose: () => void
    onSaved?: () => void
}

export default function AddChamadoModa({ open, onClose, onSaved }: Props) {

    const [titulo, setTitulo] = useState("")
    const [id, setId] = useState<string | ''>("")
    const [descricao, setDescricao] = useState("")
    const [classificacao, setClassificacao] = useState("IncidenteNivel1")
    const [loading, setLoading] = useState(false)
    const [importLoading, setImportLoading] = useState(false)
    const inputCsvRef = useRef<HTMLInputElement | null>(null)

    const { showToast } = useToast()

    if (!open) return null

    const abrirImportadorCsv = () => {
        inputCsvRef.current?.click()
    }

    async function handleImportCsv(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        e.target.value = ""

        if (!file) return

        setImportLoading(true)

        try {
            const texto = await file.text()
            const resultado = importarChamadosCSV(texto)

            if (resultado.chamados.length === 0) {
                showToast("Nenhum chamado válido foi encontrado no CSV.", 4000, "error", "#bd0000")
                return
            }

            mesclarChamados(resultado.chamados)

            const mensagem =
                resultado.invalidos > 0
                    ? `${resultado.chamados.length} incidentes importados. ${resultado.invalidos} linha(s) ignorada(s).`
                    : `${resultado.chamados.length} incidentes importados com sucesso.`

            showToast(mensagem, 4000, "success", "#18ca00")
        } catch {
            showToast("Erro ao ler o arquivo CSV.", 4000, "error", "#bd0000")
        } finally {
            setImportLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        salvarChamado({
            id: id,
            titulo,
            descricao,
            Classificacao: classificacao
        })

        onClose()
        showToast("Chamado criado com sucesso!", 3000, "success", "#18ca00")
        setLoading(false)
    }

    return (
        <div className="modalOverlay">
            <div className={`modalContainer`}>

                <div className="modalHeader">
                    <h3>Criar Chamado</h3>
                </div>

                {loading || importLoading ? (
                    <div className="modalLoading">
                        <BounceLoader size={24} color="#fff" />
                    </div>
                ) : (
                    <form className="modalForm" onSubmit={handleSubmit}>
                        <div className="modalImportBar">
                            <div>
                                <span className="sectionTitle">Importação CSV</span>
                                <div className="modalImportHint">
                                    Importa por <strong>ID_INC</strong>, agrupa tasks e mantém o card único por incidente.
                                </div>
                            </div>

                            <button type="button" className="btnModal cancel modalImportBtn" onClick={abrirImportadorCsv}>
                                <Upload size={16} />
                                Importar CSV
                            </button>
                            <input
                                ref={inputCsvRef}
                                type="file"
                                accept=".csv,text/csv"
                                hidden
                                onChange={handleImportCsv}
                            />
                        </div>

                        <div className="modalBody">

                            <div className="modalSection">
                                <span className="sectionTitle">Informações</span>
                                <span>ID:</span>
                                <div className="inputContainer">
                                    <Captions size={16} />
                                    <input
                                        type="text"
                                        value={id}
                                        onChange={e => {
                                            setId(e.target.value)
                                        }}
                                    />
                                </div>

                                <span>Titulo:</span>
                                <div className="inputContainer">
                                    <Captions size={16} />
                                    <input
                                        type="text"
                                        value={titulo}
                                        onChange={e => {
                                            setTitulo(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="modalSection">
                                <span>Status:</span>
                                <CustomSelect
                                    options={[
                                        { value: "IncidenteNivel1", label: "Incidente Nível 1" },
                                        { value: "IncidenteNivel2", label: "Incidente Nível 2" },
                                        { value: "CriseNivel1", label: "Crise Nível 1" },
                                        { value: "CriseNivel2", label: "Crise Nível 2" },
                                        { value: "Catástofre", label: "Catastrofe" },
                                    ]}
                                    value={classificacao}
                                    onChange={setClassificacao}
                                />
                                <span className="sectionTitle">Informações</span>
                                <span>Descrição:</span>
                                <div className="inputContainer">
                                    <textarea
                                        value={descricao}
                                        onChange={e => {
                                            setDescricao(e.target.value)
                                        }}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="modalActions">
                            <button type="button" className="btnModal cancel" onClick={onClose}>
                                Cancelar
                            </button>


                            <button type="submit" className="btnModal save" disabled={loading}>
                                {loading ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
