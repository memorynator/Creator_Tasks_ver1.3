import React, { useState } from 'react';
import { Staff, Task, Category, Project } from '../types';
import { Calendar, Clock, User, Folder, Plus, X } from 'lucide-react';

interface TaskFormProps {
  staff: Staff[];
  categories: Category[];
  projects: Project[];
  task?: Task;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask?: (task: Task) => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  staff = [],
  categories = [],
  projects = [],
  task,
  onAddTask,
  onUpdateTask,
  onCancel,
}) => {
  const [isExpanded, setIsExpanded] = useState(!!task);
  const [title, setTitle] = useState(task?.title || '');
  const [projectId, setProjectId] = useState(task?.projectId || '');
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || '');
  const [categoryId, setCategoryId] = useState(task?.categoryId || '');
  const [startDate, setStartDate] = useState(task?.startDate || '');
  const [endDate, setEndDate] = useState(task?.endDate || '');
  const [duration, setDuration] = useState(task?.duration?.toString() || '');
  const [completed] = useState(false);

  const activeProjects = projects.filter(p => !p.completed);
  const selectedProject = activeProjects.find(p => p.id === projectId);
  const projectCategory = selectedProject 
    ? categories.find(c => c.id === selectedProject.categoryId)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      title,
      projectId,
      assigneeId,
      categoryId,
      startDate,
      endDate,
      duration: parseFloat(parseFloat(duration).toFixed(2)), // 小数点第2位まで保持
      completed,
    };

    if (task && onUpdateTask) {
      onUpdateTask({ ...taskData, id: task.id });
    } else {
      onAddTask(taskData);
    }

    if (!task) {
      setTitle('');
      setProjectId('');
      setAssigneeId('');
      setCategoryId('');
      setStartDate('');
      setEndDate('');
      setDuration('');
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="glass-panel">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center space-x-2 py-4 text-gray-600 hover:text-blue-600 transition-colors group"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
          <span className="font-medium">新しいタスクを追加</span>
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel space-y-6 animate-scale-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {task ? 'タスクを編集' : '新しいタスク'}
        </h3>
        {!task && (
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100/50"
          >
            <X className="w-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* プロジェクト選択 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Folder className="w-4 h-4 mr-2" />
            プロジェクト
          </label>
          <select
            value={projectId}
            onChange={(e) => {
              setProjectId(e.target.value);
              const project = activeProjects.find(p => p.id === e.target.value);
              if (project) {
                setCategoryId(project.categoryId);
              }
            }}
            className="glass-input w-full"
            required
          >
            <option value="">選択してください</option>
            {activeProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {selectedProject && projectCategory && (
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: projectCategory.color }}
              />
              {projectCategory.name}
            </div>
          )}
        </div>

        {/* タスク名とスタッフ選択 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              タスク名
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-input w-full"
              placeholder="タスクの名前を入力"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2" />
              担当者
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="glass-input w-full"
              required
            >
              <option value="">選択してください</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 日付と時間 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              開始日
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="glass-input w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              終了日
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="glass-input w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              所要時間
            </label>
            <div className="relative">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="glass-input w-full pr-12"
                placeholder="0.00"
                step="0.01" // 小数点第2位まで入力可能に
                min="0"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                時間
              </span>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{task ? '更新' : '追加'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};