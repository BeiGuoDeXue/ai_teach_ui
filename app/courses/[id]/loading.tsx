import { Skeleton } from "@/components/ui/skeleton"

export default function CourseDetailLoading() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-7xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Skeleton className="h-6 w-32" />
        </div>

        {/* 课程标题和基本信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>

            <div className="flex items-center mb-6">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>

          {/* 课程封面和操作按钮 */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 课程内容标签页 */}
        <div className="mb-8">
          <div className="border-b mb-6">
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-8 w-40 mb-4" />
                <Skeleton className="h-20 w-full mb-8" />

                <Skeleton className="h-8 w-40 mb-4" />
                <div className="space-y-2 mb-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start">
                      <Skeleton className="h-2 w-2 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))}
                </div>

                <Skeleton className="h-8 w-40 mb-4" />
                <div className="space-y-2 mb-8">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start">
                      <Skeleton className="h-2 w-2 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="border rounded-lg p-6">
                  <Skeleton className="h-8 w-32 mb-4" />
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start">
                        <Skeleton className="h-10 w-10 rounded-full mr-3" />
                        <div>
                          <Skeleton className="h-5 w-24 mb-1" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 相关课程推荐 */}
        <div className="mt-12">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <div className="flex justify-between items-center mt-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
