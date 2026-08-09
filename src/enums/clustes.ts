export enum Clusters {
    // B2B
    B2B = 'B2B',
    B2BBACAPT = 'B2B BA CAPT',
    B2BRJCAPT = 'B2B RJ CAPT',
    B2BES = 'B2B ES E SANTO',
    B2BPRCAPT = 'B2B PR CAPT',
    B2BSPMETROPOLITANO = 'B2B SP METROPOLITANO',
    B2BSPABCBAIXADA = 'B2B SP ABC + BAIXADA',

    // CO
    COGOCENTRO = 'GO CENTRO',
    COGONORTE = 'GO NORTE',
    COGOSUL = 'GO SUL',
    COGORIOVERDE = 'GO R VERDE',
    CODFCAPITAL = 'DF CAPITAL',
    COMSCAPITAL = 'MS CAPITAL',
    COMSLESTE = ' MS LESTE',
    COMSTRESLAGOAS = 'MS T LAGOAS',

    // MG
    MGBARBACENA = 'MG BARBACENA',
    MGCAPITAL = 'MG CAPITAL',
    MGOESTE = 'MG OESTE',
    MGLESTE = 'MG LESTE',
    MGVALE = 'MG VALE',
    MGVERTENTES = 'MG VERTENTES',
    MGZMATA = 'MG Z MATA',
    MGLAFAIETE = 'MG LAFAIETE',

    // SP
    SPBAURU = 'SP BAURU',
    SPLIMEIRA = 'SP LIMEIRA',
    SPARACATUBA = 'SP ARACATUBA',
    SPPRESPRUDENTE = 'SP PRES PRUDENTE',
    SPSJOSE = 'SP S JOSE RIO PRETO',
    SPSOROCABA = 'SP SOROCABA',
    SPSAOROQUE = 'SP SÃO ROQUE',
    SPVALEPARAIBA = 'SP VALE PARAIBA',
    SPMETROPOLITANO = 'SP METROPOLITANO',

    // SU
    SURSERRRA = 'RS SERRA',
    SURSCAPITAL = 'RS CAPITAL',
    SURSLITORAL = 'RS LITORAL',
    SURSINTERIOR = 'RS INTERIOR',
    SURSFRONTEIRA = 'RS FRONTEIRA',

    SUSCLITORAL = 'SC LITORAL',
    SUSCOESTE = 'SC E OESTE',

    SUPRPARANA = 'SU PARANA'
}

export const ClusterLabel: Record<Clusters, string> = {

    // B2B
    [Clusters.B2B]: 'B2B',
    [Clusters.B2BBACAPT]: 'BA Capital',
    [Clusters.B2BRJCAPT]: 'RJ Capital',
    [Clusters.B2BES]: 'ES e Santo',
    [Clusters.B2BPRCAPT]: 'PR Capital',
    [Clusters.B2BSPMETROPOLITANO]: 'B2B SP Metropolitano',
    [Clusters.B2BSPABCBAIXADA]: 'SP ABC + Baixada',

    // CO
    [Clusters.COGOCENTRO]: 'GO Centro',
    [Clusters.COGONORTE]: 'GO Norte',
    [Clusters.COGOSUL]: 'GO Sul',
    [Clusters.COGORIOVERDE]: 'GO Rio Verde',
    [Clusters.CODFCAPITAL]: 'DF Capital',
    [Clusters.COMSCAPITAL]: 'MS Capital',
    [Clusters.COMSLESTE]: 'MS Leste',
    [Clusters.COMSTRESLAGOAS]: 'MS Três Lagoas',

    // MG
    [Clusters.MGBARBACENA]: 'MG Barbacena',
    [Clusters.MGCAPITAL]: 'MG Capital',
    [Clusters.MGOESTE]: 'MG Oeste',
    [Clusters.MGLESTE]: 'MG Leste',
    [Clusters.MGVALE]: 'MG Vale',
    [Clusters.MGVERTENTES]: 'MG Vertentes',
    [Clusters.MGZMATA]: 'MG Z Mata',
    [Clusters.MGLAFAIETE]: 'MG Lafaiete',

    // SP
    [Clusters.SPBAURU]: 'SP Bauru',
    [Clusters.SPLIMEIRA]: 'SP Limeira',
    [Clusters.SPARACATUBA]: 'SP Araçatuba',
    [Clusters.SPPRESPRUDENTE]: 'SP Presidente Prudente',
    [Clusters.SPSJOSE]: 'SP São José do Rio Preto',
    [Clusters.SPSOROCABA]: 'SP Sorocaba',
    [Clusters.SPSAOROQUE]: 'SP São Roque',
    [Clusters.SPVALEPARAIBA]: 'SP Vale do Paraíba',
    [Clusters.SPMETROPOLITANO]: 'SP Metropolitano',

    // SU
    [Clusters.SURSERRRA]: 'RS Serra',
    [Clusters.SURSCAPITAL]: 'RS Capital',
    [Clusters.SURSLITORAL]: 'RS Litoral',
    [Clusters.SURSINTERIOR]: 'RS Interior',
    [Clusters.SURSFRONTEIRA]: 'RS Fronteira',

    [Clusters.SUSCLITORAL]: 'SC Litoral',
    [Clusters.SUSCOESTE]: 'SC Oeste',

    [Clusters.SUPRPARANA]: 'PR Paraná'
}

const clusters = Object.values(Clusters) as Clusters[]

export const clusterOptions = [
    { label: "Todos Clusters", value: "default" },
    ...clusters.map((cluster: any) => ({
        value: cluster,
        label: ClusterLabel[cluster as Clusters]
    }))
]

export function getClusterFromTitulo(titulo: string): Clusters | null {
    const encontrado = Object.values(Clusters).find((c) =>
        titulo.toLowerCase().includes(c.toLowerCase())
    )
    return encontrado ?? null
}

export function buildClusterOptionsFromChamados(chamados: { titulo: string }[]) {
    const clustersComChamados = new Set<Clusters>()

    chamados.forEach((chamado) => {
        const cluster = getClusterFromTitulo(chamado.titulo)
        if (cluster) clustersComChamados.add(cluster)
    })

    const ordenados = [...clustersComChamados].sort((a, b) =>
        ClusterLabel[a].localeCompare(ClusterLabel[b], "pt-BR")
    )

    return [
        { label: "Todos Clusters", value: "default" },
        ...ordenados.map((cluster) => ({
            value: cluster,
            label: ClusterLabel[cluster],
        })),
    ]
}