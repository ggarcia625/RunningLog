const date = new Date();

let firstOfMonthDate = new Date();
firstOfMonthDate.setDate(1);
let $logForm = $("#logForm");
let $buttonLogSubmit = $('#buttonLogSubmit');
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let firstDay = firstOfMonthDate.getDay();
let lastDay = new Date(date.getFullYear(), currentMonth + 1, 0).getDate();
let prevMonthDay = new Date(date.getFullYear(), currentMonth, 0).getDate();
let lastDayIndex = new Date(date.getFullYear(), currentMonth + 1, 0).getDay();
let nextMonthDays = 6 - lastDayIndex;
let monthRealNumber = currentMonth + 1;
// comment

function changeMonth() {
    firstOfMonthDate.setDate(1);
    $logForm = $("#logForm");
    $buttonLogSubmit = $('#buttonLogSubmit');
    currentMonth = date.getMonth();
    firstDay = firstOfMonthDate.getDay();
    lastDay = new Date(date.getFullYear(), currentMonth + 1, 0).getDate();
    prevMonthDay = new Date(date.getFullYear(), currentMonth, 0).getDate();
    lastDayIndex = new Date(date.getFullYear(), currentMonth + 1, 0).getDay();
    nextMonthDays = 6 - lastDayIndex;
}

function saveRunningLog(event) {
    event.preventDefault();
    let $title = $('#title');
    let $date = $('#date');
    let $timeHH= $('#timeHH');
    let $timeMM= $('#timeMM');
    let $timeSS= $('#timeSS');
    let $distance = $('#distance');
    let $pace = $('#pace');
    calcPace();
    let $feel= $('#feel');
    let $notes = $('#notes');
    let logObject = {
        title: $title.val(),
        date: $date.val(),
        timeHH: $timeHH.val(),
        timeMM: $timeMM.val(),
        timeSS: $timeSS.val(),
        distance: $distance.val(),
        pace: $pace.text(),
        feel: $('input[name="feel"]:checked').val(),
        notes: $notes.val()
    }
    localStorage.setItem($date.val(), JSON.stringify(logObject))
    let currentLog = localStorage.getItem(`${$date.val()}`);
    let currentLogParse = JSON.parse(currentLog);
    console.log(currentLogParse, 'log parse');
    let logDate = currentLogParse['date'];
    currentMonth = +logDate.slice(0, 2) - 1;
    console.log(currentYear);
    console.log(currentMonth, 'currentMonth')
    $logContainer.hide();
    calendarGenerator();
    weeklyStats();
    $('.dayContainer div').on('click', showRunningLog);
    $calendar.show();
    $('.weeklySummary').show();
}

$logForm.on("submit", saveRunningLog);

let $logContainer = $('#logcontainer');
$logContainer.hide();

const todayString = date.toDateString();
let todaysDate = "";
let currentMonthString = '';

function calendarGenerator() {
    for(let i = 0; todayString.length > i; i++){
        if (typeof +todayString[i] === 'number' && +todayString[i] % 1 === 0 && +todayString[i + 5] % 1 === 0) {
            todaysDate += todayString[i];
        }
        if (i >= 4 && i <= 6) {
            currentMonthString  += todayString[i];
        }
    }
    todaysDate.replace(' ', '');
    let realMonth = '' + (currentMonth + 1);
    let nextMonth = '' + (currentMonth + 2);
    let prevMonthString = "" + currentMonth;
    let days = '';
    let daysCounter = 0;
    for (let day = firstDay; day > 0; day--) {
        let dateData= `${prevMonthString.padStart(2, "0")}/${prevMonthDay - day + 1}/${currentYear}`;
        daysCounter += 1;
        days += `<div id='${daysCounter}'class="day prevMonthDay" data-date='${dateData}'><p class ='dayNumber'>${prevMonthDay - day + 1}</p></div>`;
    }

    for (let day = 1; day <= lastDay; day++) {
        let dateData=`${(realMonth).padStart(2, "0")}/${(day).toString().padStart(2, "0")}/${currentYear}`;
        daysCounter += 1;
        if (day === +todaysDate) {
            days += `<div id="${daysCounter}" class="day today" data-date='${dateData}'><p class ='dayNumber'>${day}</p></div>`
        } else{
            days += `<div id=${daysCounter} class="day" data-date='${dateData}'><p class ='dayNumber'>${day}</p></div>`;
        }
    }

    for (let day = 1; day <= nextMonthDays; day++) {
        let dateData = `${(nextMonth).padStart(2, "0")}/${day.toString().padStart(2, "0")}/${currentYear}`
        daysCounter += 1;
        days += `<div id='${daysCounter}' class="day nextMonthDay" data-date='${dateData}'><p class ='dayNumber'>${day}</p></div>`;
    }

    document.querySelector('.dayContainer').innerHTML = days;

    let numberOfWeeks = daysCounter / 7;
    for (let week = 1; week <= numberOfWeeks; week++){
        $('.weeklySummary').append(`
        <div class='week' id="week${week}">    
            <div class="weeklyStat" id='averagePace'>Average Pace: </div> 
            <div class="weeklyStat" id='weeklyDistance'>Weekly Mileage: </div>
        </div>    
        `);
    }
}
calendarGenerator();

