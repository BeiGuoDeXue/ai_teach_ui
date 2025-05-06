"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, RefreshCw, ChevronLeft, Info } from "lucide-react"
import Link from "next/link"

export default function CameraTestBasicPage() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [permissionState, setPermissionState] = useState<string>("unknown")

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // 添加日志
  const addLog = (message: string) => {
    console.log(message)
    setLogs((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]} - ${message}`])
  }

  // 检查摄像头权限
  const checkPermission = async () => {
    try {
      addLog("检查摄像头权限...")

      // 尝试使用permissions API
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({ name: "camera" as PermissionName })
          setPermissionState(result.state)
          addLog(`权限状态: ${result.state}`)

          if (result.state === "denied") {
            setError("摄像头权限被拒绝。请在浏览器设置中允许使用摄像头。")
            return false
          }

          return true
        } catch (err) {
          addLog(`权限API错误: ${err}`)
          // 某些浏览器不支持permissions API，继续尝试
        }
      } else {
        addLog("浏览器不支持permissions API")
      }

      // 直接尝试获取摄像头
      return true
    } catch (err) {
      addLog(`权限检查错误: ${err}`)
      return false
    }
  }

  // 启动摄像头 - 最简化版本
  const startCamera = async () => {
    try {
      setError(null)
      setIsLoading(true)
      addLog("开始启动摄像头...")

      // 检查浏览器支持
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("您的浏览器不支持摄像头功能")
      }

      // 检查权限
      await checkPermission()

      // 最简单的约束
      const constraints = { video: true }
      addLog(`请求摄像头，约束: ${JSON.stringify(constraints)}`)

      // 获取媒体流
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

      // 设置视频元素
      if (videoRef.current) {
        addLog("设置视频元素源")
        videoRef.current.srcObject = stream

        // 监听事件
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
                addLog(`视频播放失败: ${err.message}`)
                setError(`视频播放失败: ${err.message}`)
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
        addLog("视频元素未找到")
        setError("视频元素未找到")
        setIsLoading(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      addLog(`启动摄像头失败: ${errorMessage}`)
      setError(`启动摄像头失败: ${errorMessage}`)
      setIsLoading(false)
    }
  }

  // 停止摄像头
  const stopCamera = () => {
    addLog("停止摄像头")

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        addLog(`停止轨道: ${track.kind}`)
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
          <Link href="/ai-experience/ai-training" className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回AI训练页面
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">基础摄像头测试</CardTitle>
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
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />

                    {!isCameraActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                {isCameraActive ? (
                  <Button variant="outline" onClick={stopCamera}>
                    停止摄像头
                  </Button>
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
              <div className="max-h-40 overflow-y-auto text-xs font-mono bg-black text-green-400 p-2 rounded">
                <div>摄像头状态: {isCameraActive ? "已启动" : "未启动"}</div>
                <div>加载状态: {isLoading ? "加载中" : "已完成"}</div>
                <div>视频元素: {videoRef.current ? "已创建" : "未创建"}</div>
                <div>权限状态: {permissionState}</div>
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
                {logs.map((log, index) => (
                  <div key={index} className="whitespace-normal break-words">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* 浏览器信息 */}
            <div className="mt-6 border rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">浏览器信息</h3>
              <div className="text-xs font-mono bg-black text-green-400 p-2 rounded">
                <div>用户代理: {navigator.userAgent}</div>
                <div>
                  浏览器支持摄像头API: {navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? "是" : "否"}
                </div>
                <div>浏览器支持权限API: {navigator.permissions && navigator.permissions.query ? "是" : "否"}</div>
                <div>是否安全上下文: {window.isSecureContext ? "是" : "否"}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t">
            <div className="text-sm text-gray-500">
              <p>
                此页面使用最简单的摄像头实现，并提供详细的调试信息。如果此页面无法正常工作，请检查浏览器设置和权限。
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
