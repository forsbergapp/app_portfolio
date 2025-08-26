# App portfolio

![App Portfolio](apps/common/public/documents/screenshot_app2.webp)

An app portfolio created as a reference platform with refactored and simplified solutions of common used third party solutions and support for any language and regional settings.

Comparison tables with solutions are presented in the Presentation app and Apps and Server menus that includes:
- Jasmine/Jest
- JSDoc
- ReadtheDocs
- Swish payment UI
- Stripe payment process
- Pix Brazil
- Vue/React
- Polyfill
- JSON Web token
- Express
- Web Crypto API
- HTTPS
- SSL
- SQL databases
- MongoDB
- Redis
- Microsoft Azure Cosmos DB
- GraphQL

All apps use pure Javascript (ES6+), Typescript, Vue, React, HTML and CSS without any build steps
All apps use Vue SFC pattern and realtime switchable framework between Vue, React and Javascipt.
All apps use pure div elements in HTML without any semantic HTML and without any specific user agent CSS.
All apps use mostly logographic UI compared to traditional phonemic UI

Apps and server use encrypted REST API and app resource transport including fonts without the need of HTTPS.
Server uses Node.js and does not use any third party modules in production.
Server renders apps using Vue SFC pattern.
Server uses secure REST API with openAPI documentation used as documentation and business logic.
Server uses ORM Database and noSQL pattern.

Implemented with many examples of patterns
- Web crypto API without browser or protocol restrictions
- Software as a Service (SaaS)
- Infrastructure As Code (IaC)
- Frontend For Backend (FFB)
- Backend For Frontend (BFF)
- Backend For External (BFE)
- ISO20022
- openAPI
- CI/CD
- Identity and Access Management (IAM)
- microservice architecture using service registry, message queue and IAM pattern
- object relational mapping (ORM) database with PK, UK and FK table constraints including cascade delete for tables and support for non tables like key value and documents
- circuitbreaker
- message queue
- email message pattern using message queue pattern
- factory
- race condition
- file transaction management
- entity/resource data model using hybrid JSON storage concept with flexible and minimal data model design
- role based and secure app server functions (simplified version of Function as a Service and serverless functions model)
- batch cron pattern

CI/CD implemented using batch server with scheduled git pull requests and automatic restart 
of Node.js using pm2 managed processes.
Runs in Node.js.
	
Oracle SQL Developer Data model designed ORM data model.
Databases used as reference to implement database patterns are MariaDB, MySQL, Oracle, PostgreSQL and SQLite.

A global support implemented in client with ALL Unicode characters supported by Noto Sans font
included different Arabic scripts and different font heights (Nastaliq).
Any regional setting supported including direction right to left. More than 500 locales with language and
country translations. Logographic UI chosen is implemented to minimize text usage and to provide simpler and better explanation to a global audience.

Developed in Visual Studio Code in Windows with integration with Github following 
Scrum agile project management framework and deployed on Oracle Cloud and Ubuntu server.

# Installation

Full documentation in /apps/common/src/functions/documentation or in presentation app when installed

## WINDOWS DEVELOPMENT

install Node.Js from https://nodejs.org/
install VS Studio Code from https://code.visualstudio.com/download
```
git clone [repository .git url]
npm install
``` 
launch configured (launch.json) from Visual Studio Code
App Portfolio

optional:
Microservice Geolocation
Microservice Batch

enter http://localhost:3333 
set admin name and password first time in admin app
install db and optional demo users so apps will start
		
enter main server        
http://localhost:3000
	
## UBUNTU SERVER

see full documentation how to install on a cloud service using Terraform

```
git clone [repository .git url] app_portfolio
sudo curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs
sudo npm install -g pm2

pm2 start $HOME/app_portfolio/server/init.js --cwd $HOME/app_portfolio --name app_portfolio -o "/dev/null" -e "/dev/null" --watch --ignore-watch=".git .vscode .well-known data docs node_modules .gitignore .eslintignore .eslintrc.js README.md tsconfig.json"

```
	optional (batch and git are used for CI/CD solution):
```	
pm2 start $HOME/app_portfolio/serviceregistry/microservice/batch/server.js --cwd $HOME/app_portfolio --name batch --watch="serviceregistry/microservice/geolocation" --watch-delay 10

pm2 start $HOME/app_portfolio/serviceregistry/microservice/geolocation/server.js --cwd $HOME/app_portfolio --name geolocation --watch="serviceregistry/microservice/batch"

```

enter http://[domain]:3333
set admin name and password first time in admin app
install db and optional demo users so apps will start
set SSL, DNS settings etc if necessary

all data and configuration files are in /data directory that is created when starting the first time

enter main server        
http://localhost:3000