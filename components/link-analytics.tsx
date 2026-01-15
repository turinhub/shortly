"use client"

import { Card } from "@/components/ui/card"
import { BarChart3, Globe, Monitor, Smartphone } from "lucide-react"

const clicksData = [
  { date: "01-15", clicks: 45 },
  { date: "01-16", clicks: 78 },
  { date: "01-17", clicks: 123 },
  { date: "01-18", clicks: 95 },
  { date: "01-19", clicks: 167 },
  { date: "01-20", clicks: 142 },
  { date: "01-21", clicks: 189 },
]

const deviceData = [
  { name: "桌面端", value: 58, icon: Monitor },
  { name: "移动端", value: 42, icon: Smartphone },
]

const locationData = [
  { country: "中国", clicks: 678, percentage: 55 },
  { country: "美国", clicks: 234, percentage: 19 },
  { country: "日本", clicks: 156, percentage: 13 },
  { country: "韩国", clicks: 98, percentage: 8 },
  { country: "其他", clicks: 68, percentage: 5 },
]

const referrerData = [
  { source: "直接访问", clicks: 456, percentage: 37 },
  { source: "Twitter", clicks: 345, percentage: 28 },
  { source: "Facebook", clicks: 234, percentage: 19 },
  { source: "LinkedIn", clicks: 123, percentage: 10 },
  { source: "其他", clicks: 76, percentage: 6 },
]

export function LinkAnalytics() {
  const maxClicks = Math.max(...clicksData.map((d) => d.clicks))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">数据分析</h2>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">点击趋势</h3>
          <div className="flex items-end gap-2 h-48">
            {clicksData.map((data) => (
              <div key={data.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-full">
                  <div
                    className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(data.clicks / maxClicks) * 100}%` }}
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium">{data.clicks}</span>
                  <span className="text-xs text-muted-foreground">{data.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">设备分布</h3>
            <div className="flex flex-col gap-3">
              {deviceData.map((device) => {
                const Icon = device.icon
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
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">地理位置</h3>
            </div>
            <div className="flex flex-col gap-2">
              {locationData.map((location) => (
                <div
                  key={location.country}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm">{location.country}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{location.clicks} 次</span>
                    <span className="text-sm font-medium w-12 text-right">{location.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">流量来源</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {referrerData.map((referrer) => (
              <div key={referrer.source} className="flex flex-col gap-2 p-4 rounded-lg border border-border">
                <span className="text-sm font-medium">{referrer.source}</span>
                <span className="text-2xl font-bold">{referrer.clicks}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${referrer.percentage}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{referrer.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
