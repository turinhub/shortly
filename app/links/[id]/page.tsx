import { Header } from "@/components/header"
import { LinkDetails } from "@/components/link-details"
import { LinkAnalytics } from "@/components/link-analytics"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight">链接详情</h1>
              <p className="text-muted-foreground">查看短链接的详细信息和分析数据</p>
            </div>
          </div>

          <LinkDetails />
          <LinkAnalytics />
        </div>
      </main>
    </div>
  )
}
