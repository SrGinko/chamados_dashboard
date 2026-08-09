import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { HashLoader } from "react-spinners";

import EditChamadoModal from "./modalChamadoComponent";
import { ClusterLabel, getClusterFromTitulo } from "../../enums/clustes";
import { Chamados as ChamadoType } from "../../types/chamado";

type ChamadoCardItem = ChamadoType & {
    classificacao?: string;
    inicioEvento?: string;
    proxEscalonamento?: string | null;
};

function normalizarClassificacao(chamado: ChamadoCardItem) {
    return chamado.Classificacao ?? chamado.classificacao ?? "";
}

function getStatusConfig(classificacao: string) {
    const valor = classificacao.toLowerCase();

    switch (valor) {
        case "incidentenivel1":
            return { label: "Incidente Nível 1", class: "status-low" };
        case "incidentenivel2":
            return { label: "Incidente Nível 2", class: "status-medium" };
        case "crisenivel1":
            return { label: "Crise Nível 1", class: "status-high" };
        case "crisenivel2":
            return { label: "Crise Nível 2", class: "status-critical" };
        case "catastrofe":
        case "catástofre":
        case "catástrofe":
            return { label: "Catástrofe", class: "status-disaster" };
        default:
            return { label: "Desconhecido", class: "" };
    }
}

export function getChamadosAgrupados(chamados: ChamadoCardItem[], cluster: string, incidente: string) {
    const filteredChamados = chamados.filter((c: ChamadoCardItem) => {
        const matchCluster = cluster === "default" || c.titulo.toLowerCase().includes(cluster.toLowerCase());
        const classificacao = normalizarClassificacao(c);
        const matchIncidente = incidente === "default" || classificacao.toLowerCase().includes(incidente.toLowerCase());
        return matchCluster && matchIncidente;
    });

    const grupos: Record<string, ChamadoCardItem[]> = {};

    filteredChamados.forEach((chamado: ChamadoCardItem) => {
        const clusterEncontrado = getClusterFromTitulo(chamado.titulo) || "Sem Cluster";

        if (!grupos[clusterEncontrado]) {
            grupos[clusterEncontrado] = [];
        }

        grupos[clusterEncontrado].push(chamado);
    });

    return { filteredChamados, chamadosAgrupados: grupos };
}

type Props = {
    cluster: string;
    incidente: string;
    chamados: ChamadoCardItem[];
    loading: boolean;
    expandedClusters: Record<string, boolean>;
    onToggleCluster: (clusterNome: string) => void;
};

export default function Chamados({
    cluster,
    incidente,
    chamados,
    loading,
    expandedClusters,
    onToggleCluster,
}: Props) {
    const [openAdd, setOpenAdd] = useState(false);
    const [chId, setChId] = useState<string>("");
    const [expandedIncidentes, setExpandedIncidentes] = useState<Record<string, boolean>>({});

    const isClusterExpanded = (clusterNome: string) => expandedClusters[clusterNome] ?? false;

    const { filteredChamados, chamadosAgrupados } = useMemo(
        () => getChamadosAgrupados(chamados, cluster, incidente),
        [chamados, cluster, incidente]
    );

    const toggleIncidente = (id: string) => {
        setExpandedIncidentes((prev) => ({
            ...prev,
            [id]: !(prev[id] ?? false),
        }));
    };

    return (
        <div className="cardContainer">
            {loading && (
                <div className="loadingContainer">
                    <HashLoader size={32} color="#bd005e" />
                </div>
            )}

            {!loading && filteredChamados?.length === 0 && (
                <div className="emptyState">
                    <h2>Nenhum chamado encontrado!</h2>
                </div>
            )}

            {!loading &&
                Object.entries(chamadosAgrupados).map(([clusterNome, chamadosDoGrupo]) => {
                    const expanded = isClusterExpanded(clusterNome);
                    const clusterLabel = ClusterLabel[clusterNome as keyof typeof ClusterLabel] || clusterNome;

                    return (
                        <div key={clusterNome} className="clusterGroup">
                            <button
                                type="button"
                                className="clusterHeader"
                                onClick={() => onToggleCluster(clusterNome)}
                                aria-expanded={expanded}
                            >
                                <div className="clusterHeaderInfo">
                                    <h2 className="clusterTitle">{clusterLabel}</h2>
                                    <span className="clusterCount">
                                        {chamadosDoGrupo.length}{" "}
                                        {chamadosDoGrupo.length === 1 ? "chamado" : "chamados"}
                                    </span>
                                </div>
                                <ChevronDown
                                    size={18}
                                    className={`clusterChevron ${expanded ? "expanded" : ""}`}
                                />
                            </button>

                            <div className={`clusterCollapsible ${expanded ? "expanded" : ""}`}>
                                <div className="clusterCollapsibleInner">
                                    <div className="clusterList">
                                        {chamadosDoGrupo.map((chamado) => {
                                            const classificacao = normalizarClassificacao(chamado);
                                            const status = getStatusConfig(classificacao);
                                            const tasks = chamado.tasks ?? [];
                                            const etiquetas = chamado.etiquetas ?? [];
                                            const expandedIncidente = expandedIncidentes[chamado.id] ?? false;

                                            return (
                                                <div
                                                    key={chamado.id}
                                                    className={`incident-card ${status.class}`}
                                                    onClick={() => {
                                                        setOpenAdd(true);
                                                        setChId(chamado.id);
                                                    }}
                                                    onContextMenu={(e) => {
                                                        e.preventDefault();
                                                        window.electronAPI?.openChamado?.({ id: chamado.id });
                                                    }}
                                                >
                                                    <div className="incident-header">
                                                        <div>
                                                            <div className="incident-title">{chamado.titulo}</div>
                                                            <div className="incident-meta">
                                                                INC: {chamado.id}
                                                                {tasks.length > 0 ? ` · ${tasks.length} task(s)` : ""}
                                                            </div>
                                                            {etiquetas.length > 0 && (
                                                                <div className="incidentTags">
                                                                    {etiquetas.map((etiqueta) => (
                                                                        <span key={etiqueta} className="incidentTag">
                                                                            {etiqueta}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="incidentHeaderActions">
                                                            <div className={`status-badge ${status.class}`}>
                                                                {status.label}
                                                            </div>
                                                            {tasks.length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    className="incidentExpandBtn"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleIncidente(chamado.id);
                                                                    }}
                                                                    aria-expanded={expandedIncidente}
                                                                >
                                                                    <ChevronDown
                                                                        size={16}
                                                                        className={`incidentChevron ${expandedIncidente ? "expanded" : ""}`}
                                                                    />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="incident-description"
                                                        onClick={() => {
                                                            setOpenAdd(true);
                                                            setChId(chamado.id);
                                                        }}
                                                    >
                                                        {chamado.descricao || "Sem descrição"}
                                                    </div>

                                                    <div className="incident-footer">
                                                        <div>
                                                            <span>Classificação</span>
                                                            {status.label}
                                                        </div>
                                                    </div>

                                                    {tasks.length > 0 && (
                                                        <div className={`incidentTasks ${expandedIncidente ? "expanded" : ""}`}>
                                                            <div className="incidentTasksInner">
                                                                {tasks.map((task) => (
                                                                    <div key={task.idTask} className="incidentTaskItem">
                                                                        <div className="incidentTaskId">TASK: {task.idTask}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

            <EditChamadoModal
                id={chId}
                open={openAdd}
                type="edit"
                onClose={() => setOpenAdd(false)}
            />
        </div>
    );
}
