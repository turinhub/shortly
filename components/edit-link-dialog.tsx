'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Pencil, X, Loader2 } from 'lucide-react'
import { updateLinkAction } from '@/lib/actions'
import { toast } from 'sonner'

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

interface EditLinkDialogProps {
  link: LinkWithStats
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: () => void
}

export function EditLinkDialog({ link, open, onOpenChange, onUpdate }: EditLinkDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    long_link: link.long_link,
    title: link.title || '',
    description: link.description || '',
    tags: link.tags || [],
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    setFormData({
      long_link: link.long_link,
      title: link.title || '',
      description: link.description || '',
      tags: link.tags || [],
    })
  }, [link])

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
      const result = await updateLinkAction(link.id, {
        long_link: formData.long_link,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
      })

      if (result.success) {
        toast.success('链接已更新')
        onOpenChange(false)
        onUpdate?.()
      } else {
        toast.error(result.error || '更新失败')
      }
    } catch (error) {
      toast.error('更新失败，请稍后重试')
      console.error('Failed to update link:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Pencil className="h-4 w-4 text-primary" />
            </div>
            编辑链接
          </DialogTitle>
          <DialogDescription>更新链接的标题、描述和标签</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-long-link" className="text-sm font-medium">
              原始链接 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-long-link"
              type="url"
              placeholder="https://example.com/your-long-url"
              value={formData.long_link}
              onChange={(e) => setFormData((prev) => ({ ...prev, long_link: e.target.value }))}
              required
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-title" className="text-sm font-medium">
              链接标题
            </Label>
            <Input
              id="edit-title"
              type="text"
              placeholder="为您的链接添加一个描述性标题"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">可选，用于在列表中识别链接</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-description" className="text-sm font-medium">
              链接描述
            </Label>
            <Textarea
              id="edit-description"
              placeholder="添加关于此链接的详细描述..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-muted-foreground">可选，添加更多关于此链接的信息</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-tags" className="text-sm font-medium">
              标签
            </Label>
            <div className="flex gap-2">
              <Input
                id="edit-tags"
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

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                '保存更改'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
