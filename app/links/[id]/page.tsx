import { Header } from '@/components/header'
import { LinkDetails } from '@/components/link-details'
import { LinkAnalytics } from '@/components/link-analytics'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getLinkById, getLinkClicks } from '@/lib/link-service'
import { notFound } from 'next/navigation'

export default async function LinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [link, clicks] = await Promise.all([getLinkById(id), getLinkClicks(id)])

  if (!link) {
    notFound()
  }

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
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">链接详情</h1>
                <Badge variant={link.status === 'active' ? 'default' : 'secondary'}>
                  {link.status === 'active' ? '活跃' : '暂停'}
                </Badge>
              </div>
              <p className="text-muted-foreground">查看短链接的详细信息和分析数据</p>
            </div>
          </div>

          <LinkDetails link={link} clicks={clicks} />
          <LinkAnalytics linkId={link.id} />
        </div>
      </main>
    </div>
  )
}
