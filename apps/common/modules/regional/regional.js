const getGregorian = async (arabicDate, adjustment) => {
    //http://www.islamicity.org
    MHK = false;

    //http://www.islamicity.org/PrayerTimes/assets/js/config.js
    var delta = 0;

    //http://www.islamicity.org/PrayerTimes/assets/js/prayertime.lib.js

    /** Date conversion English to Arabic and Arabic to English months **/
    const intPart = (floatNum) => {
        if (floatNum< -0.0000001){
            return Math.ceil(floatNum-0.0000001);
        }
        return Math.floor(floatNum+0.0000001);
    }

    const adjustDelta = (m,y) => {

        // whenever there is an adjustment to be made 
        // ( be it for the current month or for a future month/date ), use this! 
        // add new cases, without deleting the previous ones
        // make sure each case comes with its hijriToGreg and GregToHijri pairs ( ex: 1438 & 2017 )
        
        // note whenever you make changes to the scripts, update the version at /prayertimes/version-integer.php
        var bingo = false; // this gets set to true only if there is an adjustment match and allow us to short-circuit the function	
        var returnVal = delta; // this is what comes from the config.js, if no adjustment match occurs, this prevails at the end of the function return
        
        var deltaORGNOW = delta;

        if ( MHK && false ) {
            alert( 'get the m and y correct for both cases first:\n\n' + 'm: ' + m  + '\ny: ' + y   );
        } 


        // ramadan 1438 fix
        //-----------------------------------------------------------------
        if ( ( m == 6 && y == 2017 ) ||  ( m == 9 && y == 1438 ) ) {
            bingo = true;
            returnVal = 0; 
        };

        if ( ( m == 7 && y == 2017 ) ||  ( m == 11 && y == 1438 ) ) {
            bingo = true;
            returnVal = 0; 
        };

        if ( ( m == 2 && y == 2018 ) ||  ( m == 6 && y == 1438 ) ) {
            bingo = true;
            returnVal = 0; 
        };


        if ( ( m == 5 && y == 2018 ) || ( m == 8 && y == 1439 ) ) {
            bingo = true;
            returnVal = 0; 
        };
        
        if ( ( m == 8 && y == 2018 ) || ( m == 12 && y == 1439 ) ) {
                bingo = true;
                returnVal = 1; 
        };
            
            
            
        if ( ( m == 6 && y == 2019 ) || ( m == 9 && y == 1440 ) ) {
            //alert("Happy Ramadan");
            bingo = true;
            returnVal = 1;   // -1 maps to ramaan 30, 0 maps to shawaal 1, 1 maps to shawaal 2
        };

        if ( ( m == 9 && y == 2019 ) || ( m == 1 && y == 1441 ) ) {
            bingo = true;
            returnVal = 1; 
        };

        // read the ^ readme-txt 


        if ( bingo ) {
            return returnVal;
        } 
        //-----------------------------------------------------------------

        return returnVal;
    }

    //arabicDate[0] = year
    //arabicDate[1] = month
    //arabicDate[2] = day

	if(arabicDate == ""){
		return "";
	}
	//declare a date format year,month,day sequence
	var jd;
	var jd1;
	var l;
	var j;
	var n;
	var wd;
	var i;
	var k;

	var d = parseInt(arabicDate[2]);
	var m = parseInt(arabicDate[1]);
	var y = parseInt(arabicDate[0]);
	
	var deltaAdjusted;
	deltaAdjusted = adjustDelta(m,y);


	var english_date = new Array(0,0,0);

	//added delta=1 on jd to comply isna rulling for hajj 2007

	//delta = delta_array_hijri[arabicDate[1] - 1];


	jd = intPart((11*y+3)/30)+354*y+30*m-intPart((m-1)/2)+d+1948440-385-deltaAdjusted;
	//adjustment added 20180804
	jd = jd + parseInt(adjustment)
	//arg.JD.value=jd
	//wd = weekDay(jd % 7); // no use of this line

	if (jd > 2299160 )
	{
		l = jd + 68569;
		n = intPart((4*l)/146097);
		l = l - intPart((146097*n+3)/4);
		i = intPart((4000*(l+1))/1461001);
		l = l-intPart((1461*i)/4)+31;
		j = intPart((80*l)/2447);
		d = l-intPart((2447*j)/80);
		l = intPart(j/11);
		m = j+2-12*l;
		y = 100*(n-49)+i+l;
	}
	else
	{
		j = jd+1402;
		k = intPart((j-1)/1461);
		l = j-1461*k;
		n = intPart((l-1)/365)-intPart(l/1461);
		i = l-365*n+30;
		j = intPart((80*i)/2447);
		d = i-intPart((2447*j)/80);
		i = intPart(j/11);
		m = j+2-12*i;
		y= 4*k+n+i-4716;
	}

	english_date[2] = d;
	english_date[1] = m;
	english_date[0] = y;

	return english_date;
}
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
export{getGregorian, getTimezoneOffset}