import { tasks } from './tasks.js';

export function saveTasks() { localStorage.setItem('tasks', JSON.stringify(tasks)); }

export function loadTasks() {
	const data = JSON.parse(localStorage.getItem('tasks') || '[]');
	data.forEach(task => tasks.push(task));
}