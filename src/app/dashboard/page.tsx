'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/supabase'
import { AuthUser } from '@/lib/supabase'
import { BarChart3, TrendingUp } from 'lucide-react'
import {
    getFinancialSummary,
    getExpensesByCategory,
    getMonthlyData,
    FinancialSummary,
    CategoryExpense
} from '@/lib/database'
import { UserProfile, getProfile } from '@/lib/profiles'
import { OverviewSection, ChartsSection, ProfileEditModal } from '@/components/dashboard'
import theme from './dashboard.module.scss'

export default function Dashboard() {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [showProfileEdit, setShowProfileEdit] = useState(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null)
    const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([])
    const [monthlyData, setMonthlyData] = useState<{
        labels: string[]
        income: number[]
        expenses: number[]
    }>({ labels: [], income: [], expenses: [] })
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
            await loadFinancialData(currentUser.id)
            await loadUserProfile(currentUser.id)
        } catch (error) {
            console.error('Error verificando el usuario:', error)
            router.push('/login')
        } finally {
            setLoading(false)
        }
    }

    console.log(userProfile)

    const loadUserProfile = async (userId: string) => {
        try {
            const { data, error } = await getProfile(userId)
            if (data) {
                setUserProfile(data)
            } else if (error) {
                console.error('Error cargando perfil:', error)
            }
        } catch (error) {
            console.error('Error cargando perfil:', error)
        }
    }

    const loadFinancialData = async (userId: string) => {
        try {
            setDataLoading(true)

            const summary = await getFinancialSummary(userId)
            setFinancialSummary(summary)

            const expenses = await getExpensesByCategory(userId)
            setCategoryExpenses(expenses)

            const monthly = await getMonthlyData(userId, 6)
            setMonthlyData(monthly)

        } catch (error) {
            console.error('Error cargando datos financieros:', error)
        } finally {
            setDataLoading(false)
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

    const handleProfileUpdate = (updatedProfile: UserProfile) => {
        setUserProfile(updatedProfile)
    }

    return (
        <div className={theme.dashboard}>
            <header className={theme.dashboardHeader}>
                <div className={theme.headerContent}>
                    <h1>💰 FinanzasPro Dashboard</h1>
                    <div className={theme.headerActions}>
                        <span className={theme.userWelcome}>
                            Hola, {userProfile?.full_name || user?.email}
                        </span>
                        <button
                            onClick={() => setShowProfileEdit(true)}
                            className={`btn btn-secondary`}
                        >
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
                            className={theme}
                        />
                    )}

                    {activeTab === 'charts' && (
                        <ChartsSection
                            monthlyData={monthlyData}
                            categoryExpenses={categoryExpenses}
                            dataLoading={dataLoading}
                            className={theme}
                        />
                    )}
                </div>
            </main>

            <ProfileEditModal
                user={user}
                profile={userProfile}
                isOpen={showProfileEdit}
                onClose={() => setShowProfileEdit(false)}
                onProfileUpdate={handleProfileUpdate}
                className={theme}
            />
        </div>
    )
}