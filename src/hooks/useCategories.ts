import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setCategories(data.map(item => ({
        id: item.id,
        name: item.name,
        color: item.color,
      })));
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  async function addCategory(newCategory: Omit<Category, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, {
        id: data.id,
        name: data.name,
        color: data.color,
      }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  async function updateCategory(updatedCategory: Category) {
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: updatedCategory.name,
          color: updatedCategory.color,
        })
        .eq('id', updatedCategory.id);

      if (error) throw error;

      setCategories(prev =>
        prev.map(category => category.id === updatedCategory.id ? updatedCategory : category)
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  async function deleteCategory(id: string) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      throw e;
    }
  }

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}