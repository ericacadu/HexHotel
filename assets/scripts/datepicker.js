"use strict";

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var today = new Date();
var yy = today.getFullYear();
var mm = today.getMonth();
var dt = today.getDate();
var cy = today.getFullYear(); 

var cm = today.getMonth(); 

var dateArray = [];
var bookingDates = [];
var reserveDates = [];
var soldoutDates = []; 

function toggleCalendar(data) {
  getAllElemt('.form-date').forEach(function (item) {
    addData(item, 'date', 'div, label, input, i');
  });
  window.addEventListener('click', function (e) {
    var datepicker = getAllElemt('.datepicker');
    var date = e.target.dataset.date;
    var cal = e.target.dataset.cal;
    var parent = e.target.parentNode;
    if (cal) return;

    if (!date) {
      removeElemt(datepicker);
      return;
    }

    if (datepicker.length > 0) {
      removeElemt(datepicker);
    } else {
      showCalendar(parent);
    }
  });
} 


function showCalendar(target) {
  var datepicker = createElemt('DIV');
  datepicker.classList = 'datepicker dropdown';
  datepicker.setAttribute('data-cal', true);

  if (dateArray.length > 0) {
    var start = dateTime(dateArray[0]);
    var newDate = new Date(start);
    cy = newDate.getFullYear();
    cm = newDate.getMonth();
  }

  datepicker.innerHTML = "\n  <div class=\"date-header\">\n    <i class=\"material-icons\" id=\"prev\">chevron_left</i>\n    <div class=\"title\">".concat(months[cm], " ").concat(cy, "</div>\n    <i class=\"material-icons\" id=\"next\">chevron_right</i>\n  </div>\n  <div class=\"data-body\">\n    <table>\n      <thead>\n        <tr>\n          <th>sun</th>\n          <th>mon</th>\n          <th>tue</th>\n          <th>wed</th>\n          <th>thu</th>\n          <th>fri</th>\n          <th>sat</th>\n        </tr>\n      </thead>\n      <tbody>\n      </tbody>\n    </table>\n  </div>");
  addData(datepicker, 'cal', 'div, i, table, thead, tr, tbody');
  target.appendChild(datepicker);
  calendar(cy, cm);
  datepicker.addEventListener('click', selectDate);
  getElemt('#prev').addEventListener('click', prev);
  getElemt('#next').addEventListener('click', next);
} 


function calendar(y, m) {
  var firstDay = new Date(y, m).getDay();
  var table = getElemt('.datepicker tbody');
  var date = 1;
  table.innerHTML = ''; 

  var max = new Date(toTimestamp(today) + 86400000 * 90);
  var maxYear = max.getFullYear();
  var maxMonth = max.getMonth();
  var maxDate = max.getDate();

  for (var r = 0; r < 6; r++) {
    var row = createElemt('TR');
    var cell = void 0,
        cellText = void 0;

    for (var i = 0; i < 7; i++) {
      if (r === 0 && i < firstDay) {
        cell = createElemt('TD');
        row.appendChild(cell);
        cell.setAttribute('class', 'off');
      } else if (date > daysInMonth(y, m)) {
        break;
      } else {
        cell = document.createElement('TD');
        cellText = document.createTextNode(date);
        cell.appendChild(cellText);
        row.appendChild(cell);
        date++; 

        if (cy < yy || cm < mm || cy === yy && cm === mm && date <= dt) {
          cell.setAttribute('class', 'off');
        } 


        if (cy === yy && cm === mm && date === dt + 1) {
          cell.setAttribute('class', 'now');
        } 


        if (cy > maxYear || cm > maxMonth || cy >= maxYear && cm >= maxMonth && date > maxDate + 1) {
          cell.setAttribute('class', 'off');
        }
      }
    }

    addData(table, 'cal', 'tr, td');
    table.appendChild(row);
  }

  dateStyle(bookingDates, 'on');
  dateStyle(dateArray, 'act');
  dateStyle(reserveDates, 'rsv');
  getSoldoutDates();
} 


