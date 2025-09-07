'use client'

import { FinancialSummary } from '@/lib/database'
import StatCard from './statCard'

interface OverviewSectionProps {
  financialSummary: FinancialSummary | null
  dataLoading: boolean
  theme?: {
    overviewSection?: string
    loadingState?: string
    statsGrid?: string
    statCard?: string
    statValue?: string
    statChange?: string
  }
}

export default function OverviewSection({ financialSummary, dataLoading, theme }: OverviewSectionProps) {
  if (dataLoading) {
    return (
      <div className={theme?.overviewSection}>
        <div className={theme?.loadingState}>
          <p>Cargando datos financieros...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={theme?.overviewSection}>
      <div className={theme?.statsGrid}>
        <StatCard
          title="Balance Total"
          value={financialSummary?.totalBalance || 0}
          change={financialSummary?.totalBalance && financialSummary.totalBalance >= 0 ? 'Balance positivo' : 'Balance negativo'}
          type={financialSummary?.totalBalance && financialSummary.totalBalance >= 0 ? 'positive' : 'negative'}
          changeType="neutral"
          className={{
            statCard: theme?.statCard,
            statValue: theme?.statValue,
            statChange: theme?.statChange
          }}
        />
        
        <StatCard
          title="Ingresos del Mes"
          value={financialSummary?.monthlyIncome || 0}
          change={financialSummary?.incomeChange ? 
            `${financialSummary.incomeChange > 0 ? '+' : ''}${financialSummary.incomeChange.toFixed(1)}% vs mes anterior` : 
            'Sin datos del mes anterior'
          }
          type="neutral"
          changeType={financialSummary?.incomeChange && financialSummary.incomeChange >= 0 ? 'positive' : 'negative'}
          className={{
            statCard: theme?.statCard,
            statValue: theme?.statValue,
            statChange: theme?.statChange
          }}
        />
        
        <StatCard
          title="Gastos del Mes"
          value={financialSummary?.monthlyExpenses || 0}
          change={financialSummary?.expenseChange ? 
            `${financialSummary.expenseChange > 0 ? '+' : ''}${financialSummary.expenseChange.toFixed(1)}% vs mes anterior` : 
            'Sin datos del mes anterior'
          }
          type="negative"
          changeType={financialSummary?.expenseChange && financialSummary.expenseChange <= 0 ? 'positive' : 'negative'}
          className={{
            statCard: theme?.statCard,
            statValue: theme?.statValue,
            statChange: theme?.statChange
          }}
        />
        
        <StatCard
          title="Ahorros"
          value={financialSummary?.savings || 0}
          change={financialSummary?.savings && financialSummary.savings >= 0 ? 
            'Ahorro positivo este mes' : 
            'Déficit este mes'
          }
          type={financialSummary?.savings && financialSummary.savings >= 0 ? 'positive' : 'negative'}
          changeType="neutral"
          className={{
            statCard: theme?.statCard,
            statValue: theme?.statValue,
            statChange: theme?.statChange
          }}
        />
      </div>
    </div>
  )
}