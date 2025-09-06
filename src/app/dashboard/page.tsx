'use client'

import theme from './dashboard.module.scss'

export default function Dashboard() {
    return (
        <div className={theme.dashboard}>
            <header className={theme.dashboardHeader}>
                <div className={theme.headerContent}>
                    <h1>💰 FinanzasPro Dashboard</h1>
                    <div className={theme.headerActions}>
                        <span className={theme.userWelcome}>
                            Hola, amante de los ravioles
                        </span>
                        <button className={`btn btn-secondary`}>
                            Editar Perfil
                        </button>
                        <button className={`btn btn-outline`}>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>
        </div>
    )
}