'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { deleteLinkAction } from '@/lib/actions'
import { toast } from 'sonner'

interface LinkWithStats {
  id: string
  title: string | null
}

interface DeleteLinkDialogProps {
  link: LinkWithStats
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteLinkDialog({ link, open, onOpenChange, onSuccess }: DeleteLinkDialogProps) {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Determine the text the user needs to type
  // If title exists, use title. Otherwise use 'delete'.
  const targetText = link.title || 'delete'

  useEffect(() => {
    if (open) {
      setConfirmText('')
    }
  }, [open])

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()

    if (confirmText !== targetText) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteLinkAction(link.id)
      if (result.success) {
        toast.success('链接已删除')
        onOpenChange(false)
        router.refresh()
        // 触发自定义事件通知 LinksTable 和其他组件刷新
        window.dispatchEvent(new CustomEvent('links-updated'))
        onSuccess?.()
      } else {
        toast.error(result.error || '删除失败')
      }
    } catch (error) {
      console.error('Failed to delete link:', error)
      toast.error('删除失败')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除链接</DialogTitle>
          <DialogDescription>
            此操作无法撤销。这将永久删除该链接及其所有相关数据。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleDelete} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-text">
              请输入 <span className="font-bold text-destructive">{targetText}</span> 以确认删除
            </Label>
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={targetText}
              autoComplete="off"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
            >
              取消
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={confirmText !== targetText || isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              删除
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
