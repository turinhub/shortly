import { Link2 } from 'lucide-react'
import Link from 'next/link'
import { CreateLinkDialog } from '@/components/create-link-dialog'

export function Header() {
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
            <CreateLinkDialog />
          </div>
        </div>
      </div>
    </header>
  )
}
