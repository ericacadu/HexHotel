"use strict";

getElemt('.copyright .year').innerHTML = yy; 

function navBar() {
  var dropdown = getAllElemt('.dropdown');
  var nav = getElemt('nav');

  if (body.clientWidth > 767) {
    if (body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      nav.style.top = 0;
    } else {
      nav.style.top = '-72px';
      setTimeout(function () {
        document.activeElement.blur();
        removeElemt(dropdown);
      }, 300);
    }
  }

  window.addEventListener('scroll', navBar);
}

function room(data) {
  var str = '';
  str = "\n    <div class=\"room-item\">\n      <div class=\"room-img\">\n        <a class=\"room-link\" href=\"./room.html?".concat(data.id, "\"></a>\n        <img src=\"").concat(data.imageUrl, "\" alt=\"\">\n      </div>\n      <div class=\"room-title\">").concat(data.name, "</div>\n      <div class=\"room-price\">").concat(currency(data.normalDayPrice), " NTD / night</div>\n    </div>");
  return str;
}

function render(data) {
  var recommend = getElemt('.recommend .room-cloumns');
  var rooms = getAllElemt('.rooms .room-cloumns');
  var cont = {
    single: {
      title: "\n        <div class=\"title-group\">\n          <h3>One person</h3>\n          <p>Enjoy the one and only service</p>\n        </div>",
      type: ''
    },
    "double": {
      title: "\n      <div class=\"title-group\">\n        <h3>Two people</h3>\n        <p>The perfect choice for both of you</p>\n      </div>",
      type: ''
    },
    twin: {
      title: "\n      <div class=\"title-group\">\n        <h3>Family</h3>\n        <p>Wanna a big room? there you are</p>\n      </div>",
      type: ''
    }
  };
  data.forEach(function (item) {
    if (item.name.includes('Single')) {
      cont.single.type += room(item);
    } else if (item.name.includes('Double')) {
      cont["double"].type += room(item);
    } else {
      cont.twin.type += room(item);
    }
  });
  rooms[0].innerHTML = cont.single.title + cont.single.type;
  rooms[1].innerHTML = cont["double"].title + cont["double"].type;
  rooms[2].innerHTML = cont.twin.title + cont.twin.type;
  recommend.innerHTML = room(data[4]) + room(data[2]) + room(data[1]);
  navBar();
}

function toggleRoom(data) {
  var ints = getAllElemt('.form-room input');
  var rooms = getAllElemt('.form-room');
  rooms.forEach(function (item) {
    addData(item, 'room', 'label, input, i');
  });

  if (ints.length === 1) {
    roomId = location.search.split('?')[1].split('&')[1];
    data.filter(function (item) {
      if (roomId === item.id) {
        roomName = item.name;
      }

      return roomName;
    });
  }

  function activeEvent(e) {
    var roompicker = document.querySelectorAll('.roompicker');
    var room = e.target.dataset.room;
    var parent = e.target.parentNode;
    alert(e.target.textContent);

    if (!room) {
      removeElemt(roompicker);
      return;
    }

    if (roompicker.length > 0) {
      removeElemt(roompicker);
    } else {
      showRoomList(data, parent);
    } 


    data.filter(function (item) {
      if (room === item.name) {
        roomName = item.name;
        roomId = item.id;
      }

      ints.forEach(function (item) {
        item.value = roomName;
      });
      return {
        roomName: roomName,
        roomId: roomId
      };
    }); 
  }

  window.addEventListener('mouseup touchend', activeEvent);
  window.addEventListener('click', activeEvent);
}

function showRoomList(data, target) {
  var menu = createElemt('DIV');
  var str = '';
  menu.classList = 'roompicker dropdown';
  data.map(function (item) {
    str += "<li data-room=\"".concat(item.name, "\">").concat(item.name, "</li>");
    return str;
  });
  menu.innerHTML += "<ul>".concat(str, "<ul>");
  target.appendChild(menu);
} 


function getRoomsInfo(data) {
  var newRoom = data.room[0];
  var title = getElemt('.img-group h1');
  var normal = getElemt('.normal-price ');
  var holiday = getElemt('.holiday-price ');
  var desc = getElemt('.description .info-cont');
  var roomValue = getElemt('nav .form-room input');
  roomValue.value = newRoom.name;
  title.innerHTML = newRoom.name;
  normal.innerHTML = "<span>".concat(currency(newRoom.normalDayPrice), " NTD</span> / night");
  holiday.innerHTML = "holiday price - ".concat(currency(newRoom.holidayPrice), " NTD / night ");
  desc.innerHTML = "".concat(newRoom.description, "\n    <div class=\"room-info mt-3\">\n    ").concat(newRoom.descriptionShort.GuestMin, " - ").concat(newRoom.descriptionShort.GuestMax, " Guest\u30FB\n    ").concat(newRoom.descriptionShort.Bed.length, " Bed (").concat(newRoom.descriptionShort.Bed, ")\u30FB\n    ").concat(newRoom.descriptionShort['Private-Bath'], " Private Bath\u30FB\n    ").concat(newRoom.descriptionShort.Footage, " m\xB2<br>\n    Check In\uFF1A").concat(newRoom.checkInAndOut.checkInEarly, " - ").concat(newRoom.checkInAndOut.checkInLate, "<br>\n    Check Out\uFF1A").concat(newRoom.checkInAndOut.checkOut, "</div>");
  photos(newRoom);
  amenities(newRoom);
  roomId = newRoom.id;
  roomName = newRoom.name;
}

