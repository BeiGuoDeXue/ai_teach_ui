"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function DatasetsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">AI数据集</h1>
          <p className="text-gray-600 mt-2">探索我们的AI训练数据集，提升您的模型性能</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>图像分类数据集</CardTitle>
              <CardDescription>高质量标注的图像数据</CardDescription>
            </CardHeader>
            <CardContent>
              <p>包含多种类别的高质量图像数据，适用于图像分类模型训练。</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContactAgent} className="w-full">
                联系代理商开通
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>自然语言处理数据集</CardTitle>
              <CardDescription>多语言文本语料库</CardDescription>
            </CardHeader>
            <CardContent>
              <p>包含多种语言的文本数据，适用于NLP模型训练和微调。</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContactAgent} className="w-full">
                联系代理商开通
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>教育领域数据集</CardTitle>
              <CardDescription>专为教育AI应用设计</CardDescription>
            </CardHeader>
            <CardContent>
              <p>专为教育领域AI应用设计的数据集，包含学习行为、教学内容等数据。</p>
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
