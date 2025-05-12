"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function ReadingsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">AI读本</h1>
          <p className="text-gray-600 mt-2">探索我们的AI教育读本，提升您的AI知识</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI基础知识读本</CardTitle>
              <CardDescription>人工智能入门必读</CardDescription>
            </CardHeader>
            <CardContent>
              <p>介绍人工智能的基本概念、发展历史和应用领域，适合AI初学者阅读。</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContactAgent} className="w-full">
                联系代理商开通
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI教育应用读本</CardTitle>
              <CardDescription>AI在教育领域的应用</CardDescription>
            </CardHeader>
            <CardContent>
              <p>探讨AI在教育领域的应用案例、实施方法和未来趋势，适合教育工作者阅读。</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContactAgent} className="w-full">
                联系代理商开通
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI伦理与安全读本</CardTitle>
              <CardDescription>AI发展中的伦理考量</CardDescription>
            </CardHeader>
            <CardContent>
              <p>讨论AI发展中的伦理问题、安全挑战和监管框架，培养负责任的AI意识。</p>
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
