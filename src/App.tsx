import React, { useState, useEffect } from 'react';
import { GanttChart } from './components/GanttChart';
import { TaskForm } from './components/TaskForm';
import { StaffManagement } from './components/StaffManagement';
import { CategoryManagement } from './components/CategoryManagement';
import { StatsPage } from './components/StatsPage';
import { ProjectManagement } from './components/ProjectManagement';
import { TaskList } from './components/TaskList';
import { IndividualPerformance } from './components/IndividualPerformance';
import { Staff, Task, Category, Project } from './types';
import { addDays } from 'date-fns';
import { LayoutGrid, BarChart2, FolderKanban, LogOut, Users } from 'lucide-react';
import { useStaff } from './hooks/useStaff';
import { useCategories } from './hooks/useCategories';
import { useProjects } from './hooks/useProjects';
import { useTasks } from './hooks/useTasks';
import { Auth } from './components/Auth';
import { Logo } from './components/Logo';
import { SplashScreen } from './components/SplashScreen';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

type View = 'main' | 'stats' | 'projects' | 'performance';

function App() {
  const { staff, addStaff, updateStaff, deleteStaff } = useStaff();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [startDate] = useState<Date>(new Date());
  const [endDate] = useState<Date>(addDays(new Date(), 60));
  const [currentView, setCurrentView] = useState<View>('main');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setCurrentView('main');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCompleteProject = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    await updateProject({
      ...project,
      completed: true,
      completedAt: new Date().toISOString(),
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'stats':
        return <StatsPage staff={staff} tasks={tasks} projects={projects} />;
      case 'projects':
        return (
          <ProjectManagement
            projects={projects}
            categories={categories}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
            onCompleteProject={handleCompleteProject}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
          />
        );
      case 'performance':
        return (
          <IndividualPerformance
            staff={staff}
            tasks={tasks}
            projects={projects}
          />
        );
      default:
        return (
          <div className="space-y-8">
            <TaskForm
              staff={staff}
              categories={categories}
              projects={projects}
              onAddTask={addTask}
            />
            <GanttChart
              tasks={tasks}
              staff={staff}
              categories={categories}
              projects={projects}
              startDate={startDate}
              endDate={endDate}
              onUpdateTask={updateTask}
            />
            <TaskList
              tasks={tasks}
              staff={staff}
              categories={categories}
              projects={projects}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StaffManagement
                staff={staff}
                onAddStaff={addStaff}
                onUpdateStaff={updateStaff}
                onDeleteStaff={deleteStaff}
              />
              <CategoryManagement
                categories={categories}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
              />
            </div>
          </div>
        );
    }
  };

  if (!session) {
    return (
      <>
        <SplashScreen />
        <Auth />
      </>
    );
  }

  return (
    <>
      <SplashScreen />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <header className="glass-card sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Logo />
              <div className="flex items-center space-x-4">
                <nav className="flex space-x-4">
                  <button
                    onClick={() => setCurrentView('main')}
                    className={`nav-button ${
                      currentView === 'main'
                        ? 'bg-blue-500/80 text-white shadow-lg scale-105'
                        : 'bg-white/50 text-gray-700'
                    }`}
                  >
                    <LayoutGrid className="h-5 w-5" />
                    <span>ダッシュボード</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('stats')}
                    className={`nav-button ${
                      currentView === 'stats'
                        ? 'bg-blue-500/80 text-white shadow-lg scale-105'
                        : 'bg-white/50 text-gray-700'
                    }`}
                  >
                    <BarChart2 className="h-5 w-5" />
                    <span>統計</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('projects')}
                    className={`nav-button ${
                      currentView === 'projects'
                        ? 'bg-blue-500/80 text-white shadow-lg scale-105'
                        : 'bg-white/50 text-gray-700'
                    }`}
                  >
                    <FolderKanban className="h-5 w-5" />
                    <span>案件管理</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('performance')}
                    className={`nav-button ${
                      currentView === 'performance'
                        ? 'bg-blue-500/80 text-white shadow-lg scale-105'
                        : 'bg-white/50 text-gray-700'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span>個別パフォーマンス</span>
                  </button>
                </nav>
                <button
                  onClick={handleSignOut}
                  className="nav-button bg-red-500/10 text-red-600 hover:bg-red-500/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span>ログアウト</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-slide-up">
          {renderContent()}
        </main>
      </div>
    </>
  );
}

export default App;