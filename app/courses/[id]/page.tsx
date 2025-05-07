"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  Star,
  Clock,
  BookOpen,
  Users,
  Download,
  Play,
  FileText,
  ChevronRight,
  Share2,
  Heart,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// 简化的视频URL处理函数
const getVideoUrl = (videoPath: string) => {
  // 如果是完整URL（以http开头），直接返回
  if (videoPath.startsWith("http")) {
    return videoPath
  }

  // 如果以/开头，说明是从网站根目录开始的路径，直接返回
  if (videoPath.startsWith("/")) {
    return videoPath
  }

  // 否则，拼接到/videos/目录下
  return `/videos/${videoPath}`
}

export default function CourseDetail({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 课程数据 - 在实际应用中，这些数据应该从API获取
  const course = {
    id: params.id,
    title: "激光雷达竞速车",
    description:
      "围绕着车辆主控制板Arduino、直流电机及驱动、转向舵机等硬件，结合arduinoC语言，通过项目式学习，最终让学生自主设计完成一个激光雷达小车。",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E6%A0%87%E9%A2%98-9i3duEqIAVyrVFDSTdqPQJotLDrHaa.png",
    category: "硬件编程",
    level: "中级",
    duration: "30小时",
    students: 1250,
    rating: 4.8,
    tags: ["Arduino", "硬件", "编程"],
    instructor: "张教授",
    price: "¥399",
    featured: true,
    progress: 0,
    chapters: [
      {
        id: "1",
        title: "第1课 Arduino编程初探",
        duration: "2小时",
        completed: false,
        resources: [
          { id: "1-1", type: "pdf", title: "arduino_book.pdf", url: "arduino_book.pdf" },
          { id: "1-2", type: "video", title: "arduino_car.mp4", url: "arduino_car.mp4" },
        ],
      },
      {
        id: "2",
        title: "第2-3课 电子设计基础与安全规范",
        duration: "4小时",
        completed: false,
        resources: [],
      },
      {
        id: "3",
        title: "第4课 LED流水灯与编程逻辑",
        duration: "2小时",
        completed: false,
        resources: [],
      },
      {
        id: "4",
        title: "第5课 按键读取与串口通信",
        duration: "2小时",
        completed: false,
        resources: [],
      },
      {
        id: "5",
        title: "第6课 光敏电阻与自动大灯",
        duration: "2小时",
        completed: false,
        resources: [],
      },
      {
        id: "6",
        title: "第7课 蜂鸣器报警与PWM控制",
        duration: "2小时",
        completed: false,
        resources: [],
      },
      {
        id: "7",
        title: "第8课 数码管显示与控制",
        duration: "2小时",
        completed: false,
        resources: [],
      },
      {
        id: "8",
        title: "第9课 继电器控制与电路应用",
        duration: "2小时",
        completed: false,
        resources: [],
      },
      {
        id: "9",
        title: "第11课 PWM技术与呼吸灯",
        duration: "2小时",
        completed: false,
        resources: [],
      },
      {
        id: "10",
        title: "第12课 直流电机控制",
        duration: "2小时",
        completed: false,
        resources: [],
      },
    ],
    objectives: [
      "掌握Arduino基础编程技能",
      "理解电子设计基础知识和安全规范",
      "学习LED控制和编程逻辑",
      "掌握按键读取和串口通信技术",
      "了解光敏电阻工作原理和应用",
      "学习PWM控制技术",
      "掌握数码管显示和控制方法",
      "理解继电器控制和电路应用",
      "掌握直流电机控制技术",
      "完成激光雷达竞速车项目",
    ],
    requirements: ["基础编程知识", "对电子硬件有兴趣", "具备基本动手能力", "有Arduino开发板（可选）"],
    targetAudience: [
      "对硬件编程感兴趣的学生",
      "想要学习Arduino开发的爱好者",
      "希望掌握电子设计基础的初学者",
      "对机器人和智能车感兴趣的人群",
    ],
    reviews: [
      {
        id: "1",
        user: "李明",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        date: "2024-03-15",
        content: "非常棒的课程，内容详实，讲解清晰，通过这门课我成功制作了自己的第一个Arduino项目！",
      },
      {
        id: "2",
        user: "王华",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4,
        date: "2024-02-28",
        content: "课程内容很丰富，但有些地方对初学者来说可能有点难度，希望能增加更多基础知识的讲解。",
      },
      {
        id: "3",
        user: "张伟",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        date: "2024-02-10",
        content: "老师讲解非常专业，课程设计循序渐进，每一步都有详细的指导，非常适合想要入门Arduino的学习者。",
      },
    ],
  }

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-7xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/courses" className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回课程列表
          </Link>
        </div>

        {/* 课程标题和基本信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-amber-400 stroke-amber-400 mr-1" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-gray-500 ml-1">({course.reviews.length} 评价)</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-500 mr-1" />
                <span>{course.students} 名学员</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-1" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-gray-500 mr-1" />
                <span>{course.level}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {course.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="font-medium">{course.instructor.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{course.instructor}</p>
                  <p className="text-sm text-gray-500">课程讲师</p>
                </div>
              </div>
            </div>
          </div>

          {/* 课程封面和操作按钮 */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white hover:bg-white/90 text-blue-600"
                    onClick={handlePlayVideo}
                  >
                    <Play className="h-6 w-6 fill-current" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-amber-600">{course.price}</span>
                  {course.progress > 0 && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">学习进度</span>
                      <Progress value={course.progress} className="w-24 h-2" />
                      <span className="text-sm text-gray-500 ml-2">{course.progress}%</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    {course.progress > 0 ? "继续学习" : "立即学习"}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex items-center justify-center">
                      <Heart className="h-4 w-4 mr-2" />
                      收藏
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center">
                      <Share2 className="h-4 w-4 mr-2" />
                      分享
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 课程内容标签页 */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              课程概览
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              课程内容
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              学员评价
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">课程介绍</h2>
                  <p className="text-gray-700 mb-4">{course.description}</p>
                  <p className="text-gray-700">
                    本课程将带领学生从Arduino基础知识开始，逐步学习电子设计、编程逻辑、传感器应用等内容，
                    通过实践项目帮助学生掌握硬件编程技能，最终完成一个功能完整的激光雷达竞速车项目。
                    课程采用项目式学习方法，注重理论与实践相结合，帮助学生建立系统的硬件编程知识体系。
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">学习目标</h2>
                  <ul className="space-y-2">
                    {course.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">适合人群</h2>
                  <ul className="space-y-2">
                    {course.targetAudience.map((audience, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-green-600"></div>
                        <span>{audience}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">课程预备知识</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-amber-600"></div>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">课程亮点</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">项目式学习</p>
                          <p className="text-sm text-gray-500">通过实际项目掌握硬件编程技能</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">专业讲师</p>
                          <p className="text-sm text-gray-500">由资深Arduino专家授课</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <FileText className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">丰富资料</p>
                          <p className="text-sm text-gray-500">包含详细教程、代码示例和参考资料</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="pt-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">课程大纲</h2>
              <p className="text-gray-600 mb-4">
                本课程共包含 {course.chapters.length} 个章节，总时长 {course.duration}
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {course.chapters.map((chapter, index) => (
                <AccordionItem key={chapter.id} value={chapter.id}>
                  <AccordionTrigger className="hover:bg-gray-50 px-4 py-3 rounded-lg">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium">{chapter.title}</h3>
                          <p className="text-sm text-gray-500">{chapter.duration}</p>
                        </div>
                      </div>
                      {chapter.completed && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          已完成
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="pl-11">
                      {chapter.resources.length > 0 ? (
                        <div className="space-y-3">
                          {chapter.resources.map((resource) => (
                            <div
                              key={resource.id}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                            >
                              <div className="flex items-center">
                                {resource.type === "pdf" ? (
                                  <FileText className="h-5 w-5 text-red-500 mr-3" />
                                ) : (
                                  <Play className="h-5 w-5 text-blue-500 mr-3" />
                                )}
                                <span>{resource.title}</span>
                              </div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    {resource.type === "pdf" ? "查看" : "播放"}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle>{resource.title}</DialogTitle>
                                    <DialogDescription>
                                      {resource.type === "pdf" ? "课程资料" : "课程视频"}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    {resource.type === "pdf" ? (
                                      <div className="bg-gray-100 p-4 rounded-lg text-center">
                                        <FileText className="h-12 w-12 text-red-500 mx-auto mb-2" />
                                        <p className="mb-4">PDF 文档预览</p>
                                        <Button>
                                          <Download className="h-4 w-4 mr-2" />
                                          下载文档
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="relative aspect-video">
                                        <video
                                          ref={videoRef}
                                          className="w-full h-full rounded-lg"
                                          controls
                                          onPlay={() => setIsVideoPlaying(true)}
                                          onPause={() => setIsVideoPlaying(false)}
                                        >
                                          <source src={getVideoUrl(resource.url)} type="video/mp4" />
                                          您的浏览器不支持视频播放
                                        </video>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">本章节暂无可下载资源</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">学员评价</h2>
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  <Star className="h-6 w-6 fill-amber-400 stroke-amber-400 mr-1" />
                  <span className="text-2xl font-bold">{course.rating}</span>
                </div>
                <div className="text-gray-500">基于 {course.reviews.length} 条评价</div>
              </div>
            </div>

            <div className="space-y-6">
              {course.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image src={review.avatar || "/placeholder.svg"} alt={review.user} width={40} height={40} />
                    </div>
                    <div>
                      <p className="font-medium">{review.user}</p>
                      <div className="flex items-center">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-amber-400 stroke-amber-400" : "stroke-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button variant="outline" className="flex items-center">
                查看更多评价
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* 相关课程推荐 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">相关课程推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-100 relative">
                  <Image src="/placeholder.svg?height=160&width=320" alt="课程封面" fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {index === 0
                      ? "Arduino高级编程与项目实战"
                      : index === 1
                        ? "智能家居DIY实践"
                        : "机器人设计与编程基础"}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>20小时</span>
                    <span className="mx-2">•</span>
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{index === 0 ? "高级" : index === 1 ? "中级" : "初级"}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-medium text-amber-600">¥299</span>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
