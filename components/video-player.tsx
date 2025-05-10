"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useEffect, useRef } from "react"

interface VideoPlayerProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  title: string
}

// 简化的视频URL处理函数
const getVideoUrl = (videoPath: string) => {
  // 如果是完整URL（以http开头），直接返回
  if (videoPath.startsWith("http")) {
    return videoPath
  }

  // 如果以/开头，说明是从网站根目录开始的路径，直接返回
  if (videoPath.startsWith("/")) {
    return videoPath
  }

  // 否则，拼接到/videos/目录下
  return `/videos/${videoPath}`
}

export function VideoPlayer({ isOpen, onClose, videoUrl, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.focus()
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">关闭</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <video ref={videoRef} src={getVideoUrl(videoUrl)} className="w-full h-full" controls autoPlay />
        </div>
      </DialogContent>
    </Dialog>
  )
}
