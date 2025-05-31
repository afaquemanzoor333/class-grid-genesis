import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubjects } from "@/hooks/useSubjects";
import { useBatches } from "@/hooks/useBatches";

export const SubjectManager = ({ departments }) => {
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    faculty: "",
    batch: "",
    hoursPerWeek: "",
    type: ""
  });
  const { toast } = useToast();
  const { subjects, addSubject, removeSubject, loading } = useSubjects();
  const { batches } = useBatches();

  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.code || !newSubject.faculty || !newSubject.batch) {
      toast({
        title: "Missing Information",
        description: "Please fill in subject name, code, faculty, and batch.",
        variant: "destructive",
      });
      return;
    }

    const subjectData = {
      name: newSubject.name,
      code: newSubject.code,
      faculty: newSubject.faculty,
      batch_id: newSubject.batch,
      hours_per_week: newSubject.hoursPerWeek ? parseInt(newSubject.hoursPerWeek) : 0,
      subject_type: newSubject.type as 'theory' | 'practical' | 'lab' || 'theory'
    };

    const result = await addSubject(subjectData);
    
    if (result.success) {
      setNewSubject({
        name: "",
        code: "",
        faculty: "",
        batch: "",
        hoursPerWeek: "",
        type: ""
      });
    }
  };

  const handleRemoveSubject = async (id) => {
    await removeSubject(id);
  };

  if (departments.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Departments Available</h3>
          <p className="text-gray-500">
            Please add departments first before creating subjects
          </p>
        </CardContent>
      </Card>
    );
  }

  if (batches.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Batches Available</h3>
          <p className="text-gray-500">
            Please add batches first before creating subjects
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading subjects...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <BookOpen className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Subject Management</h3>
      </div>

      {/* Add New Subject */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Subject</CardTitle>
          <CardDescription>
            Create subjects with faculty assignments and scheduling details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="subject-name">Subject Name *</Label>
              <Input
                id="subject-name"
                placeholder="Programming Fundamentals"
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="subject-code">Subject Code *</Label>
              <Input
                id="subject-code"
                placeholder="CS101"
                value={newSubject.code}
                onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="faculty">Faculty Name *</Label>
              <Input
                id="faculty"
                placeholder="Dr. Ahmad Ali"
                value={newSubject.faculty}
                onChange={(e) => setNewSubject({...newSubject, faculty: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="batch-select">Batch *</Label>
              <Select value={newSubject.batch} onValueChange={(value) => setNewSubject({...newSubject, batch: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map(batch => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name} - {batch.departments?.name || 'Unknown Dept'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Subject Type</Label>
              <Select value={newSubject.type} onValueChange={(value) => setNewSubject({...newSubject, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theory">Theory</SelectItem>
                  <SelectItem value="practical">Practical</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="hours">Hours per Week</Label>
              <Input
                id="hours"
                type="number"
                placeholder="4"
                value={newSubject.hoursPerWeek}
                onChange={(e) => setNewSubject({...newSubject, hoursPerWeek: e.target.value})}
              />
            </div>
          </div>
          
          <Button onClick={handleAddSubject} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </CardContent>
      </Card>

      {/* Existing Subjects */}
      {subjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Subjects ({subjects.length})</CardTitle>
            <CardDescription>
              Manage your subject list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                      <Badge variant="secondary" className="mt-1">
                        {subject.code}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubject(subject.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Faculty:</strong> {subject.faculty}</p>
                    <p><strong>Batch:</strong> {subject.batches?.name || 'Unknown'}</p>
                    <p><strong>Department:</strong> {subject.batches?.departments?.name || 'Unknown'}</p>
                    {subject.hours_per_week > 0 && <p><strong>Hours/Week:</strong> {subject.hours_per_week}</p>}
                    {subject.subject_type && (
                      <Badge variant="outline" className="mt-2">
                        {subject.subject_type}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {subjects.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Subjects Yet</h3>
            <p className="text-gray-500">
              Add your first subject to start building the curriculum
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
