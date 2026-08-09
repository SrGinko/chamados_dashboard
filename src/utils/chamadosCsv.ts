import { ChamadoTask, Chamados } from "../types/chamado";

type CsvRow = Record<string, string>;

export type ImportChamadosCsvResult = {
    chamados: Chamados[];
    invalidos: number;
    totalLinhas: number;
};

function normalizarTexto(valor: string) {
    return valor
        .trim()
        .replace(/^\uFEFF/, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function inferirDelimitador(texto: string) {
    const primeiraLinha = texto.split(/\r?\n/).find((linha) => linha.trim().length > 0) ?? "";
    const delimitadores = [",", ";", "\t"];

    let melhor = ",";
    let maiorContagem = -1;

    delimitadores.forEach((delimitador) => {
        const contagem = (primeiraLinha.match(new RegExp(`\\${delimitador}`, "g")) ?? []).length;
        if (contagem > maiorContagem) {
            maiorContagem = contagem;
            melhor = delimitador;
        }
    });

    return melhor;
}

function parseCSV(texto: string, delimitador: string) {
    const rows: string[][] = [];
    let atual: string[] = [];
    let campo = "";
    let dentroDeAspas = false;

    for (let i = 0; i < texto.length; i++) {
        const char = texto[i];
        const next = texto[i + 1];

        if (char === '"') {
            if (dentroDeAspas && next === '"') {
                campo += '"';
                i++;
            } else {
                dentroDeAspas = !dentroDeAspas;
            }
            continue;
        }

        if (!dentroDeAspas && char === delimitador) {
            atual.push(campo);
            campo = "";
            continue;
        }

        if (!dentroDeAspas && (char === "\n" || char === "\r")) {
            if (char === "\r" && next === "\n") {
                i++;
            }

            atual.push(campo);
            campo = "";

            if (atual.some((coluna) => coluna.trim().length > 0)) {
                rows.push(atual);
            }

            atual = [];
            continue;
        }

        campo += char;
    }

    if (campo.length > 0 || atual.length > 0) {
        atual.push(campo);
        if (atual.some((coluna) => coluna.trim().length > 0)) {
            rows.push(atual);
        }
    }

    if (rows.length === 0) return [];

    const headers = rows[0].map((header) => normalizarTexto(header));

    return rows.slice(1).map((row) => {
        const obj: CsvRow = {};

        headers.forEach((header, index) => {
            obj[header] = (row[index] ?? "").trim();
        });

        return obj;
    });
}

function pegarValor(row: CsvRow, candidatos: string[]) {
    for (const candidato of candidatos) {
        const valor = row[normalizarTexto(candidato)];
        if (valor !== undefined && valor !== "") return valor;
    }
    return "";
}

function normalizeId(value: string) {
    return value.trim().replace(/\s+/g, "");
}

function normalizarClassificacaoEscalation(valor: string) {
    const texto = normalizarTexto(valor);

    if (texto.includes("incidente") && texto.includes("nivel 1")) return "IncidenteNivel1";
    if (texto.includes("incidente") && texto.includes("nivel 2")) return "IncidenteNivel2";
    if (texto.includes("crise") && texto.includes("nivel 1")) return "CriseNivel1";
    if (texto.includes("crise") && texto.includes("nivel 2")) return "CriseNivel2";
    if (texto.includes("catastrofe")) return "Catástofre";

    return valor.trim();
}

function buildTask(row: CsvRow): ChamadoTask | null {
    const idTask = pegarValor(row, ["id_task", "idtask", "task", "id_tarefa"]);
    const escalation = pegarValor(row, ["escalation", "escalacao", "escalação"]);

    if (!idTask) return null;

    return {
        idTask: normalizeId(idTask),
        titulo: pegarValor(row, ["titulo", "título"]),
        status: pegarValor(row, ["status"]),
        tituloWFM: pegarValor(row, ["titulo_wfm", "titulowfm"]),
        categoria: pegarValor(row, ["categoria"]),
        taskAtribuido: pegarValor(row, ["taskatribuido", "task_atribuido"]),
        cluster: pegarValor(row, ["cluster"]),
        impacto: pegarValor(row, ["impacto"]),
        escalation,
        etiqueta: pegarValor(row, ["etiqueta", "tag", "tags"]),
        tempoAberto: pegarValor(row, ["tempo aberto", "tempo_aberto"]),
        ultimaAtualizacao: pegarValor(row, ["ultima atualizacao", "ultima_atualizacao", "ultima atualização"]),
    };
}

export function importarChamadosCSV(texto: string): ImportChamadosCsvResult {
    const delimitador = inferirDelimitador(texto);
    const rows = parseCSV(texto, delimitador);

    const agrupados = new Map<string, Chamados & { tasks: ChamadoTask[] }>();
    let invalidos = 0;

    rows.forEach((row) => {
        const idInc = normalizeId(pegarValor(row, ["id_inc", "idinc", "inc", "id do inc"]));
        const titulo = pegarValor(row, ["titulo", "título"]);
        const escalation = pegarValor(row, ["escalation", "escalacao", "escalação"]);
        const task = buildTask(row);
        const etiqueta = pegarValor(row, ["etiqueta", "tag", "tags"]);

        if (!idInc || !titulo || !escalation || !task) {
            invalidos++;
            return;
        }

        if (!agrupados.has(idInc)) {
            agrupados.set(idInc, {
                id: idInc,
                titulo,
                descricao: "",
                Classificacao: normalizarClassificacaoEscalation(escalation),
                etiquetas: [],
                tasks: [],
            });
        }

        const chamado = agrupados.get(idInc)!;

        if (!chamado.titulo && titulo) {
            chamado.titulo = titulo;
        }

        if (!chamado.Classificacao && escalation) {
            chamado.Classificacao = normalizarClassificacaoEscalation(escalation);
        }

        const tags = new Set(chamado.etiquetas ?? []);
        if (etiqueta.trim()) tags.add(etiqueta.trim());
        if (task.etiqueta?.trim()) tags.add(task.etiqueta.trim());
        chamado.etiquetas = [...tags].sort((a, b) => a.localeCompare(b, "pt-BR"));

        chamado.tasks.push(task);
    });

    const chamados = [...agrupados.values()].map((chamado) => ({
        ...chamado,
        tasks: chamado.tasks.sort((a, b) => a.idTask.localeCompare(b.idTask, "pt-BR")),
    }));

    chamados.sort((a, b) => a.id.localeCompare(b.id, "pt-BR"));

    return {
        chamados,
        invalidos,
        totalLinhas: rows.length,
    };
}
