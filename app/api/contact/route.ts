import { NextResponse } from "next/server"

// 模拟数据库存储
interface ContactMessage {
  id: string
  name: string
  phone: string
  email: string
  message: string
  createdAt: Date
}

const contactMessages: ContactMessage[] = []

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, phone, email, message } = data

    // 验证数据
    if (!name || !phone || !email || !message) {
      return NextResponse.json({ success: false, message: "所有字段都是必填的" }, { status: 400 })
    }

    // 创建新的联系消息
    const newMessage: ContactMessage = {
      id: Math.random().toString(36).substring(2, 15),
      name,
      phone,
      email,
      message,
      createdAt: new Date(),
    }

    // 添加到"数据库"
    contactMessages.push(newMessage)

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: "留言已成功提交！",
      data: newMessage,
    })
  } catch (error) {
    console.error("提交留言时出错:", error)
    return NextResponse.json({ success: false, message: "服务器错误，请稍后再试" }, { status: 500 })
  }
}

// 获取所有留言（仅用于管理员访问）
export async function GET() {
  return NextResponse.json({
    success: true,
    data: contactMessages,
  })
}
