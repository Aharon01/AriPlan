export function renderTasks(list, tasks, showPending) {
	const now = Date.now()
	list.innerHTML = ''
	const fragment = document.createDocumentFragment()

	const sortedTasks = [...tasks]
		.filter(t => !showPending || !t.done)
		.sort((a, b) => {
			const aOverdue = a.deadline && a.deadline < now && !a.done
			const bOverdue = b.deadline && b.deadline < now && !b.done
			if (aOverdue && !bOverdue) return -1
			if (!aOverdue && bOverdue) return 1
			if (a.done && !b.done) return 1
			if (!a.done && b.done) return -1
			return b.id - a.id
		})

	if (!sortedTasks.length) {
		const li = document.createElement('li')
		li.textContent = '📭 Задач пока нет'
		li.classList.add('empty-message')
		fragment.appendChild(li)
	} else {
		sortedTasks.forEach(task => {
			const li = document.createElement('li')
			li.dataset.id = task.id

			const checkbox = document.createElement('input')
			checkbox.type = 'checkbox'
			checkbox.checked = task.done

			const span = document.createElement('span')
			span.textContent = task.text + getTimeInfo(task, now)

			const deleteBtn = document.createElement('button')
			deleteBtn.textContent = '🗑'

			li.append(checkbox, span, deleteBtn)
			updateClasses(li, span, task)

			fragment.appendChild(li)
		})
	}

	list.appendChild(fragment)
}

// лайф-обновление после клика/чекбокса
export function updateTaskStatus(list, tasks, task, showPending) {
	const now = Date.now()
	const li = list.querySelector(`li[data-id='${task.id}']`)
	if (!li) return
	const checkbox = li.querySelector('input[type="checkbox"]')
	const span = li.querySelector('span')
	checkbox.checked = task.done
	span.textContent = task.text + getTimeInfo(task, now)
	updateClasses(li, span, task)

	// Сортировка задач в DOM раз в минуту
	setTimeout(() => {
		const sortedTasks = [...tasks]
			.filter(t => !showPending || !t.done)
			.sort((a, b) => {
				const aOverdue = a.deadline && a.deadline < Date.now() && !a.done
				const bOverdue = b.deadline && b.deadline < Date.now() && !b.done
				if (aOverdue && !bOverdue) return -1
				if (!aOverdue && bOverdue) return 1
				if (a.done && !b.done) return 1
				if (!a.done && b.done) return -1
				return b.id - a.id
			})

		sortedTasks.forEach(t => {
			const li = list.querySelector(`li[data-id='${t.id}']`)
			if (li) list.appendChild(li)
		})
	}, 1000) // небольшой таймаут, чтобы не дергалось мгновенно
}

export function updateClasses(li, span, task) {
	const now = Date.now()
	const isOverdue = !task.done && task.deadline && task.deadline < now

	li.classList.remove('done', 'overdue')
	span.classList.remove('done', 'overdue')

	if (task.done && isOverdue) {
		li.classList.add('done', 'overdue')
		span.classList.add('done', 'overdue')
	} else if (task.done) {
		li.classList.add('done')
		span.classList.add('done')
	} else if (isOverdue) {
		li.classList.add('overdue')
		span.classList.add('overdue')
	}
}

export function getTimeInfo(task, now) {
	if (!task.deadline || task.done) return ''
	const diff = task.deadline - now
	if (diff <= 0) return ' (просрочено)'
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))
	const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
	const minutes = Math.floor((diff / (1000 * 60)) % 60)
	return days > 0
		? ` (осталось ${days}д ${hours}ч)`
		: ` (осталось ${hours}ч ${minutes}м)`
}

// лайф-обновление просрочки каждую минуту
export function startLiveUpdate(list, tasks, showPending = false) {
	setInterval(() => {
		const now = Date.now()
		list.querySelectorAll('li').forEach(li => {
			if (li.classList.contains('empty-message')) return
			const taskId = Number(li.dataset.id)
			const task = tasks.find(t => t.id === taskId)
			if (!task) return
			// 🔔 уведомление за 10 минут до дедлайна
			if (task.deadline && !task.done && !task.notified) {
				const diff = task.deadline - now

				if (diff <= 10 * 60 * 1000 && diff > 9 * 60 * 1000) {
					if (Notification.permission === 'granted') {
						new Notification('⏰ Напоминание', {
							body: `До дедлайна 10 минут: ${task.text}`
						})
					}
					task.notified = true
				}
			}
			const span = li.querySelector('span')
			span.textContent = task.text + getTimeInfo(task, now)
			updateClasses(li, span, task)
		})

		// Сортировка DOM раз в минуту
		const sortedTasks = [...tasks]
			.filter(t => !showPending || !t.done)
			.sort((a, b) => {
				const aOverdue = a.deadline && a.deadline < Date.now() && !a.done
				const bOverdue = b.deadline && b.deadline < Date.now() && !b.done
				if (aOverdue && !bOverdue) return -1
				if (!aOverdue && bOverdue) return 1
				if (a.done && !b.done) return 1
				if (!a.done && b.done) return -1
				return b.id - a.id
			})
		sortedTasks.forEach(t => {
			const li = list.querySelector(`li[data-id='${t.id}']`)
			if (li) list.appendChild(li)
		})
	}, 60 * 1000) // раз в минуту
}
