# App portfolio

	An app portfolio created as a reference platform and implemented with support for any language and regional settings.
	
	All apps use pure Javascript (ES6+), Typescript, Vue, React, HTML and CSS without any build steps
	All apps use Vue SFC pattern and realtime switchable framework between Vue, React and Javascipt.
	All apps use mostly logographic UI compared to traditional phonemic UI
	All apps use common user access and any user data is saved in each app for the user.

	Implemented with less third party libraries and module dependencies for performance and better maintainability.
	Server renders basic app HTML using parameters.
	Server uses secure REST API with authentication middleware that authenticates claims in access or id tokens and 
	also authenticates request access to resources on user and app level.
	Databases use common ANSI SQL with minium differences for all databases, 
	Databases use centralized and conslidated common SQL parameter syntax and consolidated data validation in Javascript 
	for all databases.

	Implemented with many examples of implementation patterns 
		- microservice architecture
		- circuitbreaker
		- message queue
		- factory
		- race condition
		- file transaction management
		- frontend for backend (FFB)
		- backend for frontend (BFF)
		- entity/resource datamodel using hybrid JSON storage concept with flexible and minimal data model design
		- role based and secure app server functions (simplified version of Function as a Service and serverless functions model)
		- ISO20022
		- CD/CI
		- batch cron pattern

	Continuous deployment implemented using batch server with scheduled git pull requests and automatic restart 
	of Node.js using pm2 managed processes.
	Runs in Node.js using Express framework.
	
	Oracle SQL Developer Data model designed data model.
	Databases supported are MariaDB, MySQL, Oracle, PostgreSQL and SQLite.
	Centralized data model error handling of database errors, constraints errors and application errors showed in users language.

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
	and to show a well structured enterprise level platform implemented to be used as reference project and a manual and 
	guidance for future projects.
	
	What
	Create a web app platform with latest technology supporting any language and regional setting with the most optimized,
	structured and most pragmatic and academic implementation in mind using years of empirical knowledge of full stack
	development using Javascript, Typescript, Vue, React, HTML, CSS as the most popular technology used for front end web development 
	and using most popular open source or free SQL databases for back end development. The web app platform should be deployed on
	the popular Node.js that supports Javascript in the server.

	How
	Aquiring latest certifications, studying latest technologies trying out pros and cons.
	Finding common factors in MariaDB, Mysql, PostgreSQL, Oracle and SQLite databases to implement easier maintainable REST API 
	and datamodel.
	Consolidate ideas from Angular, Vue, React, jQuery, Oracle Forms, Oracle Reports and Oracle APEX, existing log and 
	monitor solutions and common implementation patterns to optimal structure and implementation.

	Requirements

	- all apps should be web apps with open source written in Javascript, Typescript, HTML and CSS both for front end and back end 
	  and using JSON and REST API between front end and back end
    - all apps should work on mobile, tablet and desktop computers
	- all apps should use multi framework supporting pure Javascript, Vue and React without build step and be switchable 
	  at any time in the app allowing mixed framework rendered components simultaneously or let all apps be controlled by 
	  a server parameter to show a default framework only
	- all apps should use Typescript and JSDoc without build step
	- all apps should mount the app and other components at start using Vue single file component (SFC) similar structure
	  and only render components when needed
	- all apps should be single page application (SPA)
	- one app should be an installable Progressive Web App (PWA)
	- all apps should use event delegation declaring events on app root level only
	- any language, all unicode characters, any regional setting
	- social network basic functionality with follow, like, followed, liked and viewed including statistics
	- Javascript ECMAScript modules and ES6+ Javascript using Express in Node.js. Thirdparty javascript modules 
	  should be converted from CommonJS to ECMAScript modules if necessary.
	- report with pixel perfect design using css pt font size measurement and full unicode support
	- apps created using server side rendering
	- database and file logging
	- microservice arquitecture
	- frontend for backend (FFB) arquitecture
	- backend for frontend (BFF) arquitecture
	- MariaDB, MySQL, PostgreSQL, Oracle and SQLite databases supported with dynamic pool arquitecture
	  and sql logging stratified per app
	- MariaDB, MySQL and PostgreSQL installed as local installations and Docker as alternative
	- database should support transactions with rollback and commit and be able to save images and JSON in the database
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
	- using Scrum agile project management framework to manage project with integrated version control that supports 
	  code releases of all source code and documentation
	- development environment should be configured with ESLint for basic code formatting
	- development environment should be configured with Jasmine to provide test environment
	- documentation of installation and development environment
	- establish common app functionality with email code verification in user processes, user info with statistics, search users, 
	  QR Code on the user profile
	- avoid semantic HTML in all apps if not necessary meaning all input, a, table, li, button, label, select, form or canvas elements 
	  should be replaced by div elements to avoid different obscure functionality, UI and CSS styles in different browsers.

	Security requirements

	- Content Security Policy against XSS
	- SHA256 for REST API and Node.js crypto functions with server parameters for user passwords
	- bank and shop apps are implemented with even higher encryption and security level than other apps
	- JSON web tokens with claim validation
	- REST API request resource validations on app and user level
	- stateless app meaning cookies or localstorage should not be used in the browser, PWA should not cache files and just be installable
	- textediting control on app level to block basic cut/copy/paste for apps that need higher security
	- access control IP blocking,
	- access control user agent
	- access control method
	- access control hostname
	- access control accept language
	- access control request url
	- access control app input text
	- access control robots search engine
	- access control internet
	- access control geolocation

	Not included in the scope
	
	- Production features like
	  - Rate limiter
	  - Load balancer with for example popular NGINX for performance
	  - Reverse Proxy server with for example popular NGINX for multiple application servers on the same host
	  - Kubernetes
	  - Automatic IP control integration with for example iptables
    - Social media monitoring


