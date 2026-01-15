"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Pencil, X } from "lucide-react"

interface EditLinkDialogProps {
  link: {
    id: string
    title: string
    description?: string
    tags?: string[]
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditLinkDialog({ link, open, onOpenChange }: EditLinkDialogProps) {
  const [formData, setFormData] = useState({
    title: link.title,
    description: link.description || "",
    tags: link.tags || [],
  })
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    setFormData({
      title: link.title,
      description: link.description || "",
      tags: link.tags || [],
    })
  }, [link])

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Updating link:", { id: link.id, ...formData })
    onOpenChange(false)
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
            <Label htmlFor="edit-title" className="text-sm font-medium">
              链接标题 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-title"
              type="text"
              placeholder="为您的链接添加一个描述性标题"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
              className="h-10"
            />
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
              <Button type="button" variant="outline" onClick={addTag} className="flex-shrink-0 bg-transparent">
                添加
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1 pl-2 pr-1">
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">保存更改</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
