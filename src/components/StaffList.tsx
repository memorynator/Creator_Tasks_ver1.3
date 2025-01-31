import React from 'react';
import { Staff, roleLabels } from '../types';
import { Clock } from 'lucide-react';

interface StaffListProps {
  staff: Staff[];
  tasks: Array<{
    id: string;
    assigneeId: string;
    duration: number;
    completed: boolean;
  }>;
}

export const StaffList: React.FC<StaffListProps> = ({ staff, tasks }) => {
  const getStaffWorkload = (staffId: string) => {
    return tasks
      .filter((task) => task.assigneeId === staffId)
      .reduce((total, task) => total + task.duration, 0);
  };

  return (
    <div className="glass-panel">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">スタッフ一覧</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          全スタッフの作業時間と担当タスク数
        </p>
      </div>
      <div className="mt-4">
        <ul className="divide-y divide-gray-200/50">
          {staff.map((member, index) => {
            const workload = getStaffWorkload(member.id);
            const taskCount = tasks.filter(
              (task) => task.assigneeId === member.id
            ).length;

            return (
              <li
                key={member.id}
                className="px-4 py-4 hover:bg-white/50 transition-colors duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between group">
                  <div className="transition-all duration-300 group-hover:translate-x-2">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{roleLabels[member.role]}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500 transition-all duration-300 group-hover:scale-110">
                      <Clock className="w-4 h-4 mr-1" />
                      {workload}時間
                    </div>
                    <div className="text-sm text-gray-500">
                      タスク数: {taskCount}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}