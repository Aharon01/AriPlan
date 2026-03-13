import { tasks, toggleTaskStatus } from './tasks.js';
import { saveTasks } from './storage.js';
import { renderTasks, updateClasses, getTimeInfo, updateTaskStatus } from './ui.js';

export function initEventListeners({ input, button, list, taskFilterBtn, clearDoneBtn, toggleThemeBtn, fp }) {
  let showPending = false;

  // Добавление задачи
  const addTask = () => {
    const text = input.value.trim();
    const selectedDate = fp.selectedDates[0];
    if (!text) return;

    const task = {
      id: Date.now(),
      text,
      done: false,
      deadline: selectedDate ? selectedDate.getTime() : null,
      notified: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks(list, tasks, showPending);

    input.value = '';
    fp.clear();
    fp.close();
    input.focus();
  };

  // ✅ Используем pointerdown вместо click для кнопок
  button.addEventListener('pointerdown', addTask);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  // Фильтр задач
  taskFilterBtn.addEventListener('pointerdown', () => {
    showPending = !showPending;
    taskFilterBtn.textContent = showPending ? 'Показать все' : 'Только невыполненные';
    renderTasks(list, tasks, showPending);
  });

  // Очистка выполненных
  clearDoneBtn.addEventListener('pointerdown', () => {
    for (let i = tasks.length - 1; i >= 0; i--) {
      if (tasks[i].done) tasks.splice(i, 1);
    }
    saveTasks();
    renderTasks(list, tasks, showPending);
  });

  // Переключение темы
  toggleThemeBtn.addEventListener('pointerdown', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    toggleThemeBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Лайф-клик по задачам — pointerup для тач-событий
  list.addEventListener('pointerup', e => {
    const li = e.target.closest('li');
    if (!li || li.classList.contains('empty-message')) return;

    const taskId = Number(li.dataset.id);
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (e.target.tagName === 'BUTTON') {
      const index = tasks.indexOf(task);
      if (index > -1) tasks.splice(index, 1);
      saveTasks();
      renderTasks(list, tasks, showPending);
      return;
    }

    toggleTaskStatus(task);
    saveTasks();
    updateTaskStatus(list, tasks, task, showPending);
  });
}