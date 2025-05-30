import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, BookOpen, Loader2 } from "lucide-react";
import { useDepartments, Department } from "@/hooks/useDepartments";

export const DepartmentSetup = () => {
  const [newDepartment, setNewDepartment] = useState({ name: "", code: "", head: "" });
  const { departments, loading, addDepartment, removeDepartment } = useDepartments();

  const handleAddDepartment = async () => {
    if (!newDepartment.name || !newDepartment.code) {
      return;
    }

    const result = await addDepartment({
      name: newDepartment.name,
      code: newDepartment.code,
      head: newDepartment.head || undefined,
    });

    if (result.success) {
      setNewDepartment({ name: "", code: "", head: "" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <BookOpen className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Department Setup</h3>
      </div>

      {/* Add New Department */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Department</CardTitle>
          <CardDescription>
            Create departments that will have their own batches and subjects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dept-name">Department Name *</Label>
              <Input
                id="dept-name"
                placeholder="Computer Science"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="dept-code">Department Code *</Label>
              <Input
                id="dept-code"
                placeholder="CS"
                value={newDepartment.code}
                onChange={(e) => setNewDepartment({...newDepartment, code: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="dept-head">Department Head</Label>
              <Input
                id="dept-head"
                placeholder="Dr. John Smith"
                value={newDepartment.head}
                onChange={(e) => setNewDepartment({...newDepartment, head: e.target.value})}
              />
            </div>
          </div>
          <Button onClick={handleAddDepartment} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </CardContent>
      </Card>

      {/* Existing Departments */}
      {departments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Departments ({departments.length})</CardTitle>
            <CardDescription>
              Manage your department list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                      <Badge variant="secondary" className="mt-1">
                        {dept.code}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDepartment(dept.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {dept.head && (
                    <p className="text-sm text-gray-600 mt-2">
                      Head: {dept.head}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {departments.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Departments Yet</h3>
            <p className="text-gray-500">
              Add your first department to get started with timetable generation
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
