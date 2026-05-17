// ============================================================
// Layer 4 – Data/Service Layer: Task Service
// ============================================================
import api from './api';

const STORAGE_KEY = 'taskmanager_tasks';

// ─── Simulation helpers ─────────────────────────────────────
function loadTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const taskService = {
  async getAll() {
    // return api.get('/tasks');
    return loadTasks();
  },

  async create(taskData) {
    // return api.post('/tasks', taskData);
    const tasks = loadTasks();
    const task = {
      id: crypto.randomUUID(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.unshift(task);
    saveTasks(tasks);
    return task;
  },

  async update(id, taskData) {
    // return api.put(`/tasks/${id}`, taskData);
    const tasks = loadTasks();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    tasks[idx] = { ...tasks[idx], ...taskData, updatedAt: new Date().toISOString() };
    saveTasks(tasks);
    return tasks[idx];
  },

  async delete(id) {
    // return api.delete(`/tasks/${id}`);
    const tasks = loadTasks().filter((t) => t.id !== id);
    saveTasks(tasks);
    return { success: true };
  },

  async toggleComplete(id) {
    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    return this.update(id, { completed: !task.completed });
  },
};

export default taskService;
