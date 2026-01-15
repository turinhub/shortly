'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LinkIcon } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login - replace with actual authentication
    setTimeout(() => {
      const defaultUserId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID
      if (defaultUserId) {
        localStorage.setItem('userId', defaultUserId)
      }
      setIsLoading(false)
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <LinkIcon className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl">LinkShort</span>
        </Link>

        {/* Login Card */}
        <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">欢迎回来</h1>
            <p className="text-muted-foreground">点击下方按钮直接登录</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? '登录中...' : '直接登录'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            还没有账户？{' '}
            <Link href="#" className="text-blue-400 hover:text-blue-300 font-medium">
              立即注册
            </Link>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