let $calendar = $('#calendar');
function showRunningLog(evt){
    $calendar.hide();
    $('.weeklySummary').hide();
    $logContainer.show();
    let dateData = $(evt.target).closest('.day').data('date'); 
    $('#date').val(dateData);
}

function changeMonthAndYear(evt){
    days = '';
    daysCounter = 0;
    $('.weeklySummary').html('');

    $('.dayContainer').empty();
    if($(evt.target).hasClass('fa fa-angle-right') && currentMonth < 11) {
        currentMonth += 1;
        monthRealNumber += 1;
        $('.date h2').html(months[currentMonth]);
        date.setMonth(currentMonth);
    } else if ($(evt.target).hasClass('fa fa-angle-left') && currentMonth > 0){
        currentMonth -= 1;
        monthRealNumber -= 1;
        $('.date h2').html(months[currentMonth]);
        date.setMonth(currentMonth);
    }else if (currentMonth === 11){
        currentMonth = 0;
        monthRealNumber = 1;
        currentYear += 1;
        $('.date h2').html(months[currentMonth]);
        $('.date h1').html(currentYear);
        date.setMonth(currentMonth);
    }else if (currentMonth === 0){
        currentMonth = 11;
        monthRealNumber = 12;
        currentYear -= 1;
        $('.date h1').html(currentYear);
        $('.monthheader').html(months[currentMonth]);
        date.setMonth(currentMonth);
    }
    firstOfMonthDate = new Date(currentYear, currentMonth, 1);
    changeMonth();
    $('.weeklySummary').append('<div class="weeklyHeader">Weekly Summary</div>');
    calendarGenerator();
    $('.dayContainer div').on('click', showRunningLog);
    weeklyStats();    
}

let $changeMonthArrows = $('i');
$changeMonthArrows.on('click', changeMonthAndYear);

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

$('.date h1').html(currentYear);
$('.date h2').html(months[currentMonth]);
document.querySelector('.date p').innerHTML = date.toDateString();

let $day = $('.dayContainer div');
$day.on('click', showRunningLog);

let $timeHH = $('#timeHH');
let $timeMM = $('#timeMM');
let $timeSS = $('#timeSS');
let $distance = $("#distance");
let $unitOfDistance = $("#unitofdistance");
let $calcPaceButton = $("#calcPace");

function calcPace (){
    if ($timeHH.val() !== '' && $timeMM.val() !== '' && $timeSS.val() !== '' && $distance.val() !== '') {
        let hrsToMins = $timeHH.val() * 60;
        let minutes = $timeMM.val();
        let secToDec = $timeSS.val() / 60;
        let totMinutesAndSecs = +hrsToMins + +minutes + +secToDec;
        let paceDec = totMinutesAndSecs / $distance.val();
        let paceMinutes = Math.floor(paceDec);
        let paceSeconds = Math.round((paceDec - paceMinutes) * 60);
        if (paceSeconds < 10) {
            paceSeconds ="0" + paceSeconds;
        }
        if ($unitOfDistance.val() === "miles") {
            paceSeconds += "/mi";
        } else {
            paceSeconds += "/km";
        }
        let pace = paceMinutes + ":" + paceSeconds;
        $("#pace").html(pace);
    }
}

$timeHH.on("change", calcPace);
$timeMM.on("change", calcPace);
$timeSS.on("change", calcPace);
$distance.on("change", calcPace);

