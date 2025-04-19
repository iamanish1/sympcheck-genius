
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, AlertTriangle, HeartPulse, Clock, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TextModelResult, ImageModelResult, Finding } from "../../api/aiService";

interface ReportAnalysisResultProps {
  analysisResult: TextModelResult | ImageModelResult | null;
}

const ReportAnalysisResult: React.FC<ReportAnalysisResultProps> = ({ analysisResult }) => {
  if (!analysisResult) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No results available</AlertTitle>
        <AlertDescription>
          The analysis results are not available or are still processing.
        </AlertDescription>
      </Alert>
    );
  }

  // Function to determine severity color
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'normal': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Function to determine urgency color and icon
  const getUrgencyInfo = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return { 
          color: 'text-red-600 bg-red-100', 
          icon: <AlertTriangle className="h-4 w-4 text-red-600" /> 
        };
      case 'soon':
        return { 
          color: 'text-amber-600 bg-amber-100', 
          icon: <Clock className="h-4 w-4 text-amber-600" /> 
        };
      case 'routine':
        return { 
          color: 'text-blue-600 bg-blue-100', 
          icon: <Info className="h-4 w-4 text-blue-600" /> 
        };
      case 'monitoring':
        return { 
          color: 'text-green-600 bg-green-100', 
          icon: <HeartPulse className="h-4 w-4 text-green-600" /> 
        };
      default:
        return { 
          color: 'text-gray-600 bg-gray-100', 
          icon: <Info className="h-4 w-4 text-gray-600" /> 
        };
    }
  };

  // Function to render confidence badge
  const renderConfidenceBadge = (confidence?: number) => {
    if (!confidence) return null;
    
    const percent = Math.round(confidence * 100);
    let variant = 'outline';
    if (percent >= 95) variant = 'default';
    else if (percent >= 85) variant = 'secondary';
    
    return (
      <Badge variant={variant as any} className="ml-2">
        {percent}% confidence
      </Badge>
    );
  };

  if (analysisResult.type === 'image') {
    return (
      <div className="space-y-6">
        {/* Health Score Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              Overall Health Assessment
              <Badge 
                className={
                  analysisResult.healthScore >= 80 ? 'bg-green-500' : 
                  analysisResult.healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                }
              >
                {analysisResult.healthScore}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={analysisResult.healthScore} 
              className={`h-2 ${
                analysisResult.healthScore >= 80 ? 'bg-green-100' : 
                analysisResult.healthScore >= 60 ? 'bg-amber-100' : 'bg-red-100'
              }`}
              indicatorClassName={
                analysisResult.healthScore >= 80 ? 'bg-green-500' : 
                analysisResult.healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
              }
            />
            <p className="mt-4 text-gray-700">{analysisResult.summary}</p>
          </CardContent>
        </Card>

        {/* Detailed Findings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResult.findings.map((finding: Finding, index: number) => (
                <div 
                  key={index} 
                  className={`p-4 border rounded-lg ${
                    finding.severity ? getSeverityColor(finding.severity) : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {finding.type === 'observation' ? (
                      finding.severity === 'normal' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className={`h-5 w-5 ${
                          finding.severity === 'critical' ? 'text-red-500' :
                          finding.severity === 'high' ? 'text-orange-500' :
                          finding.severity === 'medium' ? 'text-amber-500' :
                          'text-yellow-500'
                        }`} />
                      )
                    ) : (
                      <Info className="h-5 w-5 text-blue-500" />
                    )}
                    <h4 className="font-medium capitalize">{finding.type}</h4>
                    
                    {renderConfidenceBadge(finding.confidence)}
                  </div>
                  
                  {finding.location && (
                    <p className="text-sm mb-1">
                      <span className="font-medium">Location:</span> {finding.location}
                    </p>
                  )}
                  
                  <p className="text-gray-700 mb-2">{finding.description}</p>
                  
                  {finding.suggestedAction && (
                    <div className="mt-2 text-sm bg-white bg-opacity-50 p-2 rounded-md">
                      <span className="font-medium">Suggested action:</span> {finding.suggestedAction}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisResult.recommendedActions.map((action, index) => {
                const urgencyInfo = getUrgencyInfo(action.urgency);
                return (
                  <div key={index} className={`flex p-3 border rounded-md ${urgencyInfo.color}`}>
                    <div className="mr-3 mt-0.5">
                      {urgencyInfo.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{action.description}</h4>
                        {renderConfidenceBadge(action.confidence)}
                      </div>
                      <p className="text-sm opacity-90">{action.rationale}</p>
                      <div className="mt-2 flex items-center">
                        <Badge variant="outline" className="text-xs capitalize">
                          {action.urgency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t bg-gray-50 p-3">
            <Button variant="outline" size="sm" className="mr-2">
              Download Report
            </Button>
            <Button size="sm">
              Share with Doctor
            </Button>
          </CardFooter>
        </Card>

        {/* Medical Disclaimer */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Medical Disclaimer</AlertTitle>
          <AlertDescription className="text-sm">
            This analysis is generated by AI and should not replace professional medical advice. 
            Always consult with a healthcare professional for proper diagnosis and treatment.
            If you're experiencing severe symptoms, please seek medical attention immediately.
          </AlertDescription>
        </Alert>
      </div>
    );
  } else {
    // Document analysis results
    const result = analysisResult as TextModelResult;
    
    return (
      <div className="space-y-6">
        {/* Health Score Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              Overall Health Assessment
              <Badge 
                className={
                  result.healthScore >= 80 ? 'bg-green-500' : 
                  result.healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                }
              >
                {result.healthScore}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={result.healthScore} 
              className={`h-2 ${
                result.healthScore >= 80 ? 'bg-green-100' : 
                result.healthScore >= 60 ? 'bg-amber-100' : 'bg-red-100'
              }`}
              indicatorClassName={
                result.healthScore >= 80 ? 'bg-green-500' : 
                result.healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
              }
            />
            <p className="mt-4 text-gray-700">{result.summary}</p>
          </CardContent>
        </Card>

        {/* Abnormal Values Card */}
        <Card>
          <CardHeader>
            <CardTitle>Items Requiring Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Normal Range</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interpretation</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.abnormalValues.map((value, index) => (
                    <tr key={index} className={
                      value.severity === 'critical' ? 'bg-red-50' :
                      value.severity === 'high' ? 'bg-orange-50' :
                      value.severity === 'low' ? 'bg-yellow-50' : ''
                    }>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{value.test}</td>
                      <td className={`px-4 py-3 text-sm font-medium ${
                        value.severity === 'critical' ? 'text-red-700' :
                        value.severity === 'high' ? 'text-orange-700' :
                        value.severity === 'low' ? 'text-amber-700' : 'text-gray-900'
                      }`}>
                        {value.value}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{value.normalRange}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge 
                          variant={
                            value.severity === 'critical' ? "destructive" : 
                            value.severity === 'high' ? "destructive" : 
                            "outline"
                          }
                        >
                          {value.interpretation}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {Math.round(value.confidence * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Normal Values Card */}
        <Card>
          <CardHeader>
            <CardTitle>Normal Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Normal Range</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.normalValues.map((value, index) => (
                    <tr key={index} className="bg-green-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{value.test}</td>
                      <td className="px-4 py-3 text-sm text-green-700 font-medium">{value.value}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{value.normalRange}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {Math.round(value.confidence * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.recommendedActions.map((action, index) => {
                const urgencyInfo = getUrgencyInfo(action.urgency);
                return (
                  <div key={index} className={`flex p-3 border rounded-md ${urgencyInfo.color}`}>
                    <div className="mr-3 mt-0.5">
                      {urgencyInfo.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{action.description}</h4>
                        {renderConfidenceBadge(action.confidence)}
                      </div>
                      <p className="text-sm opacity-90">{action.rationale}</p>
                      <div className="mt-2 flex items-center">
                        <Badge variant="outline" className="text-xs capitalize">
                          {action.urgency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t bg-gray-50 p-3">
            <Button variant="outline" size="sm" className="mr-2">
              Download Report
            </Button>
            <Button size="sm">
              Share with Doctor
            </Button>
          </CardFooter>
        </Card>

        {/* Medical Disclaimer */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Medical Disclaimer</AlertTitle>
          <AlertDescription className="text-sm">
            This analysis is generated by AI and should not replace professional medical advice. 
            Always consult with a healthcare professional for proper interpretation of your lab results.
            If any values concern you, please contact your doctor promptly.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
};

export default ReportAnalysisResult;
