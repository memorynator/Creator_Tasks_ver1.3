import React, { useState } from 'react';
import { Task, Staff, Category, Project, businessTypeLabels } from '../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Clock, Calendar, CheckCircle2, Edit2, Trash2, Building2, User } from 'lucide-react';
import { TaskForm } from './TaskForm';

interface TaskListProps {
  tasks: Task[];
  staff: Staff[];
  categories: Category[];
  projects: Project[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  staff,
  categories,
  projects,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [sortField, setSortField] = useState<keyof Task>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  const [filterBusinessType, setFilterBusinessType] = useState<string>('all');
  const [filterStaffId, setFilterStaffId] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const getStaffName = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.name || '未割当';
  };

  const getProject = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#gray';
  };

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleToggleComplete = (task: Task) => {
    onUpdateTask({
      ...task,
      completed: !task.completed,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('このタスクを削除してもよろしいですか？')) {
      onDeleteTask(id);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    onUpdateTask(updatedTask);
    setEditingTask(null);
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filterCompleted !== null) {
        if (task.completed !== filterCompleted) return false;
      }
      if (filterBusinessType !== 'all') {
        const project = getProject(task.projectId);
        if (project?.businessType !== filterBusinessType) return false;
      }
      if (filterStaffId !== 'all') {
        if (task.assigneeId !== filterStaffId) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortField === 'startDate' || sortField === 'endDate') {
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortField === 'duration') {
        return sortDirection === 'asc' ? a.duration - b.duration : b.duration - a.duration;
      }
      return 0;
    });

  // 事業区分ごとのタスク数を集計
  const businessTypeCounts = tasks.reduce((acc, task) => {
    const project = getProject(task.projectId);
    if (project) {
      acc[project.businessType] = (acc[project.businessType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // 担当者ごとのタスク数を集計
  const staffCounts = tasks.reduce((acc, task) => {
    acc[task.assigneeId] = (acc[task.assigneeId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <div className="glass-panel">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">タスク一覧</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">事業区分:</span>
              <select
                value={filterBusinessType}
                onChange={(e) => setFilterBusinessType(e.target.value)}
                className="glass-input text-sm"
              >
                <option value="all">すべて</option>
                {Object.entries(businessTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label} ({businessTypeCounts[value] || 0})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">担当者:</span>
              <select
                value={filterStaffId}
                onChange={(e) => setFilterStaffId(e.target.value)}
                className="glass-input text-sm"
              >
                <option value="all">すべて</option>
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({staffCounts[member.id] || 0})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">状態:</span>
              <select
                value={filterCompleted === null ? 'all' : filterCompleted.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterCompleted(value === 'all' ? null : value === 'true');
                }}
                className="glass-input text-sm"
              >
                <option value="all">すべて</option>
                <option value="false">未完了のみ</option>
                <option value="true">完了済みのみ</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  事業区分
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  案件
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タスク名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  担当者
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('startDate')}
                >
                  開始日
                  {sortField === 'startDate' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('endDate')}
                >
                  終了日
                  {sortField === 'endDate' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('duration')}
                >
                  工数
                  {sortField === 'duration' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200/50">
              {filteredTasks.map((task) => {
                const project = getProject(task.projectId);
                return (
                  <tr 
                    key={task.id}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      task.completed ? 'text-gray-400' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className={`p-1 rounded-full transition-colors ${
                          task.completed 
                            ? 'text-green-500 hover:text-green-600' 
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {project && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Building2 className="w-3 h-3 mr-1" />
                          {businessTypeLabels[project.businessType]}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {project?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getCategoryColor(task.categoryId) }}
                        />
                        <span className={task.completed ? 'line-through' : ''}>
                          {task.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <User className="w-3 h-3 mr-1" />
                        {getStaffName(task.assigneeId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(task.startDate), 'yyyy/MM/dd', { locale: ja })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(task.endDate), 'yyyy/MM/dd', { locale: ja })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className="inline-flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {task.duration}時間
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* タスク編集モーダル */}
      {editingTask && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div 
              className="px-6 py-4 border-b"
              style={{ 
                backgroundColor: getCategoryColor(editingTask.categoryId),
                color: 'white'
              }}
            >
              <h3 className="text-xl font-semibold">タスクを編集</h3>
            </div>
            <div className="p-6">
              <TaskForm
                staff={staff}
                categories={categories}
                projects={projects}
                task={editingTask}
                onUpdateTask={handleTaskUpdate}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};