let distanceTotal = 0;
let totalSeconds = 0;
let averagePace = 0;
let numberOfLogs = 0;
let monthIndexString = '';

if (currentMonth < 10 ) {
    monthIndexString = '0' + monthRealNumber;
}

function weeklyStats() {
    let $htmlDays = $('.day p');
    for (let i = 0; i < $htmlDays.length; i++) {
        let dateNumber = +$($htmlDays[i]).text();
        
        if (dateNumber < 10) {
            dateNumber = '0' + dateNumber;
        }    
        if(+dateNumber > 27 && i < 7){
            monthIndexString = '0' + (monthRealNumber - 1);
        } else if (+dateNumber < 7 && i > 21) {
            monthIndexString = '0' + (monthRealNumber + 1);
        } else {
            monthIndexString = '0' + monthRealNumber;
        }
        let currentLog = localStorage.getItem(`${monthIndexString}/${dateNumber}/${currentYear}`);
        let currentLogParse = JSON.parse(currentLog);
        console.log(currentLogParse);
        if (currentLogParse === null) {
        }else {
            let distance = currentLogParse['distance'];
            let pace = currentLogParse['pace'];
            let feelClass = currentLogParse['feel'];
            let feelColorMap = new Map()
            feelColorMap['bad'] = 'red';
            feelColorMap['notgood'] = 'orange';
            feelColorMap['okay'] = 'yellow';
            feelColorMap['good'] = '#03f0fc';
            feelColorMap['great'] = '#03fc2c';
            $($htmlDays[i]).parent().css({backgroundColor: feelColorMap[feelClass]});
            $($htmlDays[i]).parent().append(`
                <p class='pace'>${pace}</p>
                <p class='distance'>${distance} mi</p>
                
            `);
            
            let paceMinutes = 0;
            let paceSeconds = 0;
            let paceJustTime = pace.slice(0, 4);
            if(paceJustTime.length > 4) {
                paceMinutes += +pace.slice(0, 2);
                paceSeconds += +pace.slice(2, 4);
            }else {
                paceMinutes += +pace.slice(0, 1);
                paceSeconds += +pace.slice(2, 4);
                
            }
            distanceTotal += +distance;
            numberOfLogs += 1;
            totalSeconds += (+paceMinutes * 60) + +paceSeconds;
        }
        let paceSec = totalSeconds / numberOfLogs;
        let averagePaceSeconds = Math.round(paceSec % 60);
        let averageMinutes = Math.floor(paceSec / 60);
        let distanceTotalTo2Dec = (distanceTotal).toFixed(2);
        let paceMinAndSec = `${averageMinutes} : ${averagePaceSeconds}`;
        
        if (i === 6) {
            numberOfLogs = 0;
            totalSeconds = 0;
            $('#week1 #averagePace').html(`Average Pace: ${paceMinAndSec}`);
            $('#week1 #weeklyDistance').html(`Total Distance: ${distanceTotalTo2Dec}`);
            distanceTotal = 0;
        } else if (i === 13){
            numberOfLogs = 0;
            totalSeconds = 0;
            $('#week2 #averagePace').html(`Average Pace: ${paceMinAndSec}`);
            $('#week2 #weeklyDistance').html(`Total Distance: ${distanceTotalTo2Dec}`);
            distanceTotal = 0;
        }else if (i === 20){
            numberOfLogs = 0;
            totalSeconds = 0;
            $('#week3 #averagePace').html(`Average Pace: ${paceMinAndSec}`);
            $('#week3 #weeklyDistance').html(`Total Distance: ${distanceTotalTo2Dec}`);
            distanceTotal = 0;
        }else if (i === 27) {
            numberOfLogs = 0;
            totalSeconds = 0;
            $('#week4 #averagePace').html(`Average Pace: ${paceMinAndSec}`);
            $('#week4 #weeklyDistance').html(`Total Distance: ${distanceTotalTo2Dec}`);
            distanceTotal = 0;
        } else if (i === 34) {
            numberOfLogs = 0;
            totalSeconds = 0;
            $('#week5 #averagePace').html(`Average Pace: ${paceMinAndSec}`);
            $('#week5 #weeklyDistance').html(`Total Distance: ${distanceTotalTo2Dec}`);
            distanceTotal = 0;
        }
    }
}
weeklyStats();