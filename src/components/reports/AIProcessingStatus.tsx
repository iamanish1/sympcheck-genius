
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="text-center p-4">
      {stage !== 'complete' && stage !== 'error' && (
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
      )}
      
      <p className="mt-2 text-primary font-medium">{statusMessage}</p>
      
      {(stage !== 'complete' && stage !== 'error') && (
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {progress}% complete
          </p>
        </div>
      )}
      
      {stage === 'error' && message && (
        <p className="text-sm text-red-500 mt-2">{message}</p>
      )}
    </div>
  );
};

export default AIProcessingStatus;
