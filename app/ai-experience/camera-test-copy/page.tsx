"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Camera, RefreshCw, ChevronLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// 定义一个持久化的日志函数
const usePersistentLog = () => {
  const [debugLog, setDebugLog] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(message)
    setDebugLog((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]}: ${message}`])
  }

  return { debugLog, addLog }
}

export default function CameraTestCopyPage() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // 使用持久化的日志函数
  const { debugLog, addLog } = usePersistentLog()

  // 启动摄像头 - 直接从图像分类页面复制
  async function startCamera() {
    try {
      addLog("======= startCamera START =======")
      setError(null)
      setIsLoading(true)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        addLog("浏览器不支持摄像头功能")
        throw new Error("您的浏览器不支持摄像头功能")
      }

      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      }

      addLog(`尝试启动摄像头，约束: ${JSON.stringify(constraints)}`)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      addLog("成功获取媒体流")

      // 检查视频轨道
      const videoTracks = stream.getVideoTracks()
      addLog(`视频轨道数量: ${videoTracks.length}`)
      if (videoTracks.length > 0) {
        const settings = videoTracks[0].getSettings()
        addLog(`轨道设置: ${JSON.stringify(settings)}`)
      }

      if (videoRef.current) {
        addLog("设置视频元素源")
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = () => {
          addLog("视频元数据已加载")
          if (videoRef.current) {
            addLog("尝试播放视频")
            videoRef.current
              .play()
              .then(() => {
                addLog("视频播放成功")
                setIsCameraActive(true)
                setIsLoading(false)
              })
              .catch((err) => {
                addLog(`播放视频失败: ${err instanceof Error ? err.message : String(err)}`)
                setError(`播放视频失败: ${err instanceof Error ? err.message : String(err)}`)
                setIsLoading(false)
              })
          }
        }
      } else {
        addLog("视频元素未找到")
        setError("视频元素未找到")
        setIsLoading(false)
      }

      addLog("======= startCamera END =======")
    } catch (err) {
      addLog("======= startCamera ERROR =======")
      addLog(`启动摄像头失败: ${err instanceof Error ? err.message : String(err)}`)
      setError(`启动摄像头失败: ${err instanceof Error ? err.message : String(err)}`)
      setIsLoading(false)
    }
  }

  // 停止摄像头
  function stopCamera() {
    addLog("======= stopCamera START =======")

    if (streamRef.current) {
      addLog("停止媒体流轨道")
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })
      streamRef.current = null
    }

    if (videoRef.current) {
      addLog("清除视频元素源")
      videoRef.current.srcObject = null
    }

    setIsCameraActive(false)
    addLog("摄像头已停止")
    addLog("======= stopCamera END =======")
  }

  // 拍照
  function captureImage() {
    addLog("======= captureImage START =======")

    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      addLog("摄像头未启动或未准备好")
      setError("摄像头未启动或未准备好")
      return
    }

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (!context) {
        addLog("无法获取canvas上下文")
        setError("无法获取canvas上下文")
        return
      }

      // 设置canvas尺寸与视频相同
      const videoWidth = video.videoWidth || 640
      const videoHeight = video.videoHeight || 480
      addLog(`视频尺寸: ${videoWidth} x ${videoHeight}`)

      canvas.width = videoWidth
      canvas.height = videoHeight

      // 在canvas上绘制当前视频帧
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // 将canvas内容转换为数据URL
      const dataUrl = canvas.toDataURL("image/jpeg")
      addLog(`成功捕获图像，数据URL长度: ${dataUrl.length}`)

      addLog("======= captureImage END =======")
    } catch (err) {
      addLog("======= captureImage ERROR =======")
      addLog(`截取图像失败: ${err instanceof Error ? err.message : String(err)}`)
      setError(`截取图像失败: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // 组件卸载时停止摄像头
  useEffect(() => {
    addLog("组件已挂载")

    return () => {
      addLog("组件将卸载")
      stopCamera()
    }
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/ai-experience" className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回AI体验中心
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">摄像头测试 (复制版)</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>出错了</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="border-2 rounded-lg p-4 bg-gray-50">
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-white animate-spin" />
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                      style={{ display: isCameraActive ? "block" : "none" }}
                    />

                    {!isCameraActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />

                    {/* 调试信息覆盖层 */}
                    {isCameraActive && videoRef.current && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs">
                        视频尺寸: {videoRef.current.videoWidth || 0}x{videoRef.current.videoHeight || 0} | 就绪状态:{" "}
                        {videoRef.current.readyState} | 暂停状态: {videoRef.current.paused ? "已暂停" : "播放中"}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                {isCameraActive ? (
                  <>
                    <Button onClick={captureImage} className="bg-green-600 hover:bg-green-700">
                      拍照
                    </Button>
                    <Button variant="outline" onClick={stopCamera}>
                      停止摄像头
                    </Button>
                  </>
                ) : (
                  <Button onClick={startCamera} className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? "正在启动..." : "启动摄像头"}
                  </Button>
                )}
              </div>
            </div>

            {/* 调试信息 */}
            <div className="mt-6 border rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">调试信息</h3>
              <div className="max-h-60 overflow-y-auto text-xs font-mono bg-black text-green-400 p-2 rounded">
                <div>摄像头状态: {isCameraActive ? "已启动" : "未启动"}</div>
                <div>加载状态: {isLoading ? "加载中" : "已完成"}</div>
                <div>视频元素: {videoRef.current ? "已创建" : "未创建"}</div>
                {videoRef.current && (
                  <>
                    <div>视频宽度: {videoRef.current.videoWidth || "未知"}</div>
                    <div>视频高度: {videoRef.current.videoHeight || "未知"}</div>
                    <div>视频就绪状态: {videoRef.current.readyState}</div>
                    <div>视频暂停状态: {videoRef.current.paused ? "已暂停" : "播放中"}</div>
                  </>
                )}
                <div>错误信息: {error || "无"}</div>
                <div className="mt-2 pt-2 border-t border-gray-700">日志:</div>
                {debugLog.map((log, index) => (
                  <div key={index} className="whitespace-normal break-words">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t">
            <div className="text-sm text-gray-500">
              <p>此页面直接复制了图像分类页面的摄像头实现，用于测试摄像头功能。</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
