// src/components/ui/loading-spinner.tsx
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ 
  size = "md", 
  className,
  text = "Loading..." 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      {/* Animated Spinner */}
      <div className={cn(
        "relative animate-spin rounded-full border-4 border-solid border-current border-r-transparent",
        sizeClasses[size],
        "motion-reduce:animate-[spin_1.5s_linear_infinite]"
      )}>
        <span className="sr-only">Loading</span>
        
        {/* Optional: Inner ring for depth */}
        <div className={cn(
          "absolute inset-2 rounded-full border-2 border-solid border-current border-opacity-20"
        )} />
      </div>
      
      {/* Loading Text */}
      {text && (
        <p className={cn(
          "text-muted-foreground font-medium animate-pulse",
          textSizes[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

// Full Page Loading Component
export const FullPageLoader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border/50">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};

// Skeleton Loader for content
export const SkeletonLoader = ({ 
  className,
  lines = 3 
}: { 
  className?: string;
  lines?: number;
}) => {
  return (
    <div className={cn("space-y-3 animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-muted rounded-full",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
};