export enum Escalate {
    FTTH = 'FTTH',
    BACKBONE = 'Backbone',
    Energia = 'Energia',
}

export const EscalateLabel: Record<Escalate, string> = {
    [Escalate.BACKBONE]: 'Backbone',
    [Escalate.FTTH]: 'FTTH',
    [Escalate.Energia]: 'Energia',
}

const escalates = Object.values(Escalate) as Escalate[]

export const EscalateOptions = [
    {label: 'Selecione', value: null},
    ...escalates.map((escalate: any) => ({
        value: escalate,
        label: EscalateLabel[escalate as Escalate],
    }))
]

