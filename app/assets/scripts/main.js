// ------------------------------------
// Axios
// ------------------------------------
const api = 'https://challenge.thef2e.com/api/thef2e2019/stage6/'
const token = 'mjs4qNPvY17z6Ewyure88QDmZnCaXMZ6ZaOnDMGhP4ZfUpLSzjEJePhDiULQ'
const pathname = location.pathname
let id

const getRooms = () => {
  return window.axios.get(`${api}rooms`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).catch(err => {
    console.log(err)
  })
}

const getBookings = () => {
  return window.axios.get(`${api}room/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).catch(err => {
    console.log(err)
  })
}

if (pathname === '/room.html') {
  id = location.search.split('?')[1]
  window.axios.all([
    getRooms(),
    getBookings()
  ])
    .then(window.axios.spread((roomData, bookingData) => {
      const rooms = roomData.data.items
      const bookings = bookingData.data
      active(rooms)
      getRoomsInfo(bookings)
      getBookingData(bookings)
    }))
} else if (pathname === '/reserve.html') {
  id = location.search.split('?')[1].split('&')[1]
  window.axios.all([
    getRooms(),
    getBookings()
  ])
    .then(window.axios.spread((roomData, bookingData) => {
      const rooms = roomData.data.items
      const bookings = bookingData.data
      active(rooms)
      getBookingData(bookings)
    }))
} else if (pathname === '/success.html') {
  id = location.search.split('?')[1].split('&')[1]
  window.axios.all([
    getRooms(),
    getBookings()
  ])
    .then(window.axios.spread((roomData, bookingData) => {
      const rooms = roomData.data.items
      const bookings = bookingData.data
      active(rooms)
      getPostData(bookings)
    }))
} else {
  getRooms()
    .then(res => {
      const rooms = res.data.items
      active(rooms)
      render(rooms)
    })
}

// ------------------------------------
// Basic
// ------------------------------------
const getElemt = (elemt) => document.querySelector(elemt)
const getAllElemt = (elemt) => document.querySelectorAll(elemt)
const createElemt = (elemt) => document.createElement(elemt)
const currency = (x) => '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const body = document.body
const wrapper = getElemt('.wrapper')
const load = getElemt('.loading')
const alert = getElemt('.alert')
const cont = alert.querySelector('.alert-content')
let roomName
let roomId
let check = 0

function addData (arry, name, item) {
  const newArry = arry.querySelectorAll(item)
  newArry.forEach(elemt => {
    elemt.setAttribute(`data-${name}`, true)
  })
  return newArry
}

function removeElemt (arry) {
  for (let i = 0; i < arry.length; i++) {
    arry[i].remove()
  }
}

function loading () {
  body.removeChild(load)
  body.scrollTop = 0
  document.documentElement.scrollTop = 0
  wrapper.classList.add('load')
}

function closeAlert () {
  alert.classList.add('close')
  setTimeout(() => {
    alert.style.display = 'none'
    alert.classList.remove('close')
    cont.innerHTML = ''
  }, 600)
}

function active (data) {
  loading()
  toggleCalendar()
  toggleRoom(data)
}
