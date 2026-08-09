export type Chamados = {
    id: string,
    titulo: string,
    descricao: string,
    Classificacao: string,
    etiquetas?: string[],
    tasks?: ChamadoTask[],
}

export type ChamadoTask = {
    idTask: string,
    titulo?: string,
    status?: string,
    tituloWFM?: string,
    categoria?: string,
    taskAtribuido?: string,
    cluster?: string,
    impacto?: string,
    escalation: string,
    etiqueta?: string,
    tempoAberto?: string,
    ultimaAtualizacao?: string,
}
