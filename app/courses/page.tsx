"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, ChevronDown, Star, Clock, BookOpen, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// 课程数据
const coursesData = [
  {
    id: 1,
    title: "人工智能基础与应用",
    description:
      "本课程将带领小学生化身&quot;AI小侦探&quot;，揭开人工智能的神秘面纱！通过游戏化学习、互动实验与创意项目，学生将探索人脸识别、语音助手、机器翻译等AI技术背后的魔法。课程以&quot;理解AI→训练AI→应用AI→反思AI&quot;为主线，结合生活场景（如垃圾分类、宠物识别、动画生成），使用可视化AI工具（如TeachableMachine、Blockly编程）和趣味数据集（如表情包图片、动物叫声），亲手训练会&quot;思考&quot;的模型，设计能&quot;对话&quot;的程序，解锁&quot;AI+创造力&quot;的无限可能！让科技不再冰冷，让算法充满童心！",
    image: "/images/ai-course-new.png",
    category: "人工智能",
    level: "小学",
    duration: "30小时",
    students: 1200,
    rating: 4.8,
    tags: ["人工智能", "图像识别", "语音助手", "创意项目"],
    instructor: "张老师",
    price: "免费",
    featured: true,
  },
  {
    id: 2,
    title: "deepseek学习",
    description:
      "本课程以&quot;深度探索（DeepSeek）&quot;为核心，带领小学生化身&quot;知识探矿者&quot;，在人工智能、自然奥秘与数字科技的丛林中展开冒险！课程采用&quot;问题驱动的深度探究法&quot;，围绕&quot;AI如何学习&quot;&quot;数据如何说话&quot;&quot;算法如何思考&quot;等主题，通过互动游戏、虚拟实验室和跨学科项目，解密深度学习的基础逻辑。学生将亲手训练会&quot;进化&quot;的AI模型，设计能&quot;自主思考&quot;的互动程序，并在沉浸式场景中体验完整探索过程，培养科学家的思维方式！",
    image: "/images/ai-intelligent-manufacturing-new.png",
    category: "人工智能",
    level: "小学",
    duration: "25小时",
    students: 980,
    rating: 4.7,
    tags: ["深度学习", "AI模型", "数据分析", "探索式学习"],
    instructor: "李博士",
    price: "¥299",
    featured: true,
  },
  {
    id: 3,
    title: "AI芯动工坊",
    description:
      "探索AI芯片设计与应用，从基础电路到智能系统，通过动手实践项目学习人工智能硬件开发，体验从芯片到智能设备的全流程开发。",
    image: "/images/ai-chip-workshop-new.png",
    category: "编程基础",
    level: "初级",
    duration: "30小时",
    students: 1250,
    rating: 4.8,
    tags: ["AI芯片", "硬件开发", "智能系统"],
    instructor: "张教授",
    price: "免费",
    featured: true,
  },
  {
    id: 4,
    title: "AI智能制造",
    description:
      "探索AI在智能制造领域的应用，学习如何利用人工智能技术优化生产流程、提高效率和质量控制，包含实际工业案例和实践项目。",
    image: "/images/ai-intelligent-manufacturing-new.png",
    category: "人工智能",
    level: "中级",
    duration: "40小时",
    students: 980,
    rating: 4.7,
    tags: ["智能制造", "工业4.0", "AI应用"],
    instructor: "李博士",
    price: "¥299",
    featured: false,
  },
  {
    id: 5,
    title: "未来工程师",
    description: "培养面向未来的工程思维和技能，结合AI、机器人和可持续发展等前沿技术，解决复杂工程问题和社会挑战。",
    image: "/images/future-engineer-new.png",
    category: "人工智能",
    level: "高级",
    duration: "50小时",
    students: 750,
    rating: 4.9,
    tags: ["未来技术", "工程思维", "创新设计"],
    instructor: "王教授",
    price: "¥399",
    featured: true,
  },
  {
    id: 6,
    title: "AI应用能力训练",
    description: "提供Word提示工程、PPT生成、Excel数据分析等AI应用能力训练，帮助用户掌握AI工具使用技巧。",
    image: "/images/ai-application-training.png",
    category: "AI应用",
    level: "初级",
    duration: "20小时",
    students: 1500,
    rating: 4.6,
    tags: ["提示工程", "AI应用", "AIGC", "大语言模型"],
    instructor: "刘老师",
    price: "免费",
    featured: false,
  },
  {
    id: 8,
    title: "精通AI舞者",
    description: "探索AI与艺术的结合，学习如何利用人工智能技术创作舞蹈动作、编排舞蹈序列，以及实现人机协作的舞蹈表演。",
    image: "/images/ai-dancer-new.png",
    category: "人工智能",
    level: "高级",
    duration: "55小时",
    students: 680,
    rating: 4.8,
    tags: ["AI艺术", "舞蹈创作", "人机协作"],
    instructor: "林教授",
    price: "¥399",
    featured: true,
  },
  {
    id: 9,
    title: "激光雷达竞速车",
    description:
      "围绕着车辆主控制板Arduino、直流电机及驱动、转向舵机等硬件，结合arduinoC语言，通过项目式学习，最终让学生自主设计完成一个激光雷达小车。",
    image: "/images/lidar-racing-car.png",
    category: "青少年编程",
    level: "初级",
    duration: "25小时",
    students: 1100,
    rating: 4.9,
    tags: ["激光雷达", "智能车", "自动驾驶", "Arduino"],
    instructor: "孙老师",
    price: "¥199",
    featured: false,
  },
  {
    id: 10,
    title: "人工智能课程",
    description:
      "全面介绍人工智能的基础知识和应用领域，涵盖机器学习、深度学习、计算机视觉和自然语言处理等核心技术，适合AI入门学习。",
    image: "/images/ai-course-new.png",
    category: "数据科学",
    level: "中级",
    duration: "35小时",
    students: 950,
    rating: 4.6,
    tags: ["人工智能", "AI入门", "机器学习"],
    instructor: "赵博士",
    price: "¥299",
    featured: false,
  },
  {
    id: 11,
    title: "智能硬件课程",
    description:
      "学习智能硬件设计与开发，从电子元件到集成系统，掌握传感器应用、嵌入式编程和物联网技术，打造自己的智能设备。",
    image: "/images/intelligent-hardware.png",
    category: "硬件开发",
    level: "中级",
    duration: "40小时",
    students: 780,
    rating: 4.7,
    tags: ["智能硬件", "嵌入式系统", "物联网"],
    instructor: "吴教授",
    price: "¥349",
    featured: false,
  },
  {
    id: 12,
    title: "智能灌溉",
    description: "学习智能灌溉系统的设计与实现，结合传感器技术、自动控制和数据分析，开发高效节水的农业灌溉解决方案。",
    image: "/images/intelligent-irrigation.png",
    category: "智能农业",
    level: "中级",
    duration: "35小时",
    students: 650,
    rating: 4.5,
    tags: ["智能农业", "灌溉系统", "物联网"],
    instructor: "郑博士",
    price: "¥299",
    featured: false,
  },
  {
    id: 13,
    title: "AI架构师",
    description:
      "培养AI系统架构设计能力，学习大规模AI系统的设计原则、性能优化和部署策略，成为能够规划和实施AI解决方案的高级人才。",
    image: "/images/ai-architect.png",
    category: "人工智能",
    level: "高级",
    duration: "60小时",
    students: 520,
    rating: 4.9,
    tags: ["AI架构", "系统设计", "高级开发"],
    instructor: "黄教授",
    price: "¥499",
    featured: true,
  },
  {
    id: 14,
    title: "AI玩具创造实践",
    description:
      "结合AI技术与玩具设计，学习如何创造智能互动玩具，包括语音识别、动作感应和情感交互等功能，激发创新思维和动手能力。",
    image: "/images/ai-toy-creation.png",
    category: "创新设计",
    level: "初级",
    duration: "30小时",
    students: 890,
    rating: 4.7,
    tags: ["AI玩具", "创意设计", "互动体验"],
    instructor: "田老师",
    price: "¥249",
    featured: false,
  },
  {
    id: 15,
    title: "信息奥赛",
    description:
      "为参加信息学奥林匹克竞赛的学生提供系统培训，涵盖算法设计、数据结构和竞赛策略，提升解题能力和编程技巧。",
    image: "/images/informatics-olympiad.png",
    category: "竞赛培训",
    level: "高级",
    duration: "80小时",
    students: 450,
    rating: 4.8,
    tags: ["信息学竞赛", "算法", "编程挑战"],
    instructor: "李教授",
    price: "¥599",
    featured: true,
  },
  {
    id: 16,
    title: "青创课",
    description: "专为青少年设计的创新创业课程，培养创新思维、团队协作和项目管理能力，通过实践项目体验创业全过程。",
    image: "/images/youth-innovation.png",
    category: "青少年教育",
    level: "初级",
    duration: "25小时",
    students: 720,
    rating: 4.6,
    tags: ["青少年创新", "创业教育", "项目实践"],
    instructor: "张老师",
    price: "¥199",
    featured: false,
  },
  {
    id: 17,
    title: "3D建模",
    description:
      "学习3D建模技术和工具，从基础造型到高级渲染，掌握三维设计的核心技能，应用于游戏开发、产品设计和虚拟现实等领域。",
    image: "/images/3d-modeling.png",
    category: "设计与创意",
    level: "中级",
    duration: "45小时",
    students: 850,
    rating: 4.7,
    tags: ["3D设计", "建模技术", "数字艺术"],
    instructor: "王设计师",
    price: "¥399",
    featured: false,
  },
]

