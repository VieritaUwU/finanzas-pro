import { supabase } from './supabase'

// Types for transaction data
export interface Transaction {
    id: string
    user_id: string
    amount: number
    type: 'income' | 'expense'
    category: string
    description: string
    date: string
    created_at: string
}

export interface FinancialSummary {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  savings: number
  incomeChange: number
  expenseChange: number
}

export interface CategoryExpense {
  category: string
  amount: number
  percentage: number
}