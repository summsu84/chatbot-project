/**
 * Created by JJW on 2017-03-08.
 */
var extend = require('util')._extend;

/**
 * 텍스트를 교체한다.
 * @param obj
 * @param fstr
 * @param tstr
 * @returns {XML|string|void|*}
 */
function replaceText(obj, fstr, tstr)
{
    return obj.replace(fstr, tstr);
}


//전체 패턴을 변경한다.
function replaceTextAll(org, fstr, tstr)
{
    return org.split(fstr).join(tstr);
}



/**
 * 비행 스케줄 및 출도착 조회시 날짜 정보형식을 YYMMDD 형식으로 변환한다.
 * @param d
 * @returns {string}
 */
function toYYYYMMDD(d) {
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 101).toString().slice(-2);
    var dd = (d.getDate() + 100).toString().slice(-2);
    return yyyy + '-' + mm + '-' + dd;
}


/**
 * 공백 제거
 * @param data
 * @returns {XML|string|void|*}
 */
function removeSpace(data) {
    var retVal = data.replace(/(\s*)/g, "");
    return retVal;
}



/**
 * 비행 스케줄 및 출도착 시 불러온 스케줄 날짜 정보를 파싱한다.
 * @param date
 * @returns {{year: (string|string), day: (any|Buffer|string|Array.<T>|string), time: (any|Buffer|string|Array.<T>|string)}}
 */
function parseScheduleDate(date)
{
    var DateTime = {
        year : date.substring(0, 4) || "",
        day :  concatString(date.substring(4,6), date.substring(6,8), '-') || "",
        time : concatString(date.substring(8, 10), date.substring(10, 12), ':') || ""
    }
    DateTime.yearday = DateTime.year + '-' + DateTime.day;
    DateTime.yeardaytime = DateTime.yearday + ' ' + DateTime.time;


    return DateTime;
}

/**
 * 스트링 사이에 val 값을 추가한다.
 * @param a
 * @param b
 * @param val
 * @returns {any|Buffer|string|Array.<T>}
 */
function concatString(a, b, val)
{
    var retVal = a.concat(val, b);
    return retVal;
}

/**
 * 스트링을 추가한다.
 * @param src
 * @param val
 * @param position
 * @returns {string}
 */
function insertString(src, val, position)
{
    var output = [src.slice(0, position), val, src.slice(position)].join('');
    return output;
}


/**
 *  오늘 날짜 이전일 경우, fale, 오늘 날짜 이후인 경우 true를 날린다.
 * @param date
 * @returns {boolean}
 */
function checkDateWithToday(date)
{
    var today = new Date();
    //입력받은 날짜.
/*    var tmpDate = date.substring(0, 8);*/
    var tmp = insertString(date, '-', 4);
    var newDateTmp = insertString(tmp, '-', 7);
    var checkDate = new Date(newDateTmp);
    if(today < checkDate)
    {
        return true;
    }else
    {
        return false;
    }
}

/**
 * 오늘을 기준으로 이전 날자를 체크한다. 과거인 경우, false를 리턴한다.
 * @param date
 * @returns {boolean}
 */
function checkDatePastDate(date)
{
    var today = new Date();
    //입력받은 날짜.
    /*    var tmpDate = date.substring(0, 8);*/
    var tmp = insertString(date, '-', 4);
    var newDateTmp = insertString(tmp, '-', 7);
    var checkDate = new Date(newDateTmp);

    var todayMonth = getMonthFromDate(today);
    var todayDay = getDayFromDate(today);

    var dateMonth = getMonthFromDate(checkDate);
    var dateDay = getDayFromDate(checkDate);

    //입력한 달이 오늘 달보다 적은 경우
    if(dateMonth < todayMonth)
    {
        return false;
    }else if(dateMonth == todayMonth)
    {
        if(dateDay < todayDay)
        {
            return false;
        }else {
            return true;
        }
    }
    else {
        return true;
    }

   /* if(today < checkDate)
    {
        return true;
    }else
    {
        return false;
    }*/
}


/**
 *  Month까지 체크 한다.
 * @param date
 * @returns {boolean}
 */
function checkMonthWithToday(date)
{
    //오늘 날짜
    var today = new Date();
    var todayYear = Number(getYearFromDate(today));
    var todayMonth = Number(getMonthFromDate(today));
    var todayday = Number(getDayFromDate(today));

    //입력받은 날짜.
    var tmp = insertString(date, '-', 4);
    var newDateTmp = insertString(tmp, '-', 7);

    var newDate = new Date(newDateTmp);

    var dateYear = Number(getYearFromDate(newDate));
    var dateMonth = Number(getMonthFromDate(newDate));
    var dateDay = Number(getDayFromDate(newDate))
    var retVal = true;

    if(todayYear <= dateYear && todayMonth && dateMonth)
    {
        if(todayday <= dateDay) {
            retVal = true;
        }else {
            retVal = false;
        }
    }else {
        retVal = false;
    }

    return retVal;

}

