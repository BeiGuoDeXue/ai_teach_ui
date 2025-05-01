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
    title: "Python人工智能基础",
    description: "从零开始学习Python编程，掌握AI开发必备的编程技能，包含丰富的实战案例和项目练习。",
    image: "/placeholder.svg?height=200&width=300",
    category: "编程基础",
    level: "初级",
    duration: "30小时",
    students: 1250,
    rating: 4.8,
    tags: ["Python", "AI入门"],
    instructor: "张教授",
    price: "免费",
    featured: true,
  },
  {
    id: 2,
    title: "机器学习算法与应用",
    description: "学习机器学习算法和数据分析技术，通过实际案例掌握数据处理、模型训练和评估的完整流程。",
    image: "/placeholder.svg?height=200&width=300",
    category: "人工智能",
    level: "中级",
    duration: "40小时",
    students: 980,
    rating: 4.7,
    tags: ["机器学习", "数据分析"],
    instructor: "李博士",
    price: "¥299",
    featured: false,
  },
  {
    id: 3,
    title: "深度学习与神经网络",
    description: "深入学习神经网络原理和深度学习框架，构建和训练自己的深度学习模型解决实际问题。",
    image: "/placeholder.svg?height=200&width=300",
    category: "人工智能",
    level: "高级",
    duration: "50小时",
    students: 750,
    rating: 4.9,
    tags: ["深度学习", "神经网络", "TensorFlow"],
    instructor: "王教授",
    price: "¥399",
    featured: true,
  },
  {
    id: 4,
    title: "AI应用能力训练",
    description: "提供Word提示工程、PPT生成、Excel数据分析等AI应用能力训练，帮助用户掌握AI工具使用技巧。",
    image: "/placeholder.svg?height=200&width=300",
    category: "AI应用",
    level: "初级",
    duration: "20小时",
    students: 1500,
    rating: 4.6,
    tags: ["提示工程", "AI应用"],
    instructor: "刘老师",
    price: "免费",
    featured: false,
  },
  {
    id: 5,
    title: "计算机视觉实战",
    description: "学习图像处理和计算机视觉技术，从基础原理到高级应用，包含多个实战项目。",
    image: "/placeholder.svg?height=200&width=300",
    category: "人工智能",
    level: "中级",
    duration: "45小时",
    students: 820,
    rating: 4.7,
    tags: ["计算机视觉", "OpenCV"],
    instructor: "陈博士",
    price: "¥349",
    featured: false,
  },
  {
    id: 6,
    title: "自然语言处理入门到精通",
    description: "掌握NLP技术，从文本处理基础到高级模型应用，构建智能文本分析和生成系统。",
    image: "/placeholder.svg?height=200&width=300",
    category: "人工智能",
    level: "高级",
    duration: "55小时",
    students: 680,
    rating: 4.8,
    tags: ["NLP", "文本分析"],
    instructor: "林教授",
    price: "¥399",
    featured: true,
  },
  {
    id: 7,
    title: "AI创意积木编程",
    description: "通过积木式编程学习AI应用开发，适合青少年和编程初学者，培养创造力和逻辑思维。",
    image: "/placeholder.svg?height=200&width=300",
    category: "青少年编程",
    level: "初级",
    duration: "25小时",
    students: 1100,
    rating: 4.9,
    tags: ["积木编程", "创意思维"],
    instructor: "孙老师",
    price: "¥199",
    featured: false,
  },
  {
    id: 8,
    title: "数据科学与可视化",
    description: "学习数据分析和可视化技术，使用Python和相关工具处理、分析和展示数据。",
    image: "/placeholder.svg?height=200&width=300",
    category: "数据科学",
    level: "中级",
    duration: "35小时",
    students: 950,
    rating: 4.6,
    tags: ["数据分析", "可视化"],
    instructor: "赵博士",
    price: "¥299",
    featured: false,
  },
]

// 分类数据
const categories = [
  { id: "all", name: "全部" },
  { id: "programming", name: "编程基础" },
  { id: "ai", name: "人工智能" },
  { id: "ai-application", name: "AI应用" },
  { id: "youth-programming", name: "青少年编程" },
  { id: "data-science", name: "数据科学" },
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
          programming: "编程基础",
          ai: "人工智能",
          "ai-application": "AI应用",
          "youth-programming": "青少年编程",
          "data-science": "数据科学",
        }
        return course.category === categoryMap[selectedCategory]
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
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2">
                  排序
                  <ChevronDown size={16} />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 hidden">
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
                <div>
                  <h3 className="text-sm font-medium mb-2">课程分类</h3>
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                    <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
                      {categories.map((category) => (
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
          {filteredCourses.map((course) => (
            <Link href={`/courses/${course.id}`} key={course.id} className="group">
              <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
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
            <Button variant="outline" size="sm" disabled>
              上一页
            </Button>
            <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
