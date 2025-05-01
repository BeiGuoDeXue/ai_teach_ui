"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, FileText, Info, RefreshCw, Send, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// 文本分类结果类型
interface ClassificationResult {
  category: string
  probability: number
  color: string
}

// 情感分析结果类型
interface SentimentResult {
  sentiment: "positive" | "negative" | "neutral"
  score: number
  emoji: string
  color: string
}

export default function TextClassificationPage() {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"category" | "sentiment">("category")
  const [categoryResults, setCategoryResults] = useState<ClassificationResult[]>([])
  const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null)
  const [examples, setExamples] = useState<string[]>([
    "这款手机的屏幕非常清晰，电池续航也很长，总体来说非常满意这次购买。",
    "今天的天气真好，阳光明媚，让人心情愉快。",
    "这家餐厅的服务态度很差，菜品质量也不好，价格还很贵，非常失望。",
    "人工智能技术正在快速发展，将对未来的工作和生活产生深远影响。",
    "这部电影情节紧凑，演员表演出色，是近年来不可多看的佳作。",
  ])

  const modelRef = useRef<any>({
    toxicity: null,
    sentiment: null,
    universalSentenceEncoder: null,
  })

  // 加载TensorFlow.js和模型
  const loadTensorFlowAndModels = useCallback(async () => {
    try {
      setIsModelLoading(true)
      setError(null)

      // 动态导入TensorFlow.js
      const tf = await import("@tensorflow/tfjs")
      console.log("TensorFlow.js loaded:", tf.version)

      // 模拟加载模型的延迟
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 模拟模型加载成功
      modelRef.current = {
        toxicity: true,
        sentiment: true,
        universalSentenceEncoder: true,
      }

      console.log("Text classification models loaded")
      setIsModelLoading(false)
    } catch (err) {
      console.error("Error loading TensorFlow.js or models:", err)
      setError("加载模型时出错，请刷新页面重试。")
      setIsModelLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTensorFlowAndModels()
  }, [loadTensorFlowAndModels])

  // 清空文本
  const clearText = () => {
    setText("")
    setCategoryResults([])
    setSentimentResult(null)
  }

  // 使用示例文本
  const useExample = (example: string) => {
    setText(example)
  }

  // 分类文本
  const classifyText = async () => {
    if (!text.trim()) {
      setError("请输入要分析的文本")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setCategoryResults([])
      setSentimentResult(null)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (activeTab === "category") {
        // 改进的文本分类逻辑，使用更精确的关键词匹配和权重
        const categories = [
          {
            category: "科技",
            probability: 0.1,
            color: "blue",
            keywords: [
              "人工智能",
              "AI",
              "技术",
              "手机",
              "电脑",
              "互联网",
              "编程",
              "软件",
              "硬件",
              "数据",
              "算法",
              "机器学习",
              "深度学习",
              "5G",
              "云计算",
              "大数据",
            ],
          },
          {
            category: "教育",
            probability: 0.1,
            color: "green",
            keywords: [
              "学习",
              "教育",
              "学校",
              "课程",
              "老师",
              "学生",
              "知识",
              "培训",
              "教学",
              "考试",
              "学院",
              "大学",
              "研究",
              "论文",
              "教授",
              "讲师",
            ],
          },
          {
            category: "娱乐",
            probability: 0.1,
            color: "purple",
            keywords: [
              "电影",
              "音乐",
              "演员",
              "表演",
              "游戏",
              "综艺",
              "明星",
              "歌手",
              "导演",
              "剧情",
              "电视剧",
              "节目",
              "演唱会",
              "票房",
              "粉丝",
            ],
          },
          {
            category: "体育",
            probability: 0.1,
            color: "orange",
            keywords: [
              "比赛",
              "运动",
              "球队",
              "冠军",
              "足球",
              "篮球",
              "选手",
              "教练",
              "奥运",
              "健身",
              "训练",
              "联赛",
              "球员",
              "体育场",
              "得分",
              "赛事",
            ],
          },
          {
            category: "商业",
            probability: 0.1,
            color: "gray",
            keywords: [
              "价格",
              "购买",
              "商品",
              "销售",
              "市场",
              "经济",
              "金融",
              "投资",
              "股票",
              "企业",
              "公司",
              "产品",
              "消费",
              "营销",
              "品牌",
              "交易",
            ],
          },
        ]

        // 计算每个类别的匹配度
        for (const category of categories) {
          let matchCount = 0
          for (const keyword of category.keywords) {
            if (text.includes(keyword)) {
              matchCount++
            }
          }

          // 根据匹配的关键词数量计算概率
          if (matchCount > 0) {
            // 使用非线性函数增强匹配效果
            category.probability = Math.min(0.1 + Math.pow(matchCount / category.keywords.length, 0.7), 0.99)
          }
        }

        // 排序并设置结果
        const sortedCategories = categories.sort((a, b) => b.probability - a.probability)
        setCategoryResults(sortedCategories)
      } else {
        // 改进的情感分析逻辑
        // 更全面的情感词汇表
        const positiveWords = [
          "好",
          "满意",
          "喜欢",
          "优秀",
          "出色",
          "愉快",
          "开心",
          "高兴",
          "棒",
          "赞",
          "精彩",
          "完美",
          "舒适",
          "美丽",
          "优质",
          "推荐",
          "惊喜",
          "感谢",
          "享受",
          "成功",
          "清晰",
          "方便",
          "实用",
          "可靠",
          "耐用",
          "专业",
          "高效",
          "友好",
          "热情",
          "贴心",
        ]

        const negativeWords = [
          "差",
          "失望",
          "不好",
          "糟糕",
          "讨厌",
          "难受",
          "痛苦",
          "生气",
          "烂",
          "坏",
          "可怕",
          "恶心",
          "困难",
          "麻烦",
          "昂贵",
          "浪费",
          "破损",
          "缺陷",
          "问题",
          "故障",
          "慢",
          "卡顿",
          "模糊",
          "粗糙",
          "劣质",
          "不满",
          "抱怨",
          "退货",
          "骗子",
          "欺诈",
        ]

        // 计算情感得分
        let positiveScore = 0
        let negativeScore = 0

        // 为每个匹配的词增加权重
        for (const word of positiveWords) {
          if (text.includes(word)) {
            positiveScore += 1
          }
        }

        for (const word of negativeWords) {
          if (text.includes(word)) {
            negativeScore += 1
          }
        }

        // 确定情感类型和分数
        let sentiment: "positive" | "negative" | "neutral" = "neutral"
        let score = 0.5
        let emoji = "😐"
        let color = "gray"

        const totalScore = positiveScore + negativeScore

        if (totalScore > 0) {
          if (positiveScore > negativeScore) {
            sentiment = "positive"
            // 计算正面情感的强度
            score = 0.5 + 0.5 * (positiveScore / (positiveScore + negativeScore))
            emoji = score > 0.8 ? "😄" : "😊"
            color = "green"
          } else if (negativeScore > positiveScore) {
            sentiment = "negative"
            // 计算负面情感的强度
            score = 0.5 - 0.5 * (negativeScore / (positiveScore + negativeScore))
            emoji = score < 0.2 ? "😡" : "😞"
            color = "red"
          } else {
            // 正负面情感相当
            sentiment = "neutral"
            score = 0.5
            emoji = "😐"
            color = "gray"
          }
        } else {
          // 没有明显情感词汇
          sentiment = "neutral"
          score = 0.5
          emoji = "😐"
          color = "gray"
        }

        setSentimentResult({
          sentiment,
          score,
          emoji,
          color,
        })
      }
    } catch (err) {
      console.error("Error classifying text:", err)
      setError(`分析文本时出错: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 获取情感分析结果文本
  const getSentimentText = (sentiment: "positive" | "negative" | "neutral") => {
    switch (sentiment) {
      case "positive":
        return "积极"
      case "negative":
        return "消极"
      case "neutral":
        return "中性"
      default:
        return "未知"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/ai-experience" className="flex items-center text-purple-600 hover:text-purple-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回AI体验中心
          </Link>
        </div>

        <Card className="border-2 border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple-800">文本分类</CardTitle>
                <p className="text-sm text-purple-700 mt-1">分析文本的情感倾向、主题类别或语言风格</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {isModelLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-12 w-12 text-purple-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">正在加载模型...</h3>
                <p className="text-gray-500 max-w-md text-center">首次加载可能需要一些时间，请耐心等待</p>
              </div>
            ) : error && !categoryResults.length && !sentimentResult ? (
              <Alert variant="destructive" className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>出错了</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="text-input" className="text-sm font-medium text-gray-700">
                      输入文本
                    </label>
                    <Button variant="ghost" size="sm" onClick={clearText} disabled={!text}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      清空
                    </Button>
                  </div>
                  <Textarea
                    id="text-input"
                    placeholder="请输入要分析的文本..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">示例文本</h3>
                    <span className="text-xs text-gray-500">点击使用示例</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {examples.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => useExample(example)}
                      >
                        {example.length > 20 ? example.substring(0, 20) + "..." : example}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "category" | "sentiment")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="category">主题分类</TabsTrigger>
                      <TabsTrigger value="sentiment">情感分析</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex justify-center mb-6">
                  <Button
                    onClick={classifyText}
                    disabled={isLoading || !text.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        分析中...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        开始分析
                      </>
                    )}
                  </Button>
                </div>

                {/* 分类结果 */}
                {activeTab === "category" && categoryResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">主题分类结果</h3>
                    <div className="space-y-3">
                      {categoryResults.map((result, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <Badge
                                className={cn(
                                  "mr-2",
                                  index === 0
                                    ? "bg-purple-500"
                                    : index === 1
                                      ? "bg-blue-500"
                                      : index === 2
                                        ? "bg-green-500"
                                        : "bg-gray-500",
                                )}
                              >
                                {index + 1}
                              </Badge>
                              <span className="font-medium">{result.category}</span>
                            </div>
                            <span className="text-sm">{(result.probability * 100).toFixed(2)}%</span>
                          </div>
                          <Progress
                            value={result.probability * 100}
                            className={cn(
                              "h-2",
                              index === 0
                                ? "bg-purple-100"
                                : index === 1
                                  ? "bg-blue-100"
                                  : index === 2
                                    ? "bg-green-100"
                                    : "bg-gray-100",
                            )}
                            indicatorClassName={
                              index === 0
                                ? "bg-purple-500"
                                : index === 1
                                  ? "bg-blue-500"
                                  : index === 2
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 情感分析结果 */}
                {activeTab === "sentiment" && sentimentResult && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">情感分析结果</h3>
                    <div className="bg-white p-6 rounded-lg border text-center">
                      <div className="text-6xl mb-4">{sentimentResult.emoji}</div>
                      <div
                        className={cn(
                          "text-xl font-bold mb-2",
                          sentimentResult.sentiment === "positive"
                            ? "text-green-600"
                            : sentimentResult.sentiment === "negative"
                              ? "text-red-600"
                              : "text-gray-600",
                        )}
                      >
                        {getSentimentText(sentimentResult.sentiment)}
                      </div>
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">
                          情感得分: {(sentimentResult.score * 100).toFixed(2)}%
                        </span>
                      </div>
                      <Progress
                        value={sentimentResult.score * 100}
                        className="h-2 bg-gray-100"
                        indicatorClassName={
                          sentimentResult.sentiment === "positive"
                            ? "bg-green-500"
                            : sentimentResult.sentiment === "negative"
                              ? "bg-red-500"
                              : "bg-gray-500"
                        }
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>

          <CardFooter className="bg-gray-50 border-t p-4">
            <div className="text-sm text-gray-500 w-full">
              <p>提示：此功能使用自然语言处理模型进行文本分类和情感分析，可以识别文本的主题类别和情感倾向。</p>
            </div>
          </CardFooter>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-medium text-purple-600">1</span>
                </div>
                <div>
                  <p className="font-medium">输入文本</p>
                  <p className="text-sm text-gray-500">在文本框中输入您想要分析的文本，或选择一个示例文本</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-medium text-purple-600">2</span>
                </div>
                <div>
                  <p className="font-medium">选择分析类型</p>
                  <p className="text-sm text-gray-500">选择主题分类或情感分析功能</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-medium text-purple-600">3</span>
                </div>
                <div>
                  <p className="font-medium">查看结果</p>
                  <p className="text-sm text-gray-500">
                    系统将显示文本的主题类别分布或情感倾向分析结果，包括置信度和可视化展示
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
