import { EnvVariablesGuide } from "@/components/env-variables-guide"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">系统设置</h1>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <EnvVariablesGuide />
        </div>
      </div>
    </div>
  )
}
