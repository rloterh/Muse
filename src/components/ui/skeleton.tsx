import { cn } from "@/lib/utils/cn";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-[var(--color-bg-elevated)]", className)}
      {...props}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen px-8 pb-32 pt-40 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-16 w-96 max-w-full" />
        <Skeleton className="h-5 w-80 max-w-full" />
        <div className="pt-12">
          <Skeleton className="aspect-[16/9] w-full" />
        </div>
      </div>
    </div>
  );
}

export function WorkGridSkeleton() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[4/3]" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-7 w-48" />
        </div>
      ))}
    </div>
  );
}

export function CaseStudySkeleton() {
  return (
    <div className="min-h-screen px-8 pb-32 pt-40 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-20 w-[500px] max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
        <div className="pt-8">
          <Skeleton className="aspect-[16/9] w-full" />
        </div>
        <div className="grid gap-20 pt-16 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
