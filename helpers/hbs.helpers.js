var moment      = require('moment');
var _           = require('underscore');

var DateFormats = {
    short: "DD-MM-YY",
    long: "DD/MM/YYYY",
    dash: "DD/MM/YY",
    veryShort: "MM-YY",
    veryLong: "HH:mm DD/MM/YY",
    fullYear: "HH:mm DD/MM/YYYY"
};

module.exports = {
    section:            section,
    sumInArray:         sumInArray,
    ifCond:             ifCond,
    formatDate:         formatDate,
    trimString:         trimString,
    calcAgeExact:       calcAgeExact,
    currencyRound:      currencyRound,
    currency:           currency,
    greaterThan:        greaterThan,
    json:               json
};

function json(context, escape) {
    if(escape == 'true'){
        return JSON.stringify(context);
    }

    return context;
}

function calcAge(dateString) {
    if(!dateString) return 0;

    return moment().diff(dateString, 'years');
}

function currency(value) {
    if (value && !isNaN(value)) {
        if(value < 0) return value.toString().substr(1).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return '0'
}

function greaterThan(array, v2, options) {
    if(!array) return options.inverse(this);

    if (array.length > v2) {
        return options.fn(this);
    }
    return options.inverse(this);

}

function trimString(str, len) {
    if(!str) return '';
    str = str.trim();

    if (str.length > len && str.length > 0) {
        var new_str = str + " ";
        new_str = str.substr(0, len);
        new_str = str.substr(0, new_str.lastIndexOf(" "));
        new_str = (new_str.length > 0) ? new_str : str.substr(0, len);

        return new_str + '...';
    }

    return str;
}

function currencyRound(value, format, context) {
    if(format == 'false'){
        if(!value) return '0';
        return Math.round(value);
    }
    if (value) {
        var formatted = Math.round(value);

        return formatted.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return '0'
}

function sumInArray(array, selector, format) {
    if(!array) return 0;

    var calc = _.reduce(array, function (total, sel) {
        if(sel[selector]){
            var num = Math.round(sel[selector]);
        } else {
            var num = 0;
        }
        return total += num;
    }, 0);

    if (isNaN(format)) {
        calc = Math.round(calc);
        calc = calc.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    return calc;
}

// Section helper for style and scripts
function section(name, options){
    if (!this._sections) this._sections = {};

    this._sections[name] = options.fn(this);
    return null;
}

// if conditional helper
function ifCond(v1, v2, options){
    if(!v1 || !v2) return options.inverse(this);
    if (v1.toString() == v2.toString()) {
        return options.fn(this);
    }
    return options.inverse(this);
}

function formatDate(datetime, format) {
    if (datetime) {
        if (moment) {
            // can use other formats like 'lll' too
            format = DateFormats[format] || format;

            return moment(new Date(datetime)).format(format);
        }
    }
    return 'No Date';
}

function calcAgeExact(dateString){
    if(!dateString) return 0;

    return calcAge(moment(dateString).format('MM/DD/YYYY'));
}

function calcAge(fromdate) {
    var currentDate = new Date();
    var age = [],
        fromdate = new Date(fromdate),

        y = [currentDate.getFullYear(), fromdate.getFullYear()],
        ydiff = y[0] - y[1],

        m = [currentDate.getMonth(), fromdate.getMonth()],
        mdiff = m[0] - m[1],

        d = [currentDate.getDate(), fromdate.getDate()],
        ddiff = d[0] - d[1];

    if (!fromdate || fromdate == 'Invalid Date') {
        return 0;
    }
    if ((m[0] == m[1]) && (y[0] == y[1])) {
        return 0;
    }
    if (currentDate - fromdate < 0) {
        return 0;
    }

    if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
    if (mdiff < 0 || (!mdiff && !ydiff && ddiff) || (!mdiff && ydiff && ddiff < 0)) mdiff += 12;
    if (ddiff < 0) {
        fromdate.setMonth(m[1] + 1, 0);
        ddiff = fromdate.getDate() - d[1] + d[0];
        --mdiff;
    }

    if (ydiff > 0) age.push(ydiff + ' ');
    if (mdiff > 0) age.push(mdiff + ' months' + ' ');
    if (age.length > 1) age.splice(age.length - 1, 0, 'ו');

    return age.join('');
}