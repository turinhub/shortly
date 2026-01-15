'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Copy,
  ExternalLink,
  Pencil,
  Trash2,
  ToggleLeft,
  PlayCircle,
  PauseCircle,
  Download,
} from 'lucide-react'
import { Link as LinkType } from '@/lib/types'
import { toast } from 'sonner'
import { updateLinkStatusAction, getLinkClickStatsAction } from '@/lib/actions'
import { format } from 'date-fns'
import { EditLinkDialog } from '@/components/edit-link-dialog'
import { DeleteLinkDialog } from '@/components/delete-link-dialog'

interface LinkDetailsProps {
  link: LinkType
  clicks?: number
}

// 适配 EditLinkDialog 和 DeleteLinkDialog 所需的接口
interface LinkWithStats {
  id: string
  long_link: string
  short_link: string
  title: string | null
  description: string | null
  tags: string[] | null
  status: 'active' | 'frozen'
  created_at: Date
  updated_at: Date
  clicks: number
}

interface ClickStats {
  lastDay: number
  last7Days: number
  total: number
}

export function LinkDetails({ link, clicks }: LinkDetailsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clickStats, setClickStats] = useState<ClickStats>({ lastDay: 0, last7Days: 0, total: 0 })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getLinkClickStatsAction(link.id)
      if (result.success && result.data) {
        setClickStats(result.data)
      }
      setIsLoadingStats(false)
    }
    fetchStats()
  }, [link.id])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板', {
      description: text,
    })
  }

  const handleStatusToggle = () => {
    startTransition(async () => {
      const newStatus = link.status === 'active' ? 'frozen' : 'active'
      const result = await updateLinkStatusAction(link.id, newStatus)
      if (result.success) {
        toast.success(newStatus === 'active' ? '链接已激活' : '链接已暂停')
        router.refresh()
      } else {
        toast.error('操作失败', {
          description: result.error,
        })
      }
    })
  }

  // 构造兼容的 link 对象
  const linkWithStats: LinkWithStats = {
    ...link,
    clicks: clicks ?? clickStats.total,
  }

  const handleDeleteSuccess = () => {
    router.push('/dashboard')
  }

  const hasActivity = (clicks !== undefined && clicks > 0) || clickStats.total > 0

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-6 lg:col-span-2">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">{link.title || '无标题'}</h2>
              <p className="text-muted-foreground">{link.description || '无描述'}</p>
            </div>
            <Badge variant={link.status === 'active' ? 'default' : 'secondary'}>
              {link.status === 'active' ? '活跃' : '暂停'}
            </Badge>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">短链接</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-lg font-mono text-primary bg-primary/10 px-4 py-3 rounded-lg">
                  {link.short_link}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(link.short_link)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">原始链接</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 text-sm bg-muted px-4 py-3 rounded-lg break-all">
                  {link.long_link}
                </div>
                <a href={link.long_link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">标签</label>
              <div className="flex flex-wrap gap-2">
                {link.tags && link.tags.length > 0 ? (
                  link.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">无标签</span>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">创建时间</label>
                <span className="text-sm">
                  {format(new Date(link.created_at), 'yyyy-MM-dd HH:mm')}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">更新时间</label>
                <span className="text-sm">
                  {format(new Date(link.updated_at), 'yyyy-MM-dd HH:mm')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">快速统计</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">近 1 天点击</span>
                <span className="text-2xl font-bold">
                  {isLoadingStats ? '-' : clickStats.lastDay}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">近 7 天点击</span>
                <span className="text-2xl font-bold">
                  {isLoadingStats ? '-' : clickStats.last7Days}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">总点击量</span>
                <span className="text-2xl font-bold">
                  {isLoadingStats ? (clicks !== undefined ? clicks : '-') : clickStats.total}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">操作</h3>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="justify-start bg-transparent"
                disabled={isPending}
                onClick={() => setEditDialogOpen(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                编辑链接
              </Button>
              <Button
                variant="outline"
                className="justify-start bg-transparent"
                onClick={handleStatusToggle}
                disabled={isPending}
              >
                {link.status === 'active' ? (
                  <>
                    <PauseCircle className="h-4 w-4 mr-2" />
                    暂停链接
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    恢复链接
                  </>
                )}
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={isPending || hasActivity}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除链接
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {hasActivity && (
                    <TooltipContent>
                      <p>已有点击数据的链接无法删除</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </Card>
      </div>

      <EditLinkDialog
        link={linkWithStats}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={() => router.refresh()}
      />

      <DeleteLinkDialog
        link={linkWithStats}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
