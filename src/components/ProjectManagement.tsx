import React, { useState } from 'react';
import { Project, Category, ProjectPriority, priorityLabels, priorityColors, businessTypeLabels } from '../types';
import { Plus, Edit2, Trash2, X, Check, CheckCircle2, Clock, CheckCircle, Calendar, Flag, Building2, Folder } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ProjectManagementProps {
  projects: Project[];
  categories: Category[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onCompleteProject: (id: string) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

interface EditingProject extends Project {
  isNew?: boolean;
}

export const ProjectManagement: React.FC<ProjectManagementProps> = ({
  projects,
  categories,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onCompleteProject,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [editingProject, setEditingProject] = useState<EditingProject | null>(null);
  const [filterBusinessType, setFilterBusinessType] = useState<string>('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3B82F6');

  const handleAddNew = () => {
    const today = new Date();
    const defaultTargetMonth = format(today, 'yyyy-MM');

    setEditingProject({
      id: '',
      name: '',
      categoryId: '',
      revenue: 0,
      estimatedHours: 0,
      targetMonth: defaultTargetMonth,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'C',
      businessType: 'vtuber',
      isNew: true,
    });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleSave = () => {
    if (!editingProject) return;

    if (editingProject.isNew) {
      onAddProject({
        name: editingProject.name,
        categoryId: editingProject.categoryId,
        revenue: editingProject.revenue || 0,
        estimatedHours: editingProject.estimatedHours || 0,
        targetMonth: editingProject.targetMonth,
        completed: false,
        createdAt: new Date().toISOString(),
        priority: editingProject.priority,
        businessType: editingProject.businessType,
      });
    } else {
      onUpdateProject(editingProject);
    }
    setEditingProject(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('このプロジェクトを削除してもよろしいですか？')) {
      onDeleteProject(id);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName,
        color: newCategoryColor,
      });
      setNewCategoryName('');
      setNewCategoryColor('#3B82F6');
    }
  };

  const handleUpdateCategory = (category: Category) => {
    onUpdateCategory(category);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('このカテゴリーを削除してもよろしいですか？')) {
      onDeleteCategory(id);
    }
  };

  const getCategory = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  const filteredProjects = projects.filter(project => {
    if (filterBusinessType === 'all') return true;
    return project.businessType === filterBusinessType;
  });

  const activeProjects = filteredProjects.filter(project => !project.completed);
  const completedProjects = filteredProjects.filter(project => project.completed);

  const businessTypeCounts = projects.reduce((acc, project) => {
    acc[project.businessType] = (acc[project.businessType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const renderProjectForm = (project: EditingProject) => (
    <>
      <td className="px-6 py-4">
        <input
          type="text"
          value={project.name}
          onChange={(e) =>
            setEditingProject({ ...project, name: e.target.value })
          }
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="案件名"
        />
      </td>
      <td className="px-6 py-4">
        <select
          value={project.businessType}
          onChange={(e) =>
            setEditingProject({
              ...project,
              businessType: e.target.value as Project['businessType'],
            })
          }
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {Object.entries(businessTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4">
        <select
          value={project.categoryId}
          onChange={(e) =>
            setEditingProject({
              ...project,
              categoryId: e.target.value,
            })
          }
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">選択してください</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4">
        <select
          value={project.priority}
          onChange={(e) =>
            setEditingProject({
              ...project,
              priority: e.target.value as ProjectPriority,
            })
          }
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {Object.entries(priorityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4">
        <input
          type="month"
          value={project.targetMonth}
          onChange={(e) =>
            setEditingProject({
              ...project,
              targetMonth: e.target.value,
            })
          }
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="number"
          value={project.revenue}
          onChange={(e) =>
            setEditingProject({
              ...project,
              revenue: Number(e.target.value),
            })
          }
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="number"
          value={project.estimatedHours}
          onChange={(e) =>
            setEditingProject({
              ...project,
              estimatedHours: Number(e.target.value),
            })
          }
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </td>
      <td className="px-6 py-4">
        {project.isNew ? '-' : format(new Date(project.createdAt), 'yyyy/MM/dd', { locale: ja })}
      </td>
      <td className="px-6 py-4 text-right space-x-2">
        <button
          onClick={handleSave}
          className="text-green-600 hover:text-green-900"
        >
          <Check className="h-5 w-5" />
        </button>
        <button
          onClick={() => setEditingProject(null)}
          className="text-gray-600 hover:text-gray-900"
        >
          <X className="h-5 w-5" />
        </button>
      </td>
    </>
  );

  const renderProjectRow = (project: Project) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {project.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Building2 className="w-3 h-3 mr-1" />
          {businessTypeLabels[project.businessType]}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${getCategory(project.categoryId)?.color}20`,
            color: getCategory(project.categoryId)?.color,
          }}
        >
          {getCategory(project.categoryId)?.name}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{
            backgroundColor: priorityColors[project.priority],
          }}
        >
          <Flag className="w-3 h-3 mr-1" />
          {priorityLabels[project.priority]}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className="inline-flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-1" />
          {project.targetMonth ? format(new Date(project.targetMonth), 'yyyy年M月', { locale: ja }) : '未設定'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
        ¥{project.revenue.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
        <span className="inline-flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          {project.estimatedHours}時間
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(project.createdAt), 'yyyy/MM/dd', { locale: ja })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <button
          onClick={() => handleEdit(project)}
          className="text-blue-600 hover:text-blue-900"
        >
          <Edit2 className="h-5 w-5" />
        </button>
        <button
          onClick={() => onCompleteProject(project.id)}
          className="text-green-600 hover:text-green-900"
          title="案件を完了としてマーク"
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleDelete(project.id)}
          className="text-red-600 hover:text-red-900"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </td>
    </>
  );

  return (
    <div className="space-y-8">
      {/* カテゴリー管理モーダル */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">カテゴリー管理</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 新規カテゴリー追加フォーム */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-3">新規カテゴリー追加</h4>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="カテゴリー名"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="h-9 w-20 rounded-md border-gray-300"
                />
                <button
                  onClick={handleAddCategory}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  追加
                </button>
              </div>
            </div>

            {/* カテゴリー一覧 */}
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg"
                >
                  {editingCategory?.id === category.id ? (
                    <>
                      <div className="flex items-center space-x-4 flex-1">
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              name: e.target.value,
                            })
                          }
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <input
                          type="color"
                          value={editingCategory.color}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              color: e.target.value,
                            })
                          }
                          className="h-9 w-20 rounded-md border-gray-300"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateCategory(editingCategory)}
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
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 進行中の案件 */}
      <div className="glass-panel">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">進行中の案件</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              現在進行中の案件一覧
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Folder className="h-4 w-4 mr-2" />
              カテゴリー管理
            </button>
            <select
              value={filterBusinessType}
              onChange={(e) => setFilterBusinessType(e.target.value)}
              className="glass-input text-sm"
            >
              <option value="all">すべての事業区分</option>
              {Object.entries(businessTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label} ({businessTypeCounts[value] || 0})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規案件追加
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  案件名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  事業区分
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  優先度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  対応月
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  生産高
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  推定工数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200/50">
              {editingProject?.isNew && (
                <tr>{renderProjectForm(editingProject)}</tr>
              )}
              {activeProjects.map((project) => (
                <tr key={project.id} className="hover:bg-white/30 transition-colors">
                  {editingProject?.id === project.id
                    ? renderProjectForm(editingProject)
                    : renderProjectRow(project)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 完了済みの案件 */}
      <div className="glass-panel">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-medium leading-6 text-gray-900">完了済みの案件</h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            完了した案件の一覧
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  案件名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  事業区分
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  優先度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  対応月
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  生産高
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  推定工数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  完了日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200/50">
              {completedProjects.map((project) => (
                <tr key={project.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Building2 className="w-3 h-3 mr-1" />
                      {businessTypeLabels[project.businessType]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getCategory(project.categoryId)?.color}20`,
                        color: getCategory(project.categoryId)?.color,
                      }}
                    >
                      {getCategory(project.categoryId)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{
                        backgroundColor: priorityColors[project.priority],
                      }}
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      {priorityLabels[project.priority]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {project.targetMonth ? format(new Date(project.targetMonth), 'yyyy年M月', { locale: ja }) : '未設定'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    ¥{project.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    <span className="inline-flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {project.estimatedHours}時間
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(project.completedAt!), 'yyyy/MM/dd', { locale: ja })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};