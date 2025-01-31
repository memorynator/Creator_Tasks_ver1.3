import React, { useState } from 'react';
import { Task, Staff, Category, Project } from '../types';
import { format, eachDayOfInterval, addDays, subDays, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Edit2, X, ChevronLeft, ChevronRight, Calendar, CalendarDays, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { TaskForm } from './TaskForm';

interface GanttChartProps {
  tasks: Task[];
  staff: Staff[];
  categories: Category[];
  startDate: Date;
  endDate: Date;
  onUpdateTask: (task: Task) => void;
  projects: Project[]; // プロジェクト情報を追加
}

interface TaskWithPosition extends Task {
  verticalPosition: number;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  staff,
  categories,
  startDate,
  endDate,
  onUpdateTask,
  projects, // プロジェクト情報を受け取る
}) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isWeeklyView, setIsWeeklyView] = useState(true);
  const [weekStart, setWeekStart] = useState(subDays(new Date(), 1));

  const displayDays = isWeeklyView
    ? eachDayOfInterval({
        start: weekStart,
        end: addDays(weekStart, 6),
      })
    : eachDayOfInterval({
        start: startDate,
        end: endDate,
      });

  const handlePreviousWeek = () => {
    setWeekStart(subDays(weekStart, 7));
  };

  const handleNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const handleToday = () => {
    setWeekStart(subDays(new Date(), 1));
  };

  const handlePreviousMonth = () => {
    setWeekStart(subDays(weekStart, 28));
  };

  const handleNextMonth = () => {
    setWeekStart(addDays(weekStart, 28));
  };

  const calculateTaskPositions = (staffId: string): TaskWithPosition[] => {
    const staffTasks = tasks
      .filter((task) => task.assigneeId === staffId)
      .map((task) => ({
        ...task,
        verticalPosition: 0,
      }));

    staffTasks.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    for (let i = 0; i < staffTasks.length; i++) {
      const currentTask = staffTasks[i];
      const currentStart = new Date(currentTask.startDate).getTime();
      const currentEnd = new Date(currentTask.endDate).getTime();
      
      const usedPositions = new Set<number>();

      for (let j = 0; j < i; j++) {
        const previousTask = staffTasks[j];
        const previousStart = new Date(previousTask.startDate).getTime();
        const previousEnd = new Date(previousTask.endDate).getTime();

        if (currentStart < previousEnd && currentEnd > previousStart) {
          usedPositions.add(previousTask.verticalPosition);
        }
      }

      let position = 0;
      while (usedPositions.has(position)) {
        position++;
      }
      currentTask.verticalPosition = position;
    }

    return staffTasks;
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    onUpdateTask(updatedTask);
    setEditingTask(null);
  };

  const getTaskCategory = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <div className="glass-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">ガントチャート</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsWeeklyView(!isWeeklyView)}
            className={`nav-button ${
              isWeeklyView ? 'bg-blue-500/80 text-white' : 'bg-white/50 text-gray-700'
            }`}
          >
            {isWeeklyView ? (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                週表示
              </>
            ) : (
              <>
                <CalendarDays className="w-4 h-4 mr-2" />
                全期間表示
              </>
            )}
          </button>
          {isWeeklyView && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white/50 rounded-lg p-1">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="前月へ"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePreviousWeek}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="前週へ"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToday}
                  className="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors mx-2"
                >
                  今日
                </button>
                <button
                  onClick={handleNextWeek}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="次週へ"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="次月へ"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm font-medium bg-white/50 px-4 py-2 rounded-lg">
                {format(weekStart, 'yyyy年M月d日', { locale: ja })}
                ～
                {format(addDays(weekStart, 6), 'M月d日', { locale: ja })}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[200px_1fr] border-b">
            <div className="p-2 font-bold bg-gray-100">スタッフ</div>
            <div className="grid" style={{ gridTemplateColumns: `repeat(${displayDays.length}, minmax(40px, 1fr))` }}>
              {displayDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`p-2 text-center text-sm border-l font-medium ${
                    isSameDay(day, new Date()) ? 'bg-blue-50' : 'bg-gray-100'
                  }`}
                >
                  {format(day, 'M/d', { locale: ja })}
                  <div className={`text-xs ${
                    isSameDay(day, new Date()) ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {format(day, 'E', { locale: ja })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y">
            {staff.map((member) => {
              const staffTasks = calculateTaskPositions(member.id);
              const maxPosition = Math.max(...staffTasks.map(t => t.verticalPosition), 0);
              const rowHeight = (maxPosition + 1) * 40 + 20;

              return (
                <div key={member.id} className="grid grid-cols-[200px_1fr]">
                  <div className="p-2 bg-white">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.role}</div>
                  </div>
                  <div
                    className="grid relative"
                    style={{
                      gridTemplateColumns: `repeat(${displayDays.length}, minmax(40px, 1fr))`,
                      height: `${rowHeight}px`,
                    }}
                  >
                    {displayDays.map((day) => (
                      <div
                        key={day.toISOString()}
                        className={`border-l h-full ${
                          isSameDay(day, new Date()) ? 'bg-blue-50/30' : ''
                        }`}
                      />
                    ))}
                    {staffTasks.map((task) => {
                      const taskStart = new Date(task.startDate);
                      const taskEnd = new Date(task.endDate);
                      const startOffset = Math.max(
                        0,
                        Math.floor(
                          (taskStart.getTime() - displayDays[0].getTime()) / (1000 * 60 * 60 * 24)
                        )
                      );
                      const duration = Math.ceil(
                        (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)
                      );
                      const category = getTaskCategory(task.categoryId);

                      // タスクが表示期間内にあるかチェック
                      if (
                        taskEnd.getTime() < displayDays[0].getTime() ||
                        taskStart.getTime() > displayDays[displayDays.length - 1].getTime()
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={task.id}
                          className={`absolute h-8 rounded-full text-xs flex items-center justify-between px-2 whitespace-nowrap overflow-hidden group transition-all hover:shadow-lg ${
                            task.completed ? 'opacity-60' : ''
                          }`}
                          style={{
                            left: `${(startOffset * 100) / displayDays.length}%`,
                            width: `${(duration * 100) / displayDays.length}%`,
                            top: `${task.verticalPosition * 40 + 4}px`,
                            backgroundColor: category?.color || '#3B82F6',
                            color: '#fff',
                          }}
                          title={`${task.title} (${task.duration}時間)`}
                        >
                          <span className="truncate">{task.title}</span>
                          <button
                            onClick={() => setEditingTask(task)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* タスク編集モーダル */}
      {editingTask && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div 
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ 
                backgroundColor: getTaskCategory(editingTask.categoryId)?.color,
                color: 'white'
              }}
            >
              <h3 className="text-xl font-semibold">タスクを編集</h3>
              <button
                onClick={() => setEditingTask(null)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <TaskForm
                staff={staff}
                categories={categories}
                projects={projects} // プロジェクト情報を渡す
                task={editingTask}
                onUpdateTask={handleTaskUpdate}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};