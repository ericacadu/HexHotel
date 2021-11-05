getElemt('.copyright .year').innerHTML = yy
// ------------------------------------
// Index
// ------------------------------------
function navBar () {
  const dropdown = getAllElemt('.dropdown')
  const nav = getElemt('nav')
  if (body.clientWidth > 767) {
    if (body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      nav.style.top = 0
    } else {
      nav.style.top = '-72px'
      setTimeout(() => {
        document.activeElement.blur()
        removeElemt(dropdown)
      }, 300)
    }
  }
  window.addEventListener('scroll', navBar)
}

function room (data) {
  let str = ''
  str = `
    <div class="room-item">
      <div class="room-img">
        <a class="room-link" href="./room.html?${data.id}"></a>
        <img src="${data.imageUrl}" alt="">
      </div>
      <div class="room-title">${data.name}</div>
      <div class="room-price">${currency(data.normalDayPrice)} NTD / night</div>
    </div>`
  return str
}

function render (data) {
  const recommend = getElemt('.recommend .room-cloumns')
  const rooms = getAllElemt('.rooms .room-cloumns')
  const cont = {
    single: {
      title: `
        <div class="title-group">
          <h3>One person</h3>
          <p>Enjoy the one and only service</p>
        </div>`,
      type: ''
    },
    double: {
      title: `
      <div class="title-group">
        <h3>Two people</h3>
        <p>The perfect choice for both of you</p>
      </div>`,
      type: ''
    },
    twin: {
      title: `
      <div class="title-group">
        <h3>Family</h3>
        <p>Wanna a big room? there you are</p>
      </div>`,
      type: ''
    }
  }

  data.forEach(item => {
    if (item.name.includes('Single')) {
      cont.single.type += room(item)
    } else if (item.name.includes('Double')) {
      cont.double.type += room(item)
    } else {
      cont.twin.type += room(item)
    }
  })
  rooms[0].innerHTML = cont.single.title + cont.single.type
  rooms[1].innerHTML = cont.double.title + cont.double.type
  rooms[2].innerHTML = cont.twin.title + cont.twin.type
  recommend.innerHTML = room(data[4]) + room(data[2]) + room(data[1])
  navBar()
}

function toggleRoom (data) {
  const ints = getAllElemt('.form-room input')
  const rooms = getAllElemt('.form-room')
  rooms.forEach(item => {
    addData(item, 'room', 'label, input, i')
  })
  if (ints.length === 1) {
    roomId = location.search.split('?')[1].split('&')[1]
    data.filter(item => {
      if (roomId === item.id) {
        roomName = item.name
        return roomName
      }
    })
  }
  window.addEventListener('click', (e) => {
    const roompicker = getAllElemt('.roompicker')
    const room = e.target.dataset.room
    const parent = e.target.parentNode
    if (!room) {
      removeElemt(roompicker)
      return
    }
    if (roompicker.length > 0) {
      removeElemt(roompicker)
    } else {
      showRoomList(data, parent)
      roomFilter(data)
    }
    if (room === 'true') return
    if (rooms.length === 1) {
      const url = `./room.html?${roomId}`
      location.assign(url)
    }
  })
}

function roomFilter (data) {
  const items = getAllElemt('.roompicker li')
  const ints = getAllElemt('.form-room input')
  items.forEach(item => {
    item.addEventListener('click', () => {
      roomName = item.textContent
      ints.forEach(item => { item.value = roomName })
      data.filter(item => {
        if (roomName === item.name) roomId = item.id
      })
      return {
        roomName,
        roomId
      }
    })
  })
}

function showRoomList (data, target) {
  const menu = createElemt('DIV')
  let str = ''
  menu.classList = 'roompicker dropdown'
  data.map(item => {
    str += `<li data-room="${item.name}">${item.name}</li>`
    return str
  })
  menu.innerHTML += `<ul>${str}<ul>`
  target.appendChild(menu)
}

// ------------------------------------
// Room
// ------------------------------------
function getRoomsInfo (data) {
  const newRoom = data.room[0]
  const title = getElemt('.img-group h1')
  const normal = getElemt('.normal-price ')
  const holiday = getElemt('.holiday-price ')
  const desc = getElemt('.description .info-cont')
  const roomValue = getElemt('nav .form-room input')
  roomValue.value = newRoom.name
  title.innerHTML = newRoom.name
  normal.innerHTML = `<span>${currency(newRoom.normalDayPrice)} NTD</span> / night`
  holiday.innerHTML = `holiday price - ${currency(newRoom.holidayPrice)} NTD / night `
  desc.innerHTML = `${newRoom.description}
    <div class="room-info mt-3">
    ${newRoom.descriptionShort.GuestMin} - ${newRoom.descriptionShort.GuestMax} Guest・
    ${newRoom.descriptionShort.Bed.length} Bed (${newRoom.descriptionShort.Bed})・
    ${newRoom.descriptionShort['Private-Bath']} Private Bath・
    ${newRoom.descriptionShort.Footage} m²<br>
    Check In：${newRoom.checkInAndOut.checkInEarly} - ${newRoom.checkInAndOut.checkInLate}<br>
    Check Out：${newRoom.checkInAndOut.checkOut}</div>`
  photos(newRoom)
  amenities(newRoom)
  roomId = newRoom.id
  roomName = newRoom.name
}

