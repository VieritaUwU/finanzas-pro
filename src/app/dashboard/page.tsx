'use client'

import { useRouter } from 'next/navigation'
import { auth } from '@/lib/supabase'
import theme from './dashboard.module.scss'

export default function Dashboard() {
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await auth.signOut()
            router.push('/')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }

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
                        <button onClick={handleSignOut} className={`btn btn-outline`}>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>
        </div>
    )
}