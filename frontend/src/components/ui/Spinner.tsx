// src/components/layout/page-loader.tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center space-y-8">
        {/* Logo/Brand */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-primary-foreground">DW</span>
          </div>
        </div>
        
        {/* Animated Spinner */}
        <LoadingSpinner size="lg" text="Preparing your experience..." />
        
        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-[pulse_2s_ease-in-out_infinite] w-1/2" />
          </div>
        </div>
        
        {/* Subtle Animation */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};