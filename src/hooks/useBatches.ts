
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Batch {
  id: string;
  department_id: string;
  name: string;
  semester: number;
  year: number;
  student_count: number;
  created_at: string;
  updated_at: string;
  departments?: {
    name: string;
    code: string;
  };
}

export const useBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBatches = async () => {
    try {
      const { data, error } = await supabase
        .from('batches')
        .select(`
          *,
          departments (
            name,
            code
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBatches(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching batches',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addBatch = async (batch: Omit<Batch, 'id' | 'created_at' | 'updated_at' | 'departments'>) => {
    try {
      const { data, error } = await supabase
        .from('batches')
        .insert([batch])
        .select(`
          *,
          departments (
            name,
            code
          )
        `)
        .single();

      if (error) throw error;
      setBatches(prev => [data, ...prev]);
      
      toast({
        title: 'Batch Added',
        description: `${batch.name} has been added successfully.`,
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Error adding batch',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const removeBatch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('batches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBatches(prev => prev.filter(batch => batch.id !== id));
      
      toast({
        title: 'Batch Removed',
        description: 'Batch has been removed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error removing batch',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  return {
    batches,
    loading,
    addBatch,
    removeBatch,
    refetch: fetchBatches,
  };
};
