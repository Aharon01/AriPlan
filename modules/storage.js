import { tasks } from './tasks.js';

export function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks.length = 0;
    JSON.parse(saved).forEach(t => {
      tasks.push(typeof t === 'string' ? { text: t, done: false } : t);
    });
  }
}