function amenities(data) {
  var keys = ['Wi-Fi', 'Television', 'Great-View', 'Breakfast', 'Air-Conditioner', 'Smoke-Free', 'Mini-Bar', 'Refrigerator', 'Child-Friendly', 'Room-Service', 'Sofa', 'Pet-Friendly'];
  var list = document.querySelectorAll('.amenities-list li');
  var items = data.amenities;

  for (var i = 0; i < keys.length; i++) {
    if (items[keys[i]]) {
      list[i].classList.add('show');
    } else {
      list[i].classList.remove('show');
    }
  }
}

function photos(data) {
  var cover = getElemt('.img-large');
  var imgs = getAllElemt('.list-group li');
  cover.innerHTML = "<img src=\"".concat(data.imageUrl[0], "\"/>");
  imgs.forEach(function (item, index) {
    var pic = "<img src=\"".concat(data.imageUrl[index], "\"/>");
    item.innerHTML = pic;
    item.addEventListener('mouseover', function () {
      cover.innerHTML = pic;
    });
  });
}

function formFixed() {
  var container = getElemt('.container');
  var formBox = getElemt('.form-group.fixed');
  if (!formBox) return;

  if (body.clientWidth > 992) {
    formBox.style.marginRight = -(container.offsetWidth / 2) + 'px';
  } else {
    formBox.style.marginRight = '';
  }
}

window.addEventListener('resize', formFixed);
window.addEventListener('load', formFixed); 

function getBookingData(data) {
  var id = location.search.split('?')[1];
  var dates = id.split('&')[2];
  var room = data.room[0];
  var booking = data.booking;
  var ints = getAllElemt('.form-reserve input');

  if (dates) {
    var photo = getElemt('.form-img');
    var name = getElemt('.form-name');
    var newDate = dates.split(',');
    var dateValue = getElemt('.form-date input');
    photo.innerHTML = "<img src=\"".concat(room.imageUrl[0], "\"/>");
    name.innerHTML = room.name;
    bookingDates = newDate;
    dateArray[0] = newDate[0];
    dateArray[1] = newDate[newDate.length - 1];
    dateValue.value = "".concat(dateArray[0], " ~ ").concat(dateArray[1]);
    showPrice(room);
  }

  window.addEventListener('click', function (e) {
    var cal = e.target.dataset.cal;
    var total = getElemt('.form-total');
    var popup = getElemt('.msg-alert');
    if (!cal) return;

    if (dateArray.length < 2) {
      total.style.display = 'none';
      popup.style.display = 'none';
      return;
    }

    showPrice(room);
  });
  booking.map(function (item) {
    return reserveDates.push(item.date);
  });
  getSoldoutDates();
  if (soldoutDates.length > 0) showPrice(room);

  if (ints.length > 0) {
    ints.forEach(function (item) {
      item.addEventListener('focus', function () {
        item.parentNode.classList.add('on');
      });
      item.addEventListener('blur', function () {
        item.parentNode.classList.remove('on');
        verify();
      });
    });
  }
}

function calcPrice(array) {
  var totalDays = JSON.parse(JSON.stringify(array));
  var weekend = [];
  totalDays.splice(-1, 1);
  totalDays.filter(function (item) {
    var time = new Date(dateTime(item));
    var day = time.getDay();
    if (day === 0 || day === 5 || day === 6) weekend.push(item);
    return weekend;
  });
  return {
    totalDays: totalDays,
    weekend: weekend
  };
}

