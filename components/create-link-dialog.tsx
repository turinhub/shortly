'use client'

import type React from 'react'

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
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Link2, Sparkles, X, Loader2 } from 'lucide-react'
import { createAction } from '@/lib/actions'
import { toast } from 'sonner'

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    long_link: '',
    title: '',
    short_link: '',
    description: '',
    tags: [] as string[],
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const router = useRouter()
  const domain = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 's.zxd.ai'

  const generateShortCode = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const randomCode = Math.random().toString(36).substring(2, 8)
      setFormData((prev) => ({ ...prev, short_link: randomCode }))
      setIsGenerating(false)
    }, 300)
  }

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const userId = localStorage.getItem('userId') || process.env.NEXT_PUBLIC_DEFAULT_USER_ID || ''

      const result = await createAction({
        user_id: userId,
        long_link: formData.long_link,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        short_link: formData.short_link || undefined,
      })

      if (result.success) {
        toast.success('短链接创建成功！')
        setOpen(false)
        router.refresh()

        // 触发自定义事件通知 LinksTable 刷新
        window.dispatchEvent(new CustomEvent('links-updated'))

        setFormData({ long_link: '', title: '', short_link: '', description: '', tags: [] })
        setTagInput('')
      } else {
        toast.error(result.error || '创建失败')
      }
    } catch (error) {
      toast.error('创建失败，请稍后重试')
      console.error('Failed to create link:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          创建短链接
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Link2 className="h-4 w-4 text-primary" />
            </div>
            创建新的短链接
          </DialogTitle>
          <DialogDescription>输入您的长链接，我们将为您生成一个简短易记的短链接</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="long_link" className="text-sm font-medium">
              原始链接 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="long_link"
              type="url"
              placeholder="https://example.com/your-long-url"
              value={formData.long_link}
              onChange={(e) => setFormData((prev) => ({ ...prev, long_link: e.target.value }))}
              required
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">请输入完整的URL地址</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm font-medium">
              链接标题
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="为您的链接添加一个描述性标题"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">可选，用于在列表中识别链接</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              链接描述
            </Label>
            <Textarea
              id="description"
              placeholder="添加关于此链接的详细描述..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-muted-foreground">可选，添加更多关于此链接的信息</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tags" className="text-sm font-medium">
              标签
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                type="text"
                placeholder="输入标签后按 Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="h-10"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                className="flex-shrink-0 bg-transparent"
              >
                添加
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 pl-2 pr-1"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">添加标签以便更好地组织和搜索链接</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="short_link" className="text-sm font-medium">
              自定义短码
            </Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {domain}/
                </span>
                <Input
                  id="short_link"
                  type="text"
                  placeholder="abc123"
                  value={formData.short_link}
                  onChange={(e) => setFormData((prev) => ({ ...prev, short_link: e.target.value }))}
                  className="h-10 pl-[90px]"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateShortCode}
                disabled={isGenerating}
                className="flex-shrink-0 bg-transparent"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                生成
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">留空将自动生成随机短码</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              取消
            </Button>
            <Button type="submit" disabled={!formData.long_link || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  创建中...
                </>
              ) : (
                '创建短链接'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
