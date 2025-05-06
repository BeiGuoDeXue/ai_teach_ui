"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, X, Info } from "lucide-react"
import Link from "next/link"

export default function CameraTestPage() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraInfo, setCameraInfo] = useState<string>("")
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // 获取可用摄像头列表
  useEffect(() => {
    async function getCameras() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          setCameraInfo("您的浏览器不支持摄像头枚举功能")
          return
        }

        const devices = await navigator.mediaDevices.enumerateDevices()
        const cameras = devices.filter((device) => device.kind === "videoinput")
        setCameraList(cameras)

        if (cameras.length > 0) {
          setSelectedCamera(cameras[0].deviceId)
          setCameraInfo(`检测到 ${cameras.length} 个摄像头设备`)
        } else {
          setCameraInfo("未检测到摄像头设备")
        }
      } catch (err) {
        console.error("获取摄像头列表失败:", err)
        setCameraInfo(`获取摄像头列表失败: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    getCameras()
  }, [])

  // 启动摄像头
  const startCamera = async () => {
    try {
      setError(null)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("您的浏览器不支持摄像头功能")
      }

      // 停止任何现有的摄像头流
      stopCamera()

      const constraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          facingMode: "environment", // 优先使用后置摄像头
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      }

      console.log("尝试启动摄像头，约束:", constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                setIsCameraActive(true)
                console.log("摄像头启动成功")

                // 获取视频轨道信息
                const videoTrack = stream.getVideoTracks()[0]
                if (videoTrack) {
                  const settings = videoTrack.getSettings()
                  console.log("摄像头设置:", settings)
                  setCameraInfo(
                    `摄像头已启动: ${videoTrack.label || "未知设备"} (${settings.width}x${settings.height})`,
                  )
                }
              })
              .catch((err) => {
                console.error("播放视频失败:", err)
                setError(`播放视频失败: ${err instanceof Error ? err.message : String(err)}`)
              })
          }
        }
      }
    } catch (err) {
      console.error("启动摄像头失败:", err)
      setError(`启动摄像头失败: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // 停止摄像头
  const stopCamera = () => {
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
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      setError("摄像头未启动或未准备好")
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
      const dataUrl = canvas.toDataURL("image/jpeg")
      setCapturedImage(dataUrl)
    } catch (err) {
      console.error("截取图像失败:", err)
      setError(`截取图像失败: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // 清除捕获的图像
  const clearCapturedImage = () => {
    setCapturedImage(null)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/ai-experience/ai-training" className="text-blue-600 hover:text-blue-800">
            返回AI训练页面
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">摄像头测试</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>出错了</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{cameraInfo}</p>

              {cameraList.length > 0 && (
                <div className="mb-4">
                  <label htmlFor="camera-select" className="block text-sm font-medium text-gray-700 mb-1">
                    选择摄像头:
                  </label>
                  <select
                    id="camera-select"
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {cameraList.map((camera) => (
                      <option key={camera.deviceId} value={camera.deviceId}>
                        {camera.label || `摄像头 ${camera.deviceId.substring(0, 8)}...`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" className="flex items-center" onClick={startCamera} disabled={isCameraActive}>
                  <Camera className="h-4 w-4 mr-2" />
                  启动摄像头
                </Button>
                <Button variant="outline" className="flex items-center" onClick={stopCamera} disabled={!isCameraActive}>
                  <X className="h-4 w-4 mr-2" />
                  停止摄像头
                </Button>
              </div>
            </div>

            <div className="mt-6">
              {isCameraActive ? (
                <div>
                  <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                  </div>
                  <Button onClick={captureImage} className="bg-blue-600 hover:bg-blue-700">
                    拍照
                  </Button>
                </div>
              ) : (
                <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">摄像头未启动</p>
                </div>
              )}
            </div>

            {capturedImage && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">捕获的图像:</h3>
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Captured"
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button variant="outline" onClick={clearCapturedImage}>
                  清除图像
                </Button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
            {/* 调试信息 */}
            <div className="mt-6 border rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">调试信息</h3>
              <div className="max-h-40 overflow-y-auto text-xs font-mono bg-black text-green-400 p-2 rounded">
                <div>摄像头状态: {isCameraActive ? "已启动" : "未启动"}</div>
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
              <p>此页面用于测试摄像头功能。如果摄像头正常工作，您应该能够看到视频预览并拍照。</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