function amenities (data) {
  const keys = ['Wi-Fi', 'Television', 'Great-View', 'Breakfast', 'Air-Conditioner', 'Smoke-Free', 'Mini-Bar', 'Refrigerator', 'Child-Friendly', 'Room-Service', 'Sofa', 'Pet-Friendly']
  const list = document.querySelectorAll('.amenities-list li')
  const items = data.amenities
  for (let i = 0; i < keys.length; i++) {
    if (items[keys[i]]) {
      list[i].classList.add('show')
    } else {
      list[i].classList.remove('show')
    }
  }
}

function photos (data) {
  const cover = getElemt('.img-large')
  const imgs = getAllElemt('.list-group li')
  cover.innerHTML = `<img src="${data.imageUrl[0]}"/>`
  imgs.forEach((item, index) => {
    const pic = `<img src="${data.imageUrl[index]}"/>`
    item.innerHTML = pic
    item.addEventListener('mouseover', () => {
      cover.innerHTML = pic
    })
  })
}

function formFixed () {
  const container = getElemt('.container')
  const formBox = getElemt('.form-group.fixed')
  if (!formBox) return
  if (body.clientWidth > 992) {
    formBox.style.marginRight = -(container.offsetWidth / 2) + 'px'
  } else {
    formBox.style.marginRight = ''
  }
}

window.addEventListener('resize', formFixed)
window.addEventListener('load', formFixed)

// ------------------------------------
// Reserve
// ------------------------------------
function getBookingData (data) {
  const id = location.search.split('?')[1]
  const dates = id.split('&')[2]
  const room = data.room[0]
  const booking = data.booking
  const ints = getAllElemt('.form-reserve input')
  if (dates) {
    const photo = getElemt('.form-img')
    const name = getElemt('.form-name')
    const newDate = dates.split(',')
    const dateValue = getElemt('.form-date input')
    photo.innerHTML = `<img src="${room.imageUrl[0]}"/>`
    name.innerHTML = room.name
    bookingDates = newDate
    dateArray[0] = newDate[0]
    dateArray[1] = newDate[newDate.length - 1]
    dateValue.value = `${dateArray[0]} ~ ${dateArray[1]}`
    showPrice(room)
  }
  window.addEventListener('click', (e) => {
    const cal = e.target.dataset.cal
    const total = getElemt('.form-total')
    const popup = getElemt('.msg-alert')
    if (!cal) return
    if (dateArray.length < 2) {
      total.style.display = 'none'
      popup.style.display = 'none'
      return
    }
    showPrice(room)
  })
  booking.map(item => reserveDates.push(item.date))
  getSoldoutDates()
  if (soldoutDates.length > 0) showPrice(room)
  if (ints.length > 0) {
    ints.forEach(item => {
      item.addEventListener('focus', () => {
        item.parentNode.classList.add('on')
      })
      item.addEventListener('blur', () => {
        item.parentNode.classList.remove('on')
        verify()
      })
    })
  }
}

function calcPrice (array) {
  const totalDays = JSON.parse(JSON.stringify(array))
  const weekend = []
  totalDays.splice(-1, 1)
  totalDays.filter(item => {
    const time = new Date(dateTime(item))
    const day = time.getDay()
    if (day === 0 || day === 5 || day === 6) weekend.push(item)
    return weekend
  })
  return {
    totalDays,
    weekend
  }
}
function showPrice (data) {
  const total = getElemt('.form-total')
  const popup = getElemt('.msg-alert')
  const days = calcPrice(bookingDates)
  const price = {
    normal: data.normalDayPrice * (days.totalDays.length - days.weekend.length),
    holiday: data.holidayPrice * days.weekend.length,
    service: 200 * days.totalDays.length
  }
  const totalPrice = price.normal + price.holiday + price.service
  let normalCont = ''
  let holidayCont = ''
  if (price.normal) {
    normalCont = `<li>
      <div class="item-detail">${currency(data.normalDayPrice)} x ${days.totalDays.length - days.weekend.length} night</div>
      <div class="item-price">${currency(price.normal)}</div>
    </li>`
  }
  if (price.holiday) {
    holidayCont = `<li>
      <div class="item-detail">${currency(data.holidayPrice)} x ${days.weekend.length} night</div>
      <div class="item-price">${currency(price.holiday)}</div>
    </li>`
  }
  const serviceCont = `<li>
    <div class="item-detail">Service Fee</div>
    <div class="item-price">${currency(price.service)}</div>
  </li>`
  const totalCont = `
    <li class="total-price">
      <label>TOTAL</label>
      <div class="price">${currency(totalPrice)}</div>
    </li>`

  if (soldoutDates.length > 0) {
    popup.innerHTML = 'The date you selected is sold out.'
    popup.style.display = 'block'
    total.style.display = 'none'
  } else {
    total.innerHTML = normalCont + holidayCont + serviceCont + totalCont
    total.style.display = 'block'
    popup.style.display = 'none'
  }
}

