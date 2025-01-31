import React, { useState } from 'react';
import { Category } from '../types';
import { Edit2, Trash2, X, Check, Plus } from 'lucide-react';

interface CategoryManagementProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

interface EditingCategory extends Category {
  isNew?: boolean;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);

  const handleAddNew = () => {
    setEditingCategory({
      id: '',
      name: '',
      color: '#3B82F6',
      isNew: true,
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleSave = () => {
    if (!editingCategory) return;

    if (editingCategory.isNew) {
      onAddCategory({
        name: editingCategory.name,
        color: editingCategory.color,
      });
    } else {
      onUpdateCategory(editingCategory);
    }
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('このカテゴリーを削除してもよろしいですか？')) {
      onDeleteCategory(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">業務カテゴリー管理</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            業務カテゴリーの追加、編集、削除ができます
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          新規カテゴリー追加
        </button>
      </div>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                カテゴリー名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                カラー
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                {editingCategory?.id === category.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, name: e.target.value })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="color"
                        value={editingCategory.color}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, color: e.target.value })
                        }
                        className="block w-20 h-8 rounded-md border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {editingCategory?.isNew && (
              <tr>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                    placeholder="カテゴリー名"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="color"
                    value={editingCategory.color}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, color: e.target.value })
                    }
                    className="block w-20 h-8 rounded-md border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={handleSave}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};