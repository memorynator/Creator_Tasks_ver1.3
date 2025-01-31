import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Project, ProjectPriority, BusinessType } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data.map(item => ({
        id: item.id,
        name: item.name,
        categoryId: item.category_id,
        revenue: item.revenue,
        estimatedHours: item.estimated_hours,
        targetMonth: item.target_month,
        completed: item.completed,
        createdAt: item.created_at,
        completedAt: item.completed_at,
        priority: (item.priority || 'C') as ProjectPriority,
        businessType: (item.business_type || 'vtuber') as BusinessType,
      })));
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  async function addProject(newProject: Omit<Project, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: newProject.name,
          category_id: newProject.categoryId,
          revenue: newProject.revenue,
          estimated_hours: newProject.estimatedHours,
          target_month: newProject.targetMonth,
          completed: newProject.completed,
          completed_at: newProject.completedAt,
          priority: newProject.priority,
          business_type: newProject.businessType,
        }])
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [{
        id: data.id,
        name: data.name,
        categoryId: data.category_id,
        revenue: data.revenue,
        estimatedHours: data.estimated_hours,
        targetMonth: data.target_month,
        completed: data.completed,
        createdAt: data.created_at,
        completedAt: data.completed_at,
        priority: data.priority as ProjectPriority,
        businessType: data.business_type as BusinessType,
      }, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  async function updateProject(updatedProject: Project) {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: updatedProject.name,
          category_id: updatedProject.categoryId,
          revenue: updatedProject.revenue,
          estimated_hours: updatedProject.estimatedHours,
          target_month: updatedProject.targetMonth,
          completed: updatedProject.completed,
          completed_at: updatedProject.completedAt,
          priority: updatedProject.priority,
          business_type: updatedProject.businessType,
        })
        .eq('id', updatedProject.id);

      if (error) throw error;

      setProjects(prev =>
        prev.map(project => project.id === updatedProject.id ? updatedProject : project)
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  async function deleteProject(id: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
  };
}