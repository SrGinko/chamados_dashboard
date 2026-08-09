import { useEffect, useMemo, useState } from "react";
import { Captions } from "lucide-react";
import { BounceLoader } from "react-spinners";

import CustomSelect from "../ItensEstilizados/dropDownComponent";
import { atualizarChamado, buscarChamadoPorId, deletarChamado } from "../../services/storageService";
import { useToast } from "../../context/ToastContext";
import { Chamados } from "../../types/chamado";

type Props = {
    id: string;
    open: boolean;
    type: "edit" | "escalate" | "report";
    onClose: () => void;
    onSave?: () => void;
};

const classificacaoOptions = [
    { value: "IncidenteNivel1", label: "Incidente Nível 1" },
    { value: "IncidenteNivel2", label: "Incidente Nível 2" },
    { value: "CriseNivel1", label: "Crise Nível 1" },
    { value: "CriseNivel2", label: "Crise Nível 2" },
    { value: "Catástofre", label: "Catástrofe" },
];

type ChamadoEditForm = {
    id: string;
    titulo: string;
    descricao: string;
    classificacao: string;
    etiquetas: string[];
    tasks: Chamados["tasks"];
};

function normalizarChamado(chamado: Chamados & { classificacao?: string }): ChamadoEditForm {
    return {
        id: chamado.id,
        titulo: chamado.titulo ?? "",
        descricao: chamado.descricao ?? "",
        classificacao: chamado.Classificacao ?? chamado.classificacao ?? "IncidenteNivel1",
        etiquetas: chamado.etiquetas ?? [],
        tasks: chamado.tasks ?? [],
    };
}

export default function modalChamadoComponent({ id, open, onClose, type, onSave }: Props) {
    const [loading, setLoading] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [classificacao, setClassificacao] = useState("IncidenteNivel1");
    const [etiquetas, setEtiquetas] = useState<string[]>([]);
    const [tasks, setTasks] = useState<Chamados["tasks"]>([]);
    const [chamadoAtual, setChamadoAtual] = useState<string>(id);
    const { showToast } = useToast();

    const modalTitle = useMemo(() => {
        switch (type) {
            case "escalate":
                return "Escalonar Chamado";
            case "report":
                return "Gerar NOC Informa";
            default:
                return "Editar Chamado";
        }
    }, [type]);

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        setChamadoAtual(id);

        const chamado = buscarChamadoPorId(id);

        if (!chamado) {
            showToast("Chamado não encontrado no armazenamento local.", 3000, "error", "#bd0000");
            setLoading(false);
            return;
        }

        const normalizado = normalizarChamado(chamado);
        setTitulo(normalizado.titulo);
        setDescricao(normalizado.descricao);
        setClassificacao(normalizado.classificacao);
        setEtiquetas(normalizado.etiquetas);
        setTasks(normalizado.tasks);
        setLoading(false);
    }, [id, open, showToast]);

    if (!open) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (chamadoAtual === undefined) {
            showToast("Não foi possível salvar: chamado inválido.", 3000, "error", "#bd0000");
            return;
        }

        setLoading(true);

        try {
            atualizarChamado({
                id: chamadoAtual,
                titulo,
                descricao,
                Classificacao: classificacao,
                etiquetas,
                tasks,
            });

            showToast("Chamado atualizado com sucesso!", 3000, "success", "#18ca00");
            onSave?.();
            onClose();
        } catch {
            showToast("Erro ao atualizar o chamado.", 3000, "error", "#bd0000");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modalOverlay">
            <div className="modalContainer">
                <div className="modalHeader">
                    <h3>{modalTitle}</h3>
                </div>

                {loading ? (
                    <div className="modalLoading">
                        <BounceLoader size={24} color="#fff" />
                    </div>
                ) : (
                    <form className="modalForm" onSubmit={handleSubmit}>
                        <div className="modalBody">
                            <div className="modalSection">
                                <span className="sectionTitle">Informações</span>

                                <span>ID:</span>
                                <div className="inputContainer">
                                    <Captions size={16} />
                                    <input type="text" value={chamadoAtual ?? ""} disabled />
                                </div>

                                <span>Título:</span>
                                <div className="inputContainer">
                                    <Captions size={16} />
                                    <input
                                        type="text"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="modalSection">
                                <span className="sectionTitle">Informações</span>

                                <span>Descrição:</span>
                                <div className="inputContainer">
                                    <Captions size={16} />
                                    <input
                                        type="text"
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                    />
                                </div>

                                <span>Classificação:</span>
                                <CustomSelect
                                    options={classificacaoOptions}
                                    value={classificacao}
                                    onChange={setClassificacao}
                                />
                            </div>
                        </div>

                        <div className="modalActions">
                            <button type="button" className="btnModal cancel" onClick={onClose}>
                                Cancelar
                            </button>
                            <div>
                                <button
                                    type="button"
                                    className="btnModal cancel"
                                    onClick={() => {
                                        deletarChamado(chamadoAtual);
                                        onClose();
                                        showToast("Chamado excluído com sucesso!", 3000, "success", "#18ca00");
                                    }}
                                >
                                    Excluir
                                </button>
                                <button type="submit" className="btnModal save" disabled={loading}>
                                    {loading ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
