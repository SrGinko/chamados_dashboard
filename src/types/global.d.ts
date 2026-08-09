export { }

export type WhatsAppRecipient = {
    destinatario: string
    mensagem: string
}

export type WhatsAppBatchResult = {
    enviados: number
    total: number
    erros: Array<{ destinatario: string; erro: string }>
}

declare global {
    interface Window {
        electronAPI: {
            minimize: () => void
            maximize: () => void
            close: () => void

            notify: (data: { title: string; body: string }) => void
            openExternal: (url: string) => void
            openChamado: (data: { id: number | string }) => void
            puxarTitulo: (url: string) => any
            copy: (text: string) => void
            enviar: (data: WhatsAppRecipient[]) => Promise<WhatsAppBatchResult>
        }
    }
}
