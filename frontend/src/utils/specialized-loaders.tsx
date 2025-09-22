// src/components/ui/specialized-loaders.tsx
import { cn } from "@/lib/utils";

// Button loading state
export const ButtonLoader = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
      <span>Processing...</span>
    </div>
  );
};

// Card skeleton loader
export const CardSkeleton = () => {
  return (
    <div className="animate-pulse bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="h-6 bg-muted rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded" />
        <div className="h-4 bg-muted rounded w-5/6" />
      </div>
      <div className="h-10 bg-muted rounded mt-4" />
    </div>
  );
};

// Table skeleton loader
export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 animate-pulse">
          <div className="h-12 bg-muted rounded flex-1" />
          <div className="h-12 bg-muted rounded flex-1" />
          <div className="h-12 bg-muted rounded flex-1" />
          <div className="h-12 bg-muted rounded w-24" />
        </div>
      ))}
    </div>
  );
};