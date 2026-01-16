'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { BarChart3, Monitor, Smartphone } from 'lucide-react'
import { getLinkChartsDataAction } from '@/lib/actions'

interface ClickData {
  date: string
  clicks: number
}

interface DeviceData {
  name: string
  value: number
}

interface ReferrerData {
  source: string
  clicks: number
  percentage: number
}

interface LinkAnalyticsProps {
  linkId: string
}

export function LinkAnalytics({ linkId }: LinkAnalyticsProps) {
  const [clicksData, setClicksData] = useState<ClickData[]>([])
  const [deviceData, setDeviceData] = useState<DeviceData[]>([])
  const [referrerData, setReferrerData] = useState<ReferrerData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const result = await getLinkChartsDataAction(linkId)
      if (result.success && result.data) {
        setClicksData(result.data.clickTrends)
        setDeviceData(result.data.deviceDistribution)
        setReferrerData(result.data.referrerDistribution)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [linkId])

  const maxClicks = clicksData.length > 0 ? Math.max(...clicksData.map((d) => d.clicks)) : 0

  const getDeviceIcon = (name: string) => {
    return name === 'desktop' || name === '桌面端' ? Monitor : Smartphone
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">数据分析</h2>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">点击趋势</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              加载中...
            </div>
          ) : (
            <div className="flex items-stretch gap-2 h-48">
              {clicksData.map((data) => (
                <div key={data.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center flex-1">
                    <div
                      className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                      style={{ height: `${maxClicks > 0 ? (data.clicks / maxClicks) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-medium">{data.clicks}</span>
                    <span className="text-xs text-muted-foreground">{data.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">设备分布</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                加载中...
              </div>
            ) : deviceData.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                暂无数据
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {deviceData.map((device) => {
                  const Icon = getDeviceIcon(device.name)
                  return (
                    <div key={device.name} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{device.name}</span>
                          <span className="text-sm font-bold">{device.value}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${device.value}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">流量来源</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                加载中...
              </div>
            ) : referrerData.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                暂无数据
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {referrerData.map((referrer) => (
                  <div
                    key={referrer.source}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm">{referrer.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{referrer.clicks} 次</span>
                      <span className="text-sm font-medium w-12 text-right">
                        {referrer.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
