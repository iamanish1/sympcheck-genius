
import React, { useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AIProcessingStatusProps {
  stage: 'loading' | 'preparing' | 'processing' | 'analyzing' | 'complete' | 'error';
  progress?: number;
  message?: string;
}

const AIProcessingStatus: React.FC<AIProcessingStatusProps> = ({ 
  stage, 
  progress = 0,
  message 
}) => {
  // Ensure progress values are always realistic
  const displayProgress = Math.min(Math.max(progress, 0), 100);
  
  const getStatusMessage = () => {
    switch (stage) {
      case 'loading':
        return "Loading AI models...";
      case 'preparing':
        return "Preparing your file for analysis...";
      case 'processing':
        return "Processing your file with AI...";
      case 'analyzing':
        return "Analyzing results...";
      case 'complete':
        return "Analysis complete!";
      case 'error':
        return message || "Error processing your file";
      default:
        return "Processing...";
    }
  };

  const statusMessage = getStatusMessage();
  
  // Show error alert if there's an error
  if (stage === 'error') {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {message || "Error analyzing your report. We're using fallback analysis."}
          </AlertDescription>
        </Alert>
        <p className="mt-4 text-sm text-gray-500">
          Don't worry - we're still able to provide insights based on our fallback systems.
        </p>
      </div>
    );
  }

  // Simulate continuous progress when in processing or analyzing stages
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (stage === 'processing' || stage === 'analyzing') {
      if (displayProgress < 95) {
        interval = setInterval(() => {
          // If we're stuck at 70%, we need to push it forward
          const increment = displayProgress === 70 ? 5 : 1;
          const newProgress = Math.min(displayProgress + increment, 95);
          
          const progressEvent = new CustomEvent('ai-progress-update', { 
            detail: { progress: newProgress } 
          });
          window.dispatchEvent(progressEvent);
        }, 3000);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage, displayProgress]);

  return (
    <div className="text-center p-4">
      {stage === 'complete' ? (
        <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
      ) : (
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
      )}
      
      <p className="mt-2 text-primary font-medium">{statusMessage}</p>
      
      {(stage !== 'complete') && (
        <div className="mt-4">
          <Progress value={displayProgress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {displayProgress}% complete
          </p>
        </div>
      )}
      
      {stage === 'loading' && (
        <p className="text-xs text-amber-600 mt-2">
          If loading takes too long, we'll automatically switch to our fallback analysis system.
        </p>
      )}
    </div>
  );
};

export default AIProcessingStatus;
