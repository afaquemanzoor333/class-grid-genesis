
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Subject {
  id: string;
  batch_id: string;
  name: string;
  code: string;
  faculty: string;
  hours_per_week: number;
  subject_type: 'theory' | 'practical' | 'lab';
  created_at: string;
  updated_at: string;
  batches?: {
    name: string;
    departments: {
      name: string;
      code: string;
    };
  };
}

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select(`
          *,
          batches (
            name,
            departments (
              name,
              code
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Type cast the subject_type to ensure it matches our union type
      const typedData = (data || []).map(item => ({
        ...item,
        subject_type: item.subject_type as 'theory' | 'practical' | 'lab'
      }));
      setSubjects(typedData);
    } catch (error: any) {
      toast({
        title: 'Error fetching subjects',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async (subject: Omit<Subject, 'id' | 'created_at' | 'updated_at' | 'batches'>) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert([subject])
        .select(`
          *,
          batches (
            name,
            departments (
              name,
              code
            )
          )
        `)
        .single();

      if (error) throw error;
      // Type cast the returned data
      const typedData = {
        ...data,
        subject_type: data.subject_type as 'theory' | 'practical' | 'lab'
      };
      
      // Immediately add to state and also trigger a full refresh
      setSubjects(prev => [typedData, ...prev]);
      
      // Trigger a brief delay then refetch to ensure consistency
      setTimeout(fetchSubjects, 100);
      
      toast({
        title: 'Subject Added',
        description: `${subject.name} has been added successfully.`,
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Error adding subject',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const removeSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      
      toast({
        title: 'Subject Removed',
        description: 'Subject has been removed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error removing subject',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return {
    subjects,
    loading,
    addSubject,
    removeSubject,
    refetch: fetchSubjects,
  };
};
