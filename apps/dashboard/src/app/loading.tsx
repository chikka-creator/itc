import React from 'react';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-8 p-6 animate-fadeIn">
      {/* Top Header Skeleton */}
      <div className="pb-6 border-b border-hairline space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-3 w-64" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Table Skeleton */}
      <div className="bg-surface border border-hairline p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
