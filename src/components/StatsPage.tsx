import React, { useState } from 'react';
import { Staff, Task, Project } from '../types';
import { PieChart, FolderKanban, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, format, differenceInDays, parse } from 'date-fns';
import { ja } from 'date-fns/locale';

interface StatsPageProps {
  staff: Staff[];
  tasks: Task[];
  projects: Project[];
}

export const StatsPage: React.FC<StatsPageProps> = ({ staff, tasks, projects }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handlePreviousMonth = () => {
    setSelectedMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => addMonths(prev, 1));
  };

  const getMonthlyWorkHours = (month: Date) => {
    let totalHours = 0;
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    tasks.forEach((task) => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      
      if (taskStart <= monthEnd && taskEnd >= monthStart) {
        const taskDays = differenceInDays(taskEnd, taskStart) + 1;
        const taskHoursPerDay = task.duration / taskDays;
        
        const daysInMonth = eachDayOfInterval({
          start: taskStart > monthStart ? taskStart : monthStart,
          end: taskEnd < monthEnd ? taskEnd : monthEnd,
        }).length;
        
        totalHours += taskHoursPerDay * daysInMonth;
      }
    });

    return Math.round(totalHours);
  };

  const getMonthlyRevenue = (month: Date) => {
    const monthStr = format(month, 'yyyy-MM');
    const staffRevenues = staff.map(member => {
      const staffTasks = tasks.filter(task => task.assigneeId === member.id);
      let totalRevenue = 0;
      
      staffTasks.forEach(task => {
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate);
        const project = projects.find(p => p.id === task.projectId);
        
        if (!project || project.targetMonth !== monthStr) return;
        
        const totalTaskDays = Math.max(1, Math.floor(
          (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1);
        
        const hoursPerDay = task.duration / totalTaskDays;
        const monthlyHours = hoursPerDay * totalTaskDays;
        
        if (project.estimatedHours > 0) {
          const hourlyRate = project.revenue / project.estimatedHours;
          totalRevenue += hourlyRate * monthlyHours;
        }
      });
      
      return totalRevenue;
    });
    
    return Math.round(staffRevenues.reduce((sum, revenue) => sum + revenue, 0));
  };

  const getMonthlyTaskCount = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    return tasks.filter(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      return taskStart <= monthEnd && taskEnd >= monthStart;
    }).length;
  };

  const getMonthlyCompletedTaskCount = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    return tasks.filter(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      return taskStart <= monthEnd && taskEnd >= monthStart && task.completed;
    }).length;
  };

  const getMonthlyEstimatedHours = (month: Date) => {
    const monthStr = format(month, 'yyyy-MM');
    return projects
      .filter(project => project.targetMonth === monthStr)
      .reduce((sum, project) => sum + project.estimatedHours, 0);
  };

  const monthlyWorkHours = getMonthlyWorkHours(selectedMonth);
  const monthlyRevenue = getMonthlyRevenue(selectedMonth);
  const monthlyTaskCount = getMonthlyTaskCount(selectedMonth);
  const monthlyCompletedTaskCount = getMonthlyCompletedTaskCount(selectedMonth);
  const monthlyEstimatedHours = getMonthlyEstimatedHours(selectedMonth);

  // 選択された月のプロジェクト別作業時間を計算
  const getMonthlyProjectStats = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const projectStats = new Map<string, number>();

    tasks.forEach((task) => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      
      if (taskStart <= monthEnd && taskEnd >= monthStart) {
        const taskDays = differenceInDays(taskEnd, taskStart) + 1;
        const taskHoursPerDay = task.duration / taskDays;
        
        const daysInMonth = eachDayOfInterval({
          start: taskStart > monthStart ? taskStart : monthStart,
          end: taskEnd < monthEnd ? taskEnd : monthEnd,
        }).length;
        
        const monthlyHours = taskHoursPerDay * daysInMonth;
        const currentHours = projectStats.get(task.projectId) || 0;
        projectStats.set(task.projectId, currentHours + monthlyHours);
      }
    });

    return projectStats;
  };

  const monthlyProjectStats = getMonthlyProjectStats(selectedMonth);

  return (
    <div className="space-y-8">
      {/* 月別統計 */}
      <div className="glass-panel">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            統計情報
          </h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium">
              {format(selectedMonth, 'yyyy年M月', { locale: ja })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">月間タスク数</div>
            <div className="text-2xl font-bold text-blue-600">{monthlyTaskCount}</div>
            <div className="text-xs text-gray-500 mt-1">
              完了: {monthlyCompletedTaskCount}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">月間作業時間</div>
            <div className="text-2xl font-bold text-green-600 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {monthlyWorkHours}時間
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">推定工数</div>
            <div className="text-2xl font-bold text-purple-600">
              {monthlyEstimatedHours}時間
            </div>
            <div className="text-xs text-gray-500 mt-1">
              進捗率: {monthlyEstimatedHours > 0 ? Math.round((monthlyWorkHours / monthlyEstimatedHours) * 100) : 0}%
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">月間生産高</div>
            <div className="text-2xl font-bold text-orange-600">
              ¥{monthlyRevenue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* プロジェクト別作業時間 */}
      <div className="glass-panel">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FolderKanban className="w-5 h-5 mr-2" />
          プロジェクト別作業時間
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  プロジェクト名
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タスク数
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  合計作業時間
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => {
                const projectTasks = tasks.filter(task => task.projectId === project.id);
                const monthlyHours = monthlyProjectStats.get(project.id) || 0;

                return (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {projectTasks.length}件
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {monthlyHours.toFixed(1)}時間
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};