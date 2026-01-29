
'use client';
import { useEffect } from 'react';
import { useLeetCode } from '@/context/LeetCodeContext';
import SubmissionItem from '@/components/SubmissionItem';
import { User } from 'lucide-react';
import Nolinked from './Nolinked';
import { SubmissionSkeleton } from './skeleton/homeSkeleton';


export default function Activity({ username }) {
    const { submissions, isLoading, leetcodeError, fetchLeetCodeData } = useLeetCode();

    useEffect(() => {
        if (username) {
            fetchLeetCodeData(username);
        }
    }, [username, fetchLeetCodeData]);

    return (
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold">Recent LeetCode Submissions</h2>
            <span className="text-xs sm:text-sm mb-1" style={{ color: 'var(--second-text-color)' }}>
                Here are your 20 most recent LeetCode submissions.
            </span>

            {/* Handle no username case */}
            {!username ? (
                <div className="min-h-[350px] flex items-center justify-center"> <Nolinked message={"Please add you leetcode UserName to show your recent submissions"} /> </div>

            ) : (
                <>
                    {/* Loading state with skeleton */}
                    {isLoading && <SubmissionSkeleton />}

                    {/* Error state */}
                    {leetcodeError && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                            <div className="bg-red-50 rounded-full p-4 mb-4">
                                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Error Loading Data</h3>
                            <p className="text-sm text-red-600 text-center">{leetcodeError}</p>
                        </div>
                    )}

                    {/* Success state with submissions */}
                    {!isLoading && !leetcodeError && (
                        <>
                            {submissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-4">
                                    <div className="bg-gray-50 rounded-full p-4 mb-4">
                                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Recent Submissions</h3>
                                    <p className="text-sm text-gray-500 text-center">
                                        No recent submissions found for this username. Start solving problems to see your activity here!
                                    </p>
                                </div>
                            ) : (
                                <ul
                                    className="space-y-4 overflow-y-auto mt-4 pr-2"
                                    style={{ maxHeight: '560px' }}
                                >
                                    {submissions.map((submission, index) => (
                                        <SubmissionItem key={index} submission={submission} />
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

