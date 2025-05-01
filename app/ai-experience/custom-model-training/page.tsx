"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Plus, Camera, Upload, Play, Download, RefreshCw, Info, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

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

export default function CustomModelTrainingPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "class1", name: "分类1", samples: [], color: "blue" },
    { id: "class2", name: "分类2", samples: [], color: "green" },
  ])
  const [activeTab, setActiveTab] = useState("collect")
  const [activeCategoryId, setActiveCategoryId] = useState("class1")
  const [isTraining, setIsTraining] = useState(false)
  const [isTrained, setIsTrained] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [testImage, setTestImage] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const modelRef = useRef<any>(null)

  // 获取当前活动的分类
  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0]

  // 添加新分类
  const addCategory = () => {
    const newId = `class${categories.length + 1}`
    const colors = ["blue", "green", "purple", "amber", "rose", "indigo", "teal", "orange"]
    const newColor = colors[categories.length % colors.length]

    const newCategory: Category = {
      id: newId,
      name: `分类${categories.length + 1}`,
      samples: [],
      color: newColor,
    }

    setCategories([...categories, newCategory])
    setActiveCategoryId(newId)
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

        // 根据当前标签页决定是添加样本还是测试图像
        if (activeTab === "collect") {
          addSample(dataUrl)
        } else if (activeTab === "test") {
          setTestImage(dataUrl)
          if (isTrained) {
            testModel(dataUrl)
          }
        }
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

  // 启动摄像头
  const startCamera = async () => {
    try {
      setError(null)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("您的浏览器不支持摄像头功能")
      }

      const constraints = {
        video: {
          facingMode: "environment", // 优先使用后置摄像头
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // 确保视频元素正确加载
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                setIsCameraActive(true)
                console.log("Camera started successfully")
              })
              .catch((err) => {
                console.error("Error playing video:", err)
                setError(`播放视频失败: ${err instanceof Error ? err.message : String(err)}`)
              })
          }
        }
      }
    } catch (err) {
      console.error("Error starting camera:", err)
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

      // 根据当前标签页决定是添加样本还是测试图像
      if (activeTab === "collect") {
        addSample(dataUrl)
      } else if (activeTab === "test") {
        setTestImage(dataUrl)
        if (isTrained) {
          testModel(dataUrl)
        }
      }
    } catch (err) {
      console.error("Error capturing image:", err)
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
  }

  // 训练模型
  const trainModel = async () => {
    // 检查是否有足够的样本
    const hasEnoughSamples = categories.every((c) => c.samples.length >= 2)

    if (!hasEnoughSamples) {
      setError("每个分类至少需要2个样本")
      return
    }

    try {
      setIsTraining(true)
      setTrainingProgress(0)
      setError(null)

      // 模拟训练过程
      for (let i = 0; i <= 100; i += 10) {
        setTrainingProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      // 模拟训练完成
      modelRef.current = {
        trained: true,
        categories: categories.map((c) => ({ id: c.id, name: c.name, color: c.color })),
      }

      setIsTrained(true)
      setActiveTab("test")
    } catch (err) {
      console.error("Error training model:", err)
      setError(`训练模型时出错: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsTraining(false)
      setTrainingProgress(100)
    }
  }

  // 测试模型
  const testModel = async (imageUrl: string) => {
    if (!modelRef.current?.trained) {
      setError("模型尚未训练")
      return
    }

    try {
      setIsLoading(true)
      setPredictions([])
      setError(null)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟预测结果
      const results: Prediction[] = []

      // 为每个类别生成一个随机概率
      const totalProb = 0
      const rawProbs = categories.map(() => Math.random())
      const sumProbs = rawProbs.reduce((a, b) => a + b, 0)

      // 归一化概率，使它们的总和为1
      const normalizedProbs = rawProbs.map((p) => p / sumProbs)

      // 创建预测结果
      categories.forEach((category, index) => {
        results.push({
          className: category.name,
          probability: normalizedProbs[index],
          color: category.color,
        })
      })

      // 排序并设置结果
      const sortedResults = results.sort((a, b) => b.probability - a.probability)
      setPredictions(sortedResults)
    } catch (err) {
      console.error("Error testing model:", err)
      setError(`测试模型时出错: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 导出模型
  const exportModel = () => {
    if (!modelRef.current?.trained) {
      setError("模型尚未训练")
      return
    }

    // 创建一个模拟的模型数据
    const modelData = {
      name: "自定义图像分类模型",
      version: "1.0.0",
      date: new Date().toISOString(),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        sampleCount: c.samples.length,
      })),
      metadata: {
        framework: "TensorFlow.js",
        type: "image-classification",
      },
    }

    // 将模型数据转换为JSON字符串
    const modelJson = JSON.stringify(modelData, null, 2)

    // 创建一个Blob对象
    const blob = new Blob([modelJson], { type: "application/json" })

    // 创建一个下载链接
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "custom-image-model.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 处理标签切换
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // 如果切换到测试标签页，停止摄像头
    if (value !== "collect" && isCameraActive) {
      stopCamera()
    }

    // 重置测试图像和预测结果
    if (value === "test") {
      setTestImage(null)
      setPredictions([])
    }
  }

  // 清理函数
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

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
                  <CardTitle className="text-xl text-blue-800">自定义模型训练</CardTitle>
                  <p className="text-sm text-blue-700 mt-1">收集样本、训练模型、测试效果</p>
                </div>
              </div>
              <Badge variant={isTrained ? "default" : "outline"} className={isTrained ? "bg-green-500" : ""}>
                {isTrained ? "已训练" : "未训练"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="collect">1. 收集样本</TabsTrigger>
                <TabsTrigger value="train" disabled={categories.some((c) => c.samples.length < 2)}>
                  2. 训练模型
                </TabsTrigger>
                <TabsTrigger value="test" disabled={!isTrained}>
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
                                  保存
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEditingCategory}>
                                  取消
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
                                  <Badge className="ml-2 bg-gray-200 text-gray-700">{category.samples.length}</Badge>
                                </div>
                                <div className="flex items-center">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      startEditingCategory(category.id, category.name)
                                    }}
                                  >
                                    编辑
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteCategory(category.id)
                                    }}
                                    disabled={categories.length <= 2}
                                  >
                                    删除
                                  </Button>
                                </div>
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
                        <Tabs defaultValue="upload" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upload">上传图片</TabsTrigger>
                            <TabsTrigger value="camera">使用摄像头</TabsTrigger>
                          </TabsList>

                          <TabsContent value="upload" className="mt-4">
                            <div
                              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 transition-colors"
                              onClick={triggerFileInput}
                            >
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                              />
                              <Upload className="h-12 w-12 text-gray-400 mb-4" />
                              <h3 className="text-lg font-medium mb-2">点击上传图片</h3>
                              <p className="text-gray-500 text-center max-w-md">支持JPG、PNG格式，图片大小不超过5MB</p>
                            </div>
                          </TabsContent>

                          <TabsContent value="camera" className="mt-4">
                            <div className="border-2 rounded-lg p-4 bg-gray-50">
                              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                                {isCameraActive ? (
                                  <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    playsInline
                                    muted
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Camera className="h-12 w-12 text-gray-400" />
                                  </div>
                                )}
                                <canvas ref={canvasRef} className="hidden" />
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
                                  <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                                    启动摄像头
                                  </Button>
                                )}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
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
                    </div>
                  ) : isTrained ? (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <Play className="h-8 w-8 text-green-600" />
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
                        <Tabs defaultValue="upload" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upload">上传图片</TabsTrigger>
                            <TabsTrigger value="camera">使用摄像头</TabsTrigger>
                          </TabsList>

                          <TabsContent value="upload" className="mt-4">
                            <div
                              className={cn(
                                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 transition-colors",
                                testImage ? "border-blue-200 bg-blue-50" : "border-gray-200",
                              )}
                              onClick={triggerFileInput}
                            >
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                              />

                              {testImage ? (
                                <div className="w-full flex flex-col items-center">
                                  <div className="relative w-full max-w-md h-64 mb-4">
                                    <Image
                                      src={testImage || "/placeholder.svg"}
                                      alt="Test"
                                      fill
                                      className="object-contain rounded-lg"
                                    />
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setTestImage(null)
                                      setPredictions([])
                                    }}
                                  >
                                    选择其他图片
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                  <h3 className="text-lg font-medium mb-2">点击上传测试图片</h3>
                                  <p className="text-gray-500 text-center max-w-md">上传一张新图片来测试您的模型</p>
                                </>
                              )}
                            </div>
                          </TabsContent>

                          <TabsContent value="camera" className="mt-4">
                            <div className="border-2 rounded-lg p-4 bg-gray-50">
                              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                                {isCameraActive ? (
                                  <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    playsInline
                                    muted
                                  />
                                ) : testImage ? (
                                  <Image
                                    src={testImage || "/placeholder.svg"}
                                    alt="Captured"
                                    fill
                                    className="object-contain"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Camera className="h-12 w-12 text-gray-400" />
                                  </div>
                                )}
                                <canvas ref={canvasRef} className="hidden" />
                              </div>

                              <div className="flex justify-center space-x-4">
                                {isCameraActive ? (
                                  <>
                                    <Button onClick={captureImage} className="bg-blue-600 hover:bg-blue-700">
                                      拍照并测试
                                    </Button>
                                    <Button variant="outline" onClick={stopCamera}>
                                      关闭摄像头
                                    </Button>
                                  </>
                                ) : (
                                  <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                                    启动摄像头
                                  </Button>
                                )}

                                {testImage && !isCameraActive && (
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setTestImage(null)
                                      setPredictions([])
                                    }}
                                  >
                                    清除图像
                                  </Button>
                                )}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
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
                                      index === 0
                                        ? "bg-blue-500"
                                        : index === 1
                                          ? "bg-green-500"
                                          : index === 2
                                            ? "bg-purple-500"
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
                                  index === 0
                                    ? "bg-blue-100"
                                    : index === 1
                                      ? "bg-green-100"
                                      : index === 2
                                        ? "bg-purple-100"
                                        : "bg-gray-100",
                                )}
                                indicatorClassName={
                                  index === 0
                                    ? "bg-blue-500"
                                    : index === 1
                                      ? "bg-green-500"
                                      : index === 2
                                        ? "bg-purple-500"
                                        : "bg-gray-500"
                                }
                              />
                            </div>
                          ))}
                        </div>
                      ) : testImage ? (
                        <div className="text-center py-8 text-gray-500">
                          <Button onClick={() => testModel(testImage)} className="bg-blue-600 hover:bg-blue-700 mb-4">
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
          </CardContent>

          <CardFooter className="bg-gray-50 border-t p-4">
            <div className="text-sm text-gray-500 w-full">
              <p>提示：自定义模型训练功能允许您创建自己的图像分类模型，可用于识别特定物体、场景或内容。</p>
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
