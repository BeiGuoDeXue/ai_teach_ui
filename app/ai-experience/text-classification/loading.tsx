import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function TextClassificationLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Skeleton className="h-6 w-32" />
        </div>

        <Card className="border-2 border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            <div className="mb-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-md" />
                ))}
              </div>
            </div>

            <Skeleton className="h-10 w-full mb-6" />

            <div className="flex justify-center mb-6">
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="mt-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-32 mr-4" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 border-t p-4">
            <Skeleton className="h-4 w-full" />
          </CardFooter>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start">
                  <Skeleton className="w-8 h-8 rounded-full mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