/**
 *  시간을 비교 한다..
 * @param date
 * @returns {boolean}
 */
function checkTimeWithToday(date)
{
   // console.log(">>>checkTimeWithToday....inputDate : " + date);
    var today = new Date();

    var currentDateTimeCentralTimeZone = new Date(today.toLocaleString('ko-KR'));

    var todayHour = currentDateTimeCentralTimeZone.getHours();
    var todayMin = currentDateTimeCentralTimeZone.getMinutes();

    var dateHour = Number(date.substring(8, 10));
    var dateMin = Number(date.substring(10, 12));
 //   console.log("dateHour : " + dateHour + ", dateMin : " + dateMin + ", todayHour : " + todayHour + ", todayMin : " + todayMin);
    var retVal = true;

    if(todayHour <= dateHour)
    {
        if(todayHour == dateHour)
        {
            if(todayMin <= dateMin)
            {
                retVal = true;
            }else
            {
                retVal = false;
            }
        }else {
            retVal = true;
        }
    }else {
        retVal = false;
    }

    return retVal;


}

function getYearFromDate(d)
{
    return d.getFullYear().toString();
}
function getMonthFromDate(d)
{
    return (d.getMonth() + 101).toString().slice(-2);
}
function getDayFromDate(d)
{
    return (d.getDate() + 100).toString().slice(-2);
}

/**
 * 날짜 포맷에 맞는지 확인
 * @param d
 * @returns {boolean|SchemaType|Array|{index: number, input: string}|*|{manufacturer}}
 */
function isDateFormat(d) {
    //var df = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
    var df = /[0-9]{2}-[0-9]{2}/;
    return d.match(df);
}
/*
 * 윤년여부 검사
 */
function isLeaf(year) {
    var leaf = false;

    if(year % 4 == 0) {
        leaf = true;

        if(year % 100 == 0) {
            leaf = false;
        }

        if(year % 400 == 0) {
            leaf = true;
        }
    }

    return leaf;
}

function isValidDate(d) {
    // 포맷에 안맞으면 false리턴
    if(!isDateFormat(d)) {
        return false;
    }

    var month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var dateToken = d.split('-');
    var year = Number(dateToken[0]);
    var month = Number(dateToken[1]);
    var day = Number(dateToken[2]);

    // 날짜가 0이면 false
    if(day == 0) {
        return false;
    }

    var isValid = false;

    // 윤년일때
    if(isLeaf(year)) {
        if(month == 2) {
            if(day <= month_day[month-1] + 1) {
                isValid = true;
            }
        } else {
            if(day <= month_day[month-1]) {
                isValid = true;
            }
        }
    } else {
        if(day <= month_day[month-1]) {
            isValid = true;
        }
    }

    return isValid;
}




var ParseDate = function(date)
{

    this.strDate = date;

}

//오브젝트 복사
var objCopy = function(src)
{
    var obj1 = extend({}, src);

    return obj1;
}

function toYYMMDDHHSS(date)
{
    return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() )
}

// 내일 날짜 가져오기
function getTomorrow() {
    var today = new Date();
    var tomorrow = new Date(today.valueOf() + (24 * 60 * 60 * 1000));

    return tomorrow;
}



function pad2(n) { return n < 10 ? '0' + n : n }

//스플리트 하기
function stringSplit(str, d, num)
{
    var tmp = str.split(d);

    return tmp[num];
}




exports.replaceText = replaceText;
exports.parseScheduleDate = parseScheduleDate;

exports.checkDateWithToday = checkDateWithToday;
exports.checkMonthWithToday = checkMonthWithToday;
exports.checkTimeWithToday = checkTimeWithToday;
exports.toYYYYMMDD = toYYYYMMDD;
exports.toYYMMDDHHSS = toYYMMDDHHSS;
exports.removeSpace = removeSpace;

exports.objectCopy = objCopy;
exports.getTomorrow = getTomorrow;
exports.isValidDate = isValidDate;
exports.insertString = insertString;
exports.concatString = concatString;
exports.checkDatePastDate = checkDatePastDate;
exports.stringSplit = stringSplit;
exports.replaceTextAll = replaceTextAll;