// ------------------------------------
// Success
// ------------------------------------
function getPostData (data) {
  const bookings = data.booking
  const infos = getAllElemt('.success-detail .info')
  const dates = location.search.split('&')[3].split(',')
  const days = dates.length - 1
  let bookingData = []
  bookings.filter(item => {
    if (item.date === dates[0]) {
      bookingData = [item.name, item.tel, `${roomName} / ${days} Nights`, dates[0], dates[days]]
    }
    return bookingData
  })
  infos.forEach((item, index) => {
    item.innerHTML = bookingData[index]
  })
}

// ------------------------------------
// Verify
// ------------------------------------
function verify () {
  const ints = getAllElemt('.form-reserve input')
  const phone = getElemt('#phone')
  const isTrim = (item) => item.value.trim()
  const isMsg = (item) => item.parentNode.querySelector('.msg')
  if (!popup) { return }
  if (soldoutDates.length > 0) {
    cont.innerHTML = 'Please select correct dates.'
    popup.style.display = 'block'
    check = 1
  } else if (dateArray.length < 2) {
    cont.innerHTML = 'Please select 2 dates at least.'
    popup.style.display = 'block'
    check = 1
  } else if (!roomName) {
    cont.innerHTML = 'Please select room style.'
    popup.style.display = 'block'
    check = 1
  } else if (ints.length > 0) {
    ints.forEach(item => {
      if (!isTrim(item) || (item === phone && !isTEL(phone))) {
        item.classList.add('is-invalid')
        isMsg(item).style.display = 'block'
        check = 1
      } else {
        item.classList.remove('is-invalid')
        isMsg(item).style.display = 'none'
        check = 0
      }
    })
  } else {
    check = 0
  }
}

function isTEL (item) {
  const reg = /^[0]{1}[9]{1}[0-9]{8}$/
  if (!reg.exec(item.value)) {
    return false
  } else {
    return true
  }
}

// ------------------------------------
// Post
// ------------------------------------
function postData (id, Name, Tel, Dates) {
  window.axios({
    method: 'POST',
    url: `${api}room/${id}`,
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`
    },
    data: {
      name: Name,
      tel: Tel,
      date: Dates
    }
  }).then(res => {
    const status = res.data
    if (status.success) {
      const url = `./success.html?&${roomId}&${roomName}&${bookingDates}`
      location.assign(url)
    }
  }).catch(err => {
    console.log(err)
  })
}

// ------------------------------------
// Delete
// ------------------------------------
function deleteData () {
  window.axios.delete(`${api}rooms`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => {
    const status = res.status
    if (status === 200) {
      cont.innerHTML = 'All reservations has been deleted.'
      popup.style.display = 'block'
    }
  }).catch(error => {
    cont.innerHTML = 'Oops. Something went wrong.<br>Please try again.'
    popup.style.display = 'block'
    console.log(error)
  })
}

// ------------------------------------
// Buttons
// ------------------------------------
window.addEventListener('click', (e) => {
  const btn = e.target.dataset.button
  const name = getElemt('#name')
  const phone = getElemt('#phone')
  const postDate = JSON.parse(JSON.stringify(bookingDates))
  if (!btn) return
  if (btn === 'send') {
    verify()
    if (check === 0) {
      const url = `./reserve.html?&${roomId}&${bookingDates}`
      location.assign(url)
    }
  } else if (btn === 'post') {
    verify()
    if (check === 0) {
      postDate.splice(-1, 1) // 退房當天可預訂，送出日期扣掉最後一天
      postData(roomId, name.value, phone.value, postDate)
    }
  }
  if (btn === 'close') closeAlert()
  if (btn === 'delete') deleteData()
})