function showPrice(data) {
  var total = getElemt('.form-total');
  var popup = getElemt('.msg-alert');
  var days = calcPrice(bookingDates);
  var price = {
    normal: data.normalDayPrice * (days.totalDays.length - days.weekend.length),
    holiday: data.holidayPrice * days.weekend.length,
    service: 200 * days.totalDays.length
  };
  var totalPrice = price.normal + price.holiday + price.service;
  var normalCont = '';
  var holidayCont = '';

  if (price.normal) {
    normalCont = "<li>\n      <div class=\"item-detail\">".concat(currency(data.normalDayPrice), " x ").concat(days.totalDays.length - days.weekend.length, " night</div>\n      <div class=\"item-price\">").concat(currency(price.normal), "</div>\n    </li>");
  }

  if (price.holiday) {
    holidayCont = "<li>\n      <div class=\"item-detail\">".concat(currency(data.holidayPrice), " x ").concat(days.weekend.length, " night</div>\n      <div class=\"item-price\">").concat(currency(price.holiday), "</div>\n    </li>");
  }

  var serviceCont = "<li>\n    <div class=\"item-detail\">Service Fee</div>\n    <div class=\"item-price\">".concat(currency(price.service), "</div>\n  </li>");
  var totalCont = "\n    <li class=\"total-price\">\n      <label>TOTAL</label>\n      <div class=\"price\">".concat(currency(totalPrice), "</div>\n    </li>");

  if (soldoutDates.length > 0) {
    popup.innerHTML = 'The date you selected is sold out.';
    popup.style.display = 'block';
    total.style.display = 'none';
  } else {
    total.innerHTML = normalCont + holidayCont + serviceCont + totalCont;
    total.style.display = 'block';
    popup.style.display = 'none';
  }
} 


function getPostData(data) {
  var bookings = data.booking;
  var infos = getAllElemt('.success-detail .info');
  var dates = location.search.split('&')[3].split(',');
  var days = dates.length - 1;
  var bookingData = [];
  bookings.filter(function (item) {
    if (item.date === dates[0]) {
      bookingData = [item.name, item.tel, "".concat(roomName, " / ").concat(days, " Nights"), dates[0], dates[days]];
    }

    return bookingData;
  });
  infos.forEach(function (item, index) {
    item.innerHTML = bookingData[index];
  });
} 


function verify() {
  var ints = getAllElemt('.form-reserve input');
  var phone = getElemt('#phone');

  var isTrim = function isTrim(item) {
    return item.value.trim();
  };

  var isMsg = function isMsg(item) {
    return item.parentNode.querySelector('.msg');
  };

  if (!popup) {
    return;
  }

  if (soldoutDates.length > 0) {
    cont.innerHTML = 'Please select correct dates.';
    popup.style.display = 'block';
    check = 1;
  } else if (dateArray.length < 2) {
    cont.innerHTML = 'Please select 2 dates at least.';
    popup.style.display = 'block';
    check = 1;
  } else if (!roomName) {
    cont.innerHTML = 'Please select room style.';
    popup.style.display = 'block';
    check = 1;
  } else if (ints.length > 0) {
    ints.forEach(function (item) {
      if (!isTrim(item) || item === phone && !isTEL(phone)) {
        item.classList.add('is-invalid');
        isMsg(item).style.display = 'block';
        check = 1;
      } else {
        item.classList.remove('is-invalid');
        isMsg(item).style.display = 'none';
        check = 0;
      }
    });
  } else {
    check = 0;
  }
}

function isTEL(item) {
  var reg = /^[09]{2}[0-9]{8}$/;

  if (!reg.exec(item.value)) {
    return false;
  } else {
    return true;
  }
} 


function postData(id, Name, Tel, Dates) {
  window.axios({
    method: 'POST',
    url: "".concat(api, "room/").concat(id),
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: "Bearer ".concat(token)
    },
    data: {
      name: Name,
      tel: Tel,
      date: Dates
    }
  }).then(function (res) {
    var status = res.data;

    if (status.success) {
      var url = "./success.html?&".concat(roomId, "&").concat(roomName, "&").concat(bookingDates);
      location.assign(url);
    }
  })["catch"](function (err) {
    console.log(err);
  });
} 


function deleteData() {
  window.axios["delete"]("".concat(api, "rooms"), {
    headers: {
      Authorization: "Bearer ".concat(token)
    }
  }).then(function (res) {
    var status = res.status;

    if (status === 200) {
      cont.innerHTML = 'All reservations has been deleted.';
      popup.style.display = 'block';
    }
  })["catch"](function (error) {
    cont.innerHTML = 'Oops. Something went wrong.<br>Please try again.';
    popup.style.display = 'block';
    console.log(error);
  });
} 


window.addEventListener('click', function (e) {
  var btn = e.target.dataset.button;
  var name = getElemt('#name');
  var phone = getElemt('#phone');
  var postDate = JSON.parse(JSON.stringify(bookingDates));
  if (!btn) return;

  if (btn === 'send') {
    verify();

    if (check === 0) {
      var url = "./reserve.html?&".concat(roomId, "&").concat(bookingDates);
      location.assign(url);
    }
  } else if (btn === 'post') {
    verify();

    if (check === 0) {
      postDate.splice(-1, 1); 

      postData(roomId, name.value, phone.value, postDate);
    }
  }

  if (btn === 'close') {
    closeAlert();
  }

  if (btn === 'delete') {
    deleteData();
  }
});