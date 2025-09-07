'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/supabase'
import { AuthUser } from '@/lib/supabase'
import { BarChart3, TrendingUp } from 'lucide-react'
import {
    FinancialSummary,
    CategoryExpense
} from '@/lib/database'
import { OverviewSection } from '@/components/dashboard'
import theme from './dashboard.module.scss'

export default function Dashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    occupation: ''
  })
    const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null)
    const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([])
    const [dataLoading, setDataLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        try {
            const { user: currentUser, error } = await auth.getCurrentUser()
            console.log('currentUser', currentUser)
            if (!currentUser || error || !currentUser.email) {
                router.push('/login')
                return
            }
            setUser(currentUser)
            // ESTO AÚN DEBO VERLO EN LA TABLA PARA CORROBORAR LOS DATOS
            // if (currentUser.user_metadata) {
            //     setProfileData({
            //         name: currentUser.user_metadata.name || '',
            //         phone: currentUser.user_metadata.phone || '',
            //         occupation: currentUser.user_metadata.occupation || ''
            //     })
            // }
        } catch (error) {
            console.error('Error verificando el usuario:', error)
            router.push('/login')
        } finally {
            setLoading(false)
        }
    }

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