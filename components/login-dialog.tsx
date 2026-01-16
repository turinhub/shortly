'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn, Loader2, MessageSquare, User, Lock } from 'lucide-react'
import { loginWithPassword, sendSmsCode, verifySmsLogin } from '@/lib/auth'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth-provider'

type LoginMethod = 'password' | 'sms'

export function LoginDialog() {
  const [open, setOpen] = useState(false)
  const { refresh } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password')
  const [showSmsVerify, setShowSmsVerify] = useState(false)

  // Password login state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // SMS login state
  const [phone, setPhone] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [smsId, setSmsId] = useState('')
  const [smsType, setSmsType] = useState<'login' | 'register'>('login')
  const [countdown, setCountdown] = useState(0)

  const router = useRouter()

  // Countdown timer for SMS
  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await loginWithPassword(username, password)
      toast.success(`欢迎回来，${result.user.username}！`)
      setOpen(false)
      await refresh()
      router.refresh()
      // Reset form
      setUsername('')
      setPassword('')
    } catch (error: any) {
      toast.error(error?.message || '登录失败，请检查用户名和密码')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendSms = async () => {
    if (!phone) {
      toast.error('请输入手机号码')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await sendSmsCode(phone)
      setSmsId(result.sms_id)
      setSmsType(result.type)
      setShowSmsVerify(true)
      startCountdown()
      toast.success('验证码已发送')
    } catch (error: any) {
      toast.error(error?.message || '发送验证码失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSmsVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await verifySmsLogin(smsId, smsType, smsCode)
      toast.success(`登录成功，欢迎！`)
      setOpen(false)
      await refresh()
      router.refresh()
      // Reset form
      setPhone('')
      setSmsCode('')
      setSmsId('')
      setShowSmsVerify(false)
    } catch (error: any) {
      toast.error(error?.message || '验证码错误')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetSmsForm = () => {
    setShowSmsVerify(false)
    setPhone('')
    setSmsCode('')
    setSmsId('')
  }

  const switchLoginMethod = (method: LoginMethod) => {
    setLoginMethod(method)
    resetSmsForm()
    setUsername('')
    setPassword('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LogIn className="h-4 w-4 mr-2" />
          登录
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <LogIn className="h-4 w-4 text-primary" />
            </div>
            登录到 Shortly
          </DialogTitle>
          <DialogDescription>选择登录方式以访问您的短链接管理面板</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-4 bg-muted/50 p-1 rounded-lg">
          <Button
            type="button"
            variant={loginMethod === 'password' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => switchLoginMethod('password')}
            className="flex-1"
          >
            <User className="h-4 w-4 mr-2" />
            账号密码
          </Button>
          <Button
            type="button"
            variant={loginMethod === 'sms' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => switchLoginMethod('sms')}
            className="flex-1"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            短信验证码
          </Button>
        </div>

        {/* Password Login Form */}
        {loginMethod === 'password' && (
          <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="text-sm font-medium">
                用户名 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm font-medium">
                密码 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={!username || !password || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    登录中...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    登录
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* SMS Login Form */}
        {loginMethod === 'sms' && !showSmsVerify && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                手机号码 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+8613800138000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">输入手机号码以接收验证码</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="button" onClick={handleSendSms} disabled={!phone || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    发送中...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    发送验证码
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* SMS Verify Form */}
        {loginMethod === 'sms' && showSmsVerify && (
          <form onSubmit={handleSmsVerify} className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="smsCode" className="text-sm font-medium">
                验证码 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="smsCode"
                type="text"
                placeholder="请输入6位验证码"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                required
                className="h-10"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">验证码已发送至 {phone}</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={resetSmsForm}
                disabled={isSubmitting}
              >
                返回
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSendSms}
                disabled={isSubmitting || countdown > 0}
              >
                {countdown > 0 ? `重新发送 (${countdown}s)` : '重新发送'}
              </Button>
              <Button type="submit" disabled={!smsCode || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    验证中...
                  </>
                ) : (
                  '验证'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
