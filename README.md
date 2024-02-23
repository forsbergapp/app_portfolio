# App portfolio

	A platform to build your app portfolio in any language and regional settings.
	With most necessary technology configured to get started and with less
	third party libraries and module dependencies for performance and better maintainability
	with code you have control over.
	Microservice architecture using circuitbreaker and message queue.
	Services included are batch, geolocation, mail, PDF and worldcities.
	Continuous deployment implemented using batch server with scheduled git pull requests and automatic restart 
	of Node.js using pm2 managed processes.
	Runs in Node.js using Express framework.

	Apps are component structured and server-side rendered with database data popluation.
	Secure REST API with authentication middleware, common ANSI SQL with minium differences for all databases, 
	centralized common SQL parameter syntax and consolidated data validation in Javascript for all databases.
	Apps are written using pure CSS, HTML and Javascript and ES6+ Javascript using
	AJAX method and JSON, ECMAScript modules only in both client and server.
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

	Developed in Visual Studio Code in Windows with integration with Github and Jira following 
	Scrum agile project management framework and deployed on Oracle Cloud and Ubuntu server.

# Project description
	
	Why 
	As a certified professional developer, develop a new platform using latest technology and paradigm used today
	and to show a well structured enterprise level platform implemented with pure technology without unnecessary
	obscure frameworks to be used as reference project and a manual and guidance for future projects.
	
	What
	Create a web app platform with latest technology supporting any language and regional setting with the most optimized,
	structured and most pragmatic and academic implementation in mind using years of empirical knowledge of full stack
	development using Javascript, HTML, CSS as the most popular technology used for front end web development and using 
	most popular open source or free SQL databases for back end development. The web app platform should be deployed on
	the popular Node.js that supports Javascript in the server.

	How
	Aquiring latest certifications, studying latest technologies trying out pros and cons.
	Finding common factors in MariaDB, Mysql, PostgreSQL and Oracle databases to implement easier maintainable REST API 
	and datamodel.
	Consolidate ideas from Angular, Vue, React, jQuery, Oracle Forms, Oracle Reports and Oracle APEX, existing log and 
	monitor solutions, javascript frameworks to optimal structure and implementation.

	Requirements

	- all apps should be web apps with open source written in Javascript, HTML and CSS both for front end and back end 
	  and using JSON and REST API between front end and back end
    - all apps should work on mobile, tablet and desktop computers
	- all apps should be single page application (SPA)
	- one app should be Progressive Web App (PWA)
	- any language, all unicode characters in client and in server, any regional setting, double bilanguage calendar
	  realtime timetable calculations with all known needed settings configurable with different themes using CSS,
	- social network
	- Javascript ECMAScript modules and ES6+ Javascript using Express in Node.js. Thirdparty javascript modules 
	  should be converted from CommonJS to ECMScript modules if necessary.
	- report PDF with QR codes pixel perfect design using css pt font size measurement and full unicode support
	- apps created using server side rendering
	- database and file logging
	- microservice arquitecture
	- MariaDB, MySQL, PostgreSQL and Oracle databases supported deployed on Oracle Cloud with dynamic pool arquitecture
	  and sql logging stratified per app
	- MariaDB, MySQL and PostgreSQL installed as local installations and Docker as alternative
	- database should support transactions with rollback and commit and be able to save images in the database
	- database ER model and server datamodel using a database data model designer tool that can generate SQL from 
	  the server data model
	- dynamic app installation
	- admin app with monitoring of live connections and logs, statistics, broadcast maintenance, messaging to clients,
	  database info, OS info, process info and user role management.
	- admin app with access for admin database user supporting superadmin role to monitor apps
	- admin app with access for system admin to manage installation, configuration and server
	- vendor specific coding as for example -webkit-, -moz-, -o-, -ms- and filter: progid:DXImageTransform.Microsoft 
	  in CSS removed. 
	- third party modules should be canvas free solutions or configured to not use canvas.
	- own solution for statistics displayed in graphs
	- no exposure of server code in client like for example React framework is doing by default
	- using Scrum agile project management framework to manage project with integrated version control that supports 
	  code releases of all source code and documentation

	Security requirements

	- Content Security Policy against XSS
	- SHA256 for REST API and Bcrypt for user security
	- JSON web tokens with extra validation that checks at least token is authorized to correct userid, appid and ip.
	- admin app logs in with fetched code from server after accesstoken fetched and code deleted after logout
	  with no traces in navigator history
	- stateless app meaning cookies or localstorage should not be used in the browser
	- access control IP blocking,
	- access control user agent
	- access control hostname
	- access control accept language
	- access control request url
	- access control app input text
	- access control robots search engine
	- access control internet
	- access control geolocation

	Not included in the scope
	
	- Production features like
	  - Load balancer with for example popular NGINX for performance
	  - Reverse Proxy server with for example popular NGINX for multiple application servers on the same host
	  - Kubernetes
	  - Automatic IP control integration with for example iptables
    - Social media monitoring

