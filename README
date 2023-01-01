# App portfolio

	A platform to build your app portfolio in any language and regional settings.
	With most necessary technology configured to get started and with less
	third party libraries and module dependencies for performance and better maintainability
	with code you have control over.
	Microservice REST API architecture with optional monitoring of each microservice activity.
	Services included are authentication, database, forms, report, geolocation, log, mail
	and worldcities. 
	These services are based on ideas from 
		- Angular (UI)
		- Vue (UI)
		- React (JSX, server component creation, analysis of eventlistener usage, debug and runtime execution) 
	    - existing log monitor and security solutions using SHA256, Bcrypt, json webtoken, 
		  Content-Security-Policy, access control of IP and suspicious activity
		- Oracle Forms and Reports and Oracle Apex.

	Runs in Node.js using Express framework.

	Apps are component structured and server-side rendered with database data popluation.
	Secure REST API with authentication middleware, common ANSI SQL with minium differences for all databases, 
	centralized common SQL parameter syntax and consolidated data validation in Javascript for all databases.
	Apps are written using pure CSS, HTML and Javascript and ES6+ Javascript using
	AJAX method and JSON in both client and server.
	Apps third party modules included are Easy QRCode, Fontawesome icons, Leaflet map, sunposition calculations 
	and regional functions. 

	Oracle SQL Developer Data model designed data model.
	Databases supported are MariaDB, MySQL, Oracle and PostgreSQL.
	Centralized data model error handling of database errors, constraints errors and 
	application errors and showed in users language.

	A global support implemented in client with ALL Unicode characters supported by Noto Sans font
	included different arabic scripts and different font heights (Nastaliq).
	Any regional setting supported including direction right to left. More than 500 locales with language and
	country translations. The mayor 30 languages are translated in the apps. Icons are frequently used 
	to minmize text usage and to provide simplier and better explanation to a global audience.

# Apps included

	1.App 0 - Admin single page web app (SPA) with source code secured logged in as admin from database
	or server system admin authenticated outside database and dynamically loads app code after login. 
	Logout deletes secured app code and deletes any traces still running as SPA. 
	App monitors database, users and apps, can broadcast messages or remotely shutdown apps for maintenance, 
	provides user statistics in graphs created by pure css, javascript and html, 
	maintains apps parameters and full log functionality including
	log of server, apps, routers, controllers, services and SQL.

	2.App 1 - Main single page app to display your app portfolio.
	Social network functionality with profile, like, follow, view other user settings and statistics.

	3.App2 - Timetables app
	Progressive web app (PWA) and a single page web app (SPA).
	Worlds most advanced timetable calculation.
	All known regional settings, all languagues and all countries supported.
	Navigate in calendar per day, month or year in Gregorian or Hijri calendar type in realtime.
	App can be used without registering but then settings can't be saved.
	Map integration with automatic timezone and GPS lookup.
	QR code dynamic generation.
	Timetables can be displayed with different themes using CSS3.
	User interface and timetables can be displayed in any language
	and translation of user interface is fetched from translation objects data model.
	
	Server generated PDF and HTML generated timetables are pixel perfect designed using pt font sizes
	and timetable paper size supported are A4 and Letter.
	Different application themes available from about dialogue.

	Example of complexity of this application:
	Use case:
	A swedish timetable admin who only speaks english and swedish wants to help turkish user creating timetable 
	in arabic and turkish including transliteration of arabic text and showing both gregorian and hijri calendar
	in the same timetable. 
	They live in India so local settings including number system Devanagari numerals (deva in navigator) should be used.
	Header and footer will contain some chinese and urdu with Nastaliq to provide information to guests.
	Timetable shall include all timezones in the current and displayed in the same timetable.
	To keep timetable modern some emojis will be displayed in the timetable. PDF url with QRCode will be shared
	on their social network and if the timetable is printed and on a wall, passing user can scan QR code with the url
	to their phones and download PDF. Preview of future Hijri month Ramadan timetable will be sent by PDF.

	Use case in the app:
	User works remotely and can choose swedish as user preference displaying message in swedish and seeing 
	regional settings in swedish in left to right environment and local timezone.
	User can design a timetable in bilanguage, first language arabic second turkish using right to left layout
	showing result in timetable in right to left in arabic and turkish.
	User creates different timetables with different timezone settings according to chosen GPS
	positions, that is looked up in the map in settings, in the same timetable.
	User can keep track of local timezone in settings while working with other timezones.
	User get swedish text messages and ui is in swedish and can see other languages in the timetable.
	User choose to display both transliteration and translation in the timetable.
	User change the arabic timetable to show numbersystem deva and display second calendar on timetable.
	User can create pixel perfect PDF with any Unicode character incuding emojis and custom fonts according to theme chosen.
	User can preview any past or future timetable date period in Gregorian or Hijri and can save to PDF or print.
	User copies encoded PDF url (to secure privacy) in settings for day, month and year timetable to be shared.


	4.App 3 - Presentation app
	Created to show how a simple app can be installed.
	Includes diagram and data model of app portfolio and a data model for future project.

	Data model supports:
	- management of a property with multiple owners, multiple subtypes of properties, 
	  owner of multiple properties, facility management and vechicle access management
	- economic adminstration
		- bills
		- payments
		- receipts for owners, contact groups representing one or more properties
		- accounting ledger and journal, multicurrency support
		- staff management
		- salary
		- quota calculations for condominum properties
		- bank management
	- investment of assets, real estate, currency, exchange tradable(stock, future, energy), 
	  exchange cryptocurrency and basic stock exchange trading model
	- contact management, in groups or shared ownerships, representation for owners, tenants, 
	  guests
	- booking reservation facility, network access management
	- service management water, electricity, internet, phone lines etc
	- board of directors management with reunion schedule

# Installation instructions

1. Download and info about folders

	[docs/1.download_and_info.md](docs/1.download_and_info.md)

2. Install Node.js, modules on server and SSL

	[docs/2.install_nodejs_ssl.md](docs/2.install_nodejs_ssl.md)

3. Install MariaDB/MySQL/Oracle/PostgreSQL on same server or other server
   and run db scripts

	[docs/3.install_database.md](docs/3.install_database.md)

4. Start Node.js on supported Node.js platform including process monitor
	
	[docs/4.start_nodejs.md](docs/4.start_nodejs.md)

5. Enter application at http://localhost/admin or http://[yourdomain]/admin

   	Set server parameters.

	[docs/5.server_parameters.md](docs/5.server_parameters.md)

6. Set database parameters

	[docs/6.database_parameters.md](docs/6.database_parameters.md)

7. About sign in provider management:
   
	[docs/7.sign_in_provider.md](docs/7.sign_in_provider.md)

8. How to add a new app

	[docs/8.how_to_add_new_app.md](docs/8.how_to_add_new_app.md)

9. Issues
   
   Not supported:

   Hijri transliteration on Android.

   Armenian language on Chrome or Chromium, use Edge or other for Puppeteer if needed.