// 分类数据
const categories = [
  { id: "all", name: "全部" },
  { id: "primary", name: "小学" },
  { id: "middle", name: "初中" },
  { id: "high", name: "高中" },
]

// 难度级别
const levels = [
  { id: "beginner", name: "初级" },
  { id: "intermediate", name: "中级" },
  { id: "advanced", name: "高级" },
]

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [filteredCourses, setFilteredCourses] = useState(coursesData)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 9

  // 过滤课程
  useEffect(() => {
    let result = coursesData

    // 搜索过滤
    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // 分类过滤
    if (selectedCategory !== "all") {
      result = result.filter((course) => {
        const categoryMap: { [key: string]: string } = {
          primary: "小学",
          middle: "初中",
          high: "高中",
        }
        return course.level === categoryMap[selectedCategory]
      })
    }

    // 难度级别过滤
    if (selectedLevels.length > 0) {
      result = result.filter((course) => selectedLevels.includes(course.level))
    }

    // 排序
    if (sortBy === "popular") {
      result = [...result].sort((a, b) => b.students - a.students)
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "newest") {
      // 这里假设id越大越新
      result = [...result].sort((a, b) => b.id - a.id)
    }

    setFilteredCourses(result)
    // 重置到第一页
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedLevels, sortBy])

  // 切换难度级别选择
  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  // 清除所有筛选条件
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedLevels([])
  }

  // 分页逻辑
  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">课程中心</h1>
          <p className="text-gray-600 mt-2">探索我们的AI教育课程，提升您的技能和知识</p>
        </div>

        {/* 搜索和筛选区域 */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="搜索课程..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                筛选
                <ChevronDown size={16} className={cn("transition-transform", showFilters ? "rotate-180" : "")} />
              </Button>
              <div className="relative group">
                <Button variant="outline" className="flex items-center gap-2">
                  排序
                  <ChevronDown size={16} />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setSortBy("popular")}
                    >
                      最受欢迎
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setSortBy("rating")}
                    >
                      评分最高
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setSortBy("newest")}
                    >
                      最新发布
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 展开的筛选选项 */}
          {showFilters && (
            <div className="mt-4 border-t pt-4">
              <div className="flex flex-wrap gap-6">
                <div className="w-full">
                  <h3 className="text-sm font-medium mb-2">课程分类</h3>
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                    <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
                      {categories.slice(0, 6).map((category) => (
                        <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm py-1.5 px-2">
                          {category.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mt-2">
                    <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
                      {categories.slice(6).map((category) => (
                        <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm py-1.5 px-2">
                          {category.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">难度级别</h3>
                  <div className="flex flex-wrap gap-4">
                    {levels.map((level) => (
                      <div key={level.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`level-${level.id}`}
                          checked={selectedLevels.includes(level.name)}
                          onCheckedChange={() => toggleLevel(level.name)}
                        />
                        <Label htmlFor={`level-${level.id}`} className="text-sm">
                          {level.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-2 border-t">
                <div className="text-sm text-gray-500">{filteredCourses.length} 个课程符合条件</div>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
                  <X size={14} className="mr-1" /> 清除筛选条件
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 课程列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourses.map((course) => (
            <Link href={`/courses/${course.id}`} key={course.id} className="group">
              <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={course.image || "/placeholder.svg?height=200&width=300&query=course thumbnail"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  {course.featured && (
                    <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600">精选</Badge>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="flex items-center text-white">
                      <Star className="h-4 w-4 fill-amber-400 stroke-amber-400 mr-1" />
                      <span className="text-sm">{course.rating}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm">{course.students} 名学员</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {course.category}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {course.level}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{course.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                    <span className="mx-2">•</span>
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>讲师: {course.instructor}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center border-t">
                  <div className="font-medium">
                    {course.price === "免费" ? (
                      <span className="text-green-600">{course.price}</span>
                    ) : (
                      <span className="text-amber-600">{course.price}</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 group-hover:bg-blue-50">
                    查看详情 <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* 分页 */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              上一页
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                className={currentPage === page ? "bg-blue-50 text-blue-600" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
