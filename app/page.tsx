import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { LinkIcon, BarChart3, Shield, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">Shortly</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">登录</Button>
            </Link>
            <Link href="/login">
              <Button>开始使用</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 max-w-7xl">
        <section className="py-20 md:py-32">
          <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
              <Zap className="h-4 w-4" />
              <span>强大的短链接管理平台</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
              让每一个链接
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                更有价值
              </span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl leading-relaxed">
              创建、管理和追踪您的短链接。获取深入的数据分析，优化您的营销效果，提升用户体验。
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link href="/login">
                <Button size="lg" className="text-base px-8">
                  免费开始
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
                查看演示
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-blue-500/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                <LinkIcon className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">简单易用</h3>
              <p className="text-muted-foreground leading-relaxed">
                一键创建短链接，支持自定义短码、标签和描述，让链接管理更加高效便捷。
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-blue-500/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">深度分析</h3>
              <p className="text-muted-foreground leading-relaxed">
                实时追踪点击数据、设备分布、地理位置和流量来源，全方位了解链接表现。
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-blue-500/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">安全可靠</h3>
              <p className="text-muted-foreground leading-relaxed">
                企业级安全保障，数据加密存储，支持链接有效期设置和访问控制。
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <Card className="p-12 md:p-16 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">准备好开始了吗？</h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              立即注册，免费体验专业的短链接管理服务
            </p>
            <Link href="/login">
              <Button size="lg" className="text-base px-8">
                免费注册
              </Button>
            </Link>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <LinkIcon className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Shortly</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 Shortly. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
