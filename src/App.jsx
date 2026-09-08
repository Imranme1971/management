import React from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { PomodoroModal } from './components/PomodoroModal';
import { ExportImportModal } from './components/ExportImportModal';
import { Toast } from './components/Toast';

const MainContent = () => {
  const { currentView } = useTaskContext();

  return (
    <main className="min-h-[calc(100vh-64px)] pb-12">
      {currentView === 'kanban' && <KanbanBoard />}
      {currentView === 'list' && <ListView />}
      {currentView === 'calendar' && <CalendarView />}
      {currentView === 'analytics' && <AnalyticsView />}
    </main>
  );
};

const AppContainer = () => {
  const { themeConfig } = useTaskContext();
  const surfaceClass =
    themeConfig.surface === 'dots'
      ? 'surface-dots'
      : themeConfig.surface === 'minimal'
      ? 'surface-minimal'
      : 'surface-mesh';

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 ${surfaceClass}`}>
      <Header />
      <MainContent />
      <TaskModal />
      <PomodoroModal />
      <ExportImportModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <AppContainer />
    </TaskProvider>
  );
}
