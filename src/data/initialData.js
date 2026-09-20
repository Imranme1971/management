export const DEFAULT_COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'slate' },
  { id: 'in_progress', title: 'In Progress', color: 'indigo' },
  { id: 'review', title: 'Under Review', color: 'amber' },
  { id: 'completed', title: 'Completed', color: 'emerald' },
];

export const DEFAULT_TAGS = [
  { id: 'frontend', name: 'Frontend', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
  { id: 'backend', name: 'Backend', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  { id: 'design', name: 'UI/UX Design', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20' },
  { id: 'bug', name: 'Bug Fix', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  { id: 'feature', name: 'Feature', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { id: 'ops', name: 'DevOps', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Design Imran Khan Landing Page & Dashboard Layout',
    description: 'Create modern dark/light mode mockups with responsive sidebar, Kanban board grid, and productivity metrics widgets.',
    status: 'in_progress',
    priority: 'urgent',
    tags: ['design', 'frontend'],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    estimatedTime: 120, // minutes
    spentTime: 45, // minutes
    subtasks: [
      { id: 'sub-1', title: 'Create Tailwind color palette system', completed: true },
      { id: 'sub-2', title: 'Design drag-and-drop Kanban cards', completed: true },
      { id: 'sub-3', title: 'Add responsive navigation bar', completed: false }
    ],
    link: 'https://figma.com',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'task-2',
    title: 'Implement Integrated Pomodoro Focus Timer',
    description: 'Build a focus timer modal with audio alerts, custom intervals (25m/5m/15m), and automatic task time logging.',
    status: 'in_progress',
    priority: 'high',
    tags: ['feature', 'frontend'],
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
    estimatedTime: 90,
    spentTime: 30,
    subtasks: [
      { id: 'sub-4', title: 'Build timer countdown engine', completed: true },
      { id: 'sub-5', title: 'Connect active task time increment', completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'task-3',
    title: 'Configure LocalStorage Persistence & Import/Export JSON',
    description: 'Enable instant browser state caching and allow exporting tasks to a JSON file for backup and restoration.',
    status: 'completed',
    priority: 'medium',
    tags: ['ops', 'feature'],
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    estimatedTime: 60,
    spentTime: 60,
    subtasks: [
      { id: 'sub-6', title: 'Setup React Context provider', completed: true },
      { id: 'sub-7', title: 'Implement import/export JSON handlers', completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'task-4',
    title: 'Build Analytics & Productivity Dashboard',
    description: 'Calculate real-time completion rates, task breakdown charts by priority, and total focus hours.',
    status: 'todo',
    priority: 'medium',
    tags: ['frontend', 'feature'],
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    estimatedTime: 120,
    spentTime: 0,
    subtasks: [
      { id: 'sub-8', title: 'Calculate KPI metrics', completed: false },
      { id: 'sub-9', title: 'Render priority distribution bars', completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'task-5',
    title: 'Fix Drag-and-Drop Touch Events for Mobile',
    description: 'Ensure smooth touch drag experience on iOS and Android devices in Kanban board view.',
    status: 'todo',
    priority: 'high',
    tags: ['bug', 'frontend'],
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    estimatedTime: 45,
    spentTime: 0,
    subtasks: [
      { id: 'sub-10', title: 'Test touch drag handlers', completed: false }
    ],
    createdAt: new Date(Date.now()).toISOString()
  },
  {
    id: 'task-6',
    title: 'Setup Calendar Deadline View',
    description: 'Render monthly calendar grid highlighting upcoming task due dates with quick detail preview popups.',
    status: 'review',
    priority: 'low',
    tags: ['feature'],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    estimatedTime: 75,
    spentTime: 60,
    subtasks: [
      { id: 'sub-11', title: 'Generate monthly grid days', completed: true },
      { id: 'sub-12', title: 'Map tasks to calendar days', completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];
