import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Link2Off } from 'lucide-react'
import Link from 'next/link'

export default function FrozenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-flex mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Link2Off className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">链接已暂停</CardTitle>
            <CardDescription className="text-base">
              抱歉，您访问的短链接已被暂停使用，暂时无法跳转。
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            <p>可能的原因：</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-left">
              <li>链接已被管理员暂时停用</li>
              <li>链接正在维护或更新中</li>
              <li>链接存在违规内容被禁用</li>
            </ul>
          </div>
          <Link href="/">
            <Button className="w-full" variant="default">
              <Home className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
