"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title: string
}

// 简化的PDF URL处理函数
const getPdfUrl = (pdfPath: string) => {
  // 如果是完整URL（以http开头），直接返回
  if (pdfPath.startsWith("http")) {
    return pdfPath
  }

  // 如果以/开头，说明是从网站根目录开始的路径，直接返回
  if (pdfPath.startsWith("/")) {
    return pdfPath
  }

  // 否则，拼接到根目录下
  return `/${pdfPath}`
}

export function PDFViewer({ isOpen, onClose, pdfUrl, title }: PDFViewerProps) {
  const fullPdfUrl = getPdfUrl(pdfUrl)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{title}</span>
            <a href={fullPdfUrl} download className="flex items-center text-sm text-blue-600 hover:text-blue-800">
              <Download className="h-4 w-4 mr-1" />
              下载PDF
            </a>
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">关闭</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="h-[70vh] w-full">
          <iframe src={`${fullPdfUrl}#toolbar=0`} className="w-full h-full border-0" title={title} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