# Apps included

	App 0 - Admin app
	Admin app for app admins and system admins with configuration, monitoring of live connections and logs, statistics, 
	broadcast functions, database management, OS info, process info and user role management

	App 1 - App portfolio app
	Start app

	App 2 - Timetable app
	Timetable app using advanced CSS, complete regional and language settings, pixel perfect reports and map with gps functionality that integrates with microservices

	App 3 - Presentation app
	Presentation app that shows a simple app implementation

	App 4 - Map app
	World map that integrates with microservices

	App 5 - Bank app
	Bank app with core bank functionality using ISO standards and security in focus, integrates payment requests with merchants
	bank account and uses server functions with factory pattern using entity/resource and json in data model concept

	App 6 - Shop app
	Shop app that shows a product with variants and stock info to buy, uses direct bank payment and external app server function pattern to communicate with bank app	

	App 7 - Cube app
	Cube solver app using generative AI pattern that uses robot or human model to solve current cube state
	
# Installation instructions

1. Installation server

	[docs/1.installation_server.md](docs/1.installation_server.md)

2. Installation database

	[docs/2.installation_database.md](docs/2.installation_database.md)

3. Start Node.js
	
	[docs/3.start_nodejs.md](docs/3.start_nodejs.md)

4. Server configuration

	[docs/4.server_configuration.md](docs/4.server_configuration.md)

5. Apps

	[docs/5.apps.md](docs/5.apps.md)

6. Configure development environment
	
	[docs/6.development.md](docs/6.development.md)

7. Test
	
	[docs/7.test.md](docs/7.test.md)

8. Typescript, JSDoc and ESLint
	
	[docs/8.typescript_jsdoc_eslint.md](docs/8.typescript_jsdoc_eslint.md)

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
	SQLite
	www.sqlite.org
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
	Simplemap, world city database
	www.simplemaps.com	
    EasyQRCodeJS version
    www.github.com/ushelp/EasyQRCodeJS
	Country Translations
	www.github.com/umpirsky/country-list
	Locale Translations
	www.github.com/umpirsky/locale-list
	JSDoc
	www.jsdoc.app
	ESLint
	www.eslint.org
	Typescript
	www.typescriptlang.org


# Issues
   
	PM2 and NodeJS:

    	PM2 cluster mode and native Node.js cluster functionality are not supported at the moment since configuration 
		functions use module variables for performance and socket uses in memory module variable for connected clients 
		and no replication method still implemented.

	Javascript:
		Hijri transliteration on Android.

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