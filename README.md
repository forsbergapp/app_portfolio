# App portfolio

![App Portfolio](apps/common/public/documents/screenshot_app2.webp)

An app portfolio created as an open source reference platform with refactored and simplified solutions of common used third party solutions and showing secure solution without HTTPS and TLS.

A refactored and simplified devop solution following OWASP.

|Devop      |Comment|
|:----------|:------|
|PLAN	    |Follows directives OWASP, ISO20022, OpenApi, single source of truth, stateless and Scrum agile project management framework|
|CODE 	    |Javascript, CSS, HTML, Git, documentation using markdown, Terraform for Infrastructure as Code, Git and microservice batch for CI/CD|
|BUILD      |A build free solution, no compiling, no third parties in production, the git repository is the the deployable artifact using git tags, exact same code in development as deployed following OWASP|
|TEST       |Behaviour Driven Development (BDD) including spy, unit, integration and performance tests and dedicated performance test using print queue and data analysis pattern|
|RELEASE    |Uses Git release and environment tags and TEST and PRODUCTION environments|
|DEPLOY     |TEST and PRODUCTION environments are automatically updated by simple git tag command |
|MONITOR    |Admin app|
|OPERATE    |Admin app|
|DOCUMENT   |Documentation app with about, installation, development, app and server management, diagrams, comparisons with third party solutions, both static documentation including details of OWASP implementation and live documentation of release information, apps, server, OpenApi and ORM type declarations|


Comparison tables with solutions are presented in the Documentation app and Apps and Server menus that includes:
- OWASP
- Vue/React
- Transpiler/build step
- Polyfill
- Jasmine/Jest
- JSON Web token
- Web Crypto API
- HTTPS
- SSL
- SQL databases
- MongoDB
- Redis
- Microsoft Azure Cosmos DB
- GraphQL
- Express
- Swish payment UI
- Stripe payment process
- Pix Brazil
- Leaflet
- JSDoc
- ReadtheDocs
- Markdown

All apps use pure Javascript (ES6+), Typescript, Vue, React, HTML and CSS without any build steps
All apps use Vue SFC pattern and realtime switchable framework between Vue, React and Javascipt.
All apps use pure div elements in HTML, pure CSS without any specific user agent CSS and pure HTML without any Javascript and Css links.
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
- Continuos Integration and Continous Delivery/Deployment (CI/CD)
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

CI/CD implemented using batch server with scheduled git commands using Linux systemctl managed services on server
Runs in Node.js.
	
pgModeler designed ORM data model.
Databases used as reference to implement database patterns are MongoDB, MariaDB, MySQL, Oracle, PostgreSQL and SQLite.

Any regional setting supported including direction right to left. More than 500 locales with language and
country translations. Support for different Arabic scripts and different font heights (Nastaliq). Logographic UI chosen is implemented to minimize text usage and to provide simpler and better explanation to a global audience.

# Installation

Full documentation in the Documentation app when installed.
Project focuses on open source directive and supports Linux only.

## DEVELOPMENT


```
sudo apt install git
sudo apt install curl
sudo apt install codium

git clone [repository .git url] app_portfolio
sudo curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs
npm install
``` 
open repository folder in VSCodium
launch configured (launch.json) from VSCodium

App Portfolio

optional:
Microservice Batch

enter http://localhost:3333 
set admin name and password first time in admin app
install optional demo users
		
enter main server        
http://localhost:3000
	
## LINUX SERVER

```
cd $HOME
git clone [repository .git url] app_portfolio
sudo curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs

sudo systemctl enable $HOME/app_portfolio/server/scripts/app_portfolio.service
sudo systemctl daemon-reload
sudo systemctl start app_portfolio.service
```

optional (batch and git are used for CI/CD solution):
```	
sudo systemctl enable $HOME/app_portfolio/server/scripts/app_portfolio_microservice_batch.service
sudo systemctl daemon-reload
sudo systemctl start app_portfolio_microservice_batch.service

```

enter http://[domain]:3333
set admin name and password first time in admin app
install optional demo users

all data and configuration files are in /data directory that is created when starting the first time

enter main server        
http://localhost:3000


# Providers

**Oracle Cloud**
www.oracle.com/cloud
**Terraform**
www.hashicorp.com
**Node.js**
www.nodejs.org
**pgModeler**
github.com/pgmodeler
**Git**
git-scm.com
**Vue**
www.vuejs.org
**React**
www.react.dev
**Geolocation by DB-IP**
db-ip.com
**Openstreet Map Tiles**
tile.openstreetmap.org
**Esri.WorldImagery Map Tiles**
server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer
**Country Translations**
www.github.com/umpirsky/country-list
**Locale Translations**
www.github.com/umpirsky/locale-list
**JSDoc**
www.jsdoc.app
**Typescript**
www.typescriptlang.org
**Cube, Kociemba method**
github.com/torjusti/cubesolver
**Cube, Thistlewaite method**
github.com/stringham/rubiks-solver
**Cubem CFOP/Fridrich method**
github.com/slammayjammay/rubiks-cube-solver