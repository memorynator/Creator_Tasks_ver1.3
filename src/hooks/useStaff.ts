import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Staff } from '../types';

export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setStaff(data.map(item => ({
        id: item.id,
        name: item.name,
        role: item.role as Staff['role'],
      })));
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  async function addStaff(newStaff: Omit<Staff, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .insert([{
          name: newStaff.name,
          role: newStaff.role,
        }])
        .select()
        .single();

      if (error) throw error;

      const addedStaff = {
        id: data.id,
        name: data.name,
        role: data.role as Staff['role'],
      };

      setStaff(prev => [...prev, addedStaff]);
      return addedStaff;
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  async function updateStaff(updatedStaff: Staff) {
    try {
      const { error } = await supabase
        .from('staff_members')
        .update({
          name: updatedStaff.name,
          role: updatedStaff.role,
        })
        .eq('id', updatedStaff.id);

      if (error) throw error;

      setStaff(prev =>
        prev.map(staff => staff.id === updatedStaff.id ? updatedStaff : staff)
      );

      return updatedStaff;
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  async function deleteStaff(id: string) {
    try {
      // まず、このスタッフに関連するタスクを削除
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('staff_member_id', id);

      if (tasksError) throw tasksError;

      // スタッフを削除
      const { error: deleteStaffError } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', id);

      if (deleteStaffError) throw deleteStaffError;

      setStaff(prev => prev.filter(staff => staff.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  return {
    staff,
    loading,
    error,
    addStaff,
    updateStaff,
    deleteStaff,
  };
}