import React, { useState } from 'react';
import { Staff, Task, Project, roleLabels } from '../types';
import { Clock, DollarSign, CheckCircle2, Briefcase, Trophy, Medal, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ja } from 'date-fns/locale';

interface IndividualPerformanceProps {
  staff: Staff[];
  tasks: Task[];
  projects: Project[];
}

export const IndividualPerformance: React.FC<IndividualPerformanceProps> = ({
  staff,
  tasks,
  projects,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handlePreviousMonth = () => {
    setSelectedMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => addMonths(prev, 1));
  };

  const calculateStaffPerformance = (staffMember: Staff) => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

    const staffTasks = tasks.filter(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      return (
        task.assigneeId === staffMember.id && 
        taskStart <= monthEnd && 
        taskEnd >= monthStart
      );
    });

    const completedTasks = staffTasks.filter(task => task.completed);
    const inProgressTasks = staffTasks.filter(task => !task.completed);
    
    let totalWorkHours = 0;
    staffTasks.forEach(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      
      const totalTaskDays = Math.max(1, Math.floor(
        (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1);
      
      const hoursPerDay = task.duration / totalTaskDays;
      
      const effectiveStart = new Date(Math.max(taskStart.getTime(), monthStart.getTime()));
      const effectiveEnd = new Date(Math.min(taskEnd.getTime(), monthEnd.getTime()));
      
      const overlapDays = Math.max(0, Math.floor(
        (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1);
      
      totalWorkHours += hoursPerDay * overlapDays;
    });

    const projectIds = new Set(staffTasks.map(task => task.projectId));
    
    let totalRevenue = 0;
    projectIds.forEach(projectId => {
      const project = projects.find(p => p.id === projectId);
      if (project && project.estimatedHours > 0) {
        const hourlyRate = project.revenue / project.estimatedHours;
        
        const projectTasks = staffTasks.filter(t => t.projectId === projectId);
        
        projectTasks.forEach(task => {
          const taskStart = new Date(task.startDate);
          const taskEnd = new Date(task.endDate);
          
          const totalTaskDays = Math.max(1, Math.floor(
            (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1);
          
          const hoursPerDay = task.duration / totalTaskDays;
          
          const effectiveStart = new Date(Math.max(taskStart.getTime(), monthStart.getTime()));
          const effectiveEnd = new Date(Math.min(taskEnd.getTime(), monthEnd.getTime()));
          
          const overlapDays = Math.max(0, Math.floor(
            (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1);
          
          const monthlyHours = hoursPerDay * overlapDays;
          totalRevenue += hourlyRate * monthlyHours;
        });
      }
    });

    return {
      id: staffMember.id,
      name: staffMember.name,
      role: staffMember.role,
      totalWorkHours: Math.round(totalWorkHours * 100) / 100,
      totalRevenue: Math.round(totalRevenue),
      completedTaskCount: completedTasks.length,
      inProgressTaskCount: inProgressTasks.length,
      projectCount: projectIds.size,
    };
  };

  // スタッフのパフォーマンスを計算し、生産高でソート
  const rankedPerformance = staff
    .map(member => calculateStaffPerformance(member))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  // 最高生産高を取得（プログレスバーの計算用）
  const maxRevenue = Math.max(...rankedPerformance.map(p => p.totalRevenue));

  // ランキングメダルの色
  const medalColors = {
    0: 'text-yellow-400', // 金
    1: 'text-gray-400',   // 銀
    2: 'text-amber-600',  // 銅
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <h2 className="text-lg font-medium text-gray-900">パフォーマンスランキング</h2>
          </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rankedPerformance.map((performance, index) => (
            <div 
              key={performance.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {/* ランキング表示 */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50">
                    {index < 3 ? (
                      <Medal className={`w-4 h-4 ${medalColors[index]}`} />
                    ) : (
                      <span className="text-sm font-bold text-gray-400">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{performance.name}</h3>
                    <p className="text-xs text-gray-500">{roleLabels[performance.role]}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3 bg-blue-50 rounded-lg p-2">
                  <span className="text-xs text-blue-600 font-medium">生産高</span>
                  <span className="text-lg font-bold text-blue-600">
                    ¥{performance.totalRevenue.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="flex items-center justify-center text-gray-500 mb-1">
                      <Clock className="w-3 h-3" />
                    </div>
                    <div className="text-xs font-medium text-gray-900">{performance.totalWorkHours.toFixed(1)}h</div>
                    <div className="text-[10px] text-gray-500">作業時間</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="flex items-center justify-center text-gray-500 mb-1">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <div className="text-xs font-medium text-gray-900">
                      {performance.completedTaskCount}/{performance.completedTaskCount + performance.inProgressTaskCount}
                    </div>
                    <div className="text-[10px] text-gray-500">完了タスク</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="flex items-center justify-center text-gray-500 mb-1">
                      <Briefcase className="w-3 h-3" />
                    </div>
                    <div className="text-xs font-medium text-gray-900">{performance.projectCount}件</div>
                    <div className="text-[10px] text-gray-500">担当案件</div>
                  </div>
                </div>

                {/* 生産高プログレスバー */}
                <div className="space-y-1">
                  <div className="text-[10px] text-gray-500">チーム貢献割合</div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${(performance.totalRevenue / maxRevenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};