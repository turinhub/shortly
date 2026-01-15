'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Link2, MousePointerClick, TrendingUp, Loader2 } from 'lucide-react'
import { getStatsAction } from '@/lib/actions'

interface Stat {
  title: string
  value: string
  icon: any
}

export function StatsCards() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getStatsAction()

        if (!data) return

        const { linksCount, clicksCount } = data

        setStats([
          {
            title: '总链接数',
            value: linksCount.toLocaleString(),
            icon: Link2,
          },
          {
            title: '总点击量',
            value: clicksCount.toLocaleString(),
            icon: MousePointerClick,
          },
          {
            title: '活跃链接',
            value: linksCount.toLocaleString(),
            icon: TrendingUp,
          },
        ])
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // 监听链接更新事件
    const handleLinksUpdated = () => {
      fetchStats()
    }

    window.addEventListener('links-updated', handleLinksUpdated)

    return () => {
      window.removeEventListener('links-updated', handleLinksUpdated)
    }
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
