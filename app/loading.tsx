import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse p-4">
      {/* Page Header Skeleton */}
      <div>
        <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-3"></div>
        <div className="h-4 bg-gray-100 rounded-md w-2/5"></div>
      </div>

      {/* Stats/Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-card border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-4">
              <div className="flex flex-col gap-2 w-1/3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-100 rounded-md w-24"></div>
              <div className="h-4 bg-gray-100 rounded w-20"></div>
              <div className="h-8 bg-gray-100 rounded-lg w-28"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}