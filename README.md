# App portfolio

![App Portfolio](apps/common/public/documents/screenshot_app2.webp)

An open source project with refactored and simplified solutions of common used third party solutions and a DevOps workflow solution following OWASP.

The DevOps workflow activities implemented:

|Stage|Comment|
|:----------|:------|
|PLAN	    |Follows directives OWASP Application Security Verification Standard (ASVS) v 5.0.0, ISO20022, OpenApi, single source of truth, stateless and Scrum agile project management framework|
|CODE 	    |Javascript, CSS, HTML, Git, documentation using markdown, Terraform for Infrastructure as Code, Git and microservice batch for CI/CD|
|BUILD      |A build free solution, no compiling, no third parties in production, the git repository is the deployable artifact using git tags, exact same code in development as deployed following OWASP|
|TEST       |Behaviour Driven Development (BDD) including spy, unit, integration and performance tests and dedicated performance test using print queue and data analysis pattern|
|RELEASE    |Uses Git release and environment tags that deploy to TEST and PRODUCTION environments|
|DEPLOY     |TEST and PRODUCTION environments are automatically updated by simple git tag command |
|MONITOR    |Admin app|
|OPERATE    |Admin app|
|DOCUMENT   |Documentation app with about, installation, development, app and server management, diagrams, comparisons with third party solutions, both static documentation including details of OWASP implementation and live documentation of release information, apps, server, OpenApi and ORM type declarations|

Comparison tables with solutions are presented in the Documentation app that includes:
- OWASP
- Web Crypto API secure transport without HTTPS, SSL and TLS
- Vue/React
- Transpiler/build step
- Polyfill
- Jasmine/Jest
- JSON Web token
- SQL databases MariaDB, MySQL, Oracle, PostgreSQL and SQLite
- Non SQL databases MongoDB, Redis, Microsoft Azure Cosmos DB and GraphQL
- Express
- Swish payment UI
- Stripe payment process
- Pix Brazil
- Leaflet
- JSDoc
- ReadtheDocs
- Markdown

All apps features
- Multi app single page application (SPA)
- Pure Javascript (ES6+), Typescript, Vue, React, HTML and CSS without any build steps or transpilers
- Vue SFC pattern and realtime switchable framework between Vue, React and Javascipt
- Pure div elements in HTML, pure CSS without any specific user agent CSS and pure HTML without any Javascript and Css links
- Mostly logographic UI compared to traditional phonemic UI to provide simpler and better explanation to a global audience
- Event delegation
- Progressive data and code cache using closure pattern for optimal performance replacing browser cache functionality completely with OWASP secure and stateless solution

Server features
- Node.js without third party modules in production
- Renders apps using Vue SFC pattern
- Secure REST API using custom Web Crypto API including all app resources
- OpenAPI documentation used as documentation and business logic
- ORM database

Implemented with many examples of patterns
- Web Crypto API without browser or protocol restrictions
- Software as a Service (SaaS)
- Infrastructure As Code (IaC)
- Frontend For Backend (FFB)
- Backend For Frontend (BFF)
- Backend For External (BFE)
- ISO20022
- OpenAPI
- Continuos Integration and Continous Delivery/Deployment (CI/CD)
- Identity and Access Management (IAM)
- Microservice architecture using service registry, message queue and IAM pattern
- Object relational mapping (ORM) database with PK, UK and FK table constraints including cascade delete for tables and support for non tables like key value and documents
- Circuitbreaker
- Message queue
- Email message pattern using message queue pattern
- Race condition
- File transaction management
- Dependency Injection for maximum performance of server and ORM database
- Entity/resource data model using hybrid JSON storage concept with flexible and minimal data model design
- Role based and secure app server functions (simplified version of Function as a Service and serverless functions model)
- Batch cron pattern
- GEOJson
- Map tile and layer management

CI/CD implemented using batch server with scheduled git commands using Linux systemctl managed services on server

Any regional setting supported including direction right to left. More than 500 locales with language and
country translations. Support for different Arabic scripts and different font heights (Nastaliq).

# Installation

Full documentation in the Documentation app when installed.
Project supports Linux only.

## DEVELOPMENT


```
sudo apt install git
sudo apt install curl
sudo apt install codium
cd $HOME
mkdir node
wget https://nodejs.org/dist/v20.20.0/node-v20.20.0-linux-x64.tar.xz
tar -xJf node-v20.20.0-linux-x64.tar.xz -C node --strip-components=1
echo 'export PATH="$PATH:$HOME/node/bin"' >> ~/.bashrc	
source ~/.bashrc
git clone [repository .git url] app_portfolio
cd app_portfolio
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
mkdir node
wget https://nodejs.org/dist/v20.20.0/node-v20.20.0-linux-x64.tar.xz
tar -xJf node-v20.20.0-linux-x64.tar.xz -C node --strip-components=1
echo 'export PATH="$PATH:$HOME/node/bin"' >> ~/.bashrc	
source ~/.bashrc
git clone [repository .git url] app_portfolio
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

|Provider                           |Url                    |
|:----------------------------------|:----------------------|
|Oracle Cloud                       |www.oracle.com/cloud|
|Terraform                          |www.hashicorp.com|
|Node.js                            |www.nodejs.org|
|pgModeler                          |github.com/pgmodeler|
|Git                                |git-scm.com|
|Vue                                |www.vuejs.org|
|React                              |www.react.dev|
|Geolocation by DB-IP               |db-ip.com|
|Openstreet Map Tiles               |tile.openstreetmap.org|
|Esri.WorldImagery Map Tiles        |server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer|
|Esri.WorldStreetMap Map Tiles      |server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer|
|Country Translations               |www.github.com/umpirsky/country-list|
|Locale Translations                |www.github.com/umpirsky/locale-list|
|JSDoc                              |www.jsdoc.app|
|Typescript                         |www.typescriptlang.org|
|Cube, Kociemba method              |github.com/torjusti/cubesolver|
|Cube, Thistlewaite method          |github.com/stringham/rubiks-solver|
|Cube, CFOP/Fridrich method         |github.com/slammayjammay/rubiks-cube-solver|