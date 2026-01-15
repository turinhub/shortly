import { Card } from "@/components/ui/card"
import { Link2, MousePointerClick, TrendingUp, Users } from "lucide-react"

const stats = [
  {
    title: "总链接数",
    value: "1,284",
    change: "+12.5%",
    icon: Link2,
    trend: "up",
  },
  {
    title: "总点击量",
    value: "45,231",
    change: "+18.2%",
    icon: MousePointerClick,
    trend: "up",
  },
  {
    title: "7天内点击量",
    value: "12,458",
    change: "+15.8%",
    icon: TrendingUp,
    trend: "up",
  },
  {
    title: "活跃用户",
    value: "8,492",
    change: "+23.5%",
    icon: Users,
    trend: "up",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-success">{stat.change}</p>
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
