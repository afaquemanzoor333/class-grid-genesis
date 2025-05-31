import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBatches } from "@/hooks/useBatches";

export const BatchManager = ({ departments }) => {
  const [newBatch, setNewBatch] = useState({
    name: "",
    semester: "",
    department: "",
    strength: "",
    section: ""
  });
  const { toast } = useToast();
  const { batches, addBatch, removeBatch, loading } = useBatches();

  const handleAddBatch = async () => {
    if (!newBatch.name || !newBatch.semester || !newBatch.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in batch name, semester, and department.",
        variant: "destructive",
      });
      return;
    }

    const batchData = {
      name: newBatch.name,
      semester: parseInt(newBatch.semester),
      department_id: newBatch.department,
      student_count: newBatch.strength ? parseInt(newBatch.strength) : 0,
      year: new Date().getFullYear()
    };

    const result = await addBatch(batchData);
    
    if (result.success) {
      setNewBatch({ name: "", semester: "", department: "", strength: "", section: "" });
    }
  };

  const handleRemoveBatch = async (id) => {
    await removeBatch(id);
  };

  if (departments.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Departments Available</h3>
          <p className="text-gray-500">
            Please add departments first before creating batches
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
          <p className="text-gray-500 mt-4">Loading batches...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Batch Management</h3>
      </div>

      {/* Add New Batch */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Batch</CardTitle>
          <CardDescription>
            Create batches for different semesters and departments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="batch-name">Batch Name *</Label>
              <Input
                id="batch-name"
                placeholder="CS-2024"
                value={newBatch.name}
                onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="semester">Semester *</Label>
              <Select value={newBatch.semester} onValueChange={(value) => setNewBatch({...newBatch, semester: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="department">Department *</Label>
              <Select value={newBatch.department} onValueChange={(value) => setNewBatch({...newBatch, department: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                placeholder="A"
                value={newBatch.section}
                onChange={(e) => setNewBatch({...newBatch, section: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="strength">Batch Strength</Label>
              <Input
                id="strength"
                type="number"
                placeholder="60"
                value={newBatch.strength}
                onChange={(e) => setNewBatch({...newBatch, strength: e.target.value})}
              />
            </div>
          </div>
          
          <Button onClick={handleAddBatch} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Batch
          </Button>
        </CardContent>
      </Card>

      {/* Existing Batches */}
      {batches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Batches ({batches.length})</CardTitle>
            <CardDescription>
              Manage your batch list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-blue-50 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{batch.name}</h4>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary">
                          Sem {batch.semester}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBatch(batch.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Department: {batch.departments?.name || 'Unknown'}</p>
                    {batch.student_count > 0 && <p>Strength: {batch.student_count} students</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {batches.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Batches Yet</h3>
            <p className="text-gray-500">
              Add your first batch to start organizing classes
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
