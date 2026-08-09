import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useToast } from "../context/ToastContext"

type ChamadosSocketOptions = {
    onUpdate: () => void
}

export function useChamadosSocket({ onUpdate }: ChamadosSocketOptions) {
    const socketRef = useRef<Socket | null>(null)
    const { showToast } = useToast()

    useEffect(() => {
        const socket = io('https://monteirojubi.discloud.app/chamados', {
            transports: ['websocket'],
            auth: {
                apiKey: 'PINrEymbohdYJpHsCDehv'
            }
        })

        socketRef.current = socket

        socket.on('chamado:atualizado', () => {
            onUpdate()
            showToast("Chamado atualizado com sucesso!", 3000, "success", "#18ca00")
        })

        socket.on('chamado:criado', () => {
            onUpdate()
            showToast("Chamado criado com sucesso!", 3000, "success", "#18ca00")
            
        })

        socket.on('chamado:deletado', () =>{
            onUpdate()
            showToast("Chamado deletado com sucesso!", 3000, "success", "#18ca00")
        })

        return () =>{
            socket.disconnect()
        }
    }, [onUpdate])
}