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
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { VideoPlayer } from "@/components/video-player"
import { PDFViewer } from "@/components/pdf-viewer"

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
  // 人工智能基础与应用课程
  if (courseId === "1") {
    return {
      id: courseId,
      title: "人工智能基础与应用",
      description:
        '本课程将带领小学生化身"AI小侦探"，揭开人工智能的神秘面纱！通过游戏化学习、互动实验与创意项目，学生将探索人脸识别、语音助手、机器翻译等AI技术背后的魔法。课程以"理解AI→训练AI→应用AI→反思AI"为主线，结合生活场景（如垃圾分类、宠物识别、动画生成），使用可视化AI工具（如TeachableMachine、Blockly编程）和趣味数据集（如表情包图片、动物叫声），亲手训练会"思考"的模型，设计能"对话"的程序，解锁"AI+创造力"的无限可能！让科技不再冰冷，让算法充满童心！',
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
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第一章",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "第一章课件.pdf", url: "/pdfs/第一章课件.pdf" },
            { id: "1-2", type: "video", title: "认识人工智能.mp4", url: "认识人工智能.mp4" },
          ],
        },
        {
          id: "2",
          title: "第二章",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "2-1", type: "pdf", title: "第二章课件.pdf", url: "第二章课件.pdf" },
            { id: "2-2", type: "video", title: "什么是物联网.mp4", url: "什么是物联网.mp4" },
            { id: "2-3", type: "video", title: "什么是云计算.mp4", url: "什么是大数据.mp4" },
          ],
        },
        {
          id: "3",
          title: "第三章",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "3-1", type: "pdf", title: "第三章课件.pdf", url: "第三章课件.pdf" },
            { id: "3-2", type: "video", title: "图像识别.mp4", url: "图像识别.mp4" },
            { id: "3-3", type: "video", title: "人脸识别.mp4", url: "人脸识别.mp4" },
            { id: "3-4", type: "video", title: "声纹识别.mp4", url: "声纹识别.mp4" },
            { id: "3-5", type: "video", title: "自然语言处理.mp4", url: "自然语言处理.mp4" },
            { id: "3-6", type: "video", title: "知识图谱.mp4", url: "知识图谱.mp4" },
          ],
        },
        {
          id: "4",
          title: "第四章",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "4-1", type: "pdf", title: "第四章课件.pdf", url: "第四章课件.pdf" },
            { id: "4-2", type: "video", title: "机器学习.mp4", url: "机器学习.mp4" },
          ],
        },
        {
          id: "5",
          title: "第五章",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "5-1", type: "pdf", title: "第五章课件.pdf", url: "第五章课件.pdf" },
            { id: "5-2", type: "video", title: "OCR文字识别.mp4", url: "OCR文字识别.mp4" },
          ],
        },
        {
          id: "6",
          title: "第六章",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "6-1", type: "pdf", title: "第六章课件.pdf", url: "第六章课件.pdf" },
            { id: "6-2", type: "video", title: "手术机器人.mp4", url: "手术机器人.mp4" },
          ],
        },
        {
          id: "7",
          title: "第七章",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "7-1", type: "pdf", title: "第七章课件.pdf", url: "第七章课件.pdf" },
            { id: "7-2", type: "video", title: "智能巡逻机器人.mp4", url: "智能巡逻机器人.mp4" },
          ],
        },
        {
          id: "8",
          title: "第八章",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "8-1", type: "pdf", title: "第八章课件.pdf", url: "第八章课件.pdf" },
            { id: "8-2", type: "video", title: "天猫无人超市.mp4", url: "天猫无人超市.mp4" },
          ],
        },
        {
          id: "9",
          title: "第九章",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "9-1", type: "pdf", title: "第九章课件.pdf", url: "第九章课件.pdf" },
            { id: "9-2", type: "video", title: "云计算服务模型.mp4", url: "云计算服务模型.mp4" },
          ],
        },
        {
          id: "10",
          title: "第十章",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "10-1", type: "pdf", title: "第十章课件.pdf", url: "第十章课件.pdf" },
            { id: "10-2", type: "video", title: "百度Apollo无人车.mp4", url: "百度Apollo无人车.mp4" },
          ],
        },
      ],
      objectives: [
        "理解AI的三大核心能力：感知（如摄像头捕捉图像）、决策（如路径规划）、交互（如语音对话）",
        "区分人类智能与人工智能的异同，认识AI的辅助性角色",
        "学会用图形化工具训练简单分类模型（如区分猫狗、识别情绪）",
        "掌握语音指令编程基础，设计能听懂命令的互动程序",
        '培养数据思维，理解"数据质量影响AI表现"（如教AI认水果需多样图片）',
        "建立批判性思维，讨论AI伦理问题（如人脸识别的隐私风险）",
        "结合艺术创作（绘画、音乐）开发AI增强作品，体验人机协同创新",
        '通过小组项目解决真实问题（如设计"教室节能小管家"AI系统）',
      ],
      requirements: [
        "知道动植物分类的基本概念（如哺乳动物、昆虫的区别）",
        '理解简单因果关系（如"按开关→灯亮"）',
        "掌握加减乘除运算，能比较数值大小（用于理解概率、阈值）",
        "认识基础几何图形（如圆形、三角形在图像识别中的应用）",
        "会使用相机拍摄照片、用麦克风录制语音（用于构建数据集）",
        "能在指导下安全访问教育类AI平台（如KhanAcademyKids）",
        '愿意接受"AI会犯错"（如把橘子识别成橙子），并尝试改进模型',
        "对团队协作持开放态度，能分享创意并倾听他人建议",
      ],
      targetAudience: [
        '对智能手机、智能音箱等科技产品充满好奇，常问"它是怎么知道的？"',
        "喜欢益智游戏、解谜挑战，或对绘画、音乐等创意表达感兴趣",
        "基础识字量与逻辑理解能力（如读懂简单流程图）",
        "能够使用电脑/平板完成拖拽、点击等基础操作",
      ],
      reviews: [
        {
          id: "1",
          user: "李家长",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-15",
          content:
            "孩子非常喜欢这门课程，现在对AI充满了兴趣，经常问我各种技术问题，课程内容生动有趣，非常适合小学生学习！",
        },
        {
          id: "2",
          user: "王老师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-03-28",
          content:
            "作为一名小学科学老师，我认为这门课程设计得非常棒，把复杂的AI概念讲得简单易懂，学生们都很喜欢动手实践的部分。",
        },
        {
          id: "3",
          user: "张同学",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-10",
          content: "课程很有趣，我最喜欢训练AI识别图片的部分。不过有些地方对我来说有点难，需要爸爸妈妈帮忙。",
        },
      ],
    }
  }

  // Add a new condition for the second course (deepseek学习)
  else if (courseId === "2") {
    return {
      id: courseId,
      title: "deepseek学习",
      description:
        '本课程以"深度探索（DeepSeek）"为核心，带领小学生化身"知识探矿者"，在人工智能、自然奥秘与数字科技的丛林中展开冒险！课程采用"问题驱动的深度探究法"，围绕"AI如何学习""数据如何说话""算法如何思考"等主题，通过互动游戏、虚拟实验室和跨学科项目，解密深度学习的基础逻辑。学生将亲手训练会"进化"的AI模型（如预测天气的神经网络、识别星座的视觉系统），设计能"自主思考"的互动程序，并在"数据迷宫""算法解密屋"等沉浸式场景中，体验从现象观察→假设提出→模型验证→知识迁移的完整探索过程，培养科学家的思维方式！',
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
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第一章 deepseek使用指南概述",
          duration: "3小时",
          completed: false,
          resources: [{ id: "1-1", type: "video", title: "简介.mp4", url: "简介.mp4" }],
        },
        {
          id: "2",
          title: "第二章 为什么要学使用deepseek",
          duration: "3小时",
          completed: false,
          resources: [{ id: "2-1", type: "video", title: "学习原因.mp4", url: "学习原因.mp4" }],
        },
        {
          id: "3",
          title: "第三章 deepseek的版本介绍",
          duration: "3小时",
          completed: false,
          resources: [{ id: "3-1", type: "video", title: "版本详情.mp4", url: "版本详情.mp4" }],
        },
        {
          id: "4",
          title: "第四章 deepseek的几种使用方式",
          duration: "3小时",
          completed: false,
          resources: [{ id: "4-1", type: "video", title: "使用方式.mp4", url: "使用方式.mp4" }],
        },
        {
          id: "5",
          title: "第五章 网页端几个按钮的作用",
          duration: "3小时",
          completed: false,
          resources: [{ id: "5-1", type: "video", title: "按钮功能.mp4", url: "按钮功能.mp4" }],
        },
        {
          id: "6",
          title: "第六章 deepseek的共识",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "6-1", type: "video", title: "提示词和背景信息.mp4", url: "提示词和背景信息.mp4" },
            { id: "6-2", type: "video", title: "巧妙利用乔哈里视窗.mp4", url: "巧妙利用乔哈里视窗.mp4" },
            {
              id: "6-3",
              type: "video",
              title: "使用大白话交流&指定思考步骤.mp4",
              url: "使用大白话交流&指定思考步骤.mp4",
            },
          ],
        },
        {
          id: "7",
          title: "第七章 deepseek的使用技巧",
          duration: "3小时",
          completed: false,
          resources: [
            { id: "7-1", type: "video", title: "角色+信息+目标.mp4", url: "角色+信息+目标.mp4" },
            { id: "7-2", type: "video", title: "不要定义过程.mp4", url: "不要定义过程.mp4" },
            { id: "7-3", type: "video", title: "明确受众&风格明确.mp4", url: "明确受众&风格明确.mp4" },
          ],
        },
        {
          id: "8",
          title: "第八章 deepseek进阶技巧",
          duration: "4小时",
          completed: false,
          resources: [
            { id: "8-1", type: "video", title: "联网功能&补充额外信息.mp4", url: "联网功能&补充额外信息.mp4" },
            { id: "8-2", type: "video", title: "上下文联系&清楚记忆.mp4", url: "上下文联系&清楚记忆.mp4" },
            { id: "8-3", type: "video", title: "反馈与迭代优化.mp4", url: "反馈与迭代优化.mp4" },
            { id: "8-4", type: "video", title: "复杂问题，分步拆解.mp4", url: "复杂问题，分步拆解.mp4" },
          ],
        },
      ],
      objectives: [
        "理解深度学习的三大魔法：数据喂养（如训练集）、特征提取（如模式识别）、迭代优化（如梯度下降）",
        "认识AI与现实世界的互动关系（如推荐系统、自动驾驶）",
        "掌握可视化AI工具（如TensorFlowPlayground）调整神经网络参数",
        "学会用自然语言训练对话机器人（如定制专属故事生成器）",
        '建立"假设-验证"思维习惯，学会用数据证据支持观点',
        '培养元认知能力，通过"教AI学习"反思自身学习策略',
        "讨论AI伦理困境（如算法偏见、信息茧房）",
        '通过"人机协作挑战赛"，理解技术与人文的平衡之道',
      ],
      requirements: [
        "理解百分比与概率（如80%准确率意味着什么）",
        "掌握坐标系概念（用于可视化神经网络训练过程）",
        "会使用搜索引擎获取信息，能辨别广告与真实内容",
        "了解基础网络安全知识（如不随意上传个人信息）",
        "能在指导下使用在线教育平台（如DeepSeek少儿版界面）",
        "会整理分类数据（如按颜色/形状整理图片数据集）",
        '接受"AI答案不唯一"，享受开放式探索过程',
        '愿意用"错误日志本"记录实验失败案例',
      ],
      targetAudience: [
        '对"机器为什么会思考"充满好奇，喜欢《解密X档案》类探索节目',
        "擅长逻辑推理游戏（如数独、密室逃脱），或对数据分析感兴趣（如统计班级身高）",
        '需具备初步抽象思维，能理解"训练次数影响模型精度"等类比概念',
      ],
      reviews: [
        {
          id: "1",
          user: "王家长",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-04-10",
          content: "这门课程非常适合对AI有兴趣的孩子，内容深入浅出，通过探索式学习激发了孩子的好奇心和创造力！",
        },
        {
          id: "2",
          user: "张老师",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          date: "2024-03-25",
          content: "课程设计很有创意，将复杂的深度学习概念通过游戏和实验的方式呈现，学生们学得很开心，也很有收获。",
        },
        {
          id: "3",
          user: "李同学",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          date: "2024-03-05",
          content: "我最喜欢训练AI模型的部分，看着自己设计的程序能够自主思考，感觉特别神奇！",
        },
      ],
    }
  }

  // AI应用能力训练课程
  else if (courseId === "6") {
    return {
      id: courseId,
      title: "AI应用能力训练",
      description:
        "本课程旨在提升学生的AI应用能力，通过实践项目学习AIGC工具和大语言模型应用，培养学生在AI时代的核心竞争力。本课程将带领学生深入了解AIGC和大语言模型的应用，从基础概念到高级应用技巧，通过实践项目帮助学生掌握AI工具的使用方法，提升在AI时代的核心竞争力。课程内容包括AIGC工具探索，注重理论与实践相结合，帮助学生快速掌握AI应用能力。",
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
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第一课 AIGC生成式人工智能工具",
          duration: "4小时",
          completed: false,
          resources: [
            { id: "1-1", type: "pdf", title: "AIGC生成式人工智能工具课件.pdf", url: "AIGC生成式人工智能工具课件.pdf" },
          ],
        },
        {
          id: "2",
          title: "第二课 AIGC工具链接",
          duration: "4小时",
          completed: false,
          resources: [{ id: "2-1", type: "pdf", title: "AIGC工具链接课件.pdf", url: "AIGC工具链接课件.pdf" }],
        },
        {
          id: "3",
          title: "第三课 AIGC网址使用大全",
          duration: "4小时",
          completed: false,
          resources: [{ id: "3-1", type: "pdf", title: "AIGC网址使用大全课件.pdf", url: "AIGC网址使用大全课件.pdf" }],
        },
        {
          id: "4",
          title: "第四课 AIGC训练营",
          duration: "5小时",
          completed: false,
          resources: [{ id: "4-1", type: "pdf", title: "AIGC训练课件.pdf", url: "AIGC训练课件.pdf" }],
        },
      ],
      objectives: [
        "掌握AIGC工具的基本使用方法",
        "理解大语言模型的工作原理和应用场景",
        "学习高效的prompt编写技巧",
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

  // AI芯动工坊课程
  else if (courseId === "3") {
    return {
      id: courseId,
      title: "AI芯动工坊",
      description:
        "结合编程理论和实际，开发智能应用，培养学生的硬件和软件技能，并用创新的工具优化和改进他们的理解和动手能力，帮助学生掌握AI芯片技术，激发学生对AI创新的兴趣。本课程分为小学和中学两个阶段，涵盖了AI芯片和人工智能的基础知识、硬件和软件编程技能、机器感知和语言处理等内容。通过理论学习和实践项目相结合的方式，帮助学生全面了解AI芯片技术，培养创新思维和解决问题的能力，为未来的AI时代做好准备。",
      image: "/images/ai-chip-workshop-new.png",
      category: "人工智能",
      level: "初级到中级",
      duration: "40小时",
      students: 1560,
      rating: 4.9,
      tags: ["AI芯片", "硬件编程", "软件开发", "创新思维"],
      instructor: "王老师",
      price: "¥499",
      featured: true,
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "小学阶段",
          duration: "20小时",
          completed: false,
          resources: [],
          subChapters: [
            {
              id: "1-1",
              title: "第一课 初识人工智能",
              resources: [{ id: "1-1-1", type: "pdf", title: "初识人工智能课件.pdf", url: "初识人工智能课件.pdf" }],
            },
            {
              id: "1-2",
              title: "第二课 人工智能畅想",
              resources: [{ id: "1-2-1", type: "pdf", title: "人工智能创想曲课件.pdf", url: "人工智能创想曲课件.pdf" }],
            },
            {
              id: "1-3",
              title: "第三课 人工智能交互",
              resources: [{ id: "1-3-1", type: "pdf", title: "人工智能交互课件.pdf", url: "人工智能交互课件.pdf" }],
            },
            {
              id: "1-4",
              title: "第四课 无处不在的人工智能",
              resources: [
                { id: "1-4-1", type: "pdf", title: "无处不在的人工智能课件.pdf", url: "无处不在的人工智能课件.pdf" },
              ],
            },
            {
              id: "1-5",
              title: "第五课 机器的耳朵",
              resources: [{ id: "1-5-1", type: "pdf", title: "机器的耳朵课件.pdf", url: "机器的耳朵课件.pdf" }],
            },
            {
              id: "1-6",
              title: "第六课 我的语音助手(一)",
              resources: [
                { id: "1-6-1", type: "pdf", title: "我的语音助手(一)课件.pdf", url: "我的语音助手(一)课件.pdf" },
              ],
            },
            {
              id: "1-7",
              title: "第七课 我的语音助手(二)",
              resources: [
                { id: "1-7-1", type: "pdf", title: "我的语音助手(二)课件.pdf", url: "我的语音助手(二)课件.pdf" },
              ],
            },
            {
              id: "1-8",
              title: "第八课 机器的眼睛",
              resources: [{ id: "1-8-1", type: "pdf", title: "机器的眼睛课件.pdf", url: "机器的眼睛课件.pdf" }],
            },
            {
              id: "1-9",
              title: "第九课 手势识别",
              resources: [{ id: "1-9-1", type: "pdf", title: "手势识别课件.pdf", url: "手势识别课件.pdf" }],
            },
            {
              id: "1-10",
              title: "第十课 猜拳机器人",
              resources: [{ id: "1-10-1", type: "pdf", title: "猜拳机器人课件.pdf", url: "猜拳机器人课件.pdf" }],
            },
            {
              id: "1-11",
              title: "第十一课 人脸检测知多少",
              resources: [
                { id: "1-11-1", type: "pdf", title: "人脸检测知多少课件.pdf", url: "人脸检测知多少课件.pdf" },
              ],
            },
            {
              id: "1-12",
              title: "第十二课 人脸检测全流程",
              resources: [
                { id: "1-12-1", type: "pdf", title: "人脸检测全流程课件.pdf", url: "人脸检测全流程课件.pdf" },
              ],
            },
            {
              id: "1-13",
              title: "情绪小怪兽",
              resources: [{ id: "1-13-1", type: "pdf", title: "情绪小怪兽课件.pdf", url: "情绪小怪兽课件.pdf" }],
            },
            {
              id: "1-14",
              title: "第十四课 智能安防小专家(上)",
              resources: [
                { id: "1-14-1", type: "pdf", title: "智能安防小专家(上)课件.pdf", url: "智能安防小专家(上)课件.pdf" },
              ],
            },
            {
              id: "1-15",
              title: "第十五课 智能安防小专家(下)",
              resources: [
                { id: "1-15-1", type: "pdf", title: "智能安防小专家(下)课件.pdf", url: "智能安防小专家(下)课件.pdf" },
              ],
            },
          ],
        },
        {
          id: "2",
          title: "初中阶段",
          duration: "20小时",
          completed: false,
          resources: [],
          subChapters: [
            {
              id: "2-1",
              title: "01 人工智能和识谈",
              resources: [{ id: "2-1-1", type: "pdf", title: "人工智能和识谈课件.pdf", url: "人工智能和识谈课件.pdf" }],
            },
            {
              id: "2-2",
              title: "02 人工智能工具箱(上)",
              resources: [
                { id: "2-2-1", type: "pdf", title: "人工智能工具箱(上)课件.pdf", url: "人工智能工具箱(上)课件.pdf" },
              ],
            },
            {
              id: "2-3",
              title: "03 人工智能工具箱(下)",
              resources: [
                { id: "2-3-1", type: "pdf", title: "人工智能工具箱(下)课件.pdf", url: "人工智能工具箱(下)课件.pdf" },
              ],
            },
            {
              id: "2-4",
              title: "04 人工智能机器视觉技术概览(上)",
              resources: [
                {
                  id: "2-4-1",
                  type: "pdf",
                  title: "人工智能机器视觉技术概览(上)课件.pdf",
                  url: "人工智能机器视觉技术概览(上)课件.pdf",
                },
              ],
            },
            {
              id: "2-5",
              title: "05 人工智能机器视觉技术概览(下)",
              resources: [
                {
                  id: "2-5-1",
                  type: "pdf",
                  title: "人工智能机器视觉技术概览(下)课件.pdf",
                  url: "人工智能机器视觉技术概览(下)课件.pdf",
                },
              ],
            },
            {
              id: "2-6",
              title: "06 人工智能语音识别技术概览(上)",
              resources: [
                {
                  id: "2-6-1",
                  type: "pdf",
                  title: "人工智能语音识别技术概览(上)课件.pdf",
                  url: "人工智能语音识别技术概览(上)课件.pdf",
                },
              ],
            },
            {
              id: "2-7",
              title: "07 人工智能语音识别技术概览(下)",
              resources: [
                {
                  id: "2-7-1",
                  type: "pdf",
                  title: "人工智能语音识别技术概览(下)课件.pdf",
                  url: "人工智能语音识别技术概览(下)课件.pdf",
                },
              ],
            },
            {
              id: "2-8",
              title: "08 人工智能项目分析",
              resources: [
                { id: "2-8-1", type: "pdf", title: "人工智能项目分析课件.pdf", url: "人工智能项目分析课件.pdf" },
              ],
            },
            {
              id: "2-9",
              title: "09 我的萌宠",
              resources: [{ id: "2-9-1", type: "pdf", title: "我的萌宠课件.pdf", url: "我的萌宠课件.pdf" }],
            },
            {
              id: "2-10",
              title: "10 健康萌宠",
              resources: [{ id: "2-10-1", type: "pdf", title: "健康萌宠课件.pdf", url: "健康萌宠课件.pdf" }],
            },
            {
              id: "2-11",
              title: "11 手动小助手",
              resources: [{ id: "2-11-1", type: "pdf", title: "手动小助手课件.pdf", url: "手动小助手课件.pdf" }],
            },
            {
              id: "2-12",
              title: "12 定时喂食器",
              resources: [{ id: "2-12-1", type: "pdf", title: "定时喂食器课件.pdf", url: "定时喂食器课件.pdf" }],
            },
            {
              id: "2-13",
              title: "13 猫咪识别",
              resources: [{ id: "2-13-1", type: "pdf", title: "猫咪识别课件.pdf", url: "猫咪识别课件.pdf" }],
            },
            {
              id: "2-14",
              title: "14 自动小助手",
              resources: [{ id: "2-14-1", type: "pdf", title: "自动小助手课件.pdf", url: "自动小助手课件.pdf" }],
            },
            {
              id: "2-15",
              title: "15 机器学习概览及智能农业前瞻",
              resources: [
                {
                  id: "2-15-1",
                  type: "pdf",
                  title: "机器学习概览及智能农业前瞻课件.pdf",
                  url: "机器学习概览及智能农业前瞻课件.pdf",
                },
              ],
            },
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

  // 激光雷达竞速车课程
  else if (courseId === "9") {
    return {
      id: courseId,
      title: "激光雷达竞速车",
      description:
        "围绕着车辆主控制板Arduino、直流电机及驱动、转向舵机等硬件，结合arduinoC语言，通过项目式学习，最终让学生自主设计完成一个激光雷达小车。本课程将带领学生从Arduino基础知识开始，逐步学习电子设计、编程逻辑、传感器应用等内容，通过实践项目帮助学生掌握硬件编程技能，最终完成一个功能完整的激光雷达竞速车项目。课程采用项目式学习方法，注重理论与实践相结合，帮助学生建立系统的硬件编程知识体系。",
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
      progress: 0,
      chapters: [
        {
          id: "1",
          title: "第1课 Arduino编程初探",
          duration: "2小时",
          completed: false,
          resources: [{ id: "1-1", type: "pdf", title: "Arduino编程初探课件.pdf", url: "Arduino编程初探课件.pdf" }],
        },
        {
          id: "2",
          title: "第2-3课 电子设计基础与安全规范",
          duration: "4小时",
          completed: false,
          resources: [
            { id: "2-1", type: "pdf", title: "电子设计基础与安全规范课件.pdf", url: "电子设计基础与安全规范课件.pdf" },
          ],
        },
        {
          id: "3",
          title: "第4课 LED流水灯与编程逻辑",
          duration: "2小时",
          completed: false,
          resources: [
            { id: "3-1", type: "pdf", title: "LED流水灯与编程逻辑课件.pdf", url: "LED流水灯与编程逻辑课件.pdf" },
          ],
        },
        {
          id: "4",
          title: "第5课 按键读取与串口通信",
          duration: "2小时",
          completed: false,
          resources: [
            { id: "4-1", type: "pdf", title: "按键读取与串口通信课件.pdf", url: "按键读取与串口通信课件.pdf" },
          ],
        },
        {
          id: "5",
          title: "第6课 光敏电阻与自动大灯",
          duration: "2小时",
          completed: false,
          resources: [
            { id: "5-1", type: "pdf", title: "光敏电阻与自动大灯课件.pdf", url: "光敏电阻与自动大灯课件.pdf" },
          ],
        },
        {
          id: "6",
          title: "第7课 蜂鸣器报警与PWM控制",
          duration: "2小时",
          completed: false,
          resources: [
            { id: "6-1", type: "pdf", title: "蜂鸣器报警与PWM控制课件.pdf", url: "蜂鸣器报警与PWM控制课件.pdf" },
          ],
        },
        {
          id: "7",
          title: "第8课 数码管显示与控制",
          duration: "2小时",
          completed: false,
          resources: [{ id: "7-1", type: "pdf", title: "数码管显示与控制课件.pdf", url: "数码管显示与控制课件.pdf" }],
        },
        {
          id: "8",
          title: "第9课 继电器控制与电路应用",
          duration: "2小时",
          completed: false,
          resources: [
            { id: "8-1", type: "pdf", title: "继电器控制与电路应用课件.pdf", url: "继电器控制与电路应用课件.pdf" },
          ],
        },
        {
          id: "9",
          title: "第11课 PWM技术与呼吸灯",
          duration: "2小时",
          completed: false,
          resources: [{ id: "9-1", type: "pdf", title: "PWM技术与呼吸灯课件.pdf", url: "PWM技术与呼吸灯课件.pdf" }],
        },
        {
          id: "10",
          title: "第12课 直流电机控制",
          duration: "2小时",
          completed: false,
          resources: [{ id: "10-1", type: "pdf", title: "直流电机控制课件.pdf", url: "直流电机控制课件.pdf" }],
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

  // 默认返回一个基本课程
  return {
    id: courseId,
    title: "课程详情",
    description: "课程描述加载中...",
    image: "/online-learning-platform.png",
    category: "未分类",
    level: "初级",
    duration: "0小时",
    students: 0,
    rating: 0,
    tags: [],
    instructor: "待定",
    price: "免费",
    featured: false,
    progress: 0,
    chapters: [],
    objectives: [],
    requirements: [],
    targetAudience: [],
    reviews: [],
  }
}

export default function CourseDetail({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 新增状态用于视频和PDF查看器
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null)
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; title: string } | null>(null)

  // 获取课程数据
  const course = getCourseData(params.id)

  // 修复自动打开PDF的bug - 移除自动打开PDF的useEffect
  // 不再自动打开PDF，只有当用户点击时才会打开

  // 检查是否有权限查看课程
  const hasPermission = ["1", "2", "3", "6", "9"].includes(params.id)

  // 如果没有权限，显示购买提示
  if (!hasPermission) {
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
            </div>

            {/* 课程封面和操作按钮 */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-amber-600">{course.price}</span>
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">购买课程</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 权限提示 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
            <div className="text-amber-600 text-5xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V7a3 3 0 00-3-3H6a3 3 0 00-3 3v4a3 3 0 003 3h3a3 3 0 003-3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">暂无权限查看课程资源</h2>
            <p className="text-gray-600 mb-6">请购买课程以获取完整的学习内容和资源</p>
            <Button className="bg-amber-600 hover:bg-amber-700">立即购买</Button>
          </div>
        </div>
      </div>
    )
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
                          <Cpu className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">专业内容</p>
                          <p className="text-sm text-gray-500">由行业专家精心设计的课程内容</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <Layers className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">实践项目</p>
                          <p className="text-sm text-gray-500">通过实际项目巩固所学知识</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <Zap className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">灵活学习</p>
                          <p className="text-sm text-gray-500">随时随地按照自己的节奏学习</p>
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (resource.type === "pdf") {
                                  setSelectedPdf({ url: resource.url, title: resource.title })
                                } else if (resource.type === "video") {
                                  setSelectedVideo({ url: resource.url, title: resource.title })
                                }
                              }}
                            >
                              {resource.type === "pdf" ? "查看" : "播放"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {chapter.subChapters && chapter.subChapters.length > 0 && (
                    <div className="p-4 border-t">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">子章节</h4>
                      <div className="space-y-2">
                        {chapter.subChapters.map((subChapter) => (
                          <div key={subChapter.id} className="border rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between bg-gray-50 p-3">
                              <div className="flex items-center">
                                <div>
                                  <h4 className="font-medium text-sm">{subChapter.title}</h4>
                                </div>
                              </div>
                            </div>
                            {subChapter.resources && subChapter.resources.length > 0 && (
                              <div className="p-3 border-t">
                                <div className="space-y-2">
                                  {subChapter.resources.map((resource) => (
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
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          if (resource.type === "pdf") {
                                            setSelectedPdf({ url: resource.url, title: resource.title })
                                          } else if (resource.type === "video") {
                                            setSelectedVideo({ url: resource.url, title: resource.title })
                                          }
                                        }}
                                      >
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
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                  <Image src="/online-learning-platform.png" alt="课程封面" fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {index === 0 ? "AI应用进阶" : index === 1 ? "人工智能基础与应用" : "智能硬件设计入门"}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-amber-400 stroke-amber-400 mr-1" />
                      <span className="text-sm">{4.5 + index * 0.1}</span>
                    </div>
                    <span className="text-sm text-gray-500">{20 + index * 5}小时</span>
                  </div>
                  <div className="mt-4">
                    <span className="font-bold text-amber-600">¥{299 + index * 50}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 border-t">
                  <Button variant="outline" className="w-full">
                    查看详情
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 视频播放器模态框 */}
      {selectedVideo && (
        <VideoPlayer
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
        />
      )}

      {/* PDF查看器模态框 */}
      {selectedPdf && (
        <PDFViewer
          isOpen={!!selectedPdf}
          onClose={() => setSelectedPdf(null)}
          pdfUrl={selectedPdf.url}
          title={selectedPdf.title}
        />
      )}
    </div>
  )
}
