"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title: string
}

export function PDFViewer({ isOpen, onClose, pdfUrl, title }: PDFViewerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 处理PDF加载
  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      setError(null)

      // 检查PDF URL是否有效
      fetch(pdfUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`PDF加载失败: ${response.status} ${response.statusText}`)
          }
          setLoading(false)
        })
        .catch((err) => {
          console.error("PDF加载错误:", err)
          setError(`无法加载PDF文件: ${err.message}`)
          setLoading(false)
        })
    }
  }, [isOpen, pdfUrl])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 min-h-[70vh] bg-gray-100 rounded-md overflow-hidden">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p>PDF加载中...</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-red-500 p-4">
                <p className="font-bold mb-2">加载错误</p>
                <p>{error}</p>
                <p className="mt-4 text-sm text-gray-600">提示: 请确保PDF文件已正确上传到服务器的public/pdfs/目录中</p>
              </div>
            </div>
          ) : (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full border-0"
              title={title}
              onError={() => setError("PDF加载失败，请检查文件路径是否正确")}
            />
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>关闭</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
