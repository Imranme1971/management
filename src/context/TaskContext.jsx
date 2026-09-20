import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_COLUMNS, DEFAULT_TAGS, INITIAL_TASKS } from '../data/initialData';

export const ACCENT_THEMES = [
  { id: 'indigo', name: 'Electric Indigo', color: '#6366f1', gradient: 'from-indigo-500 via-purple-500 to-pink-500', ring: 'ring-indigo-500' },
  { id: 'ocean', name: 'Ocean Blue', color: '#0284c7', gradient: 'from-sky-500 via-blue-600 to-cyan-500', ring: 'ring-sky-500' },
  { id: 'emerald', name: 'Emerald Forest', color: '#059669', gradient: 'from-emerald-500 via-teal-500 to-emerald-600', ring: 'ring-emerald-500' },
  { id: 'rose', name: 'Sunset Rose', color: '#e11d48', gradient: 'from-rose-500 via-pink-500 to-amber-500', ring: 'ring-rose-500' },
  { id: 'amber', name: 'Solar Amber', color: '#d97706', gradient: 'from-amber-500 via-orange-500 to-yellow-500', ring: 'ring-amber-500' },
  { id: 'cyber', name: 'Cyber Synthwave', color: '#d946ef', gradient: 'from-fuchsia-500 via-purple-600 to-cyan-400', ring: 'ring-fuchsia-500' },
];

export const THEME_MODES = [
  { id: 'light', name: 'Light', icon: 'Sun' },
  { id: 'dark', name: 'Dark', icon: 'Moon' },
  { id: 'oled', name: 'OLED Black', icon: 'Sparkles' },
  { id: 'system', name: 'System', icon: 'Laptop' },
];

