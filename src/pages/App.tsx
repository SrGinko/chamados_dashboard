import { useState } from 'react'
import MenuController from '../Components/layout/menuContollerComponent'
import MenuLateral from '../Components/layout/menuLateralComponent'
import { ToastProvider } from '../context/ToastContext'
import { Pages } from '../enums/pages'
import Inicio from './Inicio'
import Chamados from './Chamados'
import AppEscalonamento from './appEscalonamento'



export default function App() {
    const [page, setPage] = useState<Pages>(Pages.INICIO)

    return (
        <ToastProvider>
            <MenuController />
            <div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <MenuLateral onSelect={setPage} />
                    <div className='appsContentContainer'>
                        {page === Pages.INICIO && <Inicio />}
                        {page === Pages.CHAMADOS && <Chamados />}
                        {page === Pages.ESCALONAMENTO && <AppEscalonamento />}
                    </div>
                </div>
            </div>
        </ToastProvider>
    )
}