// ------------------------------------
// Datepicker
// ------------------------------------
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const today = new Date()
const yy = today.getFullYear()
const mm = today.getMonth()
const dt = today.getDate()
let cy = today.getFullYear() // current year
let cm = today.getMonth() // current month
let dateArray = []
let bookingDates = []
let reserveDates = []
let soldoutDates = []

// 月曆開關
function toggleCalendar (data) {
  getAllElemt('.form-date').forEach(item => {
    addData(item, 'date', 'div, label, input, i')
  })
  window.addEventListener('click', function (e) {
    const datepicker = getAllElemt('.datepicker')
    const date = e.target.dataset.date
    const cal = e.target.dataset.cal
    const parent = e.target.parentNode
    if (cal) return
    if (!date) {
      removeElemt(datepicker)
      return
    }
    if (datepicker.length > 0) {
      removeElemt(datepicker)
    } else {
      showCalendar(parent)
    }
  })
}

// 顯示月曆框架
function showCalendar (target) {
  const datepicker = createElemt('DIV')
  datepicker.classList = 'datepicker dropdown'
  datepicker.setAttribute('data-cal', true)
  if (dateArray.length > 0) {
    const start = dateTime(dateArray[0])
    const newDate = new Date(start)
    cy = newDate.getFullYear()
    cm = newDate.getMonth()
  }
  datepicker.innerHTML = `
  <div class="date-header">
    <i class="material-icons" id="prev">chevron_left</i>
    <div class="title">${months[cm]} ${cy}</div>
    <i class="material-icons" id="next">chevron_right</i>
  </div>
  <div class="data-body">
    <table>
      <thead>
        <tr>
          <th>sun</th>
          <th>mon</th>
          <th>tue</th>
          <th>wed</th>
          <th>thu</th>
          <th>fri</th>
          <th>sat</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>`
  addData(datepicker, 'cal', 'div, i, table, thead, tr, tbody')
  target.appendChild(datepicker)
  calendar(cy, cm)
  datepicker.addEventListener('click', selectDate)
  getElemt('#prev').addEventListener('click', prev)
  getElemt('#next').addEventListener('click', next)
}

// 製作月曆
function calendar (y, m) {
  const firstDay = new Date(y, m).getDay()
  const table = getElemt('.datepicker tbody')
  let date = 1
  table.innerHTML = ''

  // 計算90天
  const max = new Date(toTimestamp(today) + 86400000 * 90)
  const maxYear = max.getFullYear()
  const maxMonth = max.getMonth()
  const maxDate = max.getDate()

  for (let r = 0; r < 6; r++) {
    const row = createElemt('TR')
    let cell, cellText
    for (let i = 0; i < 7; i++) {
      if (r === 0 && i < firstDay) {
        cell = createElemt('TD')
        row.appendChild(cell)
        cell.setAttribute('class', 'off')
      } else if (date > daysInMonth(y, m)) {
        break
      } else {
        cell = document.createElement('TD')
        cellText = document.createTextNode(date)
        cell.appendChild(cellText)
        row.appendChild(cell)
        date++

        // 過期日期
        if (cy < yy || cm < mm ||
          (cy === yy && cm === mm && date <= dt)) {
          cell.setAttribute('class', 'off')
        }

        // 標示今天
        if (cy === yy && cm === mm && date === dt + 1) {
          cell.setAttribute('class', 'now')
        }
        // 只能預訂90天內日期
        if (cy > maxYear || cm > maxMonth ||
          (cy >= maxYear && cm >= maxMonth && date > maxDate + 1)) {
          cell.setAttribute('class', 'off')
        }
      }
    }
    addData(table, 'cal', 'tr, td')
    table.appendChild(row)
  }
  dateStyle(bookingDates, 'on')
  dateStyle(dateArray, 'act')
  dateStyle(reserveDates, 'rsv')
  getSoldoutDates()
}

// 取出當月最後一天
function daysInMonth (y, m) {
  const days = new Date(y, m, 32).getDate()
  return 32 - days
}

// 切換上個月
function next () {
  cy = (cm === 11) ? (cy + 1) : cy
  cm = ((cm + 1) % 12 === 0) ? 0 : ((cm + 1) % 12)
  calendar(cy, cm)
  getElemt('.date-header .title').innerHTML = `${months[cm]} ${cy}`
}

// 切換下個月
function prev () {
  cy = (cm === 0) ? (cy - 1) : cy
  cm = (cm === 0) ? 11 : (cm - 1)
  calendar(cy, cm)
  getElemt('.date-header .title').innerHTML = `${months[cm]} ${cy}`
}

// 選取日期
function selectDate (e) {
  const tds = getAllElemt('.datepicker td')
  const target = e.target
  const cd = target.textContent
  const isOff = target.className.includes('off')
  const isRsv = target.className.includes('rsv')
  const ints = document.querySelectorAll('.form-date input')
  let newDate
  if (target.nodeName !== 'TD') return
  if (isOff || isRsv) return
  if (dateArray.length >= 2) {
    bookingDates = []
    dateArray = []
    soldoutDates = []
    tds.forEach(item => {
      item.classList.remove('on')
      item.classList.remove('act')
      item.classList.remove('sold')
    })
    newDate = dateTime(`${cy}-${cm + 1}-${cd}`)
    dateArray.push(dateForm(newDate))
    target.classList.add('act')
    dateStyle(reserveDates, 'rsv')
  } else {
    newDate = dateTime(`${cy}-${cm + 1}-${cd}`)
    if (dateForm(newDate) === dateArray[0]) {
      dateArray.slice(0, 1)
    } else {
      dateArray.push(dateForm(newDate))
      target.classList.add('act')
    }
  }
  dateArray.sort()
  for (let i = 0; i < ints.length; i++) {
    if (!dateArray[1]) {
      ints[i].value = dateArray[0]
    } else {
      ints[i].value = dateArray[0] + ' ~ ' + dateArray[1]
    }
  }
  if (dateArray.length < 2) return
  getAllDates(dateArray)
  dateStyle(bookingDates, 'on')
  dateStyle(dateArray, 'act')
  getSoldoutDates()
}

// 已售完日期
function getSoldoutDates () {
  soldoutDates = bookingDates.filter(item => {
    return reserveDates.indexOf(item) !== -1
  })
  dateStyle(soldoutDates, 'sold')
}

// 選取日期樣式
function dateStyle (array, className) {
  const tds = getAllElemt('.datepicker td')
  array.forEach(item => {
    const date = new Date(dateTime(item))
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = parseInt(date.getDate() < 10 ? `0${date.getDate()}` : date.getDate())
    for (let i = 0; i < tds.length; i++) {
      const cd = parseInt(tds[i].textContent)
      if (y === cy && m === cm + 1 && d === cd) {
        tds[i].setAttribute('class', '')
        tds[i].classList.add(className)
      }
    }
  })
}

// 日期轉 Timestamp
function toTimestamp (date) {
  return Date.parse(date)
}

// 日期轉時間
function dateTime (date) {
  const dateStr = date.split('-')
  const newDate = new Date()
  newDate.setUTCFullYear(dateStr[0], dateStr[1] - 1, dateStr[2])
  const newTime = newDate.getTime()
  return newTime
}

// 連續日期轉字串
function dateForm (value) {
  const date = new Date(value)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)
  const d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  return `${y}-${m}-${d}`
}

// 取出連續日期
function getAllDates (array) {
  const start = dateTime(array[0])
  const end = dateTime(array[1])
  for (let i = start; i <= end;) {
    bookingDates.push(dateForm(parseInt(i)))
    i = i + 86400000
  }
  return bookingDates
}
