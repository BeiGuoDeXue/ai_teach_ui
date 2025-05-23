"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function ToolsPage() {
  const { toast } = useToast()

  const handleContactAgent = () => {
    toast({
      title: "功能未开通",
      description: "请联系代理商开通此功能",
      variant: "default",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI工具</h1>
          <p className="text-gray-600 mt-2">探索我们的AI工具集，提升您的工作效率</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI文本生成工具</CardTitle>
              <CardDescription>快速生成高质量文本内容</CardDescription>
            </CardHeader>
            <CardContent>
              <p>使用先进的AI模型生成各类文本内容，包括文章、报告、广告文案等。</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContactAgent} className="w-full">
                联系代理商开通
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI图像处理工具</CardTitle>
              <CardDescription>智能图像编辑与生成</CardDescription>
            </CardHeader>
            <CardContent>
              <p>使用AI技术进行图像处理、编辑和生成，提升视觉内容创作效率。</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContactAgent} className="w-full">
                联系代理商开通
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI数据分析工具</CardTitle>
              <CardDescription>智能数据处理与可视化</CardDescription>
            </CardHeader>
            <CardContent>
              <p>利用AI技术快速分析数据，生成洞察报告和可视化图表。</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContactAgent} className="w-full">
                联系代理商开通
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
