"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Pencil, Trash2, ToggleLeft } from "lucide-react"

const mockLinkDetail = {
  id: "1",
  shortCode: "abc123",
  shortUrl: "link.short/abc123",
  originalUrl: "https://example.com/very-long-url-path/article/12345",
  title: "产品发布公告",
  description: "2024年第一季度新产品发布的官方公告文章",
  clicks: 1234,
  uniqueVisitors: 892,
  status: "active",
  createdAt: "2024-01-15 14:30",
  updatedAt: "2024-01-20 09:15",
  tags: ["产品", "公告", "营销"],
}

export function LinkDetails() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-6 lg:col-span-2">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">{mockLinkDetail.title}</h2>
              <p className="text-muted-foreground">{mockLinkDetail.description}</p>
            </div>
            <Badge variant={mockLinkDetail.status === "active" ? "default" : "secondary"}>
              {mockLinkDetail.status === "active" ? "活跃" : "暂停"}
            </Badge>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">短链接</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-lg font-mono text-primary bg-primary/10 px-4 py-3 rounded-lg">
                  {mockLinkDetail.shortUrl}
                </code>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(mockLinkDetail.shortUrl)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">原始链接</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 text-sm bg-muted px-4 py-3 rounded-lg break-all">
                  {mockLinkDetail.originalUrl}
                </div>
                <a href={mockLinkDetail.originalUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">标签</label>
              <div className="flex flex-wrap gap-2">
                {mockLinkDetail.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">创建时间</label>
                <span className="text-sm">{mockLinkDetail.createdAt}</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">更新时间</label>
                <span className="text-sm">{mockLinkDetail.updatedAt}</span>
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
                <span className="text-sm text-muted-foreground">总点击量</span>
                <span className="text-2xl font-bold">{mockLinkDetail.clicks.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">独立访客</span>
                <span className="text-2xl font-bold">{mockLinkDetail.uniqueVisitors.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">转化率</span>
                <span className="text-2xl font-bold">72.3%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">操作</h3>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start bg-transparent">
                <Pencil className="h-4 w-4 mr-2" />
                编辑链接
              </Button>
              <Button variant="outline" className="justify-start bg-transparent">
                <ToggleLeft className="h-4 w-4 mr-2" />
                暂停链接
              </Button>
              <Button
                variant="outline"
                className="justify-start text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除链接
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
