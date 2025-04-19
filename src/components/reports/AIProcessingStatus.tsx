
import React, { useEffect, useState } from 'react';
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
  // Local state to ensure progress can continue independently
  const [internalProgress, setInternalProgress] = useState(progress);
  
  // Update internal progress when prop changes
  useEffect(() => {
    setInternalProgress(progress);
  }, [progress]);

  // Ensure progress values are always realistic
  const displayProgress = Math.min(Math.max(internalProgress, 0), 100);
  
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

  // Enhanced continuous progress mechanism with safeguards
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (stage === 'processing' || stage === 'analyzing') {
      if (displayProgress < 95) {
        interval = setInterval(() => {
          setInternalProgress(prev => {
            // If we're stuck at 70%, push it forward more aggressively
            if (prev >= 69 && prev <= 71) {
              return prev + 5;
            }
            // Normal progression
            return Math.min(prev + 1, 95);
          });
        }, 2000); // Faster updates
      }
    }
    
    // Force completion after a timeout if we're close but stuck
    let completionTimer: NodeJS.Timeout | null = null;
    if (stage === 'analyzing' && displayProgress >= 85) {
      completionTimer = setTimeout(() => {
        // Dispatch a custom event that the parent can listen for
        const forceCompleteEvent = new CustomEvent('ai-force-complete');
        window.dispatchEvent(forceCompleteEvent);
        
        // Also update our own progress for visual feedback
        setInternalProgress(100);
      }, 10000); // 10 seconds max at analyzing stage over 85%
    }
    
    // Always dispatch progress updates to parent component
    const progressEvent = new CustomEvent('ai-progress-update', { 
      detail: { progress: displayProgress } 
    });
    window.dispatchEvent(progressEvent);
    
    return () => {
      if (interval) clearInterval(interval);
      if (completionTimer) clearTimeout(completionTimer);
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
