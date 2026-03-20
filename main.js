import { tasks } from './modules/tasks.js';
import { loadTasks } from './modules/storage.js';
import { renderTasks, startLiveUpdate } from './modules/ui.js';
import { initEventListeners } from './modules/events.js';
import { initCalendar } from './modules/calendar.js';

const input = document.getElementById('task-input');
const button = document.getElementById('add-btn');
const list = document.getElementById('task-list');
const taskFilterBtn = document.getElementById('task-filter');
const clearDoneBtn = document.getElementById('clear-done');
const toggleThemeBtn = document.getElementById('toggle-theme');
const deadlineInput = document.getElementById('deadline-input');
const calendarDiv = document.getElementById('calendar');

initCalendar(deadlineInput, calendarDiv);


loadTasks();
// 🔔 запрос разрешения на уведомления
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}
renderTasks(list, tasks, false);

initEventListeners({
  input,
  deadlineInput,
  button,
  list,
  taskFilterBtn,
  clearDoneBtn,
  toggleThemeBtn,
});

// лайф обновление дедлайнов
startLiveUpdate(list, tasks);