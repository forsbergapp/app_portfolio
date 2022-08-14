window.global_rest_app2_user_setting;
window.global_rest_app2_user_setting_user_account_id;
window.global_rest_app2_user_setting_view;

//session variables
window.global_session_currentDate;
window.global_session_CurrentHijriDate;
window.global_session_gps_map_mymap;

//praytimes.org override without modifying original code
//Adding more known methods and a custom method so any angle can be supported
window.global_prayer_praytimes_methods = {
	ALGERIAN: {
		name: 'Algerian Ministry of Religious Affairs and Wakfs',
		params: { fajr: 18, isha: 17 } },
	DIYANET: {
		name: 'Diyanet İşleri Başkanlığı',
		params: { fajr: 18, isha: 17 } },
	EGYPT: {
		name: 'Egyptian General Authority of Survey',
		params: { fajr: 19.5, isha: 17.5 } },
	EGYPTBIS: {
		name: 'Egyptian General Authority of Survey Bis',
		params: { fajr: 20, isha: 18 } },
	FRANCE15: {
		name: 'French15',
		params: { fajr: 15, isha: 15 } },
	FRANCE18: {
		name: 'French18',
		params: { fajr: 18, isha: 18 } },
	GULF: {
		name: 'Gulf region',
		params: { fajr: 19.5, isha: '90 min' } },
	KARACHI: {
		name: 'University of Islamic Sciences, Karachi',
		params: { fajr: 18, isha: 18 } },
	KEMENAG: {
		name: 'Kementerian Agama Republik Indonesia',
		params: { fajr: 20, isha: 18 } },
	ISNA: {
		name: 'Islamic Society of North America (ISNA)',
		params: { fajr: 15, isha: 15 } },
	JAFARI: {
		name: 'Shia Ithna-Ashari, Leva Institute, Qum',
		params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' } },
	JAKIM: {
		name: 'Jabatan Kemajuan Islam Malaysia',
		params: { fajr: 20, isha: 18} },
	MAKKAH: {
		name: 'Umm Al-Qura University, Makkah',
		params: { fajr: 18.5, isha: '90 min' } },  // fajr was 19 degrees before 1430 hijri
	MUIS: {
		name: 'Majlis Ugama Islam Singapura',
		params: { fajr: 20, isha: 18 } },	
	MWL: {
		name: 'Muslim World League',
		params: { fajr: 18, isha: 17 } },
	TUNISIA: {
		name: 'Tunisian Ministry of Religious Affairs',
		params: { fajr: 18, isha: 18 } },
	TEHRAN: {
		name: 'Institute of Geophysics, University of Tehran',
		params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' } },  // isha is not explicitly specified in this method
	UOIF: {
		name: 'Union des Organisations Islamiques de France',
		params: { fajr: 12, isha: 12 } }
};
