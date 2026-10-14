import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function WebLoading() {
  return (
    <div className="w-full min-h-screen bg-bg p-6 sm:p-12 space-y-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section Skeleton */}
        <div className="space-y-4 pt-12">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-14 w-full max-w-2xl" />
          <Skeleton className="h-6 w-full max-w-lg" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* 2-Column Split Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    </div>
  );
}
