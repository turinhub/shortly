import { LinksTable } from '@/components/links-table'
import { Header } from '@/components/header'
import { StatsCards } from '@/components/stats-cards'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-balance">短链接管理</h1>
            <p className="text-muted-foreground text-lg">创建、管理和追踪您的短链接性能</p>
          </div>

          <StatsCards />
          <LinksTable />
        </div>
      </main>
    </div>
  )
}
