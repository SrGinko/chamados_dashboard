import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { useToast } from "../../context/ToastContext"

type props = {
    text: string
}

export default function CopiarTexto({ text }: props) {

    const [copiado, setCopiado] = useState(false)
    const { showToast } = useToast()

    const copiar = async () => {
        await navigator.clipboard.writeText(text)
        setCopiado(true)

        showToast("Texto Copiado !", 3000, "success", '#18ca00')
        setTimeout(() => setCopiado(false), 2000)

    }

    return (
        <button onClick={copiar} style={{border: 'none', backgroundColor: "#202020", borderRadius: 10}}>
            {copiado ? <Check color="#fff" size={16} /> : <Copy color="#fff" size={16} />}
        </button>
    )
}
