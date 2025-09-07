'use client'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  type?: 'positive' | 'negative' | 'neutral'
  changeType?: 'positive' | 'negative' | 'neutral'
  theme?: {
    statCard?: string
    statValue?: string
    statChange?: string
  }
}

export default function StatCard({
  title,
  value,
  change,
  type = 'neutral',
  changeType = 'neutral',
  theme
}: StatCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return `$${val.toLocaleString()}`
    }
    return val
  }

  return (
    <div className={theme?.statCard}>
      <h3>{title}</h3>
      <p className={`${theme?.statValue} ${type}`}>
        {formatValue(value)}
      </p>
      {change && (
        <span className={`${theme?.statChange} ${changeType}`}>
          {change}
        </span>
      )}
    </div>
  )
}