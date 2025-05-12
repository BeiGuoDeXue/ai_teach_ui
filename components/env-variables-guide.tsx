import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Code } from "lucide-react"

export function EnvVariablesGuide() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">环境变量配置指南</h2>

      <div className="space-y-4">
        <p>在Vercel部署时，您可以通过以下方式配置环境变量：</p>

        <Alert>
          <Code className="h-4 w-4" />
          <AlertTitle>Vercel环境变量存储位置</AlertTitle>
          <AlertDescription>
            环境变量存储在Vercel项目设置中，可以通过以下步骤配置：
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>登录Vercel控制台</li>
              <li>选择您的项目</li>
              <li>点击"Settings"选项卡</li>
              <li>在左侧菜单中选择"Environment Variables"</li>
              <li>添加您的环境变量（键值对）</li>
              <li>选择应用环境（Production/Preview/Development）</li>
              <li>点击"Save"保存设置</li>
            </ol>
          </AlertDescription>
        </Alert>

        <h3 className="text-xl font-semibold mt-4">当前项目所需环境变量</h3>
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="font-mono mb-2">ALIYUN_API_KEY=您的阿里云API密钥</p>
          <p className="font-mono">NEXT_PUBLIC_VIDEO_BASE_URL=您的视频基础URL</p>
        </div>

        <h3 className="text-xl font-semibold mt-4">本地开发环境配置</h3>
        <p>
          在本地开发时，您可以在项目根目录创建<code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code>
          文件来存储环境变量：
        </p>
        <div className="bg-gray-100 p-4 rounded-md font-mono">
          ALIYUN_API_KEY=您的阿里云API密钥 NEXT_PUBLIC_VIDEO_BASE_URL=您的视频基础URL
        </div>

        <p className="text-sm text-gray-500 mt-2">
          注意：以<code className="bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_</code>
          开头的环境变量可以在客户端代码中访问， 其他环境变量只能在服务器端代码中访问。
        </p>
      </div>
    </div>
  )
}
