import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Task } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTasks(data.map(item => ({
        id: item.id,
        title: item.title,
        projectId: item.project_id,
        assigneeId: item.staff_member_id,
        categoryId: item.category_id,
        startDate: item.start_date,
        endDate: item.end_date,
        duration: parseFloat(item.duration), // 数値として確実にパース
        completed: item.completed,
      })));
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  async function addTask(newTask: Omit<Task, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: newTask.title,
          project_id: newTask.projectId,
          staff_member_id: newTask.assigneeId,
          category_id: newTask.categoryId,
          start_date: newTask.startDate,
          end_date: newTask.endDate,
          duration: parseFloat(newTask.duration.toFixed(2)), // 小数点第2位までに制限
          completed: newTask.completed,
        }])
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [{
        id: data.id,
        title: data.title,
        projectId: data.project_id,
        assigneeId: data.staff_member_id,
        categoryId: data.category_id,
        startDate: data.start_date,
        endDate: data.end_date,
        duration: parseFloat(data.duration),
        completed: data.completed,
      }, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  async function updateTask(updatedTask: Task) {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updatedTask.title,
          project_id: updatedTask.projectId,
          staff_member_id: updatedTask.assigneeId,
          category_id: updatedTask.categoryId,
          start_date: updatedTask.startDate,
          end_date: updatedTask.endDate,
          duration: parseFloat(updatedTask.duration.toFixed(2)), // 小数点第2位までに制限
          completed: updatedTask.completed,
        })
        .eq('id', updatedTask.id);

      if (error) throw error;

      setTasks(prev =>
        prev.map(task => task.id === updatedTask.id ? updatedTask : task)
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  async function deleteTask(id: string) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
  };
}