# Providers

	Oracle Cloud
	www.oracle.com/cloud
	MariaDB
	www.mariadb.org
	MySQL
	www.mysql.com
	PostgreSQL
	www.postgresql.org
	Oracle Database
	www.oracle.com/database
	Node.js
	www.nodejs.org
	Express
	www.expressjs.com
	Vue
	www.vuejs.org
	React
	www.react.dev
	Font Awesome
	www.fontawesome.com
	Leaflet
	www.leafletjs.com
	Geoplugin Geolocation
	www.geoplugin.com
	Pray Times client version
    www.praytimes.org
    Pray Times server version
    www.npmjs.com/package/praytimes
    EasyQRCodeJS client version
    www.github.com/ushelp/EasyQRCodeJS
    EasyQRCodeJS server version
    www.npmjs.com/package/easyqrcodejs-nodejs
	Country Translations
	www.github.com/umpirsky/country-list
	Language Translations
	www.github.com/umpirsky/language-list
	JSDoc
	www.jsdoc.app
	Typescript
	www.typescriptlang.org

# Apps included

	1.App 0 - Admin app
	Single page web app (SPA). 
	App monitors database, users and apps, can broadcast messages or remotely shutdown apps for maintenance, 
	provides user statistics in graphs created by pure css, javascript and html, 
	maintains apps and server parameters, displays server logs, monitors connected clients, installs and uninstalls
	database, installs and uninstalls demo data. Supports MariaDB, MySQL, PostreSQL and Oracle databases.

	2.App 1 - Main app to display your app portfolio.
	Single page web app (SPA).
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
	Single page web app (SPA).
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

	5.App 5 - Map app
	Single page web app (SPA).
	Map app with implemented client multiframework using pure Javascript, Vue and React
	switcher. Vue and React are implemented without Babel and as ECMAScript modules to show
	how pure Javascript solution without build step, transpiler or any NodeJs module modifications.
	
	App 2 and admin app are both using Leaflet module with same logic although without Javascript 
	framework switcher.

	Uses Leaflet module to show maps with this functionality:
	- current gps position with geodata displayed as popup on map
	- Added custom functionality on Leaflet module with solutions for custom event integration
	- Search any country and get all cities for given country using worldcities microservice
	- Search free text using worldcities microservice
	- My location button
	- Fullscreen button
	- Change layer button
	- Double click on map to show info of selected place
	- Move and zoom to any place on earth
	- Scale info on map
	- Toolbar to switch Javascript framework

# Installation instructions

1. Download and info about directories

	[docs/1.download_and_info.md](docs/1.download_and_info.md)

2. Install Node.js, modules on server, set DNS records and create SSL

	[docs/2.install_nodejs_dn_ssl.md](docs/2.install_nodejs_dns_ssl.md)

3. Install MariaDB/MySQL/Oracle/PostgreSQL on same server or other server
   and run db scripts

	[docs/3.install_database.md](docs/3.install_database.md)

4. Start Node.js on supported Node.js platform including process monitor
	
	[docs/4.start_nodejs.md](docs/4.start_nodejs.md)

5. Enter application at http://admin.localhost or http://admin.[DOMAIN] and configure server

	[docs/5.server_configuration.md](docs/5.server_configuration.md)

6. Set database parameters

	[docs/6.database_parameters.md](docs/6.database_parameters.md)

7. About sign in provider management:
   
	[docs/7.sign_in_provider.md](docs/7.sign_in_provider.md)

8. Apps

	[docs/8.apps.md](docs/8.apps.md)

9. Install development environment
	
	[docs/9.development.md](docs/9.development.md)

10. Test
	
	[docs/10.test.md](docs/10.test.md)

11. Typescript
	
	[docs/11.typescript.md](docs/11.typescript.md)

12. Issues
   
	PM2 and NodeJS:

    	PM2 cluster mode and native nodejs cluster functionality are not supported at the momment since configuration 
		functions use module variables for performance and socket uses in memory module variable for connected clients 
		and no replication method still implemented.

	Javascript:
		Hijri transliteration on Android.

		Armenian language on Chrome or Chromium, use Edge or other for Puppeteer if needed.

		Hanidec numbers Javascript bugs:

		Javascript does not support Hanidec numbers used in Chinese and North Korean numbers from 10 and above. 
		For example 10 in latn number system will display the individual numbers 1 and 0 in Hanidec 一〇 (Yī and Líng) 
		and not 10 in Hanidec that should be 十 (Shí). 

		new Intl.NumberFormat('zh-u-nu-hanidec').format(10); 
		result: 一〇 (Yī and Líng) should be 十 (Shí)
		or
		(10).toLocaleString('zh-u-nu-hanidec')
		result: 一〇 (Yī and Líng) should be 十 (Shí)

		(十).toLocaleString('en') should convert hanidec to 10 in latn numbers but returns NaN

		String.fromCharCode(0x5341).toLocaleString('en-u-nu-latin') 
		UTF-16 code unit of Hanidec 十 (Shí),
		should return 10 in latin number but returns 十.

		Workaround for chinese numbers in app 2:
		Hijri dates and timetables date titles will use latn numbers if hanidec numbersystem is used.
		Using number mapping for chinese numbers 1-100 as workaround for timetables.
		
		Other apps are using latn numbers.