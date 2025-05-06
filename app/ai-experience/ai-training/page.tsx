"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronLeft,
  Plus,
  Camera,
  Upload,
  Download,
  RefreshCw,
  Info,
  Settings,
  X,
  Edit2,
  MoreVertical,
  Check,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { TeachableMachineClassifier, createImageElement } from "@/utils/teachable-machine"

// 分类类型
interface Category {
  id: string
  name: string
  samples: string[]
  color: string
}

// 预测结果类型
interface Prediction {
  className: string
  probability: number
  color: string
}

// 定义一个持久化的日志函数
const usePersistentLog = () => {
  const [debugLog, setDebugLog] = useState<string[]>([])

  const addLog = useCallback(
    (message: string) => {
      console.log(message)
      setDebugLog((prev) => [...prev, `${new Date().toISOString().split("T")[1]}: ${message}`])
    },
    [setDebugLog],
  )

  return { debugLog, addLog }
}

export default function AITrainingPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "class1", name: "类别 1", samples: [], color: "blue" },
    { id: "class2", name: "类别 2", samples: [], color: "green" },
  ])
  const [activeTab, setActiveTab] = useState("collect")
  const [activeCategoryId, setActiveCategoryId] = useState("class1")
  const [isTraining, setIsTraining] = useState(false)
  const [isTrained, setIsTrained] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [currentEpoch, setCurrentEpoch] = useState(0)
  const [currentLoss, setCurrentLoss] = useState(0)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [testImage, setTestImage] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [tfReady, setTfReady] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)
  const [needsRetraining, setNeedsRetraining] = useState(false)
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const classifierRef = useRef<TeachableMachineClassifier | null>(null)
  const trainedCategoriesRef = useRef<string[]>([])

  // 使用持久化的日志函数
  const { debugLog, addLog } = usePersistentLog()

  // 获取当前活动的分类
  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0]

  // 组件挂载时
  useEffect(() => {
    addLog("组件已挂载")

    // 组件卸载时清理
    return () => {
      addLog("组件将卸载")
      stopCamera()
      // 释放分类器资源
      if (classifierRef.current) {
        classifierRef.current.dispose()
      }
    }
  }, [addLog])

  // 加载TensorFlow.js和初始化分类器
  useEffect(() => {
    const loadTensorFlow = async () => {
      try {
        setIsModelLoading(true)
        setError(null)
        setWarning(null)
        addLog("开始加载TensorFlow.js")

        // 动态导入TensorFlow.js
        const tf = await import("@tensorflow/tfjs")
        addLog(`TensorFlow.js 已加载, 版本: ${tf.version}`)

        // 确保TensorFlow.js已准备就绪
        await tf.ready()
        addLog("TensorFlow.js 已准备就绪")

        // 创建分类器实例
        const classifier = new TeachableMachineClassifier()
        addLog("创建分类器实例")

        try {
          await classifier.initialize()
          classifierRef.current = classifier
          setTfReady(true)
          addLog("分类器初始化成功")
          setWarning("注意：使用自定义CNN模型进行训练，而非预训练的MobileNet模型。训练可能需要更多样本和更长时间。")
        } catch (initErr) {
          addLog(`初始化分类器时出错: ${initErr instanceof Error ? initErr.message : String(initErr)}`)
          setError(
            `初始化分类器时出错: ${initErr instanceof Error ? initErr.message : String(initErr)}。请检查您的网络连接，或稍后再试。`,
          )
        }

        setIsModelLoading(false)
      } catch (err) {
        addLog(`加载TensorFlow.js时出错: ${err instanceof Error ? err.message : String(err)}`)
        setError(
          `加载TensorFlow.js时出错: ${err instanceof Error ? err.message : String(err)}。请确保您的浏览器支持WebGL和机器学习功能。`,
        )
        setIsModelLoading(false)
      }
    }

    loadTensorFlow()

    // 获取可用摄像头列表
    async function getCameras() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          addLog("您的浏览器不支持摄像头枚举功能")
          return
        }

        const devices = await navigator.mediaDevices.enumerateDevices()
        const cameras = devices.filter((device) => device.kind === "videoinput")
        setCameraList(cameras)

        if (cameras.length > 0) {
          setSelectedCamera(cameras[0].deviceId)
          addLog(`检测到 ${cameras.length} 个摄像头设备`)
        } else {
          addLog("未检测到摄像头设备")
        }
      } catch (err) {
        addLog(`获取摄像头列表失败: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    getCameras()
  }, [addLog])

  // 监听分类变化，检查是否需要重新训练
  useEffect(() => {
    if (isTrained) {
      // 获取当前所有分类名称
      const currentCategoryNames = categories.map((c) => c.name)

      // 检查是否有新的分类或分类名称变更
      const hasNewCategories = currentCategoryNames.some((name) => !trainedCategoriesRef.current.includes(name))

      if (hasNewCategories) {
        setNeedsRetraining(true)
      }
    }
  }, [categories, isTrained])

  // 添加新分类
  const addCategory = () => {
    const newId = `class${categories.length + 1}`
    const colors = ["blue", "green", "purple", "amber", "rose", "indigo", "teal", "orange"]
    const newColor = colors[categories.length % colors.length]

    const newCategory: Category = {
      id: newId,
      name: `类别 ${categories.length + 1}`,
      samples: [],
      color: newColor,
    }

    setCategories([...categories, newCategory])
    setActiveCategoryId(newId)

    // 如果已经训练过模型，标记需要重新训练
    if (isTrained) {
      setNeedsRetraining(true)
    }
  }

  // 删除分类
  const deleteCategory = (id: string) => {
    if (categories.length <= 2) {
      setError("至少需要保留两个分类")
      return
    }

    const updatedCategories = categories.filter((c) => c.id !== id)
    setCategories(updatedCategories)

    // 如果删除的是当前活动的分类，则切换到第一个分类
    if (id === activeCategoryId) {
      setActiveCategoryId(updatedCategories[0].id)
    }

    // 如果已经训练过模型，标记需要重新训练
    if (isTrained) {
      setNeedsRetraining(true)
    }
  }

  // 开始编辑分类名称
  const startEditingCategory = (id: string, name: string) => {
    setEditingCategoryId(id)
    setNewCategoryName(name)
  }

  // 保存分类名称
  const saveCategory = () => {
    if (!editingCategoryId) return

    const updatedCategories = categories.map((c) =>
      c.id === editingCategoryId ? { ...c, name: newCategoryName || c.name } : c,
    )

    setCategories(updatedCategories)
    setEditingCategoryId(null)
    setNewCategoryName("")

    // 如果已经训练过模型，标记需要重新训练
    if (isTrained) {
      setNeedsRetraining(true)
    }
  }

  // 取消编辑分类名称
  const cancelEditingCategory = () => {
    setEditingCategoryId(null)
    setNewCategoryName("")
  }

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        const dataUrl = reader.result.toString()
        addSample(dataUrl)
      }
    }
    reader.onerror = () => {
      setError("读取文件失败")
    }
    reader.readAsDataURL(file)
  }

  // 触发文件选择
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // 启动摄像头 - 从image-classification页面复制的代码
  async function startCamera() {
    try {
      addLog("======= startCamera START =======")
      setError(null)
      setIsLoading(true)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("您的浏览器不支持摄像头功能")
      }

      // 确保视频元素存在
      if (!videoRef.current) {
        addLog("视频元素未找到，等待DOM渲染...")
        // 等待一小段时间，让DOM完全渲染
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (!videoRef.current) {
          throw new Error("视频元素未找到，请刷新页面重试")
        }
      }

      addLog(`视频元素已找到，ID: ${videoRef.current.id}`)

      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      }

      addLog(`请求摄像头访问，约束: ${JSON.stringify(constraints)}`)
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
        addLog("找到视频元素，设置视频源")
        videoRef.current.srcObject = stream

        // 确保视频元素可见
        videoRef.current.style.display = "block"

        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            addLog("视频元数据已加载")
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
                addLog(`播放视频失败: ${err instanceof Error ? err.message : String(err)}`)
                setError("播放视频失败")
                setIsLoading(false)
              })
          }
        }

        // 添加错误处理
        videoRef.current.onerror = (event) => {
          addLog(`视频元素错误: ${event}`)
          setError("视频元素错误")
          setIsLoading(false)
        }
      } else {
        addLog("视频元素仍未找到")
        throw new Error("视频元素未找到")
      }
      addLog("======= startCamera END =======")
    } catch (err) {
      addLog(`启动摄像头失败: ${err instanceof Error ? err.message : String(err)}`)
      setError(`启动摄像头失败: ${err instanceof Error ? err.message : String(err)}`)
      setIsLoading(false)
    }
  }

  // 停止摄像头
  function stopCamera() {
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
  function captureImage() {
    addLog("======= captureImage START =======")
    addLog(`Video ref: ${videoRef.current ? "available" : "not available"}`)
    addLog(`Canvas ref: ${canvasRef.current ? "available" : "not available"}`)
    addLog(`Camera active: ${isCameraActive}`)

    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      addLog("Camera prerequisites not met")
      setError("摄像头未启动")
      return
    }

    try {
      addLog("Getting DOM elements")
      const video = videoRef.current
      const canvas = canvasRef.current

      addLog("Getting canvas 2D context")
      const context = canvas.getContext("2d")

      if (!context) {
        addLog("Failed to get canvas context")
        setError("无法获取canvas上下文")
        return
      }

      // 设置canvas尺寸与视频相同
      const videoWidth = video.videoWidth || 640
      const videoHeight = video.videoHeight || 480
      addLog(`Video dimensions: ${videoWidth} x ${videoHeight}`)

      addLog("Setting canvas dimensions to match video")
      canvas.width = videoWidth
      canvas.height = videoHeight

      // 在canvas上绘制当前视频帧
      addLog("Drawing video frame to canvas")
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // 将canvas内容转换为数据URL
      addLog("Converting canvas to data URL")
      try {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8) // Use 80% quality to reduce size
        addLog(`Data URL created, length: ${dataUrl.length}`)

        // 添加样本
        addSample(dataUrl)
      } catch (canvasErr) {
        addLog(
          `Error creating data URL from canvas: ${canvasErr instanceof Error ? canvasErr.message : String(canvasErr)}`,
        )
        throw new Error("无法从摄像头获取图像")
      }

      addLog("======= captureImage END =======")
    } catch (err) {
      addLog("======= captureImage ERROR =======")
      addLog(`Error capturing image: ${err instanceof Error ? err.message : String(err)}`)
      setError(`截取图像失败: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // 添加样本
  const addSample = (imageUrl: string) => {
    const updatedCategories = categories.map((c) => {
      if (c.id === activeCategoryId) {
        return {
          ...c,
          samples: [...c.samples, imageUrl],
        }
      }
      return c
    })

    setCategories(updatedCategories)

    // 如果已经训练过模型，标记需要重新训练
    if (isTrained) {
      setNeedsRetraining(true)
    }
  }

  // 删除样本
  const deleteSample = (categoryId: string, index: number) => {
    const updatedCategories = categories.map((c) => {
      if (c.id === categoryId) {
        const updatedSamples = [...c.samples]
        updatedSamples.splice(index, 1)
        return {
          ...c,
          samples: updatedSamples,
        }
      }
      return c
    })

    setCategories(updatedCategories)

    // 如果已经训练过模型，标记需要重新训练
    if (isTrained) {
      setNeedsRetraining(true)
    }
  }

  // 训练模型
  const trainModel = async () => {
    // 检查是否有足够的样本
    const hasEnoughSamples = categories.every((c) => c.samples.length >= 2)

    if (!hasEnoughSamples) {
      setError("每个分类至少需要2个样本")
      return
    }

    if (!classifierRef.current || !classifierRef.current.isReady()) {
      setError("分类器尚未准备好")
      return
    }

    try {
      setIsTraining(true)
      setTrainingProgress(0)
      setCurrentEpoch(0)
      setCurrentLoss(0)
      setError(null)

      // 准备训练数据
      const trainingSamples = []

      // 为每个分类的每个样本创建图像元素
      for (const category of categories) {
        for (const sampleUrl of category.samples) {
          try {
            const img = await createImageElement(sampleUrl)
            trainingSamples.push({
              image: img,
              label: category.name,
            })
          } catch (err) {
            console.error("加载样本图像失败:", err)
            // 继续处理其他样本
          }
        }
      }

      if (trainingSamples.length === 0) {
        throw new Error("没有有效的训练样本")
      }

      // 训练模型
      await classifierRef.current.train(trainingSamples, (epoch, loss) => {
        // 更新训练进度
        const progress = Math.round(((epoch + 1) / 50) * 100) // 假设总共50个epochs
        setTrainingProgress(progress)
        setCurrentEpoch(epoch + 1)
        setCurrentLoss(loss)
      })

      // 保存已训练的分类名称
      trainedCategoriesRef.current = categories.map((c) => c.name)

      setIsTrained(true)
      setNeedsRetraining(false)
      setActiveTab("test")
    } catch (err) {
      console.error("训练模型时出错:", err)
      setError(`训练模型时出错: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsTraining(false)
      setTrainingProgress(100)
    }
  }

  // 测试模型
  const testModel = async (imageUrl: string) => {
    if (!classifierRef.current || !isTrained) {
      setError("模型尚未训练")
      return
    }

    try {
      setIsLoading(true)
      setPredictions([])
      setError(null)

      // 加载测试图像
      const img = await createImageElement(imageUrl)

      // 进行预测
      const results = await classifierRef.current.predict(img)

      // 将预测结果与分类颜色匹配
      const coloredResults = results.map((result) => {
        const category = categories.find((c) => c.name === result.className)
        return {
          ...result,
          color: category?.color || "gray",
        }
      })

      setPredictions(coloredResults)
    } catch (err) {
      console.error("测试模型时出错:", err)
      setError(`测试模型时出错: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 导出模型
  const exportModel = async () => {
    if (!classifierRef.current || !isTrained) {
      setError("模型尚未训练")
      return
    }

    try {
      await classifierRef.current.saveModel()
    } catch (err) {
      console.error("导出模型时出错:", err)
      setError(`导出模型时出错: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // 处理标签切换
  const handleTabChange = (value: string) => {
    // 如果需要重新训练，不允许切换到测试标签页
    if (value === "test" && needsRetraining) {
      setError("您已修改了分类或样本，请先重新训练模型")
      return
    }

    // 记录当前标签页
    const previousTab = activeTab
    setActiveTab(value)

    // 如果从收集样本切换到训练标签页，停止摄像头
    if (previousTab === "collect" && value === "train" && isCameraActive) {
      stopCamera()
    }

    // 重置测试图像和预测结果
    if (value === "test") {
      setTestImage(null)
      setPredictions([])
    }
  }

  // 上传测试图像
  const handleTestImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        const dataUrl = reader.result.toString()
        setTestImage(dataUrl)
        testModel(dataUrl)
      }
    }
    reader.onerror = () => {
      setError("读取文件失败")
    }
    reader.readAsDataURL(file)
  }

  // 拍摄测试图像
  const captureTestImage = () => {
    addLog("尝试拍摄测试图像")

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
      addLog(`成功捕获测试图像，数据URL长度: ${dataUrl.length}`)

      setTestImage(dataUrl)
      testModel(dataUrl)
    } catch (err) {
      addLog(`截取测试图像失败: ${err instanceof Error ? err.message : String(err)}`)
      setError(`截取测试图像失败: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/ai-experience" className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回AI体验中心
          </Link>
        </div>

        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl text-blue-800">AI训练</CardTitle>
                  <p className="text-sm text-blue-700 mt-1">收集样本、训练模型、测试效果</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={isTrained ? "default" : "outline"} className={isTrained ? "bg-green-500" : ""}>
                  {isTrained ? "已训练" : "未训练"}
                </Badge>
                {needsRetraining && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    需要重新训练
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {isModelLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">正在加载TensorFlow.js...</h3>
                <p className="text-gray-500 max-w-md text-center">首次加载可能需要一些时间，请耐心等待</p>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>出错了</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <>
                {warning && (
                  <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">注意</AlertTitle>
                    <AlertDescription className="text-amber-700">{warning}</AlertDescription>
                  </Alert>
                )}

                {needsRetraining && isTrained && (
                  <Alert className="mb-6 bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">需要重新训练</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      您已修改了分类或样本，需要重新训练模型才能识别新的类别。
                      <Button onClick={trainModel} className="mt-2 bg-blue-600 hover:bg-blue-700" disabled={isTraining}>
                        {isTraining ? "训练中..." : "重新训练模型"}
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="collect">1. 收集样本</TabsTrigger>
                    <TabsTrigger value="train" disabled={categories.some((c) => c.samples.length < 2)}>
                      2. 训练模型
                    </TabsTrigger>
                    <TabsTrigger value="test" disabled={!isTrained || needsRetraining}>
                      3. 测试模型
                    </TabsTrigger>
                  </TabsList>

                  {/* 收集样本标签页 */}
                  <TabsContent value="collect" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* 左侧分类列表 */}
                      <div className="md:col-span-1">
                        <div className="bg-gray-50 border rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-4">分类列表</h3>
                          <div className="space-y-3 mb-4">
                            {categories.map((category) => (
                              <div
                                key={category.id}
                                className={cn(
                                  "p-3 rounded-lg cursor-pointer border-2 flex justify-between items-center",
                                  activeCategoryId === category.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-transparent hover:bg-gray-100",
                                )}
                                onClick={() => setActiveCategoryId(category.id)}
                              >
                                {editingCategoryId === category.id ? (
                                  <div className="flex-1 flex items-center">
                                    <Input
                                      value={newCategoryName}
                                      onChange={(e) => setNewCategoryName(e.target.value)}
                                      className="mr-2"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") saveCategory()
                                        if (e.key === "Escape") cancelEditingCategory()
                                      }}
                                    />
                                    <Button size="sm" variant="ghost" onClick={saveCategory}>
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={cancelEditingCategory}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center">
                                      <div
                                        className={cn(
                                          "w-4 h-4 rounded-full mr-2",
                                          category.color === "blue"
                                            ? "bg-blue-500"
                                            : category.color === "green"
                                              ? "bg-green-500"
                                              : category.color === "purple"
                                                ? "bg-purple-500"
                                                : category.color === "amber"
                                                  ? "bg-amber-500"
                                                  : "bg-gray-500",
                                        )}
                                      ></div>
                                      <span className="font-medium">{category.name}</span>
                                      <Badge className="ml-2 bg-gray-200 text-gray-700">
                                        {category.samples.length}
                                      </Badge>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            startEditingCategory(category.id, category.name)
                                          }}
                                        >
                                          <Edit2 className="h-4 w-4 mr-2" />
                                          编辑
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            deleteCategory(category.id)
                                          }}
                                          disabled={categories.length <= 2}
                                        >
                                          <X className="h-4 w-4 mr-2" />
                                          删除
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center"
                            onClick={addCategory}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            添加分类
                          </Button>
                        </div>
                      </div>

                      {/* 右侧样本收集区域 */}
                      <div className="md:col-span-2">
                        <div className="bg-white border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">
                              收集样本: <span className="text-blue-600">{activeCategory.name}</span>
                            </h3>
                            <Badge variant="outline">{activeCategory.samples.length} 个样本</Badge>
                          </div>

                          <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-4">添加图片样本:</p>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                className="flex-1 flex items-center justify-center"
                                onClick={startCamera}
                                disabled={isCameraActive || isLoading}
                              >
                                {isLoading ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    启动中...
                                  </>
                                ) : (
                                  <>
                                    <Camera className="h-4 w-4 mr-2" />
                                    摄像头
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 flex items-center justify-center"
                                onClick={triggerFileInput}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                上传
                              </Button>
                              <Link href="/ai-experience/image-classification" passHref>
                                <Button variant="outline" className="flex-1 flex items-center justify-center">
                                  <Settings className="h-4 w-4 mr-2" />
                                  摄像头测试
                                </Button>
                              </Link>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                              />
                            </div>
                          </div>

                          {/* 摄像头预览 */}
                          <div className="mb-6">
                            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                              {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <RefreshCw className="h-8 w-8 text-white animate-spin" />
                                </div>
                              ) : null}

                              {/* 始终渲染视频元素，但在未激活时隐藏 */}
                              <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                style={{ display: isCameraActive ? "block" : "none" }}
                                autoPlay
                                playsInline
                                muted
                              />
                              <canvas ref={canvasRef} className="hidden" />

                              {/* 添加调试信息覆盖层 */}
                              {isCameraActive && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs">
                                  {videoRef.current
                                    ? `视频尺寸: ${videoRef.current.videoWidth || 0}x${videoRef.current.videoHeight || 0} | 就绪状态: ${videoRef.current.readyState}`
                                    : "视频元素未初始化"}
                                </div>
                              )}
                            </div>
                            <div className="flex justify-center space-x-4">
                              {isCameraActive ? (
                                <>
                                  <Button onClick={captureImage} className="bg-blue-600 hover:bg-blue-700">
                                    拍照并添加
                                  </Button>
                                  <Button variant="outline" onClick={stopCamera}>
                                    关闭摄像头
                                  </Button>
                                </>
                              ) : (
                                <div className="text-center py-4 text-gray-500">
                                  {isLoading ? "正在启动摄像头..." : "摄像头未启动"}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 样本预览 */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">样本预览</h4>
                            {activeCategory.samples.length === 0 ? (
                              <div className="text-center py-8 text-gray-500 border rounded-lg">
                                <Info className="h-8 w-8 mx-auto mb-2" />
                                <p>尚未添加任何样本</p>
                                <p className="text-sm mt-1">每个分类至少需要2个样本才能训练模型</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {activeCategory.samples.map((sample, index) => (
                                  <div key={index} className="relative group">
                                    <div className="relative h-20 w-full rounded-md overflow-hidden border">
                                      <Image
                                        src={sample || "/placeholder.svg"}
                                        alt={`样本 ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => deleteSample(activeCategoryId, index)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 训练模型标签页 */}
                  <TabsContent value="train" className="mt-4">
                    <div className="bg-white border rounded-lg p-6">
                      <div className="text-center mb-8">
                        <h3 className="text-xl font-medium mb-2">训练自定义图像分类模型</h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                          使用您收集的样本训练一个自定义图像分类模型。训练完成后，您可以使用该模型对新图像进行分类。
                        </p>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-lg font-medium mb-4">训练数据概览</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium mb-2">分类数量</h5>
                            <div className="flex items-center">
                              <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
                              <div className="ml-2 text-gray-500">个分类</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium mb-2">样本总数</h5>
                            <div className="flex items-center">
                              <div className="text-3xl font-bold text-blue-600">
                                {categories.reduce((sum, c) => sum + c.samples.length, 0)}
                              </div>
                              <div className="ml-2 text-gray-500">个样本</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-lg font-medium mb-4">分类详情</h4>
                        <div className="space-y-4">
                          {categories.map((category) => (
                            <div key={category.id} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div
                                    className={cn(
                                      "w-4 h-4 rounded-full mr-2",
                                      category.color === "blue"
                                        ? "bg-blue-500"
                                        : category.color === "green"
                                          ? "bg-green-500"
                                          : category.color === "purple"
                                            ? "bg-purple-500"
                                            : category.color === "amber"
                                              ? "bg-amber-500"
                                              : "bg-gray-500",
                                    )}
                                  ></div>
                                  <span className="font-medium">{category.name}</span>
                                </div>
                                <Badge variant="outline">{category.samples.length} 个样本</Badge>
                              </div>
                              <div className="grid grid-cols-6 gap-1">
                                {category.samples.slice(0, 6).map((sample, index) => (
                                  <div key={index} className="relative h-10 w-full rounded-md overflow-hidden border">
                                    <Image
                                      src={sample || "/placeholder.svg"}
                                      alt={`样本 ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                                {category.samples.length > 6 && (
                                  <div className="relative h-10 w-full rounded-md overflow-hidden border bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs text-gray-600">+{category.samples.length - 6}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {isTraining ? (
                        <div className="text-center">
                          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">正在训练模型...</h3>
                          <div className="max-w-md mx-auto mb-2">
                            <Progress value={trainingProgress} className="h-2" />
                          </div>
                          <p className="text-gray-500">{trainingProgress}% 完成</p>
                          {currentEpoch > 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                              当前训练轮次: {currentEpoch}/50, 损失值: {currentLoss.toFixed(4)}
                            </p>
                          )}
                        </div>
                      ) : isTrained ? (
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <Check className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">模型训练完成！</h3>
                          <p className="text-gray-600 mb-4">您的自定义图像分类模型已经准备就绪，可以开始测试了。</p>
                          <div className="flex justify-center space-x-4">
                            <Button onClick={() => setActiveTab("test")} className="bg-blue-600 hover:bg-blue-700">
                              开始测试
                            </Button>
                            <Button variant="outline" onClick={exportModel}>
                              <Download className="h-4 w-4 mr-1" />
                              导出模型
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Button
                            onClick={trainModel}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={categories.some((c) => c.samples.length < 2)}
                          >
                            开始训练
                          </Button>
                          {categories.some((c) => c.samples.length < 2) && (
                            <p className="text-sm text-amber-600 mt-2">每个分类至少需要2个样本才能训练模型</p>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* 测试模型标签页 */}
                  <TabsContent value="test" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 左侧测试区域 */}
                      <div>
                        <div className="bg-white border rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-4">测试模型</h3>

                          <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-4">选择测试图像:</p>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                className="flex-1 flex items-center justify-center"
                                onClick={startCamera}
                                disabled={isCameraActive || isLoading}
                              >
                                {isLoading ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    启动中...
                                  </>
                                ) : (
                                  <>
                                    <Camera className="h-4 w-4 mr-2" />
                                    摄像头
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 flex items-center justify-center"
                                onClick={() => {
                                  if (fileInputRef.current) {
                                    fileInputRef.current.click()
                                  }
                                }}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                上传
                              </Button>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleTestImageUpload}
                              />
                            </div>
                          </div>

                          {/* 摄像头预览 */}
                          <div className="mb-6" style={{ display: isCameraActive ? "block" : "none" }}>
                            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                              {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <RefreshCw className="h-8 w-8 text-white animate-spin" />
                                </div>
                              ) : null}

                              {/* 始终渲染视频元素，但在未激活时隐藏 */}
                              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                              <canvas ref={canvasRef} className="hidden" />

                              {/* 添加调试信息覆盖层 */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs">
                                {videoRef.current
                                  ? `视频尺寸: ${videoRef.current.videoWidth || 0}x${videoRef.current.videoHeight || 0} | 就绪状态: ${videoRef.current.readyState}`
                                  : "视频元素未初始化"}
                              </div>
                            </div>
                            <div className="flex justify-center space-x-4">
                              <Button onClick={captureTestImage} className="bg-blue-600 hover:bg-blue-700">
                                拍照并测试
                              </Button>
                              <Button variant="outline" onClick={stopCamera}>
                                关闭摄像头
                              </Button>
                            </div>
                          </div>

                          {/* 测试图像预览 */}
                          {testImage && !isCameraActive && (
                            <div className="mb-6">
                              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                                <Image
                                  src={testImage || "/placeholder.svg"}
                                  alt="Test"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex justify-center space-x-4">
                                <Button
                                  onClick={() => testModel(testImage)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      分析中...
                                    </>
                                  ) : (
                                    "重新分析"
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setTestImage(null)
                                    setPredictions([])
                                  }}
                                >
                                  清除图像
                                </Button>
                              </div>
                            </div>
                          )}

                          {!testImage && !isCameraActive && (
                            <div className="text-center py-8 text-gray-500 border rounded-lg">
                              <Info className="h-8 w-8 mx-auto mb-2" />
                              <p>请上传或拍摄一张图像进行测试</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 右侧结果区域 */}
                      <div>
                        <div className="bg-white border rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-4">分类结果</h3>

                          {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                              <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                              <h3 className="text-lg font-medium mb-2">正在分析图像...</h3>
                              <p className="text-gray-500 max-w-md text-center">请稍候</p>
                            </div>
                          ) : error ? (
                            <Alert variant="destructive" className="mb-6">
                              <Info className="h-4 w-4" />
                              <AlertTitle>出错了</AlertTitle>
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          ) : predictions.length > 0 ? (
                            <div className="space-y-3">
                              {predictions.map((prediction, index) => (
                                <div key={index} className="bg-white p-3 rounded-lg border">
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center">
                                      <Badge
                                        className={cn(
                                          "mr-2",
                                          prediction.color === "blue"
                                            ? "bg-blue-500"
                                            : prediction.color === "green"
                                              ? "bg-green-500"
                                              : prediction.color === "purple"
                                                ? "bg-purple-500"
                                                : prediction.color === "amber"
                                                  ? "bg-amber-500"
                                                  : "bg-gray-500",
                                        )}
                                      >
                                        {index + 1}
                                      </Badge>
                                      <span className="font-medium">{prediction.className}</span>
                                    </div>
                                    <span className="text-sm">{(prediction.probability * 100).toFixed(2)}%</span>
                                  </div>
                                  <Progress
                                    value={prediction.probability * 100}
                                    className={cn(
                                      "h-2",
                                      prediction.color === "blue"
                                        ? "bg-blue-100"
                                        : prediction.color === "green"
                                          ? "bg-green-100"
                                          : prediction.color === "purple"
                                            ? "bg-purple-100"
                                            : prediction.color === "amber"
                                              ? "bg-amber-100"
                                              : "bg-gray-100",
                                    )}
                                    indicatorClassName={
                                      prediction.color === "blue"
                                        ? "bg-blue-500"
                                        : prediction.color === "green"
                                          ? "bg-green-500"
                                          : prediction.color === "purple"
                                            ? "bg-purple-500"
                                            : prediction.color === "amber"
                                              ? "bg-amber-500"
                                              : "bg-gray-500"
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          ) : testImage ? (
                            <div className="text-center py-8 text-gray-500">
                              <Button
                                onClick={() => testModel(testImage)}
                                className="bg-blue-600 hover:bg-blue-700 mb-4"
                              >
                                分析图像
                              </Button>
                              <p>点击按钮开始分析图像</p>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Info className="h-8 w-8 mx-auto mb-2" />
                              <p>请先上传或拍摄一张图像</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}

            {/* 调试信息 */}
            <div className="mt-6 border rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">调试信息</h3>
              <div className="max-h-60 overflow-y-auto text-xs font-mono bg-black text-green-400 p-2 rounded">
                <div>摄像头状态: {isCameraActive ? "已启动" : "未启动"}</div>
                <div>加载状态: {isLoading ? "加载中" : "已完成"}</div>
                <div>视频元素: {videoRef.current ? "已找到" : "未找到"}</div>
                <div>错误信息: {error || "无"}</div>
                <div className="mt-2 pt-2 border-t border-gray-700">日志:</div>
                {debugLog.slice(-20).map((log, index) => (
                  <div key={index} className="whitespace-normal break-words">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 border-t p-4">
            <div className="text-sm text-gray-500 w-full">
              <p>提示：AI训练功能允许您创建自己的图像分类模型，可用于识别特定物体、场景或内容。</p>
            </div>
          </CardFooter>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">收集样本</p>
                  <p className="text-sm text-gray-500">
                    创建分类并为每个分类收集图像样本。每个分类至少需要2个样本才能训练模型。
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">训练模型</p>
                  <p className="text-sm text-gray-500">
                    使用收集的样本训练自定义图像分类模型。训练过程可能需要一些时间，请耐心等待。
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-medium text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">测试模型</p>
                  <p className="text-sm text-gray-500">
                    上传或拍摄新图像来测试您的模型。系统将显示分类结果及其置信度。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
