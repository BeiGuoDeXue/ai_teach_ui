import { NextResponse } from "next/server"

const BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
const APP_ID = "0625b6418dd240de94ebc4f722a7adfc"

// 您需要设置API密钥，可以通过环境变量或其他安全方式提供
// 这里我们假设API密钥已经设置在环境变量中
const API_KEY = process.env.ALIYUN_API_KEY || ""

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    // 格式化消息以符合API要求
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // 调用阿里云API
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "X-DashScope-AppId": APP_ID,
      },
      body: JSON.stringify({
        model: "qwen-max", // 使用阿里云的通义千问模型，可根据实际情况调整
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error:", errorData)
      return NextResponse.json({ error: "调用AI服务时出错" }, { status: response.status })
    }

    const data = await response.json()

    // 从响应中提取AI的回复
    const aiResponse = data.choices?.[0]?.message?.content || "无法获取回复"

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "处理请求时出错" }, { status: 500 })
  }
}
