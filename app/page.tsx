"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Globe,
  Brain,
  Cpu,
  Code,
  BotIcon as Robot,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Globe2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏 */}
      <header className="border-b sticky top-0 z-50 bg-white">
        <div className="bg-gray-900 text-white py-1">
          <div className="container mx-auto px-4 flex justify-end text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1 text-blue-400" />
                <span>400-1014-137</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1 text-blue-400" />
                <span>support@veeknexus.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%85%AC%E5%8F%B8%E6%A0%87%E9%A2%98-VMjnw7th193vuQnDCNLxHBOA3TCKLh.png"
                alt="Veek Nexus"
                width={240}
                height={70}
                className="h-14 w-auto"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-amber-600">
              首页
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-amber-600">
              课程
            </Link>
            <Link href="/projects" className="text-gray-700 hover:text-amber-600">
              项目
            </Link>
            <Link href="/tools" className="text-gray-700 hover:text-amber-600">
              工具
            </Link>
            <Link href="/datasets" className="text-gray-700 hover:text-amber-600">
              数据集
            </Link>
            <Link href="/ai-experience" className="text-gray-700 hover:text-amber-600">
              AI 体验
            </Link>
            <Link href="/ai-code-assistant" className="text-gray-700 hover:text-amber-600">
              AI 代码助手
            </Link>
            <Link href="/reading" className="text-gray-700 hover:text-amber-600">
              读本
            </Link>
            <Link href="/activities" className="text-gray-700 hover:text-amber-600">
              活动
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="rounded-full px-6 border-amber-600 text-amber-600 hover:bg-amber-50">
              注册
            </Button>
            <Button className="rounded-full px-6 bg-amber-600 hover:bg-amber-700">登录</Button>
          </div>
        </div>
      </header>

      {/* 英雄区域 - 使用深色背景和科技感设计，参考宣传册 */}
      <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,150,255,0.1),transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(0,150,255,0.1),transparent_40%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-6">
                <span className="text-white">打造</span>
                <span className="text-amber-400">AI教育创新</span>
                <span className="text-white">平台</span>
              </h1>
              <div className="bg-gray-800/50 inline-block px-8 py-4 rounded-lg border border-blue-500/30 backdrop-blur-sm mb-6">
                <p className="text-xl">维客未来，让AI教育触手可及</p>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white rounded-md">
                  开始体验
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-gray-800 rounded-md"
                >
                  了解更多
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-gray-800 rounded-full flex items-center justify-center">
                  <Globe className="w-40 h-40 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 服务板块 - 基于宣传册内容 */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">我们的服务</h2>
            <p className="text-gray-600 mt-2">专业AI教育解决方案提供商</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 服务01 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-teal-500 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                    <span className="text-teal-600 font-bold">01</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">智能AI-AIGC工具集成</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  提供智能PPT生成、智能文案生成、智能图像生成等AIGC工具，满足教育场景下的创作需求。
                </p>
                <div className="flex items-center text-teal-600">
                  <span className="text-sm font-medium">了解更多</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>

            {/* 服务02 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">02</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">AI应用能力训练</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  提供Word提示工程、PPT生成、Excel数据分析等AI应用能力训练，帮助用户掌握AI工具使用技巧。
                </p>
                <div className="flex items-center text-purple-600">
                  <span className="text-sm font-medium">了解更多</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>

            {/* 服务03 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-amber-500 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <span className="text-amber-600 font-bold">03</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">AI教育课程体系</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  从基础AI概念到高级应用，提供完整的AI教育课程体系，包括Python编程、机器学习、深度学习等。
                </p>
                <div className="flex items-center text-amber-600">
                  <span className="text-sm font-medium">了解更多</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 特色工坊 */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">特色工坊</h2>
            <p className="text-gray-600 mt-2">探索AI教育的多种可能性</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-200 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Python工坊</h3>
              <p className="text-sm text-gray-600">掌握AI开发的基础编程技能</p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-teal-200 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">人工智能工坊</h3>
              <p className="text-sm text-gray-600">探索AI模型训练与应用</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-200 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">创意积木工坊</h3>
              <p className="text-sm text-gray-600">通过积木式编程学习AI应用</p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-xl flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-rose-200 rounded-xl flex items-center justify-center mb-4">
                <Cpu className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">硬件工坊</h3>
              <p className="text-sm text-gray-600">结合硬件设备实现AI应用</p>
            </div>
          </div>
        </div>
      </div>

      {/* 课程与项目展示 - 使用标签页切换 */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">精选课程与项目</h2>
            <p className="text-gray-600 mt-2">探索我们的热门AI教育内容</p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                  全部
                </TabsTrigger>
                <TabsTrigger value="courses" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                  课程
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                >
                  项目
                </TabsTrigger>
                <TabsTrigger value="tools" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                  工具
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 项目卡片1 */}
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-teal-500 to-teal-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-20 h-20 text-white/30" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-white text-teal-600">热门</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>智能AI-AIGC工具集成</CardTitle>
                    {/* 修改这里，不使用CardDescription组件，直接使用div和span */}
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          AI应用
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          AIGC
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      提供智能PPT生成、智能文案生成、智能图像生成等AIGC工具，满足教育场景下的创作需求。
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-gray-500">更新时间: 2024-04-15</div>
                    <Button variant="ghost" className="text-teal-600 hover:text-teal-700 p-0">
                      查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* 项目卡片2 */}
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-purple-500 to-purple-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Code className="w-20 h-20 text-white/30" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-white text-purple-600">新课</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>Python人工智能基础</CardTitle>
                    {/* 修改这里，不使用CardDescription组件，直接使用div和span */}
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          Python
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          AI入门
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      从零开始学习Python编程，掌握AI开发必备的编程技能，包含丰富的实战案例和项目练习。
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-gray-500">更新时间: 2024-03-28</div>
                    <Button variant="ghost" className="text-purple-600 hover:text-purple-700 p-0">
                      查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* 项目卡片3 */}
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-amber-500 to-amber-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Robot className="w-20 h-20 text-white/30" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-white text-amber-600">推荐</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>AI应用能力训练</CardTitle>
                    {/* 修改这里，不使用CardDescription组件，直接使用div和span */}
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          提示工程
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          AI应用
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      提供Word提示工程、PPT生成、Excel数据分析等AI应用能力训练，帮助用户掌握AI工具使用技巧。
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-gray-500">更新时间: 2024-04-02</div>
                    <Button variant="ghost" className="text-amber-600 hover:text-amber-700 p-0">
                      查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 课程卡片 */}
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-purple-500 to-purple-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Code className="w-20 h-20 text-white/30" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-white text-purple-600">新课</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>Python人工智能基础</CardTitle>
                    {/* 修改这里，不使用CardDescription组件，直接使用div和span */}
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          Python
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          AI入门
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      学习机器学习算法和数据分析技术，通过实际案例掌握数据处理、模型训练和评估的完整流程。
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-gray-500">更新时间: 2024-02-15</div>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
                      查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 项目卡片 */}
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-teal-500 to-teal-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-20 h-20 text-white/30" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-white text-teal-600">热门</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>智能AI-AIGC工具集成</CardTitle>
                    {/* 修改这里，不使用CardDescription组件，直接使用div和span */}
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          AI应用
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          AIGC
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      提供智能PPT生成、智能文案生成、智能图像生成等AIGC工具，满足教育场景下的创作需求。
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-gray-500">更新时间: 2024-04-15</div>
                    <Button variant="ghost" className="text-teal-600 hover:text-teal-700 p-0">
                      查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* 更多项目卡片 */}
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-amber-500 to-amber-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Robot className="w-20 h-20 text-white/30" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-white text-amber-600">推荐</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>AI应用能力训练</CardTitle>
                    {/* 修改这里，不使用CardDescription组件，直接使用div和span */}
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          提示工程
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          AI应用
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      提供Word提示工程、PPT生成、Excel数据分析等AI应用能力训练，帮助用户掌握AI工具使用技巧。
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-gray-500">更新时间: 2024-04-02</div>
                    <Button variant="ghost" className="text-amber-600 hover:text-amber-700 p-0">
                      查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 工具卡片 */}
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-rose-500 to-rose-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-20 h-20 text-white/30" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-white text-rose-600">新品</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>智能PPT生成工具</CardTitle>
                    {/* 修改这里，不使用CardDescription组件，直接使用div和span */}
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          AIGC
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          办公工具
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      只需输入主题和关键内容，AI即可自动生成专业PPT，支持多种模板和风格定制。
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-gray-500">更新时间: 2024-04-10</div>
                    <Button variant="ghost" className="text-rose-600 hover:text-rose-700 p-0">
                      查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* 更多工具卡片 */}
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-indigo-500 to-indigo-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Code className="w-20 h-20 text-white/30" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-white text-indigo-600">热门</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>AI代码助手</CardTitle>
                    {/* 修改这里，不使用CardDescription组件，直接使用div和span */}
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          编程
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800">
                          开发工具
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      智能代码补全和生成工具，支持多种编程语言，提高编程效率和代码质量。
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-gray-500">更新时间: 2024-03-20</div>
                    <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 p-0">
                      查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 联系我们 */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">联系我们</h2>
              <p className="mb-8 text-gray-300">
                维客未来致力于为教育机构和个人提供专业的AI教育解决方案，欢迎联系我们了解更多信息。
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center mr-4">
                    <Phone className="text-blue-400" />
                  </div>
                  <span>400-1014-137</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center mr-4">
                    <Mail className="text-blue-400" />
                  </div>
                  <span>support@veeknexus.com</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center mr-4">
                    <Globe2 className="text-blue-400" />
                  </div>
                  <span>www.veeknexus.com</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center mr-4">
                    <MapPin className="text-blue-400" />
                  </div>
                  <span>深圳市中深国际大厦902</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">留言咨询</h3>
              <div className="space-y-4">
                <Input placeholder="您的姓名" className="bg-gray-700 border-gray-600" />
                <Input placeholder="联系电话" className="bg-gray-700 border-gray-600" />
                <Input placeholder="电子邮箱" className="bg-gray-700 border-gray-600" />
                <textarea
                  placeholder="您的需求"
                  className="w-full h-24 px-3 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">提交</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%85%AC%E5%8F%B8%E6%A0%87%E9%A2%98-VMjnw7th193vuQnDCNLxHBOA3TCKLh.png"
                alt="Veek Nexus"
                width={180}
                height={50}
                className="h-10 w-auto mb-2"
              />
              <span>© 2024 版权所有</span>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-amber-400">
                关于我们
              </Link>
              <Link href="#" className="hover:text-amber-400">
                隐私政策
              </Link>
              <Link href="#" className="hover:text-amber-400">
                服务条款
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
