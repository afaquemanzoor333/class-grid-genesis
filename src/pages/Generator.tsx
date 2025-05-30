
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, RefreshCw, Calendar, Users, BookOpen, Clock, Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DepartmentSetup } from "@/components/DepartmentSetup";
import { BatchManager } from "@/components/BatchManager";
import { SubjectManager } from "@/components/SubjectManager";
import { TimetableGenerator } from "@/components/TimetableGenerator";
import { GeneratedTimetable } from "@/components/GeneratedTimetable";
import { useToast } from "@/hooks/use-toast";

const Generator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("departments");
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (departments.length === 0 || batches.length === 0 || subjects.length === 0) {
      toast({
        title: "Missing Data",
        description: "Please complete all setup steps before generating timetable.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate timetable generation process
    setTimeout(() => {
      const mockTimetable = {
        id: Date.now(),
        generatedAt: new Date().toISOString(),
        departments: departments,
        batches: batches,
        subjects: subjects,
        schedule: generateMockSchedule(batches, subjects)
      };
      
      setGeneratedTimetable(mockTimetable);
      setIsGenerating(false);
      setActiveTab("preview");
      
      toast({
        title: "Timetable Generated!",
        description: "Your timetable has been successfully generated.",
      });
    }, 3000);
  };

  const generateMockSchedule = (batches, subjects) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
      '9:00-10:00', '10:00-11:00', '11:30-12:30', '12:30-1:30', '2:30-3:30', '3:30-4:30'
    ];
    
    const schedule = {};
    
    batches.forEach(batch => {
      schedule[batch.id] = {};
      days.forEach(day => {
        schedule[batch.id][day] = {};
        timeSlots.forEach((slot, index) => {
          if (index < subjects.length && subjects[index]) {
            schedule[batch.id][day][slot] = {
              subject: subjects[index].name,
              faculty: subjects[index].faculty,
              room: `Room ${Math.floor(Math.random() * 20) + 101}`
            };
          }
        });
      });
    });
    
    return schedule;
  };

  const stats = [
    { label: "Departments", value: departments.length, icon: BookOpen },
    { label: "Batches", value: batches.length, icon: Users },
    { label: "Subjects", value: subjects.length, icon: Calendar },
    { label: "Status", value: generatedTimetable ? "Generated" : "Pending", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold">Timetable Generator</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Timetable
                  </>
                )}
              </Button>
              
              {generatedTimetable && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <span>Timetable Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your departments, batches, and subjects to generate the perfect timetable
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="departments" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Departments</span>
                </TabsTrigger>
                <TabsTrigger value="batches" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Batches</span>
                </TabsTrigger>
                <TabsTrigger value="subjects" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Subjects</span>
                </TabsTrigger>
                <TabsTrigger value="generate" className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Generate</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="departments" className="space-y-6">
                <DepartmentSetup 
                  departments={departments} 
                  setDepartments={setDepartments} 
                />
              </TabsContent>

              <TabsContent value="batches" className="space-y-6">
                <BatchManager 
                  batches={batches} 
                  setBatches={setBatches}
                  departments={departments}
                />
              </TabsContent>

              <TabsContent value="subjects" className="space-y-6">
                <SubjectManager 
                  subjects={subjects} 
                  setSubjects={setSubjects}
                  departments={departments}
                />
              </TabsContent>

              <TabsContent value="generate" className="space-y-6">
                <TimetableGenerator 
                  departments={departments}
                  batches={batches}
                  subjects={subjects}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <GeneratedTimetable timetable={generatedTimetable} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Generator;
