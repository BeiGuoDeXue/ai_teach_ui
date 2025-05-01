"use client"

import { useRouter } from "next/navigation"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Code, Sparkles, FileText, ImageIcon, Bot, Braces } from "lucide-react"

export default function ToolsPage() {
  const router = useRouter()

  const tools = [
    {
      title: "AI代码助手",
      description: "使用积木式编程，轻松创建AI应用",
      icon: <Code className="h-8 w-8 text-amber-500" />,
      link: "/ai-code-assistant", // 更新为新的路由
      color: "bg-gradient-to-br from-amber-50 to-amber-100",
      buttonColor: "text-amber-600 hover:text-amber-700",
      new: true,
    },
    {
      title: "智能PPT生成",
      description: "只需输入主题和关键内容，AI即可自动生成专业PPT",
      icon: <Sparkles className="h-8 w-8 text-rose-500" />,
      link: "/tools/ppt-generator",
      color: "bg-gradient-to-br from-rose-50 to-rose-100",
      buttonColor: "text-rose-600 hover:text-rose-700",
      new: false,
    },
    {
      title: "智能文案生成",
      description: "快速生成各类营销、教育文案，提高内容创作效率",
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      link: "/tools/content-generator",
      color: "bg-gradient-to-br from-blue-50 to-blue-100",
      buttonColor: "text-blue-600 hover:text-blue-700",
      new: false,
    },
    {
      title: "智能图像生成",
      description: "通过文本描述生成各种风格的图像",
      icon: <ImageIcon className="h-8 w-8 text-purple-500" />,
      link: "/tools/image-generator",
      color: "bg-gradient-to-br from-purple-50 to-purple-100",
      buttonColor: "text-purple-600 hover:text-purple-700",
      new: false,
    },
    {
      title: "AI对话助手",
      description: "智能对话助手，回答问题、提供建议",
      icon: <Bot className="h-8 w-8 text-green-500" />,
      link: "/ai-experience",
      color: "bg-gradient-to-br from-green-50 to-green-100",
      buttonColor: "text-green-600 hover:text-green-700",
      new: false,
    },
    {
      title: "代码转换工具",
      description: "在不同编程语言之间转换代码",
      icon: <Braces className="h-8 w-8 text-indigo-500" />,
      link: "/tools/code-converter",
      color: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      buttonColor: "text-indigo-600 hover:text-indigo-700",
      new: false,
    },
  ]

  const handleToolClick = (path: string) => {
    router.push(path)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 工具集</h1>
          <p className="text-gray-600">探索我们的智能工具，提升您的工作效率</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-md transition-shadow border-2 border-gray-100 cursor-pointer"
              onClick={() => handleToolClick(tool.link)}
            >
              <CardHeader className={`${tool.color} p-6`}>
                <div className="flex justify-between items-center">
                  <div className="p-3 bg-white rounded-lg shadow-sm">{tool.icon}</div>
                  {tool.new && <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">新功能</span>}
                </div>
                <CardTitle className="mt-4">{tool.title}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
              </CardHeader>
              <CardFooter className="bg-white p-4 border-t">
                <Button variant="ghost" className={`w-full justify-between ${tool.buttonColor}`}>
                  开始使用
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
