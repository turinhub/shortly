'use client'

import { Link2 } from 'lucide-react'
import Link from 'next/link'
import { LoginDialog } from '@/components/login-dialog'
import { UserMenu } from '@/components/user-menu'
import { useAuth } from '@/components/auth-provider'
import { Loader2 } from 'lucide-react'

export function Header() {
  const { user, isLoading } = useAuth()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Link2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LinkShort</span>
          </Link>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-9 w-9">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <LoginDialog />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
