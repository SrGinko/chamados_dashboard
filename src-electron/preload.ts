import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),

    notify: (data :any) => ipcRenderer.invoke("notify", data),
    openExternal: (url: string) => ipcRenderer.invoke("openExternal", url),
    openChamado: (data: any) => ipcRenderer.invoke("openChamado", data),
    puxarTitulo: (url: string) => ipcRenderer.invoke("browser:open", url),
    copy: (text: string) => navigator.clipboard.writeText(text),
    enviar: (data: { destinatario: string; mensagem: string }[]) =>
        ipcRenderer.invoke('enviarWhatsapp', data),
})
