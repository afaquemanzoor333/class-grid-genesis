
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Department {
  id: string;
  name: string;
  code: string;
  head?: string;
  created_at: string;
  updated_at: string;
}

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDepartments(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching departments',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (department: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([department])
        .select()
        .single();

      if (error) throw error;
      
      // Immediately add to state and also trigger a full refresh
      setDepartments(prev => [data, ...prev]);
      
      // Trigger a brief delay then refetch to ensure consistency
      setTimeout(fetchDepartments, 100);
      
      toast({
        title: 'Department Added',
        description: `${department.name} has been added successfully.`,
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Error adding department',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const removeDepartment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDepartments(prev => prev.filter(dept => dept.id !== id));
      
      toast({
        title: 'Department Removed',
        description: 'Department has been removed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error removing department',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    addDepartment,
    removeDepartment,
    refetch: fetchDepartments,
  };
};
