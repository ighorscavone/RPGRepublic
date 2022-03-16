function isDate(value) {
    try {
        var DayIndex = 0;
        var MonthIndex = 1;
        var YearIndex = 2;

        value = value.replace(/-/g, "/").replace(/\./g, "/");
        var SplitValue = value.split("/");
        var OK = true;
        if (!(SplitValue[DayIndex].length == 1 || SplitValue[DayIndex].length == 2)) {
            OK = false;
        }
        if (OK && !(SplitValue[MonthIndex].length == 1 || SplitValue[MonthIndex].length == 2)) {
            OK = false;
        }
        if (OK && SplitValue[YearIndex].length != 4) {
            OK = false;
        }
        if (OK) {
            var Day = parseInt(SplitValue[DayIndex], 10);
            var Month = parseInt(SplitValue[MonthIndex], 10);
            var Year = parseInt(SplitValue[YearIndex], 10);

            var DateNow = new Date().getDate();

            if (OK = (Year > 1900)) {
                if (OK = (Month <= 12 && Month > 0)) {
                    var LeapYear = (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0));

                    if (Month == 2) {
                        OK = LeapYear ? Day <= 29 : Day <= 28;
                    }
                    else {
                        if ((Month == 4) || (Month == 6) || (Month == 9) || (Month == 11)) {
                            OK = (Day > 0 && Day <= 30);
                        }
                        else {
                            OK = (Day > 0 && Day <= 31);
                        }
                    }
                }
            }
        }
        return OK;
    }
    catch (e) {
        return false;
    }
}

function validaHoraInicioFim(horaInicio, HoraFim) {   
    var splitValue1 = horaInicio.split(':');
    hour1 = splitValue1[0];
    min1 = splitValue1[1];
    var splitValue2 = HoraFim.split(':');
    hour2 = splitValue2[0];
    min2 = splitValue2[1];

    if (hour1 > hour2) {
        return false
    }

    if (hour1 >= hour2 && min1 >= min2) {
        return false
    }

    return true;
}

function isHour(value) {
    var splitValue = value.split(':');
    hour = splitValue[0];
    min = splitValue[1];

    if (hour < 0 || hour > 23) {
        return false
    }

    if (min < 0 || min > 59) {
        return false;
    }

    return true;
}

function comparaDatas(dataInicial, dataFinal, horaInicial, horaFinal) {
    if (horaInicial == null || horaInicial == "") {
        horaInicial = "00:00";
    }
    if (horaFinal == null || horaFinal == "") {
        horaFinal = "00:00";
    }

    dataInicial = new Date(dataInicial);
    dataFinal = new Date(dataFinal);

    dataInicial.setHours(horaInicial.split(':')[0], horaInicial.split(':')[1]);
    dataFinal.setHours(horaFinal.split(':')[0], horaFinal.split(':')[1]);

    if (dataInicial.getMilliseconds > dataFinal.getMilliseconds) {
        return false;
    }

    return true;
}