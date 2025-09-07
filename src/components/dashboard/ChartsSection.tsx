'use client'

import React from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { CategoryExpense } from '@/lib/database'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface ChartsSectionProps {
  monthlyData: {
    labels: string[]
    income: number[]
    expenses: number[]
  }
  categoryExpenses: CategoryExpense[]
  dataLoading: boolean
  className?: {
    chartsSection?: string
    chartsHeader?: string
    chartsGrid?: string
    chartContainer?: string
    chartLoading?: string
  }
}

export default function ChartsSection({ monthlyData, categoryExpenses, dataLoading, className: theme }: ChartsSectionProps) {
  const monthlyChartData = {
    labels: monthlyData.labels.length > 0 ? monthlyData.labels : ['Sin datos'],
    datasets: [
      {
        label: 'Ingresos',
        data: monthlyData.income.length > 0 ? monthlyData.income : [0],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4
      },
      {
        label: 'Gastos',
        data: monthlyData.expenses.length > 0 ? monthlyData.expenses : [0],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  }

  // Generate data for expense categories chart
  const expenseChartData = {
    labels: categoryExpenses.length > 0 ? categoryExpenses.map(c => c.category) : ['Sin gastos'],
    datasets: [
      {
        data: categoryExpenses.length > 0 ? categoryExpenses.map(c => c.amount) : [0],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
          '#14B8A6',
          '#F97316'
        ]
      }
    ]
  }

  // Generate data for savings chart
  const savingsChartData = {
    labels: monthlyData.labels.length > 0 ? monthlyData.labels : ['Sin datos'],
    datasets: [
      {
        label: 'Ahorros',
        data: monthlyData.labels.length > 0 ? 
          monthlyData.income.map((income, index) => income - (monthlyData.expenses[index] || 0)) : 
          [0],
        backgroundColor: 'rgba(16, 185, 129, 0.8)'
      }
    ]
  }

  const downloadChartAsPDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 200
      const pageHeight = 277
      
      const charts = [
        { id: 'monthly-chart', title: 'Ingresos vs Gastos Mensuales' },
        { id: 'expense-chart', title: 'Distribución de Gastos' },
        { id: 'savings-chart', title: 'Evolución de Ahorros' }
      ]

      for (let i = 0; i < charts.length; i++) {
        const chartElement = document.getElementById(charts[i].id)
        if (!chartElement) continue

        // Add new page
        if (i > 0) {
          pdf.addPage()
        }

        pdf.setFontSize(16)
        pdf.text(charts[i].title, pageWidth / 2, 20, { align: 'center' })

        // With this, we can add the title of the chart
        const canvas = await html2canvas(chartElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        })

        const imgData = canvas.toDataURL('image/png')
        
        const imgWidth = pageWidth - 20
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        const xPosition = 10
        const yPosition = 30

        // Add img for the graphic
        pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, Math.min(imgHeight, pageHeight - 40))
      }

      pdf.save('grafico.pdf')
    } catch (error) {
      console.error('Error generando PDF:', error)
    }
  }

  return (
    <div className={theme?.chartsSection} id="financial-charts">
      <div className={theme?.chartsHeader}>
        <h2>Análisis Financiero</h2>
        <button 
          onClick={downloadChartAsPDF}
          className={`btn btn-primary`}
        >
          <Download size={16} style={{ marginRight: '0.5rem' }} />
          Descargar PDF
        </button>
      </div>
      
      <div className={theme?.chartsGrid}>
        <div className={theme?.chartContainer} id="monthly-chart">
          <h3>Ingresos vs Gastos Mensuales</h3>
          {dataLoading ? (
            <div className={theme?.chartLoading}>Cargando gráfico...</div>
          ) : (
            <Line data={monthlyChartData} options={{ responsive: true }} />
          )}
        </div>
        
        <div className={theme?.chartContainer} id="expense-chart">
          <h3>Distribución de Gastos</h3>
          {dataLoading ? (
            <div className={theme?.chartLoading}>Cargando gráfico...</div>
          ) : (
            <Doughnut data={expenseChartData} options={{ responsive: true }} />
          )}
        </div>
        
        <div className={theme?.chartContainer} id="savings-chart">
          <h3>Evolución de Ahorros</h3>
          {dataLoading ? (
            <div className={theme?.chartLoading}>Cargando gráfico...</div>
          ) : (
            <Bar data={savingsChartData} options={{ responsive: true }} />
          )}
        </div>
      </div>
    </div>
  )
}