
// Skeleton for Recommendation page
export  const  RecommendationListSkeleton = () => {
    const skeletons = Array(6).fill(null); // Number of skeleton cards to render

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skeletons.map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-md shadow-xs border border-blue-100 animate-pulse p-6"
                >
                    {/* Title */}
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />

                    {/* Date */}
                    <div className="flex items-center text-sm text-gray-400 mb-6">
                        <div className="h-4 w-4 bg-gray-300 rounded-full mr-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>

                    {/* Problem count badge */}
                    <div className="h-6 bg-gray-200 rounded-full w-1/3 mb-6" />

                    {/* Button */}
                    <div className="h-10 bg-gray-100 rounded w-full" />
                </div>
            ))}
        </div>
    );
}


 
// Skeleton for Recommendation-Details page
 export const RecommendationDetailsSkeleton = () => (
        <div className="min-h-screen py-6 mt-8 animate-pulse">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="bg-gray-100 border border-gray-200 rounded-xl p-6 mb-6 shadow-xs">
                    <div className="h-7 bg-blue-100 rounded w-3/4 mb-4"></div> {/* Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-4 bg-blue-100 rounded w-18"></div>
                            <div className="h-6 bg-gray-100 rounded-lg w-16"></div>
                        </div>
                        <div className="flex items-center gap-2 sm:ml-auto">
                            <div className="h-4 w-4 bg-gray-100 rounded"></div>
                            <div className="h-4 bg-gray-100 rounded w-20"></div>
                            <div className="h-4 bg-gray-100 rounded w-24"></div>
                        </div>
                    </div>
                </div>

                {/* Problems List Skeleton (e.g., 3 items) */}
                <div className="space-y-3">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="bg-gray-100 border border-gray-200 rounded-lg p-4 shadow-xs">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-5 bg-red-100 rounded border w-16"></div>
                                        <div className="h-6 bg-gray-200 rounded w-64"></div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4">
                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                    <div className="h-8 bg-yellow-100 rounded w-24"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );