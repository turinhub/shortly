'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Copy, ExternalLink, MoreVertical, Pencil, Trash2, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { EditLinkDialog } from '@/components/edit-link-dialog'
import { getLinksAction, deleteLinkAction, updateLinkStatusAction } from '@/lib/actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const domain = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 's.zxd.ai'

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

export function LinksTable() {
  const [links, setLinks] = useState<LinkWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLink, setEditingLink] = useState<LinkWithStats | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchLinks = async () => {
    setLoading(true)
    try {
      const result = await getLinksAction()
      if (result.success && result.data) {
        setLinks(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch links:', error)
      toast.error('加载链接失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()

    // 监听链接更新事件
    const handleLinksUpdated = () => {
      fetchLinks()
    }

    window.addEventListener('links-updated', handleLinksUpdated)

    return () => {
      window.removeEventListener('links-updated', handleLinksUpdated)
    }
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  }

  const handleEdit = (link: LinkWithStats) => {
    setEditingLink(link)
    setEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个链接吗？')) return

    try {
      const result = await deleteLinkAction(id)
      if (result.success) {
        toast.success('链接已删除')
        fetchLinks()
      } else {
        toast.error(result.error || '删除失败')
      }
    } catch (error) {
      console.error('Failed to delete link:', error)
      toast.error('删除失败')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'frozen') => {
    const newStatus = currentStatus === 'active' ? 'frozen' : 'active'
    try {
      const result = await updateLinkStatusAction(id, newStatus)
      if (result.success) {
        toast.success(newStatus === 'active' ? '链接已激活' : '链接已冻结')
        fetchLinks()
      } else {
        toast.error(result.error || '更新失败')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('更新失败')
    }
  }

  const filteredLinks = links.filter(
    (link) =>
      link.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.long_link.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.short_link.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">所有链接</h2>
            <Input
              placeholder="搜索链接..."
              className="max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      短链接
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      标题
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      原始链接
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      标签
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      点击量
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      状态
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      创建日期
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        {searchQuery ? '没有找到匹配的链接' : '还没有创建任何链接'}
                      </td>
                    </tr>
                  ) : (
                    filteredLinks.map((link) => (
                      <tr
                        key={link.id}
                        className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                              {link.short_link}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => copyToClipboard(link.short_link)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/links/${link.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {link.title || '无标题'}
                          </Link>
                          {link.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {link.description}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 max-w-xs">
                            <span className="text-sm text-muted-foreground truncate">
                              {link.long_link}
                            </span>
                            <a
                              href={link.long_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0"
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {link.tags?.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            )) || <span className="text-sm text-muted-foreground">-</span>}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium">{link.clicks.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={link.status === 'active' ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => handleToggleStatus(link.id, link.status)}
                          >
                            {link.status === 'active' ? '活跃' : '冻结'}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-muted-foreground">
                            {new Date(link.created_at).toLocaleDateString('zh-CN')}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/links/${link.id}`}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <BarChart3 className="h-4 w-4" />
                                  查看详情
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={() => handleEdit(link)}
                              >
                                <Pencil className="h-4 w-4" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-destructive"
                                onClick={() => handleDelete(link.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

      {editingLink && (
        <EditLinkDialog
          link={editingLink}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onUpdate={fetchLinks}
        />
      )}
    </>
  )
}
