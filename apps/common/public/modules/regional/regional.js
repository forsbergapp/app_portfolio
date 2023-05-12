//https://github.com/mobz/get-timezone-offset
//It returns the timezone offset in minutes for any IANA timezone name 
//for any valid javascript date in the past, present and future.
//function getTimezoneOffset( tz_str, date ) {
const getTimezoneOffset = async (tz_str) => {
    //https://github.com/mobz/get-timezone-offset
    const parseDate = ( date_str ) => {
        var us_re = /(\d+).(\d+).(\d+),?\s+(\d+).(\d+)(.(\d+))?/;
        date_str = date_str.replace(/[\u200E\u200F]/g, '');
        var date_a = us_re.exec( date_str );
        return [].slice.call(us_re.exec( date_str ), 1)
            .map( Math.floor );
    }
    //https://github.com/mobz/get-timezone-offset
    const diffMinutes = ( d1, d2 ) => {
        var day = d1[1] - d2[1];
        var hour = d1[3] - d2[3];
        var min = d1[4] - d2[4];
        if( day > 15 ) day = -1;
        if( day < -15 ) day = 1;
        return 60 * ( 24 * day + hour ) + min;
    }

    var now = new Date();
    var locale = 'en-us';
    var format_options = {timeZone: 'UTC',
                        hour12: false,
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'};

    var utc_f = new Intl.DateTimeFormat(locale, format_options );
    format_options.timeZone = tz_str;
    var loc_f = new Intl.DateTimeFormat(locale, format_options );
    return -1 * diffMinutes(
        parseDate( utc_f.format( now )),
        parseDate( loc_f.format( now ))) / 60;
}
export{getTimezoneOffset}