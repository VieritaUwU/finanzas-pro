'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/supabase'
import { BarChart3, TrendingUp } from 'lucide-react'
import {
  FinancialSummary,
  CategoryExpense 
} from '@/lib/database'
import { OverviewSection } from '@/components/dashboard'
import theme from './dashboard.module.scss'

export default function Dashboard() {
    const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null)
    const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([])
    const [dataLoading, setDataLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
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

            <main className={theme.dashboardMain}>
                <nav className={theme.dashboardNav}>
                    <button
                        className={`${theme.navItem} ${activeTab === 'overview' ? theme.active : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <BarChart3
                            size={24}
                        />
                        Resumen
                    </button>
                    <button
                        className={`${theme.navItem} ${activeTab === 'charts' ? theme.active : ''}`}
                        onClick={() => setActiveTab('charts')}
                    >
                        <TrendingUp
                            size={24}
                        />
                        Gráficas
                    </button>
                </nav>

                <div className={theme.dashboardContent}>
                    {activeTab === 'overview' && (
                        <OverviewSection
                            financialSummary={financialSummary}
                            dataLoading={dataLoading}
                            theme={theme}
                        />
                    )}
                </div>
            </main>
        </div>
    )
}