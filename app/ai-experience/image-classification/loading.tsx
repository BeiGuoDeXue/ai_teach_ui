import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ImageIcon } from "lucide-react"

export default function ImageClassificationLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Skeleton className="h-6 w-32" />
        </div>

        <Card className="border-2 border-green-100">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-3">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-6">
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-64 w-full rounded-lg" />
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
