
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar, Clock, CheckCircle } from "lucide-react";

export const GeneratedTimetable = ({ timetable }) => {
  if (!timetable) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Timetable Generated</h3>
          <p className="text-gray-500">
            Complete the setup and click generate to see your timetable here
          </p>
        </CardContent>
      </Card>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '9:00-10:00', '10:00-11:00', '11:30-12:30', '12:30-1:30', '2:30-3:30', '3:30-4:30'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Generated Timetable</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Generated Successfully
          </Badge>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Timetable Info */}
      <Card>
        <CardHeader>
          <CardTitle>Timetable Information</CardTitle>
          <CardDescription>
            Generated on {new Date(timetable.generatedAt).toLocaleDateString()} at{' '}
            {new Date(timetable.generatedAt).toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{timetable.departments.length}</div>
              <div className="text-sm text-gray-600">Departments</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{timetable.batches.length}</div>
              <div className="text-sm text-gray-600">Batches</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{timetable.subjects.length}</div>
              <div className="text-sm text-gray-600">Subjects</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Timetables */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Timetables</CardTitle>
          <CardDescription>
            View timetables for all batches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={timetable.batches[0]?.id.toString()}>
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-6">
              {timetable.batches.map((batch) => (
                <TabsTrigger key={batch.id} value={batch.id.toString()} className="text-sm">
                  {batch.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {timetable.batches.map((batch) => (
              <TabsContent key={batch.id} value={batch.id.toString()}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <h4 className="text-lg font-semibold">{batch.name}</h4>
                    <Badge>Semester {batch.semester}</Badge>
                    <Badge variant="outline">{batch.departmentName}</Badge>
                  </div>

                  {/* Timetable Grid */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left font-semibold">
                            <Clock className="h-4 w-4 inline mr-2" />
                            Time
                          </th>
                          {days.map(day => (
                            <th key={day} className="border border-gray-300 p-3 text-center font-semibold">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((slot) => (
                          <tr key={slot} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-3 font-medium bg-blue-50">
                              {slot}
                            </td>
                            {days.map(day => {
                              const classInfo = timetable.schedule[batch.id]?.[day]?.[slot];
                              return (
                                <td key={`${day}-${slot}`} className="border border-gray-300 p-3">
                                  {classInfo ? (
                                    <div className="space-y-1">
                                      <div className="font-semibold text-sm text-blue-900">
                                        {classInfo.subject}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {classInfo.faculty}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {classInfo.room}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-gray-400 text-sm text-center">
                                      Free
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
