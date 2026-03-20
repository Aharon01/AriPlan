export function initCalendar(deadlineInput, calendarDiv) {
  let currentDate = new Date()
  let currentYear = currentDate.getFullYear()
  let currentMonth = currentDate.getMonth()
  let selectedDay = null

  const monthNames = [
    'Январь','Февраль','Март','Апрель','Май','Июнь',
    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
  ]

  // --- HEADER ---
  const header = document.createElement('div')
  header.classList.add('calendar-header')

  const prevBtn = document.createElement('button')
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>'
  prevBtn.addEventListener('click', e => {
    e.stopPropagation()
    changeMonth(-1)
  })

  const nextBtn = document.createElement('button')
  nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>'
  nextBtn.addEventListener('click', e => {
    e.stopPropagation()
    changeMonth(1)
  })

  const title = document.createElement('span')
  title.classList.add('calendar-title')

  header.append(prevBtn, title, nextBtn)
  calendarDiv.appendChild(header)

  // --- WEEKDAYS ---
  const weekDays = document.createElement('div')
  weekDays.classList.add('calendar-weekdays')
  ;['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(d => {
    const wd = document.createElement('div')
    wd.textContent = d
    if (d === 'Сб' || d === 'Вс') wd.style.color = 'var(--color-red)'
    weekDays.appendChild(wd)
  })
  calendarDiv.appendChild(weekDays)

  // --- DAYS GRID ---
  const daysGrid = document.createElement('div')
  daysGrid.classList.add('calendar-days')
  calendarDiv.appendChild(daysGrid)

  // --- TIME PICKER ---
  const timePicker = document.createElement('div')
  timePicker.classList.add('time-picker')

  const timeDisplay = document.createElement('span')
  timeDisplay.classList.add('time-display')
  timeDisplay.textContent = '1:00'

  const hoursSlider = document.createElement('input')
  hoursSlider.type = 'range'
  hoursSlider.min = 1
  hoursSlider.max = 12
  hoursSlider.value = 1

  const minutesSlider = document.createElement('input')
  minutesSlider.type = 'range'
  minutesSlider.min = 0
  minutesSlider.max = 59
  minutesSlider.value = 0

  const slidersContainer = document.createElement('div')
  slidersContainer.classList.add('time-sliders')
  slidersContainer.append(hoursSlider, minutesSlider)

  const ampmToggle = document.createElement('button')
  ampmToggle.textContent = 'PM'
  ampmToggle.type = 'button'
  ampmToggle.classList.add('ampm-toggle')

  timePicker.append(timeDisplay, ampmToggle, slidersContainer)
  calendarDiv.appendChild(timePicker)

  // --- CONFIRM BUTTON (вне timePicker) ---
  const confirmBtn = document.createElement('button')
  confirmBtn.textContent = 'Подтвердить'
  confirmBtn.type = 'button'
  confirmBtn.classList.add('calendar-confirm')
  calendarDiv.appendChild(confirmBtn)

  // --- UPDATE TIME DISPLAY ---
  function updateTimeDisplay() {
    const hh = hoursSlider.value
    const mm = String(minutesSlider.value).padStart(2, '0')
    timeDisplay.textContent = `${hh}:${mm}`
  }
  hoursSlider.addEventListener('input', updateTimeDisplay)
  minutesSlider.addEventListener('input', updateTimeDisplay)
  ampmToggle.addEventListener('click', () => {
    ampmToggle.textContent = ampmToggle.textContent === 'AM' ? 'PM' : 'AM'
  })

  // --- OPEN CALENDAR ---
  deadlineInput.addEventListener('focus', e => {
    e.stopPropagation()
    renderCalendar()
    positionCalendar()
    calendarDiv.style.display = 'block'
  })

  // --- CLOSE WHEN CLICK OUTSIDE ---
  document.addEventListener('click', e => {
    if (!calendarDiv.contains(e.target) && e.target !== deadlineInput) {
      calendarDiv.style.display = 'none'
    }
  })

  // --- CONFIRM TIME ---
  confirmBtn.addEventListener('click', () => {
    if (!selectedDay) return

    const hours = parseInt(hoursSlider.value)
    const minutes = parseInt(minutesSlider.value)
    let adjustedHours = hours % 12
    if (ampmToggle.textContent === 'PM') adjustedHours += 12

    const mm = String(currentMonth + 1).padStart(2,'0')
    const dd = String(selectedDay.getDate()).padStart(2,'0')
    const hh = String(adjustedHours).padStart(2,'0')
    const min = String(minutes).padStart(2,'0')

    deadlineInput.value = `${currentYear}-${mm}-${dd} ${hh}:${min}`
    calendarDiv.style.display = 'none'
  })

  // --- RENDER CALENDAR ---
  function renderCalendar() {
    title.textContent = `${monthNames[currentMonth]} ${currentYear}`
    daysGrid.innerHTML = ''

    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const emptyCells = firstDay === 0 ? 6 : firstDay - 1

    for (let i = 0; i < emptyCells; i++) {
      const empty = document.createElement('div')
      empty.classList.add('calendar-day','empty')
      daysGrid.appendChild(empty)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayBtn = document.createElement('div')
      dayBtn.classList.add('calendar-day')
      dayBtn.textContent = day

      const date = new Date(currentYear, currentMonth, day)
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) dayBtn.classList.add('weekend')

      const today = new Date()
      if (day === today.getDate() &&
          currentMonth === today.getMonth() &&
          currentYear === today.getFullYear()
      ) dayBtn.classList.add('today')

      if (selectedDay &&
          day === selectedDay.getDate() &&
          currentMonth === selectedDay.getMonth() &&
          currentYear === selectedDay.getFullYear()
      ) dayBtn.classList.add('selected')

      dayBtn.addEventListener('click', e => {
        e.stopPropagation()
        selectedDay = new Date(currentYear, currentMonth, day)
        renderCalendar()
        hoursSlider.focus() // фокус на часы
      })

      daysGrid.appendChild(dayBtn)
    }
  }

  function changeMonth(delta) {
    currentMonth += delta
    if (currentMonth < 0) {
      currentMonth = 11
      currentYear--
    }
    if (currentMonth > 11) {
      currentMonth = 0
      currentYear++
    }
    renderCalendar()
  }

  function positionCalendar() {
    const rect = deadlineInput.getBoundingClientRect()
    calendarDiv.style.top = rect.bottom + window.scrollY + 'px'
    calendarDiv.style.left = rect.left + window.scrollX + 'px'
  }
}