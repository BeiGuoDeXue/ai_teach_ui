"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function ActivitiesPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">AI活动</h1>
          <p className="text-gray-600 mt-2">参与我们的AI教育活动，拓展您的AI视野</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI创新大赛</CardTitle>
              <CardDescription>展示您的AI创新能力</CardDescription>
            </CardHeader>
            <CardContent>
              <p>参与我们的AI创新大赛，展示您的创意和技术能力，赢取丰厚奖品。</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContactAgent} className="w-full">
                联系代理商开通
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI教育论坛</CardTitle>
              <CardDescription>探讨AI教育的未来</CardDescription>
            </CardHeader>
            <CardContent>
              <p>参与我们的AI教育论坛，与专家学者交流，探讨AI教育的发展趋势和挑战。</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContactAgent} className="w-full">
                联系代理商开通
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI夏令营</CardTitle>
              <CardDescription>沉浸式AI学习体验</CardDescription>
            </CardHeader>
            <CardContent>
              <p>参加我们的AI夏令营，通过沉浸式学习体验，掌握AI技能，结交志同道合的朋友。</p>
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
