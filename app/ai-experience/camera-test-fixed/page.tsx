"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Camera, RefreshCw, ChevronLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CameraTestFixedPage() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugLog, setDebugLog] = useState<string[]>([])
  const [videoReady, setVideoReady] = useState(false)

  // 创建refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // 添加日志函数
  const addLog = (message: string) => {
    const timestamp = new Date().toTimeString().split(" ")[0]
    console.log(`${timestamp}: ${message}`)
    setDebugLog((prev) => [...prev, `${timestamp}: ${message}`])
  }

  // 组件挂载时
  useEffect(() => {
    addLog("组件已挂载")

    // 检查视频元素是否已创建
    if (videoRef.current) {
      addLog("视频元素已创建")
      setVideoReady(true)
    } else {
      addLog("视频元素未创建")
    }

    // 组件卸载时清理
    return () => {
      addLog("组件将卸载")
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // 监听视频元素的创建
  useEffect(() => {
    if (videoRef.current && !videoReady) {
      addLog("视频元素已创建 (延迟检测)")
      setVideoReady(true)
    }
  }, [videoReady])

  // 启动摄像头
  const startCamera = async () => {
    try {
      addLog("开始启动摄像头...")
      setError(null)
      setIsLoading(true)

      // 检查视频元素
      if (!videoRef.current) {
        addLog("视频元素未找到，尝试等待...")

        // 等待短暂时间，让React有时间渲染DOM
        await new Promise((resolve) => setTimeout(resolve, 100))

        if (!videoRef.current) {
          addLog("视频元素仍未找到")
          setError("视频元素未找到，请刷新页面重试")
          setIsLoading(false)
          return
        }

        addLog("视频元素已找到 (延迟)")
      }

      // 检查浏览器支持
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        addLog("浏览器不支持摄像头功能")
        setError("您的浏览器不支持摄像头功能")
        setIsLoading(false)
        return
      }

      // 请求摄像头权限
      addLog("请求摄像头访问...")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })

      addLog("成功获取媒体流")
      streamRef.current = stream

      // 检查视频轨道
      const videoTracks = stream.getVideoTracks()
      addLog(`视频轨道数量: ${videoTracks.length}`)

      if (videoTracks.length > 0) {
        const settings = videoTracks[0].getSettings()
        addLog(`轨道设置: ${JSON.stringify(settings)}`)
      }

      // 确保视频元素存在
      if (videoRef.current) {
        addLog("设置视频元素源")

        // 直接设置srcObject
        try {
          videoRef.current.srcObject = stream
          addLog("成功设置视频源")
        } catch (err) {
          addLog(`设置视频源失败: ${err instanceof Error ? err.message : String(err)}`)
          throw new Error("设置视频源失败")
        }

        // 设置事件处理
        videoRef.current.onloadedmetadata = () => {
          addLog("视频元数据已加载")

          if (videoRef.current) {
            addLog(`视频尺寸: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`)
            addLog("尝试播放视频")

            videoRef.current
              .play()
              .then(() => {
                addLog("视频播放成功")
                setIsCameraActive(true)
                setIsLoading(false)
              })
              .catch((err) => {
                addLog(`视频播放失败: ${err instanceof Error ? err.message : String(err)}`)
                setError(`视频播放失败: ${err instanceof Error ? err.message : String(err)}`)
                setIsLoading(false)
              })
          }
        }

        videoRef.current.onerror = (e) => {
          addLog(`视频元素错误: ${e}`)
          setError(`视频元素错误: ${e}`)
          setIsLoading(false)
        }
      } else {
        addLog("视频元素仍然未找到 (设置源之前)")
        setError("视频元素未找到")
        setIsLoading(false)
      }
    } catch (err) {
      addLog(`启动摄像头失败: ${err instanceof Error ? err.message : String(err)}`)
      setError(`启动摄像头失败: ${err instanceof Error ? err.message : String(err)}`)
      setIsLoading(false)
    }
  }

  // 停止摄像头
  const stopCamera = () => {
    addLog("停止摄像头")

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
  }

  // 拍照
  const captureImage = () => {
    addLog("尝试拍照")

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
      addLog(`视频尺寸: ${videoWidth}x${videoHeight}`)

      canvas.width = videoWidth
      canvas.height = videoHeight

      // 在canvas上绘制当前视频帧
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // 将canvas内容转换为数据URL
      const dataUrl = canvas.toDataURL("image/jpeg")
      addLog(`成功捕获图像，数据URL长度: ${dataUrl.length}`)

      // 显示捕获的图像
      const img = document.createElement("img")
      img.src = dataUrl
      img.style.maxWidth = "100%"
      img.style.maxHeight = "200px"
      img.style.border = "1px solid #ccc"
      img.style.borderRadius = "4px"
      img.style.marginTop = "10px"

      const capturedImagesDiv = document.getElementById("captured-images")
      if (capturedImagesDiv) {
        capturedImagesDiv.appendChild(img)
        addLog("图像已添加到页面")
      }
    } catch (err) {
      addLog(`截取图像失败: ${err instanceof Error ? err.message : String(err)}`)
      setError(`截取图像失败: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

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
            <CardTitle className="text-xl">摄像头测试 (修复版)</CardTitle>
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
                    {/* 关键是这个视频元素 */}
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

              {/* 捕获的图像容器 */}
              <div id="captured-images" className="mt-4 flex flex-wrap gap-2"></div>
            </div>

            {/* 调试信息 */}
            <div className="mt-6 border rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">调试信息</h3>
              <div className="max-h-60 overflow-y-auto text-xs font-mono bg-black text-green-400 p-2 rounded">
                <div>摄像头状态: {isCameraActive ? "已启动" : "未启动"}</div>
                <div>加载状态: {isLoading ? "加载中" : "已完成"}</div>
                <div>视频元素: {videoRef.current ? "已创建" : "未创建"}</div>
                <div>视频就绪: {videoReady ? "是" : "否"}</div>
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
              <p>此页面使用了修复后的摄像头实现，添加了更多的错误检查和调试信息。</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
