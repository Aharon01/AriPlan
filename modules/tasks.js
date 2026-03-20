export const tasks = [];

export function addTask(task) {
  tasks.push(task);
}

export function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index > -1) tasks.splice(index, 1);
}

export function clearDoneTasks() {
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].done) tasks.splice(i, 1);
  }
}

export function toggleTaskStatus(task) {
  task.done = !task.done;
}