function daysInMonth(y, m) {
  var days = new Date(y, m, 32).getDate();
  return 32 - days;
} 


function next() {
  cy = cm === 11 ? cy + 1 : cy;
  cm = (cm + 1) % 12 === 0 ? 0 : (cm + 1) % 12;
  calendar(cy, cm);
  getElemt('.date-header .title').innerHTML = "".concat(months[cm], " ").concat(cy);
} 


function prev() {
  cy = cm === 0 ? cy - 1 : cy;
  cm = cm === 0 ? 11 : cm - 1;
  calendar(cy, cm);
  getElemt('.date-header .title').innerHTML = "".concat(months[cm], " ").concat(cy);
} 


function selectDate(e) {
  var tds = getAllElemt('.datepicker td');
  var target = e.target;
  var cd = target.textContent;
  var isOff = target.className.includes('off');
  var isRsv = target.className.includes('rsv');
  var ints = document.querySelectorAll('.form-date input');
  var newDate;
  if (target.nodeName !== 'TD') return;
  if (isOff || isRsv) return;

  if (dateArray.length >= 2) {
    bookingDates = [];
    dateArray = [];
    soldoutDates = [];
    tds.forEach(function (item) {
      item.classList.remove('on');
      item.classList.remove('act');
      item.classList.remove('sold');
    });
    newDate = dateTime("".concat(cy, "-").concat(cm + 1, "-").concat(cd));
    dateArray.push(dateForm(newDate));
    target.classList.add('act');
    dateStyle(reserveDates, 'rsv');
  } else {
    newDate = dateTime("".concat(cy, "-").concat(cm + 1, "-").concat(cd));

    if (dateForm(newDate) === dateArray[0]) {
      dateArray.slice(0, 1);
    } else {
      dateArray.push(dateForm(newDate));
      target.classList.add('act');
    }
  }

  dateArray.sort();

  for (var i = 0; i < ints.length; i++) {
    if (!dateArray[1]) {
      ints[i].value = dateArray[0];
    } else {
      ints[i].value = dateArray[0] + ' ~ ' + dateArray[1];
    }
  }

  if (dateArray.length < 2) return;
  getAllDates(dateArray);
  dateStyle(bookingDates, 'on');
  dateStyle(dateArray, 'act');
  getSoldoutDates();
} 


function getSoldoutDates() {
  soldoutDates = bookingDates.filter(function (item) {
    return reserveDates.indexOf(item) !== -1;
  });
  dateStyle(soldoutDates, 'sold');
} 


function dateStyle(array, className) {
  var tds = getAllElemt('.datepicker td');
  array.forEach(function (item) {
    var date = new Date(dateTime(item));
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = parseInt(date.getDate() < 10 ? "0".concat(date.getDate()) : date.getDate());

    for (var i = 0; i < tds.length; i++) {
      var cd = parseInt(tds[i].textContent);

      if (y === cy && m === cm + 1 && d === cd) {
        tds[i].setAttribute('class', '');
        tds[i].classList.add(className);
      }
    }
  });
} 


function toTimestamp(date) {
  return Date.parse(date);
} 


function dateTime(date) {
  var dateStr = date.split('-');
  var newDate = new Date();
  newDate.setUTCFullYear(dateStr[0], dateStr[1] - 1, dateStr[2]);
  var newTime = newDate.getTime();
  return newTime;
} 


function dateForm(value) {
  var date = new Date(value);
  var y = date.getFullYear();
  var m = date.getMonth() + 1 < 10 ? "0".concat(date.getMonth() + 1) : date.getMonth() + 1;
  var d = date.getDate() < 10 ? "0".concat(date.getDate()) : date.getDate();
  return "".concat(y, "-").concat(m, "-").concat(d);
} 


function getAllDates(array) {
  var start = dateTime(array[0]);
  var end = dateTime(array[1]);

  for (var i = start; i <= end;) {
    bookingDates.push(dateForm(parseInt(i)));
    i = i + 86400000;
  }

  return bookingDates;
}