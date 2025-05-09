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
  Play,
  Share2,
  Heart,
  Cpu,
  Layers,
  Zap,
  Settings,
  Code,
  Lightbulb,
  Rocket,
  Brain,
  MessageSquare,
  Award,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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

// 课程数据 - 根据课程ID返回不同的课程内容
const getCourseData = (courseId: string) => {
  // AI芯动工坊课程
  if (courseId === "1") {
    return {
      id: courseId,
      title: "AI芯动工坊",
      description:
        "结合编程理论和实际，开发智能应用，培养学生的硬件和软件技能，并用创新的工具优化和改进他们的理解和动手能力，帮助学生掌握AI芯片技术，激发学生对AI创新的兴趣。",
      image: "/images/ai-chip-workshop.png",
      category: "人工智能",
      level: "初级到中级",
      duration: "40小时",
      students: 1560,
      rating: 4.9,
      tags: ["AI芯片", "硬件编程", "软件开发", "创新思维"],
      instructor: "王教授",
      price: "¥499",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "小学阶段",
          duration: "20小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "AI芯片入门.pdf", url: "ai_chip_intro.pdf" },
            { id: "1-2", type: "video", title: "AI芯片基础.mp4", url: "ai_chip_basics.mp4" },
          ],
          subChapters: [
            {
              id: "1-1",
              title: "01 初识人工智能",
              resources: [
                { id: "1-1-1", type: "pdf", title: "初识人工智能.pdf", url: "ai_intro.pdf" },
                { id: "1-1-2", type: "video", title: "人工智能概述.mp4", url: "ai_overview.mp4" },
              ],
            },
            {
              id: "1-2",
              title: "02 人工智能搜索",
              resources: [
                { id: "1-2-1", type: "pdf", title: "AI搜索算法.pdf", url: "ai_search.pdf" },
                { id: "1-2-2", type: "video", title: "搜索算法演示.mp4", url: "search_demo.mp4" },
              ],
            },
            {
              id: "1-3",
              title: "03 人工智能优化",
              resources: [{ id: "1-3-1", type: "pdf", title: "AI优化方法.pdf", url: "ai_optimization.pdf" }],
            },
            // 其他子章节保持原样...
            { id: "1-4", title: "04 实际中的人工智能" },
            { id: "1-5", title: "05 机器的感知" },
            { id: "1-6", title: "06 我的语言助手(一)" },
            { id: "1-7", title: "07 我的语言助手(二)" },
            { id: "1-8", title: "08 机器的理解" },
            { id: "1-9", title: "09 手势识别" },
            { id: "1-10", title: "10 虚拟机器人" },
            { id: "1-11", title: "11 人脸识别和表情" },
            { id: "1-12", title: "12 智能对话问题" },
            { id: "1-13", title: "13 情绪小管家" },
            { id: "1-14", title: "14 智能安防小专家(上)" },
            { id: "1-15", title: "15 智能安防小专家(下)" },
          ],
        },
        {
          id: "2",
          title: "中学阶段",
          duration: "20小时",
          completed: false,
          resources: [],
          subChapters: [
            {
              id: "2-1",
              title: "01 人工智能识别系统",
              resources: [
                { id: "2-1-1", type: "pdf", title: "AI识别系统概述.pdf", url: "ai_recognition.pdf" },
                { id: "2-1-2", type: "video", title: "识别系统演示.mp4", url: "recognition_demo.mp4" },
              ],
            },
            {
              id: "2-2",
              title: "02 人工智能硬件基础(上)",
              resources: [{ id: "2-2-1", type: "pdf", title: "AI硬件基础.pdf", url: "ai_hardware.pdf" }],
            },
            // 其他子章节保持原样...
            { id: "2-3", title: "03 人工智能硬件基础(下)" },
            { id: "2-4", title: "04 人工智能软件编程技术概论(上)" },
            { id: "2-5", title: "05 人工智能软件编程技术概论(下)" },
            { id: "2-6", title: "06 人工智能感知与动作控制概论(上)" },
            { id: "2-7", title: "07 人工智能感知与动作控制概论(下)" },
            { id: "2-8", title: "08 人工智能项目分析" },
            { id: "2-9", title: "09 实际项目" },
            { id: "2-10", title: "10 语音识别" },
            { id: "2-11", title: "11 图像与动态" },
            { id: "2-12", title: "12 强化学习基础" },
            { id: "2-13", title: "13 情绪识别" },
            { id: "2-14", title: "14 自动小助手" },
            { id: "2-15", title: "15 机器学习概述及智能产业未来" },
          ],
        },
      ],
      objectives: [
        "了解AI芯片的基本原理和应用场景",
        "掌握人工智能基础知识和搜索算法",
        "学习AI硬件和软件的基本编程技能",
        "理解机器感知和语言处理的基本原理",
        "掌握图像识别和语音识别的基本技术",
        "学习AI项目的分析和实施方法",
        "培养创新思维和解决问题的能力",
        "了解AI产业的发展趋势和未来方向",
      ],
      requirements: ["基础计算机操作能力", "对人工智能和硬件有兴趣", "具备基本逻辑思维能力", "小学及以上学历"],
      targetAudience: [
        "对AI芯片和人工智能感兴趣的小学生和中学生",
        "希望学习AI硬件和软件技能的青少年",
        "想要培养创新思维的学生",
        "对未来科技发展有兴趣的年轻人",
      ],
      reviews: [
        {
          id: "1",
          user: "张小明",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-15",
          content:
            "这门课程非常适合孩子学习，内容由浅入深，我的孩子学习后对AI产生了浓厚的兴趣，现在已经能够独立完成一些简单的AI项目了！",
        },
        {
          id: "2",
          user: "李华",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-03-20",
          content:
            "作为一名中学老师，我强烈推荐这门课程给对AI感兴趣的学生。课程内容丰富，实践性强，能够激发学生的创新思维。",
        },
        {
          id: "3",
          user: "王强",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-02-28",
          content:
            "课程内容很全面，从AI基础到实际应用都有涉及，特别是硬件和软件结合的部分非常实用。唯一的建议是希望能增加更多的实践项目。",
        },
      ],
    }
  }
  // AI智能制造课程
  else if (courseId === "2") {
    return {
      id: courseId,
      title: "AI智能制造",
      description:
        "提供一个全面而深入的AI智能学习体验，通过项目实战，引导学生利用面向化编程软件和Arduino UNO弹性控制芯片，揭开智能硬件的神秘面纱。",
      image: "/images/ai-intelligent-manufacturing.png",
      category: "人工智能",
      level: "中级",
      duration: "39小时",
      students: 980,
      rating: 4.7,
      tags: ["智能制造", "Arduino", "AI应用", "项目实战"],
      instructor: "李博士",
      price: "¥299",
      featured: false,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第1课 提出问题",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "课程介绍.pdf", url: "course_intro.pdf" },
            { id: "1-2", type: "video", title: "智能制造概述.mp4", url: "smart_manufacturing_intro.mp4" },
          ],
        },
        {
          id: "2",
          title: "第2课 分析问题",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "3",
          title: "第3课 设计思路",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "4",
          title: "第4课 设计方案",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "5",
          title: "第5课 选择器材",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "6",
          title: "第6课 程序设计",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "7",
          title: "第7课 编写程序",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "8",
          title: "第8课 实物制作",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "9",
          title: "第9课 整体组装",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "10",
          title: "第10课 整体调试",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "11",
          title: "第11课 演讲表达",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "12",
          title: "第12课 再次提出问题",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "13",
          title: "第13课 设计方案",
          duration: "3小时",
          completed: false,
          resources: [],
        },
      ],
      objectives: [
        "了解AI智能制造的基本概念和应用场景",
        "掌握Arduino UNO的基础编程和控制方法",
        "学习智能制造项目的分析和设计方法",
        "掌握软硬件结合的项目开发流程",
        "学习模块化设计和编程技巧",
        "掌握项目调试和优化的方法",
        "通过实际项目提升综合应用能力",
        "培养问题分析和解决能力",
      ],
      requirements: ["基础计算机知识", "基本的编程概念", "对智能制造有兴趣", "动手能力"],
      targetAudience: [
        "对智能制造感兴趣的学生",
        "希望学习Arduino应用的爱好者",
        "想要提升项目实战能力的学习者",
        "对AI与制造结合感兴趣的人群",
      ],
      reviews: [
        {
          id: "1",
          user: "陈工程师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-03-20",
          content:
            "课程内容非常实用，通过项目实战的方式学习，让我对智能制造有了更深入的理解，Arduino的应用部分讲解得特别清晰。",
        },
        {
          id: "2",
          user: "张同学",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-02-15",
          content: "作为一名初学者，这门课程的循序渐进让我能够轻松上手，项目实战部分很有挑战性，但收获也很大。",
        },
        {
          id: "3",
          user: "李教师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-01-30",
          content:
            "我是一名教师，这门课程的内容和教学方法对我的教学有很大启发，特别是项目分析和设计的部分，非常适合引导学生进行实践学习。",
        },
      ],
    }
  }
  // AI创想家课程
  else if (courseId === "5") {
    return {
      id: courseId,
      title: "AI创想家",
      description: "通过Python编程和创意项目，培养孩子的逻辑思维和创造力，让孩子在游戏化学习中掌握AI时代的核心技能。",
      image: "/ai-creative-thinker.png",
      category: "人工智能",
      level: "小学",
      duration: "60小时",
      students: 820,
      rating: 4.7,
      tags: ["Python", "创意编程", "AI应用", "实用项目"],
      instructor: "陈博士",
      price: "¥349",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第1课-迷宫寻宝奇事",
          duration: "2小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "迷宫寻宝教程.pdf", url: "maze_treasure_tutorial.pdf" },
            { id: "1-2", type: "video", title: "迷宫寻宝演示.mp4", url: "maze_treasure_demo.mp4" },
          ],
        },
        {
          id: "2",
          title: "第2课-贪吃小企鹅",
          duration: "2小时",
          completed: false,
          resources: [{ id: "2-1", type: "pdf", title: "贪吃小企鹅教程.pdf", url: "hungry_penguin_tutorial.pdf" }],
        },
        {
          id: "3",
          title: "第3课-小企鹅做数学",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "4",
          title: "第4课-森林历险记",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "5",
          title: "第5课-欢乐游乐园",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "6",
          title: "第6课-开心过大年",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "7",
          title: "第7课-闯一闯关",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "8",
          title: "第8课-恐龙运动会",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "9",
          title: "第9课-时光穿梭机",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "10",
          title: "第10课-恐龙大危机",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "11",
          title: "第11课-全班春季游",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "12",
          title: "第12课-魔法学院",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "13",
          title: "第13课-妈妈的小帮手",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "14",
          title: "第14课-模拟测试题",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "15",
          title: "第15课-迷宫寻宝表体验",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "16",
          title: "第16课-小企鹅的移动",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "17",
          title: "第17课-随机出现的宝石",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "18",
          title: "第18课-控制体力球宝石",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "19",
          title: "第19课-找最近的宝石",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "20",
          title: "第20课-学做算法",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "21",
          title: "第21课-小企鹅自动寻路",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "22",
          title: "第22课-安全离场",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "23",
          title: "第23课-找最近密码",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "24",
          title: "第24课-与敌方竞争",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "25",
          title: "第25课-成套宝石加分(一)",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "26",
          title: "第26课-成套宝石加分(二)",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "27",
          title: "第27课-综合复习(一)",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "28",
          title: "第28课-综合复习(二)",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "29",
          title: "第29课-实战演练",
          duration: "2小时",
          completed: false,
          resources: [],
        },
        {
          id: "30",
          title: "第30课-擂台进阶",
          duration: "2小时",
          completed: false,
          resources: [],
        },
      ],
      objectives: [
        "掌握Python编程基础知识和核心库的使用",
        "学习创意编程和游戏开发的基本技能",
        "培养解决实际问题的编程思维",
        "学习如何设计和开发互动游戏和应用",
        "掌握算法基础和自动寻路等AI技术",
        "培养创新思维和项目实践能力",
        "学习如何将编程应用到日常生活中",
        "培养团队协作和项目展示能力",
      ],
      requirements: [
        "基础计算机操作能力",
        "对编程和创意设计有兴趣",
        "小学三年级及以上学历",
        "家长能够提供基本的学习支持",
      ],
      targetAudience: [
        "对编程和人工智能感兴趣的小学生",
        "希望培养创造力和逻辑思维的儿童",
        "想要学习Python编程的青少年",
        "希望孩子掌握未来技能的家长",
      ],
      reviews: [
        {
          id: "1",
          user: "王妈妈",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-05",
          content:
            "孩子非常喜欢这门课程，每天都迫不及待地想要学习。课程内容生动有趣，通过游戏的方式让孩子轻松掌握了编程知识，现在已经能自己设计小游戏了！",
        },
        {
          id: "2",
          user: "李老师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-18",
          content:
            "作为一名小学信息技术教师，我强烈推荐这门课程。课程设计非常符合小学生的认知特点，通过有趣的项目激发了学生的学习兴趣，教学效果很好。",
        },
        {
          id: "3",
          user: "张爸爸",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-02-25",
          content:
            "这是我见过的最适合小学生的编程课程，内容由浅入深，每节课都有明确的目标和成果。我的孩子通过这门课不仅学会了编程，还提高了解决问题的能力。",
        },
      ],
    }
  }
  // 人工智能课程
  else if (courseId === "8") {
    return {
      id: courseId,
      title: "人工智能课程",
      description: "从人工智能基础框架切入，理解技术原理与应用场景，同步结合机器人控制、智能项目开发等跨学科项目实践。",
      image: "/ai-course-concept.png",
      category: "人工智能",
      level: "高中",
      duration: "28小时",
      students: 850,
      rating: 4.8,
      tags: ["人工智能", "机器学习", "神经网络", "图像处理"],
      instructor: "赵博士",
      price: "¥399",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "1. 信息熵与特征选择",
          duration: "4小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "信息熵理论基础.pdf", url: "entropy_basics.pdf" },
            { id: "1-2", type: "video", title: "特征选择方法.mp4", url: "feature_selection.mp4" },
          ],
        },
        {
          id: "2",
          title: "2. KNN算法及应用",
          duration: "4小时",
          completed: false,
          resources: [
            { id: "2-1", type: "pdf", title: "KNN算法原理.pdf", url: "knn_algorithm.pdf" },
            { id: "2-2", type: "video", title: "KNN实际应用案例.mp4", url: "knn_applications.mp4" },
          ],
        },
        {
          id: "3",
          title: "3. 图像预处理探索",
          duration: "4小时",
          completed: false,
          resources: [{ id: "3-1", type: "pdf", title: "图像预处理技术.pdf", url: "image_preprocessing.pdf" }],
        },
        {
          id: "4",
          title: "4. 搭建多层神经网络",
          duration: "4小时",
          completed: false,
          resources: [
            { id: "4-1", type: "pdf", title: "神经网络基础.pdf", url: "neural_network_basics.pdf" },
            { id: "4-2", type: "video", title: "多层神经网络构建.mp4", url: "multilayer_nn.mp4" },
          ],
        },
        {
          id: "5",
          title: "5. 开源神经网络模型",
          duration: "4小时",
          completed: false,
          resources: [{ id: "5-1", type: "pdf", title: "开源模型概述.pdf", url: "open_source_models.pdf" }],
        },
        {
          id: "6",
          title: "6. 开源模型应用",
          duration: "4小时",
          completed: false,
          resources: [
            { id: "6-1", type: "pdf", title: "模型应用指南.pdf", url: "model_application_guide.pdf" },
            { id: "6-2", type: "video", title: "实际应用案例.mp4", url: "application_cases.mp4" },
          ],
        },
        {
          id: "7",
          title: "7. 模型训练影响因素",
          duration: "4小时",
          completed: false,
          resources: [
            { id: "7-1", type: "pdf", title: "训练参数优化.pdf", url: "training_parameters.pdf" },
            { id: "7-2", type: "video", title: "模型调优技巧.mp4", url: "model_tuning.mp4" },
          ],
        },
      ],
      objectives: [
        "掌握信息熵理论和特征选择方法",
        "理解KNN算法原理及其应用场景",
        "学习图像预处理技术和方法",
        "掌握多层神经网络的构建和训练",
        "了解主流开源神经网络模型",
        "学习如何应用开源模型解决实际问题",
        "理解影响模型训练效果的关键因素",
        "培养跨学科项目实践能力",
      ],
      requirements: ["高中数学基础", "基础编程知识", "对人工智能有兴趣", "具备基本逻辑思维能力"],
      targetAudience: [
        "高中生及以上学历的学习者",
        "对人工智能和机器学习感兴趣的学生",
        "希望掌握AI技术应用的爱好者",
        "想要进行跨学科项目实践的学习者",
      ],
      reviews: [
        {
          id: "1",
          user: "张明",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-10",
          content:
            "课程内容非常系统，从基础理论到实际应用都有详细讲解，特别是神经网络部分讲得非常清晰，很适合高中生学习。",
        },
        {
          id: "2",
          user: "李华",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-15",
          content: "作为一名高中生，这门课程让我对人工智能有了更深入的了解，实践项目很有挑战性，但也很有成就感。",
        },
        {
          id: "3",
          user: "王教授",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-02-20",
          content: "这门课程的教学设计非常出色，理论与实践结合得很好，我已经推荐给我的学生们学习。",
        },
      ],
    }
  }
  // 未来工程师课程
  else if (courseId === "3") {
    return {
      id: courseId,
      title: "未来工程师",
      description: "零基础学生用AI画图+智能建模工具，3步完成可爱他实战项目",
      image: "/images/future-engineer.png",
      category: "通用",
      level: "初级",
      duration: "18小时",
      students: 760,
      rating: 4.6,
      tags: ["AI绘图", "智能建模", "实战项目", "3D设计"],
      instructor: "张工程师",
      price: "¥299",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第1课 座椅精修",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "座椅精修基础.pdf", url: "chair_refinement_basics.pdf" },
            { id: "1-2", type: "video", title: "座椅精修演示.mp4", url: "chair_refinement_demo.mp4" },
          ],
        },
        {
          id: "2",
          title: "第2课 认识硬件",
          duration: "3小时",
          completed: false,
          resources: [{ id: "2-1", type: "pdf", title: "硬件基础知识.pdf", url: "hardware_basics.pdf" }],
        },
        {
          id: "3",
          title: "第3课 功能编程",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "4",
          title: "第4课 结构设计",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "5",
          title: "第5课 项目应用",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "6",
          title: "第6课 项目总结",
          duration: "3小时",
          completed: false,
          resources: [],
        },
      ],
      objectives: [
        "掌握AI绘图工具的基本使用方法",
        "了解智能建模的基本原理和应用",
        "学习3D结构设计的基础知识",
        "掌握功能编程的基本技能",
        "通过实战项目提升综合应用能力",
        "培养创新思维和解决问题的能力",
        "学习项目规划和总结的方法",
        "了解未来工程领域的发展趋势",
      ],
      requirements: ["基础计算机操作能力", "对AI和3D设计有兴趣", "具备基本逻辑思维能力", "无需编程基础"],
      targetAudience: [
        "零基础想学习AI绘图和智能建模的学生",
        "对3D设计和工程应用感兴趣的初学者",
        "希望快速掌握实用技能的学习者",
        "想要了解未来工程技术的爱好者",
      ],
      reviews: [
        {
          id: "1",
          user: "李同学",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-10",
          content:
            "作为零基础学生，这门课程让我能够快速上手AI绘图和智能建模工具，三步法教学非常适合初学者，现在我已经能独立完成简单的项目了！",
        },
        {
          id: "2",
          user: "王老师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-15",
          content:
            "课程内容设计合理，从基础到应用循序渐进，特别适合在校学生学习。建议可以增加一些更复杂的项目案例，帮助学生进一步提升。",
        },
        {
          id: "3",
          user: "张工程师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-02-20",
          content:
            "这门课程将AI绘图和智能建模工具结合得很好，实战项目部分设计得非常巧妙，能够让学生在短时间内看到成果，增强学习信心。",
        },
      ],
    }
  }
  // AI舞者课程
  else if (courseId === "6") {
    return {
      id: courseId,
      title: "AI舞者",
      description: "学习3D打印，体验AI语音，学习简单的编程，制作出可以说话，走路，跳舞的舞蹈机器人。",
      image: "/images/ai-dancer.png",
      category: "通用",
      level: "初级",
      duration: "24小时",
      students: 0,
      rating: 0,
      tags: ["3D打印", "AI语音", "编程", "机器人"],
      instructor: "待定",
      price: "¥349",
      featured: false,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "课程内容待更新",
          duration: "待定",
          completed: false,
          resources: [],
        },
      ],
      objectives: [
        "学习3D打印技术的基础知识和应用",
        "体验和掌握AI语音技术的基本原理",
        "学习简单的编程技能和逻辑思维",
        "掌握机器人设计和组装的基本方法",
        "学习如何让机器人实现说话功能",
        "掌握机器人行走和舞蹈动作的编程",
        "培养创新思维和动手能力",
        "了解人工智能和机器人技术的发展趋势",
      ],
      requirements: ["基础计算机操作能力", "对3D打印和机器人有兴趣", "具备基本逻辑思维能力", "无需编程基础"],
      targetAudience: [
        "对机器人和AI技术感兴趣的初学者",
        "想要学习3D打印技术的爱好者",
        "希望掌握简单编程技能的学习者",
        "对创意设计和动手制作感兴趣的人群",
      ],
      reviews: [],
    }
  }
  // AI应用能力训练课程
  else if (courseId === "4") {
    return {
      id: courseId,
      title: "AI应用能力训练",
      description:
        "本课程旨在提升学生的AI应用能力，通过实践项目学习AIGC工具和大语言模型应用，培养学生在AI时代的核心竞争力。",
      image: "/images/ai-application-training.png",
      category: "人工智能",
      level: "中级",
      duration: "25小时",
      students: 980,
      rating: 4.7,
      tags: ["AIGC", "大语言模型", "AI应用", "Deepseek"],
      instructor: "李教授",
      price: "¥349",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第一课 了解硬件",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "hardware.pdf", url: "hardware.pdf" },
            { id: "1-2", type: "video", title: "hardware.mp4", url: "hardware.mp4" },
          ],
        },
        {
          id: "2",
          title: "第二课 了解软件",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "3",
          title: "第三课 点阵小灯",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "4",
          title: "第四课 交通灯",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "5",
          title: "第五课 星际迷航",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "6",
          title: "第六课 舞蹈小⻋",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "7",
          title: "第七课 激光打靶",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "8",
          title: "第八课 幸运大转盘",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "9",
          title: "第九课 乒乓球游戏",
          duration: "3小时",
          completed: false,
          resources: [],
        },
      ],
      objectives: [
        "掌握AIGC工具的基本使用方法",
        "理解大语言模型的工作原理和应用场景",
        "学习高效的prompt编写技巧",
        "掌握Deepseek的安装和基础功能",
        "学习Deepseek的高级应用技巧",
        "通过实践项目提升AI应用能力",
        "了解AI技术在各行业的应用前景",
        "培养AI时代的核心竞争力",
      ],
      requirements: ["基础计算机操作能力", "对人工智能有基本了解", "具备基本英语阅读能力"],
      targetAudience: [
        "对AI应用感兴趣的学生",
        "希望提升AI工具使用能力的职场人士",
        "想要了解AIGC和大语言模型的初学者",
        "需要在工作中应用AI技术的专业人员",
      ],
      reviews: [
        {
          id: "1",
          user: "张明",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-10",
          content: "课程内容非常实用，通过学习我掌握了多种AI工具的使用方法，大大提高了工作效率！",
        },
        {
          id: "2",
          user: "王丽",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-25",
          content: "老师讲解清晰，案例丰富，特别是Deepseek的应用部分非常实用，推荐给想要提升AI应用能力的朋友。",
        },
        {
          id: "3",
          user: "刘伟",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-03-05",
          content: "作为AI初学者，这门课程让我快速入门并掌握了实用技能，课程设计循序渐进，非常适合我这样的新手。",
        },
      ],
    }
  }
  // Add these new course cases after the existing ones (before the default return)

  // Add the Intelligent Hardware Course (智能硬件课程)
  else if (courseId === "7") {
    return {
      id: courseId,
      title: "智能硬件课程",
      description: "通过实践项目学习智能硬件开发，从硬件基础到软件编程，培养学生的动手能力和创新思维。",
      image: "/images/intelligent-hardware.png",
      category: "硬件编程",
      level: "初级到中级",
      duration: "27小时",
      students: 680,
      rating: 4.6,
      tags: ["硬件编程", "Arduino", "电子设计", "创客教育"],
      instructor: "陈工程师",
      price: "¥349",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第一课 了解硬件",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "硬件基础知识.pdf", url: "hardware_basics.pdf" },
            { id: "1-2", type: "video", title: "硬件入门.mp4", url: "hardware_intro.mp4" },
          ],
        },
        {
          id: "2",
          title: "第二课 了解软件",
          duration: "3小时",
          completed: false,
          resources: [{ id: "2-1", type: "pdf", title: "软件基础.pdf", url: "software_basics.pdf" }],
        },
        {
          id: "3",
          title: "第三课 点阵小灯",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "4",
          title: "第四课 交通灯",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "5",
          title: "第五课 星际迷航",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "6",
          title: "第六课 舞蹈小车",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "7",
          title: "第七课 激光打靶",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "8",
          title: "第八课 幸运大转盘",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "9",
          title: "第九课 乒乓球游戏",
          duration: "3小时",
          completed: false,
          resources: [],
        },
      ],
      objectives: [
        "了解电子硬件的基本原理和组成",
        "掌握Arduino基础编程和控制方法",
        "学习LED、传感器等常用电子元件的应用",
        "掌握简单电路设计和连接方法",
        "学习通过编程控制硬件设备",
        "培养解决实际问题的能力",
        "通过项目实践提升动手能力",
        "培养创新思维和团队协作能力",
      ],
      requirements: ["基础计算机操作能力", "对电子硬件有兴趣", "具备基本逻辑思维能力", "无需编程基础"],
      targetAudience: [
        "对智能硬件开发感兴趣的初学者",
        "希望学习电子设计基础的学生",
        "想要提升动手实践能力的爱好者",
        "对创客教育感兴趣的教师和学生",
      ],
      reviews: [
        {
          id: "1",
          user: "王同学",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-12",
          content: "课程内容非常实用，通过动手实践让我对硬件编程有了更深入的理解，特别是点阵小灯和交通灯的项目很有趣！",
        },
        {
          id: "2",
          user: "李老师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-25",
          content: "作为一名教师，这门课程给了我很多教学灵感，课程设计循序渐进，非常适合引导学生进行创客教育。",
        },
        {
          id: "3",
          user: "张工程师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-03-08",
          content: "课程内容设计合理，从基础到应用，每个项目都有明确的学习目标，非常适合想要入门智能硬件开发的学习者。",
        },
      ],
    }
  }
  // Add the Youth Innovation Course (青创课)
  else if (courseId === "12") {
    return {
      id: courseId,
      title: "青创课",
      description: "培养青少年创新思维和实践能力，从创意激发到项目实施，全方位指导学生完成创新项目。",
      image: "/images/youth-innovation.png",
      category: "创新教育",
      level: "中级",
      duration: "21小时",
      students: 420,
      rating: 4.8,
      tags: ["创新思维", "项目设计", "硬件开发", "结构设计"],
      instructor: "林教授",
      price: "¥299",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第一课--创意激发",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "创意思维导图.pdf", url: "creative_thinking.pdf" },
            { id: "1-2", type: "video", title: "创意激发方法.mp4", url: "creativity_methods.mp4" },
          ],
        },
        {
          id: "2",
          title: "第二课--课题方向",
          duration: "3小时",
          completed: false,
          resources: [{ id: "2-1", type: "pdf", title: "课题选择指南.pdf", url: "topic_selection_guide.pdf" }],
        },
        {
          id: "3",
          title: "第三课--确定课题",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "4",
          title: "第四课--课题调研",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "5",
          title: "第五课-硬件设计",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "6",
          title: "第六节-结构设计",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "7",
          title: "第七课--程序设计",
          duration: "3小时",
          completed: false,
          resources: [],
        },
      ],
      objectives: [
        "培养创新思维和问题解决能力",
        "学习项目选题和方向确定方法",
        "掌握课题调研和资料收集技巧",
        "了解硬件设计的基本原理和方法",
        "学习结构设计的基本知识",
        "掌握简单的程序设计技能",
        "培养项目规划和实施能力",
        "提升团队协作和沟通表达能力",
      ],
      requirements: ["基础逻辑思维能力", "对创新项目有兴趣", "具备基本动手能力", "初中及以上学历"],
      targetAudience: [
        "对创新项目感兴趣的青少年",
        "希望提升创新思维的学生",
        "想要学习项目设计和实施的初学者",
        "参加创新比赛的学生团队",
      ],
      reviews: [
        {
          id: "1",
          user: "刘同学",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-15",
          content:
            "这门课程让我学会了如何从零开始规划一个创新项目，从创意激发到最终实施，每个环节都有详细指导，非常实用！",
        },
        {
          id: "2",
          user: "张老师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-03-28",
          content: "作为指导老师，这门课程给了我很多教学思路，课程内容设计合理，能够有效激发学生的创新思维和实践能力。",
        },
        {
          id: "3",
          user: "王家长",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-10",
          content:
            "孩子通过这门课程完成了自己的第一个创新项目，不仅学到了知识，更重要的是培养了解决问题的能力和自信心。",
        },
      ],
    }
  }
  // Add the Intelligent Irrigation Course (智能灌溉)
  else if (courseId === "8") {
    return {
      id: courseId,
      title: "智能灌溉",
      description: "学习智能灌溉系统的设计与实现，从基础电子元件到完整系统搭建，培养学生的实践能力和创新思维。",
      image: "/images/intelligent-irrigation.png",
      category: "智能农业",
      level: "中级",
      duration: "36小时",
      students: 520,
      rating: 4.7,
      tags: ["智能灌溉", "Arduino", "传感器应用", "自动化系统"],
      instructor: "王工程师",
      price: "¥399",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第一课 初识智能灌溉",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "智能灌溉概述.pdf", url: "irrigation_overview.pdf" },
            { id: "1-2", type: "video", title: "智能灌溉系统介绍.mp4", url: "irrigation_intro.mp4" },
          ],
        },
        {
          id: "2",
          title: "第二课 点亮LED灯",
          duration: "3小时",
          completed: false,
          resources: [{ id: "2-1", type: "pdf", title: "LED基础知识.pdf", url: "led_basics.pdf" }],
        },
        {
          id: "3",
          title: "第三课 呼吸灯",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "4",
          title: "第四课 蜂鸣器",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "5",
          title: "第五课 土壤湿度传感器",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "6",
          title: "第六课 继电器",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "7",
          title: "第七课 超声波",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "8",
          title: "第八课 温湿度传感器完整版",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "9",
          title: "第九课 水泵",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "10",
          title: "第十课 自动浇灌系统",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "11",
          title: "第十一课 灌溉系统搭建",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "12",
          title: "第十二课 系统框架",
          duration: "3小时",
          completed: false,
          resources: [],
        },
      ],
      objectives: [
        "了解智能灌溉的基本原理和应用场景",
        "掌握基础电子元件的使用方法",
        "学习各类传感器的工作原理和应用",
        "掌握Arduino编程控制硬件设备",
        "学习自动化系统的设计和实现",
        "掌握智能灌溉系统的搭建方法",
        "培养解决实际问题的能力",
        "提升项目规划和实施能力",
      ],
      requirements: ["基础电子知识", "基本编程概念", "对智能农业有兴趣", "具备基本动手能力"],
      targetAudience: [
        "对智能农业感兴趣的学生",
        "希望学习传感器应用的爱好者",
        "想要了解自动化系统的初学者",
        "对智能灌溉技术感兴趣的农业从业者",
      ],
      reviews: [
        {
          id: "1",
          user: "李工程师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-08",
          content: "课程内容非常实用，从基础电子元件到完整系统搭建，每个环节都讲解得很清晰，实践性很强。",
        },
        {
          id: "2",
          user: "张同学",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-20",
          content: "作为一名农业专业的学生，这门课程让我了解了智能灌溉的技术原理，对我的专业学习很有帮助。",
        },
        {
          id: "3",
          user: "王农户",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-03-05",
          content: "通过这门课程，我学会了如何搭建一个简单的智能灌溉系统，已经应用到我的小型农场中，效果很好！",
        },
      ],
    }
  }
  // Add the Informatics Olympiad Course (信息奥赛)
  else if (courseId === "11") {
    return {
      id: courseId,
      title: "信息奥赛",
      description: "系统学习信息学奥林匹克竞赛的核心知识和算法，从基础编程到高级算法，培养学生的逻辑思维和解题能力。",
      image: "/images/informatics-olympiad.png",
      category: "编程竞赛",
      level: "中级到高级",
      duration: "90小时",
      students: 750,
      rating: 4.9,
      tags: ["算法", "编程竞赛", "C++", "数据结构"],
      instructor: "张教授",
      price: "¥599",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第1课 算法初探",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "算法基础.pdf", url: "algorithm_basics.pdf" },
            { id: "1-2", type: "video", title: "算法入门.mp4", url: "algorithm_intro.mp4" },
          ],
        },
        {
          id: "2",
          title: "第2课 阴影的面积(常量变量表达式，赋值语句)",
          duration: "3小时",
          completed: false,
          resources: [{ id: "2-1", type: "pdf", title: "变量与表达式.pdf", url: "variables_expressions.pdf" }],
        },
        {
          id: "3",
          title: "第3课 计算机画图",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "4",
          title: "第4课 程序的顺序结构",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "5",
          title: "第5课 随机出题(常用函数，运算符)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "6",
          title: "第6课 初识分支(单分支、双分支、关系运算符)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "7",
          title: "第7课 字母的判断(逻辑运算符和逻辑表达式)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "8",
          title: "第8课 讨厌的分支嵌套",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "9",
          title: "第9课 闰年的由来(switch语句)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "10",
          title: "第10课 谁的成绩最好(分支结构的优化与复习)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "11",
          title: "第11课 初识循环(while循环结构)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "12",
          title: "第12课 大篮子能装多少个苹果(黑加器的使用)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "13",
          title: "第13课 想重复几次就几次(for计数循环)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "14",
          title: "第14课 随心所欲控制循环(循环条件的设置)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "15",
          title: "第15课 先执行再判断(dowhile循环结构)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "16",
          title: "第17课 有趣的循环算法(打插法，数列求π)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "17",
          title: "第18课 最大公约数研究(一般循环，更相减损术，辗转相除法)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "18",
          title: "第19课 形状各异的几何图形上(双重循环)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "19",
          title: "第20课 形状各异的几何图形下(双重循环)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "20",
          title: "第21课 奔跑的小人(双重循环应用)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "21",
          title: "第22课 枚举法及基本思想(单重循环枚举)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "22",
          title: "第23课 让我们帮警察一起破案(双重循环枚举)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "23",
          title: "第24课 2147483647是素数吗?(特殊的枚举)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "24",
          title: "第25课 批量处理数据(数组初探)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "25",
          title: "第26课 利用数组解决实际问题(数组的应用)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "26",
          title: "第27课 数据排序上(桶排与选择排序)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "27",
          title: "第28课 数据排序下(冒泡排序与插入排序)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "28",
          title: "第29课 怎样快速的找到你(顺序查找和对分查找)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "29",
          title: "第30课 走出迷宫(二维字符数组)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "30",
          title: "第31课 海量数据怎么办?(文件的妙用)",
          duration: "3小时",
          completed: false,
          resources: [],
        },
      ],
      objectives: [
        "掌握C++编程语言的核心语法和特性",
        "理解基础算法和数据结构的原理和应用",
        "学习分支、循环等基本程序结构的使用",
        "掌握数组和字符串的处理方法",
        "学习常用排序和查找算法",
        "培养算法思维和解题能力",
        "提升编程竞赛的应试技巧",
        "为参加信息学奥林匹克竞赛做准备",
      ],
      requirements: ["基础数学知识", "基本逻辑思维能力", "初中及以上学历", "对编程有兴趣"],
      targetAudience: [
        "希望参加信息学奥林匹克竞赛的学生",
        "对算法和编程感兴趣的中学生",
        "想要提升编程能力的青少年",
        "希望在计算机科学领域深造的学生",
      ],
      reviews: [
        {
          id: "1",
          user: "王同学",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-18",
          content: "这门课程内容非常系统，从基础到进阶，每个知识点都讲解得很清晰，通过学习我在省赛中获得了一等奖！",
        },
        {
          id: "2",
          user: "李老师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-03-25",
          content: "作为一名信息学竞赛教练，我强烈推荐这门课程，课程内容设计合理，练习题丰富，非常适合备赛使用。",
        },
        {
          id: "3",
          user: "张家长",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-10",
          content: "孩子通过这门课程对编程产生了浓厚的兴趣，不仅学到了知识，更重要的是培养了解决问题的能力和思维方式。",
        },
      ],
    }
  }
  // Add the AI Architect Course (AI架构师)
  else if (courseId === "9") {
    return {
      id: courseId,
      title: "AI架构师",
      description: "探索计算机视觉和人工智能的奇妙世界，从Python基础到图像识别和目标检测，培养学生的AI应用能力。",
      image: "/images/ai-architect.png",
      category: "人工智能",
      level: "中级",
      duration: "24小时",
      students: 620,
      rating: 4.8,
      tags: ["计算机视觉", "Python", "图像识别", "AI应用"],
      instructor: "黄博士",
      price: "¥499",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第1课-视界初启:计算机视觉的奇幻之旅",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "计算机视觉概述.pdf", url: "computer_vision_overview.pdf" },
            { id: "1-2", type: "video", title: "视觉AI入门.mp4", url: "vision_ai_intro.mp4" },
          ],
        },
        {
          id: "2",
          title: "第2课-Python初体验:编程世界的钥匙",
          duration: "3小时",
          completed: false,
          resources: [{ id: "2-1", type: "pdf", title: "Python基础.pdf", url: "python_basics.pdf" }],
        },
        {
          id: "3",
          title: "第3课-像素小侦探:图像世界的秘密调查",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "4",
          title: "第4课-美颜大师班:AI帮我来装饰",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "5",
          title: "第5课-识图小能手:图像识别的入门挑战",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "6",
          title: "第6课-姿势猜一猜:姿态识别小游戏",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "7",
          title: "第7课-视觉创意工坊:打造我的图像识别系统",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "8",
          title: "第8课-目标找一找:图像检测入门挑战",
          duration: "3小时",
          completed: false,
          resources: [],
        },
      ],
      objectives: [
        "了解计算机视觉的基本原理和应用场景",
        "掌握Python编程基础和核心库的使用",
        "学习图像处理和分析的基本技术",
        "掌握图像识别和分类的基本方法",
        "学习姿态识别的基本原理和应用",
        "培养创建图像识别系统的能力",
        "了解目标检测的基本原理和应用",
        "培养AI应用的实践能力和创新思维",
      ],
      requirements: ["基础计算机知识", "基本数学概念", "对人工智能有兴趣", "初中及以上学历"],
      targetAudience: [
        "对计算机视觉和AI感兴趣的学生",
        "希望学习Python和图像处理的初学者",
        "想要了解AI应用开发的爱好者",
        "对图像识别和目标检测感兴趣的青少年",
      ],
      reviews: [
        {
          id: "1",
          user: "李同学",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-15",
          content: "这门课程让我对计算机视觉产生了浓厚的兴趣，通过实践项目学习，我已经能够开发简单的图像识别应用了！",
        },
        {
          id: "2",
          user: "王老师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-03-28",
          content: "课程内容设计得非常好，从基础到应用，每个知识点都有实践项目，非常适合引导学生学习AI技术。",
        },
        {
          id: "3",
          user: "张工程师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-10",
          content:
            "作为一名AI从业者，我认为这门课程对初学者非常友好，内容由浅入深，实践性强，是入门计算机视觉的好选择。",
        },
      ],
    }
  }
  // Add the 3D Modeling Course (3D建模)
  else if (courseId === "13") {
    return {
      id: courseId,
      title: "3D建模",
      description: "学习3D打印和建模技术，从基础操作到创意设计，培养学生的空间思维和创新能力。",
      image: "/images/3d-modeling.png",
      category: "设计与创意",
      level: "初级到中级",
      duration: "39小时",
      students: 580,
      rating: 4.7,
      tags: ["3D打印", "建模设计", "创意制作", "实用项目"],
      instructor: "刘设计师",
      price: "¥399",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第一课 走进3D打印",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "3D打印技术概述.pdf", url: "3d_printing_overview.pdf" },
            { id: "1-2", type: "video", title: "3D打印入门.mp4", url: "3d_printing_intro.mp4" },
          ],
        },
        {
          id: "2",
          title: "第二课 软件的基本操作",
          duration: "3小时",
          completed: false,
          resources: [{ id: "2-1", type: "pdf", title: "建模软件基础.pdf", url: "modeling_software_basics.pdf" }],
        },
        {
          id: "3",
          title: "第三课 杯子与杯垫",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "4",
          title: "第四课 创意笔筒",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "5",
          title: "第五课 印章",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "6",
          title: "第六课 创意书签",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "7",
          title: "第七课 兔子支架",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "8",
          title: "第八课 桌面收纳盒",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "9",
          title: "第九课 创意果篮",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "10",
          title: "第十课 生活助手-密封夹",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "11",
          title: "第十一课 3D手机壳",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "12",
          title: "第十二课 台灯",
          duration: "3小时",
          completed: false,
          resources: [],
        },
        {
          id: "13",
          title: "第十三课 地球仪",
          duration: "3小时",
          completed: false,
          resources: [],
        },
      ],
      objectives: [
        "了解3D打印技术的基本原理和应用",
        "掌握3D建模软件的基本操作方法",
        "学习基础几何体的创建和编辑技巧",
        "掌握实用物品的设计和建模方法",
        "学习创意设计的思路和技巧",
        "培养空间思维和创新能力",
        "掌握3D模型的优化和打印准备",
        "通过实践项目提升综合应用能力",
      ],
      requirements: ["基础计算机操作能力", "对3D设计有兴趣", "具备基本空间思维能力", "无需建模经验"],
      targetAudience: [
        "对3D打印和建模感兴趣的初学者",
        "希望学习创意设计的学生",
        "想要制作实用物品的爱好者",
        "对新兴技术感兴趣的青少年",
      ],
      reviews: [
        {
          id: "1",
          user: "张同学",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-12",
          content: "这门课程让我从零基础入门3D建模，每个项目都很实用，现在我已经能够设计和打印自己的创意作品了！",
        },
        {
          id: "2",
          user: "李老师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-25",
          content: "课程内容设计合理，从简单到复杂，每个项目都有明确的学习目标，非常适合在校学生学习3D设计。",
        },
        {
          id: "3",
          user: "王设计师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-03-08",
          content: "作为一名设计师，我认为这门课程对初学者非常友好，项目选择很贴近生活，能够激发学习兴趣和创造力。",
        },
      ],
    }
  }

  // 激光雷达竞速车课程（默认课程）
  return {
    id: courseId,
    title: "激光雷达竞速车",
    description:
      "围绕着车辆主控制板Arduino、直流电机及驱动、转向舵机等硬件，结合arduinoC语言，通过项目式学习，最终让学生自主设计完成一个激光雷达小车。",
    image: "/images/lidar-racing-car.png",
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
}

