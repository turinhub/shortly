'use client'

import { useState } from 'react'
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

const mockLinks = [
  {
    id: '1',
    shortCode: 'abc123',
    shortUrl: 'link.short/abc123',
    originalUrl: 'https://example.com/very-long-url-path/article/12345',
    title: '产品发布公告',
    description: '最新产品特性的详细发布说明',
    tags: ['产品', '公告'],
    clicks: 1234,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    shortCode: 'xyz789',
    shortUrl: 'link.short/xyz789',
    originalUrl: 'https://docs.example.com/getting-started/installation',
    title: '文档 - 快速开始',
    description: '帮助新用户快速上手的安装指南',
    tags: ['文档', '教程'],
    clicks: 856,
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    shortCode: 'def456',
    shortUrl: 'link.short/def456',
    originalUrl: 'https://blog.example.com/2024/marketing-strategy',
    title: '营销策略文章',
    description: '2024年度营销战略规划分析',
    tags: ['营销', '博客'],
    clicks: 2341,
    status: 'active',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    shortCode: 'ghi789',
    shortUrl: 'link.short/ghi789',
    originalUrl: 'https://store.example.com/products/new-release',
    title: '新品发布页',
    description: '最新上架产品展示页面',
    tags: ['电商', '新品'],
    clicks: 453,
    status: 'paused',
    createdAt: '2024-01-12',
  },
]

export function LinksTable() {
  const [editingLink, setEditingLink] = useState<(typeof mockLinks)[0] | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleEdit = (link: (typeof mockLinks)[0]) => {
    setEditingLink(link)
    setEditDialogOpen(true)
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">所有链接</h2>
            <Input placeholder="搜索链接..." className="max-w-xs" />
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
                  {mockLinks.map((link) => (
                    <tr
                      key={link.id}
                      className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                            {link.shortUrl}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyToClipboard(link.shortUrl)}
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
                          {link.title}
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
                            {link.originalUrl}
                          </span>
                          <a
                            href={link.originalUrl}
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
                          {link.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium">{link.clicks.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={link.status === 'active' ? 'default' : 'secondary'}>
                          {link.status === 'active' ? '活跃' : '暂停'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-muted-foreground">{link.createdAt}</span>
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
                            <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

      {editingLink && (
        <EditLinkDialog link={editingLink} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      )}
    </>
  )
}
