// events.js
import { tasks, toggleTaskStatus } from './tasks.js';
import { saveTasks } from './storage.js';
import {
  renderTasks,
  updateClasses,
  getTimeInfo,
  updateTaskStatus
} from './ui.js';

export function initEventListeners({
  input,
  deadlineInput,
  button,
  list,
  taskFilterBtn,
  clearDoneBtn,
  toggleThemeBtn
}) {
  let showPending = false;
  const errorSpan = document.getElementById('task-error'); // берём span ошибки один раз

  // --- Добавление задачи ---
  const addTask = () => {
    const text = input.value.trim();
    const selectedDate = deadlineInput.value
      ? new Date(deadlineInput.value).getTime()
      : null;

    // Валидация
    if (!text) {
      errorSpan.textContent = 'Введите задачу';
      errorSpan.classList.add('visible');
      return;
    } else {
      errorSpan.textContent = '';
      errorSpan.classList.remove('visible');
    }

    const task = {
      id: Date.now(),
      text,
      done: false,
      deadline: selectedDate,
      notified: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks(list, tasks, showPending);

    input.value = '';
    deadlineInput.value = '';
    input.focus();
  };

  // Добавление через кнопку
  button.addEventListener('pointerdown', addTask);

  // Добавление через Enter
  [input, deadlineInput].forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') addTask();
    });
  });

  // --- Фильтр задач ---
  taskFilterBtn.addEventListener('pointerdown', () => {
    showPending = !showPending;
    taskFilterBtn.textContent = showPending
      ? 'Показать все'
      : 'Только невыполненные';
    renderTasks(list, tasks, showPending);
  });

  // --- Очистка выполненных ---
  clearDoneBtn.addEventListener('pointerdown', () => {
    for (let i = tasks.length - 1; i >= 0; i--) {
      if (tasks[i].done) tasks.splice(i, 1);
    }
    saveTasks();
    renderTasks(list, tasks, showPending);
  });

  // --- Переключение темы ---
  toggleThemeBtn.addEventListener('pointerdown', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    toggleThemeBtn.innerHTML = isDark 
    ? '<i class="fa-regular fa-sun"></i>' 
    : '<i class="fa-regular fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // --- Лайф-клик по задачам (удаление / чекбокс) ---
  list.addEventListener('pointerup', e => {
    const li = e.target.closest('li');
    if (!li || li.classList.contains('empty-message')) return;

    const taskId = Number(li.dataset.id);
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Удаление
    if (e.target.tagName === 'BUTTON') {
      const index = tasks.indexOf(task);
      if (index > -1) tasks.splice(index, 1);
      saveTasks();
      renderTasks(list, tasks, showPending);
      return;
    }

    // Чекбокс выполнения
    toggleTaskStatus(task);
    saveTasks();
    updateTaskStatus(list, tasks, task, showPending);
  });
}