export default function CourseDetail({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 获取课程数据
  const course = getCourseData(params.id)

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

  // 检查是否为AI芯动工坊课程
  const isAIChipCourse = params.id === "1"
  // 检查是否为AI智能制造课程
  const isAIManufacturingCourse = params.id === "2"
  // 检查是否为AI创想家课程
  const isAICreativeCourse = params.id === "5"
  // 检查是否为人工智能课程
  const isAICourse = params.id === "8"
  // 检查是否为未来工程师课程
  const isFutureEngineerCourse = params.id === "3"
  // 检查是否为AI舞者课程
  const isAIDancerCourse = params.id === "6"
  // 检查是否为智能硬件课程
  const isIntelligentHardwareCourse = params.id === "7"
  // 检查是否为青创课课程
  const isYouthInnovationCourse = params.id === "12"
  // 检查是否为智能灌溉课程
  const isIntelligentIrrigationCourse = params.id === "8"
  // 检查是否为信息奥赛课程
  const isInformaticsOlympiadCourse = params.id === "11"
  // 检查是否为AI架构师课程
  const isAIArchitectCourse = params.id === "9"
  // 检查是否为3D建模课程
  const is3DModelingCourse = params.id === "13"

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
              {course.rating > 0 && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-amber-400 stroke-amber-400 mr-1" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-gray-500 ml-1">({course.reviews.length} 评价)</span>
                </div>
              )}
              {course.students > 0 && (
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-1" />
                  <span>{course.students} 名学员</span>
                </div>
              )}
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

            {course.instructor !== "待定" && (
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
            )}
          </div>

          {/* 课程封面和操作按钮 */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                {!isAIDancerCourse && (
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
                )}
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
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={isAIDancerCourse}>
                    {isAIDancerCourse ? "即将上线" : course.progress > 0 ? "继续学习" : "立即学习"}
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
            {course.reviews.length > 0 && (
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                学员评价
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">课程介绍</h2>
                  <p className="text-gray-700 mb-4">{course.description}</p>
                  {isAIChipCourse ? (
                    <p className="text-gray-700">
                      本课程分为小学和中学两个阶段，涵盖了AI芯片和人工智能的基础知识、硬件和软件编程技能、
                      机器感知和语言处理等内容。通过理论学习和实践项目相结合的方式，帮助学生全面了解AI芯片技术，
                      培养创新思维和解决问题的能力，为未来的AI时代做好准备。
                    </p>
                  ) : isAIManufacturingCourse ? (
                    <p className="text-gray-700">
                      本课程将带领学生深入了解AI智能制造的实践应用，从项目分析、设计思路到软硬件实现， 通过Arduino
                      UNO平台进行实际项目开发。课程内容包括问题分析、设计方案、程序编写、实物制作和调试等环节，
                      注重理论与实践相结合，帮助学生掌握智能制造项目的完整开发流程，培养解决实际问题的能力。
                    </p>
                  ) : isAICreativeCourse ? (
                    <p className="text-gray-700">
                      本课程专为小学生设计，通过有趣的游戏和项目，引导学生学习Python编程和创意开发。
                      课程内容包括迷宫寻宝、小企鹅冒险、游戏开发等主题，通过三步走策略（掌握核心库、理解应用场景、善用开发工具），
                      帮助学生从零基础开始，逐步掌握编程技能，最终能够独立开发实用的Python作品。
                    </p>
                  ) : isAICourse ? (
                    <p className="text-gray-700">
                      本课程专为高中学生设计，从人工智能基础框架入手，系统讲解信息熵、KNN算法、图像处理和神经网络等核心内容。
                      课程结合机器人控制和智能项目开发等跨学科实践，帮助学生理解AI技术原理并掌握实际应用能力，
                      为未来深入学习人工智能或参与相关领域的研究与开发打下坚实基础。
                    </p>
                  ) : isFutureEngineerCourse ? (
                    <p className="text-gray-700">
                      本课程专为零基础学生设计，通过AI绘图和智能建模工具的结合，帮助学生快速掌握3D设计和工程应用的基本技能。
                      课程采用三步法教学，从座椅精修入手，逐步学习硬件知识、功能编程和结构设计，最终完成实战项目。
                      无需编程基础，通过简单易学的工具和方法，让学生能够快速上手并创作出自己的作品。
                    </p>
                  ) : isAIDancerCourse ? (
                    <p className="text-gray-700">
                      本课程将带领学生学习3D打印技术、AI语音识别与合成，以及简单的编程知识，通过实践项目制作一个能够说话、走路和跳舞的舞蹈机器人。
                      课程内容涵盖3D模型设计与打印、AI语音技术应用、机器人编程控制等方面，注重动手实践和创意表达，
                      帮助学生在有趣的项目中掌握多学科知识，培养创新思维和解决问题的能力。
                    </p>
                  ) : isIntelligentHardwareCourse ? (
                    <p className="text-gray-700">
                      本课程将带领学生通过实践项目学习智能硬件开发，从硬件基础到软件编程，培养学生的动手能力和创新思维。
                      课程内容涵盖电子硬件的基本原理和组成、Arduino基础编程和控制方法、LED、传感器等常用电子元件的应用、简单电路设计和连接方法等，
                      注重理论与实践相结合，帮助学生掌握智能硬件开发的基本技能，培养解决实际问题的能力。
                    </p>
                  ) : isYouthInnovationCourse ? (
                    <p className="text-gray-700">
                      本课程旨在培养青少年创新思维和实践能力，从创意激发到项目实施，全方位指导学生完成创新项目。
                      课程内容涵盖创意激发、课题方向、课题调研、硬件设计、结构设计、程序设计等环节，
                      注重理论与实践相结合，帮助学生掌握创新项目的完整开发流程，培养解决实际问题的能力。
                    </p>
                  ) : isIntelligentIrrigationCourse ? (
                    <p className="text-gray-700">
                      本课程将带领学生学习智能灌溉系统的设计与实现，从基础电子元件到完整系统搭建，培养学生的实践能力和创新思维。
                      课程内容涵盖智能灌溉的基本原理和应用场景、基础电子元件的使用方法、各类传感器的工作原理和应用、Arduino编程控制硬件设备等，
                      注重理论与实践相结合，帮助学生掌握智能灌溉系统的搭建方法，培养解决实际问题的能力。
                    </p>
                  ) : isAIArchitectCourse ? (
                    <p className="text-gray-700">
                      本课程将带领学生探索计算机视觉和人工智能的奇妙世界，从Python基础到图像识别和目标检测，培养学生的AI应用能力。
                      课程内容涵盖计算机视觉的基本原理和应用场景、Python编程基础和核心库的使用、图像处理和分析的基本技术等，
                      注重理论与实践相结合，帮助学生掌握AI应用开发的基本技能，培养解决实际问题的能力。
                    </p>
                  ) : isInformaticsOlympiadCourse ? (
                    <p className="text-gray-700">
                      本课程将带领学生系统学习信息学奥林匹克竞赛的核心知识和算法，从基础编程到高级算法，培养学生的逻辑思维和解题能力。
                      课程内容涵盖C++编程语言的核心语法和特性、基础算法和数据结构的原理和应用、分支、循环等基本程序结构的使用等，
                      注重理论与实践相结合，帮助学生掌握编程竞赛的应试技巧，为参加信息学奥林匹克竞赛做准备。
                    </p>
                  ) : is3DModelingCourse ? (
                    <p className="text-gray-700">
                      本课程将带领学生学习3D打印和建模技术，从基础操作到创意设计，培养学生的空间思维和创新能力。
                      课程内容涵盖3D打印技术的基本原理和应用、3D建模软件的基本操作方法、基础几何体的创建和编辑技巧等，
                      注重理论与实践相结合，帮助学生掌握3D建模的基本技能，培养解决实际问题的能力。
                    </p>
                  ) : params.id === "4" ? (
                    <p className="text-gray-700">
                      本课程将带领学生深入了解AIGC和大语言模型的应用，从基础概念到高级应用技巧，
                      通过实践项目帮助学生掌握AI工具的使用方法，提升在AI时代的核心竞争力。
                      课程内容包括AIGC工具探索、Deepseek应用实践等，注重理论与实践相结合， 帮助学生快速掌握AI应用能力。
                    </p>
                  ) : (
                    <p className="text-gray-700">
                      本课程将带领学生从Arduino基础知识开始，逐步学习电子设计、编程逻辑、传感器应用等内容，
                      通过实践项目帮助学生掌握硬件编程技能，最终完成一个功能完整的激光雷达竞速车项目。
                      课程采用项目式学习方法，注重理论与实践相结合，帮助学生建立系统的硬件编程知识体系。
                    </p>
                  )}
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
                      {isAIChipCourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Cpu className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">AI芯片技术</p>
                              <p className="text-sm text-gray-500">掌握前沿AI芯片技术和应用</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Layers className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">分级教学</p>
                              <p className="text-sm text-gray-500">小学和中学阶段分级教学</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Zap className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">创新思维</p>
                              <p className="text-sm text-gray-500">培养AI时代的创新思维和解决问题能力</p>
                            </div>
                          </div>
                        </>
                      ) : isAIManufacturingCourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Settings className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">项目实战</p>
                              <p className="text-sm text-gray-500">通过实际项目掌握智能制造技能</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Code className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Arduino应用</p>
                              <p className="text-sm text-gray-500">使用Arduino UNO进行智能控制</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Cpu className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">全流程学习</p>
                              <p className="text-sm text-gray-500">从分析设计到实现调试的完整流程</p>
                            </div>
                          </div>
                        </>
                      ) : isAICreativeCourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Lightbulb className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">创意编程</p>
                              <p className="text-sm text-gray-500">通过游戏和项目激发创造力</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Code className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Python基础</p>
                              <p className="text-sm text-gray-500">适合小学生的Python编程入门</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Rocket className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">实用项目</p>
                              <p className="text-sm text-gray-500">从迷宫寻宝到自动寻路的实用作品</p>
                            </div>
                          </div>
                        </>
                      ) : isAICourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Brain className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">系统学习</p>
                              <p className="text-sm text-gray-500">从基础理论到实际应用的系统学习</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Layers className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">神经网络</p>
                              <p className="text-sm text-gray-500">掌握多层神经网络构建和应用</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Code className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">跨学科实践</p>
                              <p className="text-sm text-gray-500">结合机器人控制和智能项目开发</p>
                            </div>
                          </div>
                        </>
                      ) : isFutureEngineerCourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Lightbulb className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">零基础入门</p>
                              <p className="text-sm text-gray-500">无需编程基础，快速上手AI工具</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Code className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">三步法教学</p>
                              <p className="text-sm text-gray-500">简单高效的学习方法</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Rocket className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">实战项目</p>
                              <p className="text-sm text-gray-500">完成可爱实用的3D设计作品</p>
                            </div>
                          </div>
                        </>
                      ) : isAIDancerCourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Lightbulb className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">3D打印技术</p>
                              <p className="text-sm text-gray-500">学习3D模型设计与打印技术</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <MessageSquare className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">AI语音技术</p>
                              <p className="text-sm text-gray-500">体验AI语音识别与合成应用</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Rocket className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">舞蹈机器人</p>
                              <p className="text-sm text-gray-500">制作能说话、走路、跳舞的机器人</p>
                            </div>
                          </div>
                        </>
                      ) : isIntelligentHardwareCourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Lightbulb className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">实践项目</p>
                              <p className="text-sm text-gray-500">通过动手实践掌握硬件编程</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Code className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Arduino基础</p>
                              <p className="text-sm text-gray-500">学习Arduino编程和电子设计</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Settings className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">创客教育</p>
                              <p className="text-sm text-gray-500">培养创新思维和动手能力</p>
                            </div>
                          </div>
                        </>
                      ) : isYouthInnovationCourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Lightbulb className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">创新思维</p>
                              <p className="text-sm text-gray-500">培养创新思维和问题解决能力</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Code className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">项目设计</p>
                              <p className="text-sm text-gray-500">学习项目选题和方向确定方法</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Rocket className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">实践能力</p>
                              <p className="text-sm text-gray-500">提升团队协作和沟通表达能力</p>
                            </div>
                          </div>
                        </>
                      ) : isIntelligentIrrigationCourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Lightbulb className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">智能农业</p>
                              <p className="text-sm text-gray-500">了解智能灌溉的基本原理和应用</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Code className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">传感器应用</p>
                              <p className="text-sm text-gray-500">学习各类传感器的工作原理和应用</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Settings className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">自动化系统</p>
                              <p className="text-sm text-gray-500">掌握自动化系统的设计和实现</p>
                            </div>
                          </div>
                        </>
                      ) : isAIArchitectCourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Lightbulb className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">计算机视觉</p>
                              <p className="text-sm text-gray-500">探索计算机视觉的奇妙世界</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Code className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Python编程</p>
                              <p className="text-sm text-gray-500">掌握Python编程基础和核心库</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Rocket className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">AI应用能力</p>
                              <p className="text-sm text-gray-500">培养AI应用的实践能力和创新思维</p>
                            </div>
                          </div>
                        </>
                      ) : isInformaticsOlympiadCourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Lightbulb className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">算法学习</p>
                              <p className="text-sm text-gray-500">系统学习信息学奥赛的核心知识</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Code className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">C++编程</p>
                              <p className="text-sm text-gray-500">掌握C++编程语言的核心语法</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Rocket className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">竞赛技巧</p>
                              <p className="text-sm text-gray-500">提升编程竞赛的应试技巧</p>
                            </div>
                          </div>
                        </>
                      ) : is3DModelingCourse ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Lightbulb className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">3D打印技术</p>
                              <p className="text-sm text-gray-500">了解3D打印技术的基本原理</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Code className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">建模设计</p>
                              <p className="text-sm text-gray-500">掌握3D建模软件的基本操作方法</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Rocket className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">创意制作</p>
                              <p className="text-sm text-gray-500">培养空间思维和创新能力</p>
                            </div>
                          </div>
                        </>
                      ) : params.id === "4" ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">实用AI工具</p>
                              <p className="text-sm text-gray-500">掌握当前最流行的AI工具应用方法</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Brain className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">提示词工程</p>
                              <p className="text-sm text-gray-500">学习高效的prompt编写技巧</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Code className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">实践项目</p>
                              <p className="text-sm text-gray-500">通过实际项目提升AI应用能力</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
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

            {isAIDancerCourse ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-700 mb-4">课程内容正在精心准备中</h3>
                <p className="text-gray-600 mb-6">我们的教学团队正在为您打造高质量的学习内容，敬请期待！</p>
                <Button variant="outline">预约通知</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {course.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between bg-gray-50 p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div>
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
                    {chapter.resources && chapter.resources.length > 0 && (
                      <div className="p-4 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">章节资源</h4>
                        <div className="space-y-2">
                          {chapter.resources.map((resource) => (
                            <div
                              key={resource.id}
                              className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                            >
                              <div className="flex items-center">
                                {resource.type === "pdf" ? (
                                  <FileText className="h-4 w-4 text-red-500 mr-2" />
                                ) : (
                                  <Play className="h-4 w-4 text-blue-500 mr-2" />
                                )}
                                <span className="text-sm">{resource.title}</span>
                              </div>
                              <Button variant="outline" size="sm" disabled={isAIDancerCourse}>
                                {resource.type === "pdf" ? "查看" : "播放"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {course.reviews.length > 0 && (
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
            </TabsContent>
          )}
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
                    {isAIChipCourse
                      ? index === 0
                        ? "AI芯片高级应用"
                        : index === 1
                          ? "人工智能基础与应用"
                          : "智能硬件设计入门"
                      : isAIManufacturingCourse
                        ? index === 0
                          ? "Arduino高级应用与项目开发"
                          : index === 1
                            ? "智能工厂设计与实施"
                            : "工业物联网技术与应用"
                        : isAICreativeCourse
                          ? index === 0
                            ? "Python游戏开发进阶"
                            : index === 1
                              ? "少儿编程与创意思维"
                              : "AI绘画与创意设计"
                          : isAICourse
                            ? index === 0
                              ? "深度学习实战"
                              : index === 1
                                ? "计算机视觉应用"
                                : "自然语言处理入门"
                            : isFutureEngineerCourse
                              ? index === 0
                                ? "AI辅助设计进阶"
                                : index === 1
                                  ? "3D打印技术入门"
                                  : "智能硬件开发基础"
                              : isAIDancerCourse
                                ? index === 0
                                  ? "机器人编程入门"
                                  : index === 1
                                    ? "3D打印技术与应用"
                                    : "AI语音技术实战"
                                : params.id === "4"
                                  ? index === 0
                                    ? "ChatGPT高级应用实战"
                                    : index === 1
                                      ? "AI绘画与创意设计"
                                      : "大语言模型开发入门"
                                  : isIntelligentHardwareCourse
                                    ? index === 0
                                      ? "Arduino高级编程与项目实战"
                                      : index === 1
                                        ? "智能家居DIY实践"
                                        : "机器人设计与编程基础"
                                    : isYouthInnovationCourse
                                      ? index === 0
                                        ? "创新项目设计与实施"
                                        : index === 1
                                          ? "硬件开发与结构设计"
                                          : "程序设计与算法应用"
                                      : isIntelligentIrrigationCourse
                                        ? index === 0
                                          ? "传感器技术与应用"
                                          : index === 1
                                            ? "Arduino编程与控制"
                                            : "自动化系统设计与实现"
                                        : isAIArchitectCourse
                                          ? index === 0
                                            ? "图像识别与目标检测"
                                            : index === 1
                                              ? "Python编程与AI应用"
                                              : "深度学习与神经网络"
                                          : isInformaticsOlympiadCourse
                                            ? index === 0
                                              ? "算法设计与分析"
                                              : index === 1
                                                ? "数据结构与算法"
                                                : "C++编程与竞赛技巧"
                                            : is3DModelingCourse
                                              ? index === 0
                                                ? "3D打印技术与应用"
                                                : index === 1
                                                  ? "建模软件高级技巧"
                                                  : "创意设计与实践项目"
                                              : index === 0
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
