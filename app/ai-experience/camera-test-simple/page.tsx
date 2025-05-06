"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, RefreshCw, ChevronLeft, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CameraTestSimplePage() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // 启动摄像头
  async function startCamera() {
    try {
      setError(null)
      setIsLoading(true)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("您的浏览器不支持摄像头功能")
      }

      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      }

      console.log("尝试启动摄像头，约束:", constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // 确保视频元素正确加载
        return new Promise<void>((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                videoRef.current
                  .play()
                  .then(() => {
                    setIsCameraActive(true)
                    setIsLoading(false)
                    console.log("摄像头启动成功")
                    resolve()
                  })
                  .catch((err) => {
                    console.error("播放视频失败:", err)
                    setError(`播放视频失败: ${err instanceof Error ? err.message : String(err)}`)
                    setIsLoading(false)
                    reject(err)
                  })
              }
            }

            // 添加错误处理
            videoRef.current.onerror = (e) => {
              console.error("视频元素错误:", e)
              setError(`视频元素错误: ${e}`)
              setIsLoading(false)
              reject(e)
            }
          }
        })
      }
    } catch (err) {
      console.error("启动摄像头失败:", err)
      setError(`启动摄像头失败: ${err instanceof Error ? err.message : String(err)}`)
      setIsLoading(false)
    }
  }

  // 停止摄像头
  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsCameraActive(false)
  }

  // 拍照
  function captureImage() {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      setError("摄像头未启动")
      return
    }

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (!context) {
        setError("无法获取canvas上下文")
        return
      }

      // 设置canvas尺寸与视频相同
      const videoWidth = video.videoWidth || 640
      const videoHeight = video.videoHeight || 480

      canvas.width = videoWidth
      canvas.height = videoHeight

      // 在canvas上绘制当前视频帧
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // 将canvas内容转换为数据URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
      setSelectedImage(dataUrl)
    } catch (err) {
      console.error("截取图像失败:", err)
      setError(`截取图像失败: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // 重置状态
  function resetState() {
    setSelectedImage(null)
    setError(null)

    if (!isCameraActive) {
      startCamera()
    }
  }

  // 组件卸载时停止摄像头
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/ai-experience/ai-training" className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回AI训练页面
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">简化版摄像头测试</CardTitle>
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

                    {!isCameraActive && selectedImage ? (
                      <Image src={selectedImage || "/placeholder.svg"} alt="Captured" fill className="object-contain" />
                    ) : (
                      !isCameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Camera className="h-12 w-12 text-gray-400" />
                        </div>
                      )
                    )}
                  </>
                )}
                <canvas ref={canvasRef} className="hidden" />
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

                {selectedImage && (
                  <Button variant="outline" onClick={resetState}>
                    重新拍摄
                  </Button>
                )}
              </div>
            </div>

            {/* 调试信息 */}
            <div className="mt-6 border rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">调试信息</h3>
              <div className="max-h-40 overflow-y-auto text-xs font-mono bg-black text-green-400 p-2 rounded">
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
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t">
            <div className="text-sm text-gray-500">
              <p>
                此页面使用与图像分类相同的摄像头实现方式。如果此页面能正常显示摄像头画面，但原页面不行，请检查原页面的视频元素样式和属性。
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