export const SURFACE_STYLES = [
  { id: 'mesh', name: 'Ambient Mesh', desc: 'Soft glowing gradient' },
  { id: 'dots', name: 'Dot Matrix', desc: 'Engineering blueprint grid' },
  { id: 'minimal', name: 'Minimal Solid', desc: 'Clean, flat neutral surface' },
];

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  // Theme Config State
  const [themeConfig, setThemeConfig] = useState(() => {
    const saved = localStorage.getItem('taskpulse_theme_config_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved theme config', e);
      }
    }
    const legacyTheme = localStorage.getItem('taskpulse_theme');
    return {
      mode: legacyTheme || 'system',
      accent: 'indigo',
      surface: 'mesh',
    };
  });

  // Track OS dark mode preference in real-time
  const [systemIsDark, setSystemIsDark] = useState(() => {
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute resolved mode
  const resolvedMode = themeConfig.mode === 'system'
    ? (systemIsDark ? 'dark' : 'light')
    : themeConfig.mode;

  // Apply theme classes and data attributes to document.documentElement
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('dark', 'oled');
    if (resolvedMode === 'dark') {
      root.classList.add('dark');
    } else if (resolvedMode === 'oled') {
      root.classList.add('dark', 'oled');
    }

    root.setAttribute('data-theme', themeConfig.accent || 'indigo');
    root.setAttribute('data-mode', resolvedMode);
    root.setAttribute('data-surface', themeConfig.surface || 'mesh');

    localStorage.setItem('taskpulse_theme_config_v2', JSON.stringify(themeConfig));
    localStorage.setItem('taskpulse_theme', resolvedMode);
  }, [themeConfig, resolvedMode]);

  const setThemeMode = (mode) => {
    setThemeConfig(prev => ({ ...prev, mode }));
  };

  const setAccentColor = (accent) => {
    setThemeConfig(prev => ({ ...prev, accent }));
  };

  const setSurfaceStyle = (surface) => {
    setThemeConfig(prev => ({ ...prev, surface }));
  };

  const resetThemeSettings = () => {
    setThemeConfig({
      mode: 'system',
      accent: 'indigo',
      surface: 'mesh',
    });
    showToast('Theme reset to defaults', 'info');
  };

  const toggleTheme = () => {
    setThemeConfig(prev => {
      let nextMode;
      if (prev.mode === 'light') nextMode = 'dark';
      else if (prev.mode === 'dark') nextMode = 'oled';
      else if (prev.mode === 'oled') nextMode = 'system';
      else nextMode = 'light';
      return { ...prev, mode: nextMode };
    });
  };

  // Active accent object
  const activeAccent = ACCENT_THEMES.find(t => t.id === themeConfig.accent) || ACCENT_THEMES[0];

  // Tasks State
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskpulse_tasks_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tasks', e);
      }
    }
    return INITIAL_TASKS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('taskpulse_tasks_v1', JSON.stringify(tasks));
  }, [tasks]);

  // View State: 'kanban' | 'list' | 'calendar' | 'analytics'
  const [currentView, setCurrentView] = useState('kanban');

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  // Modal & Focus Timer State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [pomodoroTask, setPomodoroTask] = useState(null);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // CRUD Actions
  const addTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      spentTime: 0,
      subtasks: [],
      tags: [],
      ...taskData,
    };
    setTasks(prev => [newTask, ...prev]);
    showToast('Task created successfully!', 'success');
  };

  const updateTask = (id, updatedFields) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    showToast('Task updated successfully!', 'success');
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task deleted', 'warning');
  };

  const moveTaskStatus = (id, newStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map(s =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, subtasks: updatedSubtasks };
      })
    );
  };

  const logFocusTime = (taskId, minutes) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return { ...t, spentTime: (t.spentTime || 0) + minutes };
      })
    );
    showToast(`Logged ${minutes} minutes of focus time!`, 'success');
  };

  const batchCompleteTasks = (taskIds) => {
    setTasks(prev =>
      prev.map(t => (taskIds.includes(t.id) ? { ...t, status: 'completed' } : t))
    );
    showToast(`Completed ${taskIds.length} tasks!`, 'success');
  };

  const batchDeleteTasks = (taskIds) => {
    setTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
    showToast(`Deleted ${taskIds.length} tasks`, 'warning');
  };

  const openCreateTaskModal = (initialStatus = 'todo') => {
    setEditingTask({ status: initialStatus });
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const startPomodoroForTask = (task) => {
    setPomodoroTask(task);
    setIsPomodoroOpen(true);
  };

  // Import / Export JSON
  const exportTasksJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `imran-khan-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported tasks to JSON file!', 'success');
  };

  const importTasksJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        setTasks(parsed);
        showToast(`Successfully imported ${parsed.length} tasks!`, 'success');
        return true;
      } else {
        throw new Error('Invalid format: expected JSON array');
      }
    } catch (err) {
      showToast(`Import failed: ${err.message}`, 'warning');
      return false;
    }
  };

  const resetToDefaultData = () => {
    setTasks(INITIAL_TASKS);
    showToast('Reset data to default demo tasks', 'info');
  };

  // Filtered Tasks helper
  const filteredTasks = tasks.filter(task => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title?.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchTags = task.tags?.some(tag => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }

    if (statusFilter !== 'all' && task.status !== statusFilter) {
      return false;
    }

    if (tagFilter !== 'all' && (!task.tags || !task.tags.includes(tagFilter))) {
      return false;
    }

    return true;
  });

  return (
    <TaskContext.Provider
      value={{
        theme: resolvedMode,
        themeConfig,
        resolvedMode,
        activeAccent,
        setThemeMode,
        setAccentColor,
        setSurfaceStyle,
        resetThemeSettings,
        toggleTheme,
        isThemeModalOpen,
        setIsThemeModalOpen,
        tasks,
        filteredTasks,
        columns: DEFAULT_COLUMNS,
        tags: DEFAULT_TAGS,
        currentView,
        setCurrentView,
        searchQuery,
        setSearchQuery,
        priorityFilter,
        setPriorityFilter,
        statusFilter,
        setStatusFilter,
        tagFilter,
        setTagFilter,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        toggleSubtask,
        logFocusTime,
        batchCompleteTasks,
        batchDeleteTasks,
        isTaskModalOpen,
        openCreateTaskModal,
        openEditTaskModal,
        closeTaskModal,
        editingTask,
        isPomodoroOpen,
        setIsPomodoroOpen,
        pomodoroTask,
        startPomodoroForTask,
        isExportImportOpen,
        setIsExportImportOpen,
        isCalculatorOpen,
        setIsCalculatorOpen,
        exportTasksJSON,
        importTasksJSON,
        resetToDefaultData,
        toast,
        showToast,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return ctx;
};
