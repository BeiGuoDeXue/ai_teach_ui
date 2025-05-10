"use client"
import { useState } from "react"
import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Globe, ArrowRight, Phone, Mail, MapPin, Globe2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 课程数据
  const elementaryCourses = [
    {
      id: 1,
      title: "人工智能基础与应用",
      description:
        "本课程将带领小学生化身AI小侦探，揭开人工智能的神秘面纱！通过游戏化学习、互动实验与创意项目，学生将探索人脸识别、语音助手、机器翻译等AI技术背后的魔法。",
      tags: ["人工智能", "图像识别"],
    },
    {
      id: 2,
      title: "deepseek学习",
      description:
        '本课程以"深度探索（DeepSeek）"为核心，带领小学生化身"知识探矿者"，在人工智能、自然奥秘与数字科技的丛林中展开冒险！',
      tags: ["深度学习", "AI模型"],
    },
  ]

  const middleSchoolCourses = [
    {
      id: 3,
      title: "AI芯动工坊",
      description: "探索AI芯片设计与应用，从基础电路到智能系统，通过动手实践项目学习人工智能硬件开发。",
      tags: ["AI芯片", "硬件开发"],
    },
    {
      id: 12,
      title: "智能灌溉",
      description: "结合AI技术和物联网设备，设计和实现智能灌溉系统，解决农业水资源管理问题。",
      tags: ["物联网", "智能农业"],
    },
  ]

  const highSchoolCourses = [
    {
      id: 9,
      title: "激光雷达竞速车",
      description: "设计、组装和编程自己的激光雷达智能竞速车，学习传感器技术、自动驾驶算法和实时决策系统。",
      tags: ["激光雷达", "智能车"],
    },
    {
      id: 13,
      title: "AI架构师",
      description: "学习AI系统架构设计，包括模型选择、数据流设计、系统集成和性能优化等高级主题。",
      tags: ["系统架构", "AI工程"],
    },
  ]

  // 师资团队数据
  const teachers = [
    {
      id: 1,
      name: "张祖鑫",
      title: "人工智能教育专家",
      avatar: "/teacher-avatar-1.png",
      description: "毕业于陕西师范大学，拥有2年AI教育经验，专注于中小学AI启蒙教育，曾参与多个AI教育项目的开发与实施。",
    },
    {
      id: 2,
      name: "李清清",
      title: "计算机科学博士",
      avatar: "/teacher-avatar-2.png",
      description: "毕业于四川大学，研究方向为机器学习和计算机视觉，拥有丰富的教学和实践经验，热衷于AI教育推广。",
    },
    {
      id: 3,
      name: "王倩蓉",
      title: "STEAM教育专家",
      avatar: "/young-asian-female-teacher.png",
      description: "毕业于吉林大学，专注于STEAM教育和项目式学习，擅长将复杂的AI概念转化为易于理解的教学内容。",
    },
    {
      id: 4,
      name: "刘建峰",
      title: "AI应用工程师",
      avatar: "/teacher-avatar-4.png",
      description: "毕业于海南大学，来自知名科技公司，拥有丰富的AI项目实战经验，负责实践课程的设计和指导。",
    },
  ]

  // 提交留言
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 简单验证
    if (!name || !phone || !email || !message) {
      toast({
        title: "提交失败",
        description: "请填写所有必填字段",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 成功提示
      toast({
        title: "提交成功",
        description: "感谢您的留言，我们会尽快与您联系！",
      })

      // 重置表单
      setName("")
      setPhone("")
      setEmail("")
      setMessage("")
    } catch (error) {
      console.error("提交留言时出错:", error)
      toast({
        title: "提交失败",
        description: "服务器错误，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 英雄区域 - 使用深色背景和科技感设计 */}
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
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white rounded-md"
                  onClick={() => router.push("/ai-experience")}
                >
                  开始体验
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

      {/* 我们的服务 - 恢复之前的UI但使用新内容 */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">AI教育赋能平台</h2>
            <p className="text-gray-600 mt-2">Innovative Tech Applications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 模块一 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-teal-500 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                    <span className="text-teal-600 font-bold">01</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">AI 科创课程体系</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  借鉴国外STEAM教育理念，以AI为驱动核心，全面开发科学与技术、竞技与工程、艺术与创造、人文与社会为主体结构的AI应用教学课程体系，让学生在实践中学习体验最前沿的AI技术。
                </p>
              </div>
            </div>

            {/* 模块二 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">02</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">AI实验室搭建</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  部署AI学习实验室，可根据特定的场景，用图文、音视频、数字人等和师生互动。
                </p>
                <p className="text-gray-600 mb-4">部署AI设备，用于对外科普、展示。</p>
              </div>
            </div>

            {/* 模块三 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-amber-500 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <span className="text-amber-600 font-bold">03</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">AI辅助教师教学能力提升</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  根据中小学教学的需求，培训老师掌握AI工具，并有效的运用到教学工作中，让教育工作者在AI时代赋能。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 海量课程资源 - 三个固定模块 */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="md:w-1/4">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                海量课程资源
                <br />
                轻松开启AI
                <br />
                教学之旅
              </h2>
              <Button
                variant="outline"
                className="mt-6 flex items-center gap-2"
                onClick={() => router.push("/courses")}
              >
                查看更多课程 <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 小学课程 */}
              <div className="bg-yellow-100 rounded-xl p-6 flex flex-col">
                <h3 className="text-3xl font-bold mb-4">
                  小学
                  <br />
                  课程
                </h3>
                <p className="text-gray-700 mb-4">应知&认知</p>

                <div className="space-y-3 mt-4 mb-6">
                  {elementaryCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/courses/${course.id}`)}
                    >
                      <h4 className="font-semibold text-gray-800">{course.title}</h4>
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        {course.tags.map((tag, i) => (
                          <span key={i} className="bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{course.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="rounded-full bg-gray-900 text-white hover:bg-gray-800 border-0"
                    onClick={() => router.push("/courses")}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* 初中课程 */}
              <div className="bg-red-100 rounded-xl p-6 flex flex-col">
                <h3 className="text-3xl font-bold mb-4">
                  初中
                  <br />
                  课程
                </h3>
                <p className="text-gray-700 mb-4">探究&实践</p>

                <div className="space-y-3 mt-4 mb-6">
                  {middleSchoolCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/courses/${course.id}`)}
                    >
                      <h4 className="font-semibold text-gray-800">{course.title}</h4>
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        {course.tags.map((tag, i) => (
                          <span key={i} className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{course.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="rounded-full bg-gray-900 text-white hover:bg-gray-800 border-0"
                    onClick={() => router.push("/courses")}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* 高中课程 */}
              <div className="bg-blue-100 rounded-xl p-6 flex flex-col">
                <h3 className="text-3xl font-bold mb-4">
                  高中
                  <br />
                  课程
                </h3>
                <p className="text-gray-700 mb-4">应用&创新</p>

                <div className="space-y-3 mt-4 mb-6">
                  {highSchoolCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/courses/${course.id}`)}
                    >
                      <h4 className="font-semibold text-gray-800">{course.title}</h4>
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        {course.tags.map((tag, i) => (
                          <span key={i} className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{course.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="rounded-full bg-gray-900 text-white hover:bg-gray-800 border-0"
                    onClick={() => router.push("/courses")}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 师资力量 */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">专业师资团队</h2>
            <p className="text-gray-600 mt-2">汇聚AI教育领域的专家，为学生提供高质量的教学体验</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                      src={teacher.avatar || "/placeholder.svg"}
                      alt={teacher.name}
                      width={120}
                      height={120}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{teacher.name}</h3>
                  <p className="text-sm text-blue-600 mb-3">{teacher.title}</p>
                  <p className="text-gray-600 text-sm">{teacher.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <div className="flex items-center space-x-8">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                <p className="text-gray-600">专业教师</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
                <p className="text-gray-600">行业专家</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">8+</div>
                <p className="text-gray-600">平均教龄</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <p className="text-gray-600">学生满意度</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 课程案例展示 */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">课程案例展示</h2>
            <p className="text-gray-600 mt-2">学生们在我们的课程中完成的精彩项目</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 智能机器人项目 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
              {/* 图片区域 */}
              <div className="bg-gray-50 p-4 flex justify-center items-center" style={{ height: "180px" }}>
                <div className="relative w-full h-full flex justify-center items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E6%99%BA%E8%83%BD%E6%9C%BA%E5%99%A8%E4%BA%BA%E9%A1%B9%E7%9B%AE-XSUi0RRlsOGz72sldCUBpRnmF6vNmE.png"
                    alt="智能机器人项目"
                    width={300}
                    height={180}
                    className="object-contain max-h-full"
                  />
                </div>
              </div>

              {/* 文字内容区域 */}
              <div className="p-6 border-t">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">智能机器人项目</h3>
                <p className="text-gray-600 mb-4">
                  学生们设计并制作了各种智能机器人，包括避障小车、跟随机器人和互动机器人等。
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">学习成果:</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-green-600 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">掌握基础电子电路知识</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-green-600 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">学习Arduino编程技能</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-green-600 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">培养创新思维和解决问题能力</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 可穿戴设备项目 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
              {/* 图片区域 */}
              <div className="bg-gray-50 p-4 flex justify-center items-center" style={{ height: "180px" }}>
                <div className="relative w-full h-full flex justify-center items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%8F%AF%E7%A9%BF%E6%88%B4%E8%AE%BE%E5%A4%87%E9%A1%B9%E7%9B%AE-hw3DgEGcaKKZay5hWNxDmnxzsOU27s.png"
                    alt="可穿戴设备项目"
                    width={300}
                    height={180}
                    className="object-contain max-h-full"
                  />
                </div>
              </div>

              {/* 文字内容区域 */}
              <div className="p-6 border-t">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">可穿戴设备项目</h3>
                <p className="text-gray-600 mb-4">
                  学生们开发了智能服装和可穿戴设备，结合传感器技术实现健康监测和互动功能。
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">学习成果:</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-green-600 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">了解传感器工作原理</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-green-600 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">掌握数据采集和分析方法</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-green-600 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">学习人机交互设计原则</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 机械臂与智能控制 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
              {/* 图片区域 */}
              <div className="bg-gray-50 p-4 flex justify-center items-center" style={{ height: "180px" }}>
                <div className="relative w-full h-full flex justify-center items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E6%9C%BA%E6%A2%B0%E8%87%82%E4%B8%8E%E6%99%BA%E8%83%BD%E6%8E%A7%E5%88%B6-oHmaFU4Q7lv54kx0drEPChR9wDUB2c.png"
                    alt="机械臂与智能控制"
                    width={300}
                    height={180}
                    className="object-contain max-h-full"
                  />
                </div>
              </div>

              {/* 文字内容区域 */}
              <div className="p-6 border-t">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">机械臂与智能控制</h3>
                <p className="text-gray-600 mb-4">
                  学生们构建和编程机械臂，实现物体抓取、分拣和精确定位等功能，探索工业自动化应用。
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">学习成果:</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-green-600 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">理解机械结构设计原理</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-green-600 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">掌握伺服电机控制技术</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-green-600 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">学习工业自动化基础知识</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="px-6">
              查看更多项目
            </Button>
          </div>
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
              <form onSubmit={handleSubmitMessage} className="space-y-4">
                <Input
                  placeholder="您的姓名"
                  className="bg-gray-700 border-gray-600"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  placeholder="联系电话"
                  className="bg-gray-700 border-gray-600"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Input
                  placeholder="电子邮箱"
                  className="bg-gray-700 border-gray-600"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <textarea
                  placeholder="您的需求"
                  className="w-full h-24 px-3 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? "提交中..." : "提交"}
                </Button>
              </form>
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

      <Toaster />
    </div>
  )
}
