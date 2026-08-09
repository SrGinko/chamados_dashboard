import { useEffect, useState } from 'react'
import { Bolt, BookText, Ticket, Home } from 'lucide-react'
import { Pages } from '../../enums/pages'

type Props = {
    onSelect: (page: Pages) => void
}

export default function MenuLateral({ onSelect }: Props) {
    const [active, setActive] = useState<Pages>(Pages.INICIO)

    function handleSelect(page: Pages) {
        setActive(page)
        onSelect(page)
    }

    return (
        <div className="menuLateral">
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>
                Dashboard
            </div>
            <div className='menuItemContainer'>
                <div className={`menuItens ${active === Pages.CONFIGURACAO ? "active" : ""}`} onClick={() => handleSelect(Pages.CONFIGURACAO)}><Bolt size={18} color='#bd005e' /> <span className='menuItensText'>Configuração</span></div>
            </div>
            <div style={{ marginTop: 40 }}>
                <div style={{ fontWeight: 'bold', fontSize: 13 }}>
                    Navegação:
                </div>
                <div className='menuItemContainer'>
                    <div className={`menuItens ${active === Pages.INICIO ? "active" : ""}`} onClick={() => handleSelect(Pages.INICIO)}><Home size={18} color='#bd005e' /><span className='menuItensText'>Início</span></div>
                    <div className={`menuItens ${active === Pages.CHAMADOS ? "active" : ""}`} onClick={() => handleSelect(Pages.CHAMADOS)}><Ticket size={18} color='#bd005e' /><span className='menuItensText'>Chamados</span></div>
                    <div className={`menuItens ${active === Pages.ESCALONAMENTO ? "active" : ""}`} onClick={() => handleSelect(Pages.ESCALONAMENTO)}><BookText size={18} color='#bd005e' /><span className='menuItensText'>App Escalonamento</span></div>
                </div>

            </div>
        </div>
    )
} 