"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, Trash2, Volume2, Mic, MicOff, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: string
}

export default function AIChat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "您好！我是维客未来AI助手，有什么我可以帮助您的吗？",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // 加载历史对话
  useEffect(() => {
    const savedConversations = localStorage.getItem("ai-conversations")
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations)
        setConversations(parsed)

        // 如果有对话，加载最近的一个
        if (parsed.length > 0) {
          const latestConversation = parsed[0]
          setCurrentConversationId(latestConversation.id)
          setMessages(latestConversation.messages)
        }
      } catch (e) {
        console.error("Failed to parse saved conversations:", e)
      }
    }

    // 初始化语音识别
    if (window.webkitSpeechRecognition) {
      const SpeechRecognition = window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "zh-CN"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("")

        setInput(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // 初始化语音合成
    if (window.speechSynthesis) {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const saveConversation = (newMessages: Message[]) => {
    let updatedConversations: Conversation[]

    if (currentConversationId) {
      // 更新现有对话
      updatedConversations = conversations.map((conv) =>
        conv.id === currentConversationId ? { ...conv, messages: newMessages } : conv,
      )
    } else {
      // 创建新对话
      const newId = Date.now().toString()
      const title = newMessages.length > 1 ? newMessages[1].content.slice(0, 30) + "..." : "新对话"
      const newConversation: Conversation = {
        id: newId,
        title,
        messages: newMessages,
        createdAt: new Date().toISOString(),
      }
      updatedConversations = [newConversation, ...conversations]
      setCurrentConversationId(newId)
    }

    setConversations(updatedConversations)
    localStorage.setItem("ai-conversations", JSON.stringify(updatedConversations))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === "") return

    // 添加用户消息
    const userMessage: Message = { role: "user", content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    // 保存对话
    saveConversation(updatedMessages)

    try {
      // 调用API获取AI响应
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      })

      if (!response.ok) {
        throw new Error("网络响应不正常")
      }

      const data = await response.json()
      const aiResponse = { role: "assistant" as const, content: data.response || "抱歉，我遇到了一些问题。" }

      // 添加AI响应
      const finalMessages = [...updatedMessages, aiResponse]
      setMessages(finalMessages)

      // 保存更新后的对话
      saveConversation(finalMessages)
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = { role: "assistant" as const, content: "抱歉，我遇到了一些技术问题。请稍后再试。" }
      const finalMessages = [...updatedMessages, errorMessage]
      setMessages(finalMessages)
      saveConversation(finalMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const startNewConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: "您好！我是维客未来AI助手，有什么我可以帮助您的吗？",
      },
    ])
    setCurrentConversationId(null)
  }

  const loadConversation = (id: string) => {
    const conversation = conversations.find((conv) => conv.id === id)
    if (conversation) {
      setMessages(conversation.messages)
      setCurrentConversationId(id)
    }
  }

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedConversations = conversations.filter((conv) => conv.id !== id)
    setConversations(updatedConversations)
    localStorage.setItem("ai-conversations", JSON.stringify(updatedConversations))

    if (id === currentConversationId) {
      if (updatedConversations.length > 0) {
        loadConversation(updatedConversations[0].id)
      } else {
        startNewConversation()
      }
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("您的浏览器不支持语音识别功能")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      setInput("")
    }
  }

  const speakText = (text: string) => {
    if (!synthRef.current) {
      alert("您的浏览器不支持语音合成功能")
      return
    }

    // 停止当前正在播放的语音
    if (isSpeaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "zh-CN"
    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current.speak(utterance)
  }

  const exportConversation = () => {
    if (messages.length <= 1) return

    const conversationText = messages
      .map((msg) => `${msg.role === "user" ? "用户" : "AI助手"}: ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([conversationText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `对话记录_${new Date().toLocaleDateString()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">对话</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <Card className="border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-xl text-blue-800">AI 对话助手</CardTitle>
              <CardDescription>与维客未来AI助手进行对话，体验人工智能的魅力</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 h-[400px] overflow-y-auto p-4 rounded-lg bg-slate-50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 rounded-lg p-4",
                      message.role === "user" ? "bg-blue-100 ml-12" : "bg-white mr-12",
                    )}
                  >
                    <Avatar className={message.role === "user" ? "bg-blue-600" : "bg-amber-500"}>
                      <AvatarFallback>
                        {message.role === "user" ? <User size={18} /> : <Bot size={18} />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-relaxed flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">{message.role === "user" ? "您" : "AI助手"}</p>
                        {message.role === "assistant" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => speakText(message.content)}
                                >
                                  <Volume2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>朗读文本</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 rounded-lg p-4 bg-white mr-12">
                    <Avatar className="bg-amber-500">
                      <AvatarFallback>
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <p className="text-sm text-gray-500">AI助手正在思考...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 p-4">
              <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant={isListening ? "default" : "outline"}
                        onClick={toggleListening}
                        className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isListening ? "停止语音输入" : "开始语音输入"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Input
                  placeholder={isListening ? "正在聆听..." : "输入您的问题..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || input.trim() === ""}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={exportConversation}
                        disabled={messages.length <= 1}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>导出对话</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </form>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>对话历史</CardTitle>
              <CardDescription>您可以查看和管理之前的对话记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button onClick={startNewConversation} className="w-full justify-start mb-4">
                  <Plus className="mr-2 h-4 w-4" /> 新建对话
                </Button>
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">暂无对话历史</div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => loadConversation(conv.id)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-100",
                        currentConversationId === conv.id ? "bg-blue-50 border border-blue-200" : "",
                      )}
                    >
                      <div className="truncate flex-1">
                        <div className="font-medium truncate">{conv.title}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(conv.createdAt).toLocaleString()} · {conv.messages.length} 条消息
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
