import { useEffect, useMemo, useState } from "react";
import { ChevronDown, FileText, X } from "lucide-react";

import CopiarTexto from "../ItensEstilizados/CopiarTexto";
import { Chamados } from "../../types/chamado";
import {
    buildRelatorioChamados,
    generateRelatorioTexto,
    getResumoRelatorio,
    ChamadoRelatorio,
} from "../../utils/chamadosRelatorio";

type Props = {
    open: boolean;
    chamados: Chamados[];
    onClose: () => void;
};

export default function ModalRelatorioChamados({ open, chamados, onClose }: Props) {
    const [expandedTerritorios, setExpandedTerritorios] = useState<Record<string, boolean>>({});
    const [expandedClusters, setExpandedClusters] = useState<Record<string, boolean>>({});

    const tree = useMemo(() => buildRelatorioChamados(chamados as ChamadoRelatorio[]), [chamados]);
    const textoRelatorio = useMemo(
        () => generateRelatorioTexto(chamados as ChamadoRelatorio[]),
        [chamados]
    );
    const resumo = useMemo(() => getResumoRelatorio(chamados as ChamadoRelatorio[]), [chamados]);

    useEffect(() => {
        if (!open) return;

        const territorios: Record<string, boolean> = {};
        const clusters: Record<string, boolean> = {};

        tree.forEach((territorio) => {
            territorios[territorio.nome] = true;
            territorio.clusters.forEach((cluster) => {
                clusters[`${territorio.nome}::${cluster.nome}`] = true;
            });
        });

        setExpandedTerritorios(territorios);
        setExpandedClusters(clusters);
    }, [open, tree]);

    if (!open) return null;

    const toggleTerritorio = (nome: string) => {
        setExpandedTerritorios((prev) => ({
            ...prev,
            [nome]: !(prev[nome] ?? false),
        }));
    };

    const toggleCluster = (territorio: string, cluster: string) => {
        const key = `${territorio}::${cluster}`;
        setExpandedClusters((prev) => ({
            ...prev,
            [key]: !(prev[key] ?? false),
        }));
    };

    const expandAll = () => {
        const territorios: Record<string, boolean> = {};
        const clusters: Record<string, boolean> = {};

        tree.forEach((territorio) => {
            territorios[territorio.nome] = true;
            territorio.clusters.forEach((cluster) => {
                clusters[`${territorio.nome}::${cluster.nome}`] = true;
            });
        });

        setExpandedTerritorios(territorios);
        setExpandedClusters(clusters);
    };

    const collapseAll = () => {
        const territorios: Record<string, boolean> = {};
        const clusters: Record<string, boolean> = {};

        tree.forEach((territorio) => {
            territorios[territorio.nome] = false;
            territorio.clusters.forEach((cluster) => {
                clusters[`${territorio.nome}::${cluster.nome}`] = false;
            });
        });

        setExpandedTerritorios(territorios);
        setExpandedClusters(clusters);
    };

    return (
        <div className="modalOverlay">
            <div className="reportModalContainer">
                <div className="modalHeader reportHeader">
                    <div className="reportTitleBlock">
                        <h3>Mini Relatório de Chamados</h3>
                        <span className="reportSummary">
                            {resumo.territorios} territórios, {resumo.clusters} clusters, {resumo.chamados} chamados, {resumo.tasks} tasks
                        </span>
                    </div>

                    <button type="button" className="iconButton" onClick={onClose} aria-label="Fechar">
                        <X size={18} />
                    </button>
                </div>

                <div className="reportToolbar">
                    <button type="button" className="reportToolbarBtn" onClick={expandAll}>
                        Expandir tudo
                    </button>
                    <button type="button" className="reportToolbarBtn" onClick={collapseAll}>
                        Recolher tudo
                    </button>
                    <div className="reportCopyAction">
                        <CopiarTexto text={textoRelatorio} />
                    </div>
                </div>

                <div className="reportPreview">
                    {tree.length === 0 ? (
                        <div className="reportEmptyState">
                            <FileText size={20} />
                            <span>Nenhum chamado disponível para gerar relatório.</span>
                        </div>
                    ) : (
                        tree.map((territorio) => {
                            const territorioExpanded = expandedTerritorios[territorio.nome] ?? true;

                            return (
                                <section key={territorio.nome} className="reportTerritorio">
                                    <button
                                        type="button"
                                        className="reportTerritorioHeader"
                                        onClick={() => toggleTerritorio(territorio.nome)}
                                        aria-expanded={territorioExpanded}
                                    >
                                        <span className="reportTerritorioName">
                                            TERRITÓRIO {territorio.nome}
                                        </span>
                                        <ChevronDown
                                            size={18}
                                            className={`reportChevron ${territorioExpanded ? "expanded" : ""}`}
                                        />
                                    </button>

                                    <div className={`reportTerritorioBody ${territorioExpanded ? "expanded" : ""}`}>
                                        <div className="reportTerritorioScroll">
                                            {territorio.clusters.map((cluster) => {
                                                const clusterKey = `${territorio.nome}::${cluster.nome}`;
                                                const clusterExpanded = expandedClusters[clusterKey] ?? true;

                                                return (
                                                    <div key={clusterKey} className="reportCluster">
                                                        <button
                                                            type="button"
                                                            className="reportClusterHeader"
                                                            onClick={() => toggleCluster(territorio.nome, cluster.nome)}
                                                            aria-expanded={clusterExpanded}
                                                        >
                                                            <span className="reportClusterName">
                                                                {cluster.nome}
                                                            </span>
                                                            <span className="reportClusterCount">
                                                                {cluster.itens.length} chamado{cluster.itens.length === 1 ? "" : "s"}
                                                            </span>
                                                            <ChevronDown
                                                                size={16}
                                                                className={`reportChevron ${clusterExpanded ? "expanded" : ""}`}
                                                            />
                                                        </button>

                                                        <div className={`reportClusterBody ${clusterExpanded ? "expanded" : ""}`}>
                                                            {cluster.itens.map(({ chamado, statusLabel, statusEmoji }) => (
                                                                <div key={chamado.id} className="reportItem">
                                                                    <div className="reportItemTitle">
                                                                        {chamado.titulo} - {chamado.id}
                                                                    </div>
                                                                    <div className="reportItemStatus">
                                                                        {statusLabel} {statusEmoji} -&gt; {chamado.descricao || ""}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </section>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
