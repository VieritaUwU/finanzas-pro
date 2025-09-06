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