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

// Function to get user's financial summary
export async function getFinancialSummary(userId: string): Promise<FinancialSummary> {
  try {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear

    // Get current month transactions
    const { data: currentMonthTransactions, error: currentError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
      .lt('date', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`)

    if (currentError) throw currentError

    // Get previous month transactions
    const { data: previousMonthTransactions, error: previousError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', `${previousYear}-${previousMonth.toString().padStart(2, '0')}-01`)
      .lt('date', `${previousYear}-${currentMonth.toString().padStart(2, '0')}-01`)

    if (previousError) throw previousError

    // Calculate current month totals
    const currentIncome = currentMonthTransactions
      ?.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) || 0

    const currentExpenses = currentMonthTransactions
      ?.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0) || 0

    // Calculate previous month totals
    const previousIncome = previousMonthTransactions
      ?.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) || 0

    const previousExpenses = previousMonthTransactions
      ?.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0) || 0

    // Get all transactions
    const { data: allTransactions, error: allError } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', userId)

    if (allError) throw allError

    const totalBalance = allTransactions?.reduce((balance, t) => {
      return t.type === 'income' ? balance + t.amount : balance - t.amount
    }, 0) || 0

    // Calculate percentage changes
    const incomeChange = previousIncome > 0 
      ? ((currentIncome - previousIncome) / previousIncome) * 100 
      : 0

    const expenseChange = previousExpenses > 0 
      ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 
      : 0

    const savings = currentIncome - currentExpenses

    return {
      totalBalance,
      monthlyIncome: currentIncome,
      monthlyExpenses: currentExpenses,
      savings,
      incomeChange,
      expenseChange
    }
  } catch (error) {
    console.error('Error obteniendo resumen financiero:', error)
    throw error
  }
}

// Function to get expenses by category
export async function getExpensesByCategory(userId: string): Promise<CategoryExpense[]> {
  try {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    const { data: expenses, error } = await supabase
      .from('transactions')
      .select('category, amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
      .lt('date', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`)

    if (error) throw error

    // Group by category
    const categoryTotals = expenses?.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>) || {}

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

    // Convert to array with percentages
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
  } catch (error) {
    console.error('Error obteniendo gastos por categoría:', error)
    throw error
  }
}

// Function to get recent transactions
export async function getRecentTransactions(userId: string, limit: number = 10): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error obteniendo transacciones recientes:', error)
    throw error
  }
}

// Function to get monthly data
export async function getMonthlyData(userId: string, months: number = 6): Promise<{
  labels: string[]
  income: number[]
  expenses: number[]
}> {
  try {
    const currentDate = new Date()
    const data = {
      labels: [] as string[],
      income: [] as number[],
      expenses: [] as number[]
    }

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', userId)
        .gte('date', `${year}-${month.toString().padStart(2, '0')}-01`)
        .lt('date', `${year}-${(month + 1).toString().padStart(2, '0')}-01`)

      if (error) throw error

      const monthIncome = transactions
        ?.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) || 0

      const monthExpenses = transactions
        ?.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0) || 0

      data.labels.push(monthName)
      data.income.push(monthIncome)
      data.expenses.push(monthExpenses)
    }

    return data
  } catch (error) {
    console.error('Error obteniendo datos mensuales:', error)
    throw error
  }
}

// Function to create a new transaction
export async function createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creando transacción:', error)
    throw error
  }
}