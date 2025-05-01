"use client"

import { useState, useEffect } from "react"
import { Search, ChevronRight, Bot, ImageIcon, FileText, Mic, Brain, Info, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

// 导入聊天组件
import AIChat from "@/components/ai-chat"

// AI体验模块数据
const aiModules = [
  {
    id: "chat",
    title: "AI对话助手",
    description: "与AI助手进行自然语言对话，获取信息、解答问题、创作内容",
    icon: <Bot className="h-6 w-6" />,
    category: "语言",
    tags: ["对话", "问答", "创作"],
    featured: true,
    new: false,
  },
  {
    id: "image-classification",
    title: "图像分类",
    description: "上传图片或使用摄像头，AI将��别图像中的物体、场景或内容",
    icon: <ImageIcon className="h-6 w-6" />,
    category: "视觉",
    tags: ["图像识别", "物体检测"],
    featured: true,
    new: true,
  },
  {
    id: "text-classification",
    title: "文本分类",
    description: "分析文本的情感倾向、主题类别或语言风格",
    icon: <FileText className="h-6 w-6" />,
    category: "语言",
    tags: ["情感分析", "主题分类"],
    featured: false,
    new: false,
  },
  {
    id: "pose-detection",
    title: "姿态识别",
    description: "通过摄像头实时检测和分析人体姿态，识别动作和姿势",
    icon: <Brain className="h-6 w-6" />,
    category: "视觉",
    tags: ["人体姿态", "动作识别"],
    featured: false,
    new: true,
  },
  {
    id: "speech-recognition",
    title: "语音识别",
    description: "将语音转换为文本，支持多种语言和方言",
    icon: <Mic className="h-6 w-6" />,
    category: "语音",
    tags: ["语音转文本", "声音分析"],
    featured: true,
    new: false,
  },
]

// 分类数据
const categories = [
  { id: "all", name: "全部" },
  { id: "language", name: "语言" },
  { id: "vision", name: "视觉" },
  { id: "audio", name: "语音" },
]

export default function AIExperiencePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredModules, setFilteredModules] = useState(aiModules)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const router = useRouter()

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // 过滤模块
  useEffect(() => {
    let result = aiModules

    // 搜索过滤
    if (searchTerm) {
      result = result.filter(
        (module) =>
          module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // 分类过滤
    if (selectedCategory !== "all") {
      const categoryMap: { [key: string]: string } = {
        language: "语言",
        vision: "视觉",
        audio: "语音",
      }
      result = result.filter((module) => module.category === categoryMap[selectedCategory])
    }

    setFilteredModules(result)
  }, [searchTerm, selectedCategory])

  // 选择模块
  const handleSelectModule = (moduleId: string) => {
    // 如果是图像分类模块，导航到图像分类页面
    if (moduleId === "image-classification") {
      router.push("/ai-experience/image-classification")
      return
    }

    // 如果是文本分类模块，导航到文本分类页面
    if (moduleId === "text-classification") {
      router.push("/ai-experience/text-classification")
      return
    }

    setSelectedModule(moduleId)
    // 在移动设备上，滚动到顶部
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // 获取当前选中的模块
  const getCurrentModule = () => {
    return selectedModule ? aiModules.find((m) => m.id === selectedModule) : null
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-8">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI 体验中心</h1>
          <p className="text-gray-600 mt-2">探索和体验各种人工智能技术，感受AI的魅力</p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 左侧模块列表 - 在移动设备上，如果选择了模块则隐藏 */}
          <div className={cn("md:col-span-1", isMobile && selectedModule ? "hidden" : "block")}>
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>AI 功能</CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {filteredModules.length} 个模块
                  </Badge>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="搜索AI功能..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <div className="px-6 pb-2">
                <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="grid grid-cols-4 mb-2">
                    {categories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id}>
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-350px)] md:h-[calc(100vh-300px)]">
                  <div className="px-6 py-2 space-y-2">
                    {filteredModules.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">未找到匹配的AI功能</div>
                    ) : (
                      filteredModules.map((module) => (
                        <div
                          key={module.id}
                          className={cn(
                            "p-4 rounded-lg cursor-pointer transition-colors",
                            selectedModule === module.id
                              ? "bg-blue-50 border border-blue-200"
                              : "hover:bg-gray-50 border border-transparent",
                          )}
                          onClick={() => handleSelectModule(module.id)}
                        >
                          <div className="flex items-start">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0",
                                module.id === "chat"
                                  ? "bg-blue-100 text-blue-600"
                                  : module.id === "image-classification"
                                    ? "bg-green-100 text-green-600"
                                    : module.id === "text-classification"
                                      ? "bg-purple-100 text-purple-600"
                                      : module.id === "pose-detection"
                                        ? "bg-amber-100 text-amber-600"
                                        : "bg-rose-100 text-rose-600",
                              )}
                            >
                              {module.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-900">{module.title}</h3>
                                {module.new && (
                                  <Badge className="ml-2 bg-green-500 hover:bg-green-600 text-white">新</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{module.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {module.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* 右侧内容区域 - 在移动设备上，如果没有选择模块则隐藏 */}
          <div
            className={cn(
              "md:col-span-2",
              isMobile && !selectedModule ? "hidden" : "block",
              "transition-all duration-300",
            )}
          >
            {selectedModule ? (
              <div className="h-full">
                {/* 移动设备上的返回按钮 */}
                {isMobile && (
                  <Button variant="ghost" className="mb-4" onClick={() => setSelectedModule(null)}>
                    <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                    返回列表
                  </Button>
                )}

                {/* 模块内容 */}
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center mr-3",
                          selectedModule === "chat"
                            ? "bg-blue-100 text-blue-600"
                            : selectedModule === "image-classification"
                              ? "bg-green-100 text-green-600"
                              : selectedModule === "text-classification"
                                ? "bg-purple-100 text-purple-600"
                                : selectedModule === "pose-detection"
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-rose-100 text-rose-600",
                        )}
                      >
                        {getCurrentModule()?.icon}
                      </div>
                      <div>
                        <CardTitle>{getCurrentModule()?.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{getCurrentModule()?.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-6">
                    {/* 根据选择的模块显示不同内容 */}
                    {selectedModule === "chat" ? (
                      <AIChat />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-blue-50 p-4 rounded-full mb-4">
                          <Info className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">即将推出</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                          {getCurrentModule()?.title}功能正在开发中，敬请期待！
                        </p>
                        <Button onClick={() => handleSelectModule("chat")}>
                          先体验AI对话 <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="bg-blue-50 p-6 rounded-full inline-block mb-4">
                    <Bot className="h-12 w-12 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">选择一个AI功能开始体验</h2>
                  <p className="text-gray-500 mb-6">从左侧列表中选择一个AI功能，开始探索人工智能的魅力</p>
                  <Button onClick={() => handleSelectModule("chat")}>
                    体验AI对话 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 推荐模块 */}
        <div className={cn(isMobile && selectedModule ? "hidden" : "block")}>
          <h2 className="text-xl font-bold mb-4">推荐体验</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {aiModules
              .filter((module) => module.featured)
              .map((module) => (
                <Card
                  key={module.id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelectModule(module.id)}
                >
                  <div
                    className={cn(
                      "h-2",
                      module.id === "chat"
                        ? "bg-blue-500"
                        : module.id === "image-classification"
                          ? "bg-green-500"
                          : module.id === "text-classification"
                            ? "bg-purple-500"
                            : module.id === "pose-detection"
                              ? "bg-amber-500"
                              : "bg-rose-500",
                    )}
                  ></div>
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0",
                          module.id === "chat"
                            ? "bg-blue-100 text-blue-600"
                            : module.id === "image-classification"
                              ? "bg-green-100 text-green-600"
                              : module.id === "text-classification"
                                ? "bg-purple-100 text-purple-600"
                                : module.id === "pose-detection"
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-rose-100 text-rose-600",
                        )}
                      >
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{module.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{module.description}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" className="w-full justify-between">
                      开始体验 <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
