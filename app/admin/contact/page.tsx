"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ContactMessage {
  id: string
  name: string
  phone: string
  email: string
  message: string
  createdAt: string
}

export default function ContactAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/contact")
        const data = await response.json()

        if (data.success) {
          setMessages(data.data)
        } else {
          setError("获取留言失败")
        }
      } catch (err) {
        setError("服务器错误，请稍后再试")
        console.error("获取留言时出错:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">留言管理</h1>

      {loading ? (
        <div className="text-center py-10">加载中...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-10 text-gray-500">暂无留言</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{message.name}</span>
                  <span className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">电话:</span> {message.phone}
                  </p>
                  <p>
                    <span className="font-semibold">邮箱:</span> {message.email}
                  </p>
                  <p>
                    <span className="font-semibold">留言:</span>
                  </p>
                  <p className="bg-gray-50 p-3 rounded-md text-gray-700">{message.message}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    标记为已处理
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
