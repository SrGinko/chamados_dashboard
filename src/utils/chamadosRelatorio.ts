import { Chamados } from "../types/chamado";
import { ClusterLabel, Clusters, getClusterFromTitulo } from "../enums/clustes";

export type ChamadoRelatorio = Chamados & {
    classificacao?: string;
};

export type RelatorioChamadoItem = {
    chamado: ChamadoRelatorio;
    classificacao: string;
    statusLabel: string;
    statusEmoji: string;
};

export type RelatorioCluster = {
    nome: string;
    itens: RelatorioChamadoItem[];
};

export type RelatorioTerritorio = {
    nome: string;
    clusters: RelatorioCluster[];
};

const ORDEM_TERRITORIOS = ["B2B", "CO", "MG", "SP", "SU", "Sem território"];

function normalizarClassificacao(chamado: ChamadoRelatorio) {
    return (chamado.Classificacao ?? chamado.classificacao ?? "").trim();
}

function getStatusInfo(classificacao: string) {
    const valor = classificacao.toLowerCase();

    switch (valor) {
        case "incidentenivel1":
            return { label: "Incidente Nível 1", emoji: "🟢" };
        case "incidentenivel2":
            return { label: "Incidente Nível 2", emoji: "🟡" };
        case "crisenivel1":
            return { label: "Crise Nível 1", emoji: "🟠" };
        case "crisenivel2":
            return { label: "Crise Nível 2", emoji: "🔴" };
        case "catástofre":
        case "catastrofe":
        case "catástrofe":
            return { label: "Catástrofe", emoji: "🟣" };
        default:
            return { label: "Desconhecido", emoji: "⚪" };
    }
}

function getTerritorioFromCluster(cluster: string) {
    const valor = cluster.toUpperCase().trim();

    if (valor.startsWith("B2B")) return "B2B";
    if (valor.startsWith("MG")) return "MG";
    if (valor.startsWith("SP")) return "SP";
    if (valor.startsWith("GO") || valor.startsWith("DF") || valor.startsWith("MS")) return "CO";
    if (valor.startsWith("RS") || valor.startsWith("SC") || valor.startsWith("SU")) return "SU";

    return "Sem território";
}

function getClusterLabel(chamado: ChamadoRelatorio) {
    const cluster = getClusterFromTitulo(chamado.titulo);
    return cluster ? ClusterLabel[cluster as Clusters] : "Sem Cluster";
}

export function buildRelatorioChamados(chamados: ChamadoRelatorio[]) {
    const territoriosMap = new Map<string, Map<string, RelatorioChamadoItem[]>>();

    chamados.forEach((chamado) => {
        const clusterRaw = getClusterFromTitulo(chamado.titulo);
        const clusterLabel = clusterRaw ? ClusterLabel[clusterRaw as Clusters] : "Sem Cluster";
        const territorio = clusterRaw ? getTerritorioFromCluster(clusterRaw) : "Sem território";
        const classificacao = normalizarClassificacao(chamado);
        const status = getStatusInfo(classificacao);

        const item: RelatorioChamadoItem = {
            chamado,
            classificacao,
            statusLabel: status.label,
            statusEmoji: status.emoji,
        };

        if (!territoriosMap.has(territorio)) {
            territoriosMap.set(territorio, new Map<string, RelatorioChamadoItem[]>());
        }

        const clustersMap = territoriosMap.get(territorio)!;

        if (!clustersMap.has(clusterLabel)) {
            clustersMap.set(clusterLabel, []);
        }

        clustersMap.get(clusterLabel)!.push(item);
    });

    const territorioOrdenado = [...territoriosMap.entries()].sort(([a], [b]) => {
        const pa = ORDEM_TERRITORIOS.indexOf(a);
        const pb = ORDEM_TERRITORIOS.indexOf(b);

        if (pa !== -1 || pb !== -1) {
            return (pa === -1 ? Number.MAX_SAFE_INTEGER : pa) - (pb === -1 ? Number.MAX_SAFE_INTEGER : pb);
        }

        return a.localeCompare(b, "pt-BR");
    });

    const tree: RelatorioTerritorio[] = territorioOrdenado.map(([territorio, clustersMap]) => ({
        nome: territorio,
        clusters: [...clustersMap.entries()]
            .sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
            .map(([nome, itens]) => ({
                nome,
                itens: itens.sort((a, b) => a.chamado.titulo.localeCompare(b.chamado.titulo, "pt-BR")),
            })),
    }));

    return tree;
}

export function generateRelatorioTexto(chamados: ChamadoRelatorio[]) {
    const tree = buildRelatorioChamados(chamados);
    const linhas: string[] = [];

    tree.forEach((territorio, territorioIndex) => {
        linhas.push(`*TERRITÓRIO ${territorio.nome}*`);
        linhas.push("");

        territorio.clusters.forEach((cluster) => {
            linhas.push(`*${cluster.nome}*`);
            linhas.push("");

            cluster.itens.forEach(({ chamado, statusLabel, statusEmoji }) => {
                linhas.push(`${chamado.titulo} - ${chamado.id}`);
                linhas.push(`${statusLabel} ${statusEmoji} ->`);
                if (chamado.tasks && chamado.tasks.length > 0) {
                    linhas.push(`Tasks: ${chamado.tasks.length}`);
                }
                linhas.push("");
            });
        });

        if (territorioIndex < tree.length - 1) {
            linhas.push("-----------------------------------------------------");
            linhas.push("");
        }
    });

    return linhas.join("\n").trim();
}

export function getResumoRelatorio(chamados: ChamadoRelatorio[]) {
    const tree = buildRelatorioChamados(chamados);
    const territorios = tree.length;
    const clusters = tree.reduce((acc, territorio) => acc + territorio.clusters.length, 0);
    const tasks = chamados.reduce((acc, chamado) => acc + (chamado.tasks?.length ?? 0), 0);

    return {
        territorios,
        clusters,
        chamados: chamados.length,
        tasks,
    };
}
