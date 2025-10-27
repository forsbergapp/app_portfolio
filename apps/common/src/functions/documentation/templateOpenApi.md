# OpenApi

OpenApi is used as both documentation and for management of configuration of App Portfolio and uses JSON syntax.
The documentation follows single source of truth pattern and is integrated with JSDoc where all comments are saved using @description tag for summary and @returns tag for responses in the rows and properties keys and these JSDoc tags are displayed with green text. 

## Security

OpenApi follows OWASP guidelines for security and uses IAM pattern that includes 

- encrypting transport for all requests
- role based REST API
- IAM pattern to authenticate REST API resources

## ISO20022

ISO2022 REST API pattern is implemented. See ISO20022 specification how pagination, list response, error response, field limits, single or multi resource work.
Objects in ORM use PascalCase naming standard. In REST API they use lowercase naming standard to follow ISO20022.
Record limit is controlled by server using document ConfigServer, SERVICE_APP and APP_LIMIT_RECORD parameter.
Pagination can be used in any path that can return one or many records. Records are returned in rows key.


## OpenApi REST API URI implementation

[protocol]://[domain]/[Backend For Frontend (BFF)]/[role authorization]/version/[resource collection/service]/[resource]/[optional resource id]?[URI query]

All REST API paths can only be accessed from an app with dynamic ID token created for the specific app instance in the browser.

All REST API paths use Backend For Frontend (BFF) pattern and are grouped by role

All REST API all called from Frontend For Backend (FFB) sending query and body in base64 format and decoded in server by Backend For Frontend (BFF). Body is sent using format `{data:Object.&ltstring,*&gt}` converted to string and base64 format. Query is sent using parameters=base64 string. Body body and query formats managed by FFB and BFF.

All REST API use same request url with uuid and method. 

All REST API send data in body with route info including query, method and header.

|Role                       |Comment                                                     |
|:--------------------------|:-----------------------------------------------------------|
|app_id                     |Authorized without begin logged in                          |
|app                        |Same as app_id but used for app assets                      |
|app_access                 |Authorized when a user is logged in                         |
|app_access_verification    |Authorized when a user is logged in for verification access |
|admin                      |Authorized when admin is logged in                          |
|app_external               |Authorized for external url and sending encrypted messages  |
|app_access_external        |Authorized for external url and sending encrypted messages using external authorization |
|iam                        |Authenticates user login in IAM of both type USER and ADMIN, checks if login is enabled for users |
|iam_signup                 |Same as app_id and checks if signup is enabled              |
|microservice               |Authorized when microservice is in use using encrypted messages to get access to service registry, IAM and message queue |
|microservice_auth          |Authenticates microservices using encrypted messages         |


@{OPENAPI}