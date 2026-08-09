import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, FileText, Plus, Search, Trash2 } from "lucide-react";

import Chamados, { getChamadosAgrupados } from "../Components/layout/cardChamadosComponent";
import AddChamadoModa from "../Components/layout/addChamadoModalcomponent";
import ModalRelatorioChamados from "../Components/layout/modalRelatorioChamadosComponent";
import CustomSelect from "../Components/ItensEstilizados/dropDownComponent";
import { buildClusterOptionsFromChamados, Clusters } from "../enums/clustes";
import { useChamadosStorage } from "../hooks/useChamadosStorage";
import { deletarTodosChamados } from "../services/storageService";

export default function ChamadosPage() {
    const { chamados, loading } = useChamadosStorage();

    const [openAdd, setOpenAdd] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [cluster, setCluster] = useState<Clusters | string>("default");
    const [classificacao, setClassificacao] = useState<string>("default");
    const [expandedClusters, setExpandedClusters] = useState<Record<string, boolean>>({});

    const { chamadosAgrupados } = useMemo(
        () => getChamadosAgrupados(chamados, cluster, classificacao),
        [chamados, cluster, classificacao]
    );

    const toggleCluster = useCallback((clusterNome: string) => {
        setExpandedClusters((prev) => ({
            ...prev,
            [clusterNome]: !(prev[clusterNome] ?? false),
        }));
    }, []);

    const expandAll = useCallback(() => {
        setExpandedClusters((prev) => {
            const next = { ...prev };
            Object.keys(chamadosAgrupados).forEach((nome) => {
                next[nome] = true;
            });
            return next;
        });
    }, [chamadosAgrupados]);

    const collapseAll = useCallback(() => {
        setExpandedClusters((prev) => {
            const next = { ...prev };
            Object.keys(chamadosAgrupados).forEach((nome) => {
                next[nome] = false;
            });
            return next;
        });
    }, [chamadosAgrupados]);

    const clusterOptions = useMemo(
        () => buildClusterOptionsFromChamados(chamados),
        [chamados]
    );

    useEffect(() => {
        if (cluster === "default") return;
        if (!clusterOptions.some((opt) => opt.value === cluster)) {
            setCluster("default");
        }
    }, [clusterOptions, cluster]);

    return (
        <div className="chamadosPage">
            <div className="chamadosTitleContent">
                <div style={{ display: "flex", gap: 10, alignItems: "center", overflow: "visible" }}>
                    <div
                        style={{
                            display: "flex",
                            backgroundColor: "#292929",
                            borderRadius: 10,
                            gap: 2,
                            alignItems: "center",
                            padding: 10,
                        }}
                    >
                        <Search size={16} color="#ffff" />
                        <input
                            type="search"
                            placeholder="Pesquisar por título e ID do chamado"
                            style={{ width: 300 }}
                        />
                    </div>

                    <CustomSelect
                        value={cluster}
                        onChange={setCluster}
                        buttonStyle={{ width: 150 }}
                        selectBoxStyle={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        options={clusterOptions}
                    />

                    <CustomSelect
                        value={classificacao}
                        buttonStyle={{ width: 150 }}
                        onChange={setClassificacao}
                        selectBoxStyle={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        options={[
                            { label: "Todos Incidentes", value: "default" },
                            { label: "Incidente Nível 1", value: "IncidenteNivel1" },
                            { label: "Incidente Nível 2", value: "IncidenteNivel2" },
                            { label: "Crise Nível 1", value: "CriseNivel1" },
                            { label: "Crise Nível 2", value: "CriseNivel2" },
                            { label: "Catástrofe", value: "Catástofre" },
                        ]}
                    />

                    <div className="chamadosClusterActions">
                        <button type="button" className="chamadosActionBtn chamadosActionIconBtn" onClick={expandAll} title="Expandir todos" aria-label="Expandir todos">
                            <ChevronDown size={16} />
                        </button>
                        <button type="button" className="chamadosActionBtn chamadosActionIconBtn" onClick={collapseAll} title="Recolher todos" aria-label="Recolher todos">
                            <ChevronUp size={16} />
                        </button>
                         <button type="button" className="chamadosActionBtn chamadosActionIconBtn" onClick={deletarTodosChamados} title="Recolher todos" aria-label="Recolher todos">
                            <Trash2 size={16} />
                        </button>
                        <button
                            type="button"
                            className="chamadosActionBtn chamadosActionIconBtn"
                            onClick={() => setOpenReport(true)}
                            title="Mini relatório"
                            aria-label="Mini relatório"
                        >
                            <FileText size={16} />
                        </button>
                    </div>
                </div>

                <div className="button" onClick={() => setOpenAdd(true)}>
                    <Plus size={16} color="#fff" />
                </div>
            </div>

            <Chamados
                cluster={cluster}
                incidente={classificacao}
                chamados={chamados}
                loading={loading}
                expandedClusters={expandedClusters}
                onToggleCluster={toggleCluster}
            />

            <AddChamadoModa open={openAdd} onClose={() => setOpenAdd(false)} />

            <ModalRelatorioChamados
                open={openReport}
                chamados={chamados}
                onClose={() => setOpenReport(false)}
            />
        </div>
    );
}
