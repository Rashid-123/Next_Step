
// --------- POD skeleton -----------
export const PODSkeleton = () => {
    return (
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-200 animate-pulse">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-4">
                <div className="h-6 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>

            {/* Subtitle */}
            <div className="h-3 bg-gray-200 rounded w-40 mb-4"></div>

            {/* Problem info section */}
            <div className="py-2 my-2 sm:my-3">
                {/* Problem number, difficulty, accuracy */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>

                {/* Problem title */}
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>

                {/* Topic tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="h-6 bg-gray-200 rounded w-16"></div>
                    ))}
                </div>
            </div>

            {/* Button */}
            <div className="mt-4">
                <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );
}

//----- Heatmap skeleton -----------------
export const HeatmapSkeleton = () => {
    return (
        <div className="animate-pulse">

            <div className="grid grid-cols-53 gap-1 mb-4">
                {Array.from({ length: 371 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 bg-green-200 rounded-sm"></div>
                ))}
            </div>


            <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 rounded-sm"></div>
                ))}
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};


//---------------- submission skeleton ----


export const SubmissionSkeleton = () => {
    return (
        <ul className="space-y-4 overflow-y-auto mt-4 pr-2" style={{ maxHeight: '450px' }}>
            {[...Array(5)].map((_, index) => (
                <li key={index} className="p-3 sm:p-5 border border-gray-200 rounded-lg sm:rounded-2xl animate-pulse">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                        <div className="h-4 w-4 bg-blue-100 rounded-full flex-shrink-0"></div>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mr-auto">
                            <div className="h-3 bg-green-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-24 mt-0.5 sm:mt-0"></div>
                        </div>

                        <div className="flex gap-2 mt-1 sm:mt-0">
                            <div className="h-5 bg-gray-200 rounded w-12"></div>
                            <div className="h-5 bg-gray-200 rounded w-10"></div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}


