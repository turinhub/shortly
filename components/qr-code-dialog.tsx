'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import QRCode from 'qrcode'

interface LinkData {
  short_link: string
  title: string | null
}

interface QRCodeDialogProps {
  link: LinkData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QRCodeDialog({ link, open, onOpenChange }: QRCodeDialogProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (open && link.short_link) {
      setGenerating(true)
      let fullUrl = link.short_link
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = fullUrl.includes('localhost') || fullUrl.includes('127.0.0.1')
          ? `http://${fullUrl}`
          : `https://${fullUrl}`
      }
      
      QRCode.toDataURL(fullUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => {
          setQrDataUrl(url)
          setGenerating(false)
        })
        .catch((err) => {
          console.error('Failed to generate QR code', err)
          toast.error('二维码生成失败')
          setGenerating(false)
        })
    } else {
      setQrDataUrl(null)
    }
  }, [open, link.short_link])

  const copyImageToClipboard = async () => {
    if (!qrDataUrl) return

    try {
      const response = await fetch(qrDataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ])
      toast.success('二维码图片已复制')
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to copy image:', err)
      toast.error('复制失败，请尝试手动复制')
    }
  }

  const downloadImage = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `qrcode-${link.short_link.split('/').pop()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('二维码已开始下载')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>二维码分享</DialogTitle>
          <DialogDescription>{link.title || link.short_link}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 gap-6">
          <div className="relative flex items-center justify-center w-[200px] h-[200px] bg-white rounded-lg border shadow-sm overflow-hidden">
            {generating ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
            ) : null}
          </div>

          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={copyImageToClipboard}
              disabled={!qrDataUrl || generating}
            >
              <Copy className="h-4 w-4 mr-2" />
              复制图片
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={downloadImage}
              disabled={!qrDataUrl || generating}
            >
              <Download className="h-4 w-4 mr-2" />
              下载
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
