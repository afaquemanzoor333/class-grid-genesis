
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, RefreshCw, Zap } from "lucide-react";

export const TimetableGenerator = ({ departments, batches, subjects, onGenerate, isGenerating }) => {
  const completionChecks = [
    { label: "Departments", count: departments.length, required: true },
    { label: "Batches", count: batches.length, required: true },
    { label: "Subjects", count: subjects.length, required: true },
  ];

  const allRequiredComplete = completionChecks.every(check => check.required ? check.count > 0 : true);
  const progressPercentage = (completionChecks.filter(check => check.count > 0).length / completionChecks.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Zap className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Generate Timetable</h3>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Progress</CardTitle>
          <CardDescription>
            Complete all setup steps before generating your timetable
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completionChecks.map((check, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                {check.count > 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                )}
                <div>
                  <p className="font-medium">{check.label}</p>
                  <p className="text-sm text-gray-600">{check.count} added</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Settings</CardTitle>
          <CardDescription>
            Configure how your timetable should be generated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Time Slots</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Morning:</span>
                  <Badge variant="outline">9:00 AM - 12:30 PM</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Afternoon:</span>
                  <Badge variant="outline">2:30 PM - 4:30 PM</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Break:</span>
                  <Badge variant="outline">11:00 AM - 11:30 AM</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Constraints</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No faculty conflicts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Room availability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Batch scheduling</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Button */}
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            {isGenerating ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <h4 className="text-lg font-semibold">Generating Timetable...</h4>
                <p className="text-gray-600">
                  Please wait while we create your optimized schedule
                </p>
                <div className="max-w-md mx-auto">
                  <Progress value={66} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2">
                    Processing constraints and optimizing schedule...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Clock className="h-12 w-12 mx-auto text-blue-600" />
                <h4 className="text-lg font-semibold">Ready to Generate</h4>
                <p className="text-gray-600 max-w-md mx-auto">
                  All setup is complete. Click the button below to generate your automated timetable.
                </p>
                <Button
                  onClick={onGenerate}
                  disabled={!allRequiredComplete}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Generate Timetable
                </Button>
                {!allRequiredComplete && (
                  <p className="text-sm text-orange-600">
                    Please complete all required setup steps before generating
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
