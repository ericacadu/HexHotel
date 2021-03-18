"use strict";

var api = 'https://challenge.thef2e.com/api/thef2e2019/stage6/';
var token = 'mjs4qNPvY17z6Ewyure88QDmZnCaXMZ6ZaOnDMGhP4ZfUpLSzjEJePhDiULQ';
var pathname = location.pathname;
var id;

var getRooms = function getRooms() {
  return window.axios.get("".concat(api, "rooms"), {
    headers: {
      Authorization: "Bearer ".concat(token)
    }
  })["catch"](function (err) {
    console.log(err);
  });
};

var getBookings = function getBookings() {
  return window.axios.get("".concat(api, "room/").concat(id), {
    headers: {
      Authorization: "Bearer ".concat(token)
    }
  })["catch"](function (err) {
    console.log(err);
  });
};

if (pathname === '/room.html') {
  id = location.search.split('?')[1];
  window.axios.all([getRooms(), getBookings()]).then(window.axios.spread(function (roomData, bookingData) {
    var rooms = roomData.data.items;
    var bookings = bookingData.data;
    active(rooms);
    getRoomsInfo(bookings);
    getBookingData(bookings);
  }));
} else if (pathname === '/reserve.html') {
  id = location.search.split('?')[1].split('&')[1];
  window.axios.all([getRooms(), getBookings()]).then(window.axios.spread(function (roomData, bookingData) {
    var rooms = roomData.data.items;
    var bookings = bookingData.data;
    active(rooms);
    getBookingData(bookings);
  }));
} else if (pathname === '/success.html') {
  id = location.search.split('?')[1].split('&')[1];
  window.axios.all([getRooms(), getBookings()]).then(window.axios.spread(function (roomData, bookingData) {
    var rooms = roomData.data.items;
    var bookings = bookingData.data;
    active(rooms);
    getPostData(bookings);
  }));
} else {
  getRooms().then(function (res) {
    var rooms = res.data.items;
    active(rooms);
    render(rooms);
  });
} 


var getElemt = function getElemt(elemt) {
  return document.querySelector(elemt);
};

var getAllElemt = function getAllElemt(elemt) {
  return document.querySelectorAll(elemt);
};

var createElemt = function createElemt(elemt) {
  return document.createElement(elemt);
};

var currency = function currency(x) {
  return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

var body = document.body;
var wrapper = getElemt('.wrapper');
var load = getElemt('.loading');
var alert = getElemt('.alert');
var cont = alert.querySelector('.alert-content');
var roomName;
var roomId;
var check = 0;

function addData(arry, name, item) {
  var newArry = arry.querySelectorAll(item);
  newArry.forEach(function (elemt) {
    elemt.setAttribute("data-".concat(name), true);
  });
  return newArry;
}

function removeElemt(arry) {
  for (var i = 0; i < arry.length; i++) {
    arry[i].remove();
  }
}

function loading() {
  body.removeChild(load);
  body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  wrapper.classList.add('load');
}

function closeAlert() {
  alert.classList.add('close');
  setTimeout(function () {
    alert.style.display = 'none';
    alert.classList.remove('close');
    cont.innerHTML = '';
  }, 600);
}

function active(data) {
  loading();
  toggleCalendar();
  toggleRoom(data);
}