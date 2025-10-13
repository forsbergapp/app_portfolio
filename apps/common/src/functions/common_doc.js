/**
 * @module apps/common/src/functions/common_doc
*/
/**
 * @import {server} from '../../../../server/types.js'
 */
const {server} = await import('../../../../server/server.js');
const fs = await import('node:fs');

const MD_PATH =                         '/apps/common/src/functions/documentation/';
const MD_SUFFIX =                        '.md';
const MD_TEMPLATE_APPS =                'templateApps';
const MD_TEMPLATE_RESTAPI =             'templateRestApi';
const MD_TEMPLATE_RESTAPI_FUNCTIONS =   'templateRouteFunctions';
const MD_TEMPLATE_APPROUTES =           'templateAppRoutes';
const MD_TEMPLATE_MODULE =              'templateModule';


/**
 * @name getFile
 * @description  Get file and add given suffix to path
 *               If file not found
 *                  fileRequest=false (system file):throw 500
 *                  fileRequest=true  (request file):return iamUtilMessageNotAuthorized()
 * @function
 * @param {string} path
 * @param {boolean} [fileRequest]
 * @returns {Promise.<string>}
 */
const getFile = async (path, fileRequest=false) =>{
    return fs.promises.readFile(path, 'utf8')
            .then(file=>file.toString())
            .catch(error=>{
                if (fileRequest)
                    return server.iam.iamUtilMessageNotAuthorized();
                else
                    throw error;
            });
};
/**
 * @name getFiles
 * @description Find all *.js files in given directory and its subdirectories
 * @function
 * @param {string} directory
 * @param {RegExp} filePattern
 * @returns {Promise.<{id:number, file:string}[]>}
 */
const getFiles = async (directory, filePattern) =>{
    
    /**@type{{id:number, file:string}[]}*/
    const fileList = [];
    let index =0;
    /**
     * @param {string} directory
     * @param {RegExp} pattern
     * @returns {Promise.<{id:number, file:string}[]>}
     */
    const findFiles = async (directory, pattern) =>{
        const files = await fs.promises.readdir(directory, { withFileTypes: true });
        
        for (const file of files){
            const fullPath = `${directory}/${file.name}`;
            if (file.isDirectory())
                await findFiles(fullPath, pattern);
            else 
                if (file.isFile() && file.name.match(pattern)){
                    //remove OS path info, .js suffix and replace \\ with /                
                    fileList.push({   id: ++index,
                                        file:fullPath
                                            .replace(server.ORM.serverProcess.cwd(),'')
                                            .replace('.js','')
                                            .replaceAll('\\','/')});
                }
        }
        return fileList;
    };
    return await findFiles(directory, filePattern);
};
/**
 * @name renderTablesFunctions
 * @description
 * @function
 * @param {{app_id:Number,
 *          file:string,
 *          module:string,
 *          comment_with_filter:string|null}} parameters
 * @returns {Promise.<string>}
 */
const renderTablesFunctions = async parameters =>{
    //replace variables for MODULE_APPS, MODULE_SERVICEREGISTRY and MODULE_SERVER

    //search all JSDoc comments
    const regexp_module_function = /\/\*\*([\s\S]*?)\*\//g;

    const module_functions =[];
    let match_module_function;

    // module table with variables, add keyvalue id in title to use CSS common_md_tab_key_value class
    const HEADER            = '|{#kv}@{TYPE}    |@{FUNCTION_NAME}                       |';
    const ALIGNMENT         = '|:---------------|:--------------------------------------|';
    const FUNCTION_TAG      = '|@{FUNCTION_TAG} |@{FUNCTION_TEXT}                       |';
    const SOURCE_LINE_TAG   = '|Source line     |[@{MODULE_LINE}](@{SOURCE_LINE_LINK)   |';

    const REGEXP_TAG = /@\w+/g;

    
    parameters.file = parameters.file?.replaceAll('\r\n','\n') ??'';
    while ((match_module_function = regexp_module_function.exec(parameters.file ?? '')) !==null){
        //check if supported comment types and if filter should be used
        if (commentType(match_module_function[1]) && match_module_function[1].indexOf(parameters.comment_with_filter ?? match_module_function[1])>-1){
            const function_tags = match_module_function[1].split('\n')
                    .map(row=>{
                                //reset regexp so regexp will work in loop
                                REGEXP_TAG.lastIndex = 0;
                                const tag = REGEXP_TAG.exec(row)?.[0]??'';
                                return FUNCTION_TAG
                                .replace(   '@{FUNCTION_TAG}',
                                            tag)
                                .replace(   '@{FUNCTION_TEXT}',
                                            //check if tag exists
                                            (tag!='' && row.indexOf(tag)>-1)?
                                                //return part after tag
                                                HTMLEntities(row.substring(row
                                                                .indexOf(tag)+tag.length)
                                                                .trimStart()):
                                                    //no tag, return after first '*', remove start space characters
                                                    HTMLEntities(row
                                                        .substring(row.indexOf('*')+1)));
                                })
                                //remove @name tag (with one space so @namespace remains) presented in title
                                .filter(row=>row.indexOf('@name ')<0)
                                //remove tags presented in title
                                .filter(row=>row.indexOf('@function')<0)
                                .filter(row=>row.indexOf('@constant')<0)
                                .filter(row=>row.indexOf('@class')<0)
                                .join('\n');
            //calculate source line: row match found + match row length
            const source_line = (parameters.file?parameters.file.substring(0,parameters.file.indexOf(match_module_function[1])).split('\n').length:0)  + 
                match_module_function[1].split('\n').length;

            module_functions.push(
                                    HEADER
                                        .replace('@{TYPE}',commentType(match_module_function[1])??'')
                                        .replace('@{FUNCTION_NAME}',match_module_function[1].split('\n').filter(row=>row.indexOf('@name')>-1).length>0?
                                                                    match_module_function[1]
                                                                        .split('\n')
                                                                        .filter(row=>row.indexOf('@name')>-1)
                                                                        .map(row=>  row
                                                                                    .substring( row.indexOf('@name')+'@name'.length)
                                                                                    .trimStart())[0]:'')
                                    + '\n' +
                                    ALIGNMENT+ '\n' +
                                    function_tags + '\n' +
                                    SOURCE_LINE_TAG
                                        .replace('@{MODULE_LINE}',parameters.module ??'')
                                        .replace('@{SOURCE_LINE_LINK',`${parameters.module}#line${source_line}`));
        }
    }
    //replace all found JSDoc comments with markdown formatted module functions
    return module_functions.join('\n'+'\n');
};
/**
 * @name HTMLEntities
 * @description Return supported characters as HTML Entities for tables
 *              If cr=true then also replace \n to &crarr;
 * @function
 * @param {string} text
 * @param {boolean} cr
 * @returns {string}
 */
const HTMLEntities = (text, cr=false) => text
                            .replaceAll(cr?'\n':'',cr?'&crarr;':'')
                            .replaceAll('|','&vert;')
                            .replaceAll('[','&#91;')
                            .replaceAll(']','&#93;')
                            .replaceAll('<','&lt;')
                            .replaceAll('>','&gt;')
                            .replaceAll('}}','&rbrace; &rbrace;')
                            .replaceAll('{{','&lbrace; &lbrace;');

/**
 * @name commentType
 * @description Returns type of comment or null if comment not supported
 * @function
 * @param {string} comment
 * @returns {string|null}
 */
const commentType = comment =>  comment.indexOf('@module')>-1?'Module':
                                comment.indexOf('@function')>-1?'Function':
                                comment.indexOf('@constant')>-1?'Constant':
                                comment.indexOf('@class')>-1?'Class':
                                comment.indexOf('@method')>-1?'Method':null;

/**
 * @name markdownRender
 * @description Renders markdown document and replaces template variables
 *              APP uses template MD_TEMPLATE_APPS
 *              MODULE
 *              doc==MD_TEMPLATE_RESTAPI:           openApi, uses template MD_TEMPLATE_RESTAPI
 *              doc==MD_TEMPLATE_APPROUTES:         app routes, uses template MD_TEMPLATE_APPROUTES
 *              doc==MD_TEMPLATE_RESTAPI_FUNCTIONS: openApi functions, uses template MD_TEMPLATE_RESTAPI_FUNCTIONS
 *              GUIDE returns saved markdown and replaces GIT_REPOSITORY_URL if used with parameter value GIT_REPOSITORY_URL in ConfigServer
 * @function
 * @param {{app_id:number,
 *          type:server['app']['commonDocumentMenu']['type'],
 *          doc:string,
 *          module:string,
 *          locale:string}} parameters
 * @returns {Promise.<string>}
 */
const markdownRender = async parameters =>{
    
    switch (true){
        case parameters.type.toUpperCase()=='APP':{
            //replace variables for APP template
            /**@type{server['ORM']['Object']['AppTranslation']} */
            const app_translation = server.ORM.db.AppTranslation.get(parameters.app_id,null, parameters.locale, 
                                                                server.ORM.UtilNumberValue(parameters.doc)??0).result[0];
            /**@type{server['ORM']['Object']['App']} */
            const app = server.ORM.db.App.get({app_id:parameters.app_id, resource_id:server.ORM.UtilNumberValue(parameters.doc)}).result[0];

            let markdown = await getFile(`${server.ORM.serverProcess.cwd()}${MD_PATH + MD_TEMPLATE_APPS + MD_SUFFIX}`);
            //remove all '\r' in '\r\n'
            markdown = markdown.replaceAll('\r\n','\n');
            //replace APP_NAME
            markdown = markdown.replaceAll('@{APP_NAME}', app.Name);
            //replace SCREENSHOT_START
            markdown = markdown.replaceAll('@{SCREENSHOT_START}', app_translation.Document?app_translation.Document.ScreenshotStart:'');
            //replace DESCRIPTION
            markdown = markdown.replaceAll('@{DESCRIPTION}', app_translation.Document?app_translation.Document.Description:'');
            //replace REFERENCE
            markdown = markdown.replaceAll('@{REFERENCE}', app_translation.Document?app_translation.Document.Reference:'');
            //replace TECHNOLOGY
            markdown = markdown.replaceAll('@{TECHNOLOGY}', app_translation.Document?app_translation.Document.Technology:'');
            //replace SECURITY
            markdown = markdown.replaceAll('@{SECURITY}', app_translation.Document?app_translation.Document.Security:'');
            //replace PATTERN
            markdown = markdown.replaceAll('@{PATTERN}', app_translation.Document?app_translation.Document.Pattern:'');
            //replace COMPARISON
            markdown = markdown.replaceAll('@{COMPARISON}', app_translation.Document?.Comparison?.length==0?
                                                                '':
                                                                '**Comparison**' + '\n\n' + 
                                                                (app_translation.Document?.Comparison??[])
                                                                .map((/**@type{[string,string][]}*/table)=>
                                                                        table.map((row, index)=>
                                                                                index==0?
                                                                                ('|' + row[0] + '|' + row[1] + '|'+'\n' +
                                                                                '|:-------------|:-------------|' + '\n'):
                                                                                ('|' + row[0] + '|' + row[1] + '|'+'\n')
                                                                                ).join('')
                                                                    ).join('\n')
                                            );
            //replace SCREENSHOT_END
            //images are saved in an array
            return markdown.replaceAll('@{SCREENSHOT_END}', app_translation.Document?app_translation.Document.ScreenshotEnd.join('\n'):'');
        }
        case parameters.type.toUpperCase().startsWith('MODULE'):{
            //replace variables for MODULE_APPS, MODULE_SERVICEREGISTRY and MODULE_SERVER            
            const markdown = await getFile(`${server.ORM.serverProcess.cwd()}${MD_PATH + MD_TEMPLATE_MODULE + MD_SUFFIX}`)
                        .then(markdown=>
                                markdown
                                .replaceAll('@{MODULE_NAME}',       parameters.module ?? '')
                                .replaceAll('@{MODULE}',            parameters.module ??'')
                                .replaceAll('@{SOURCE_LINK}',       parameters.module ??'')
                                //metadata tags                            
                                .replaceAll('@{SERVER_HOST}',       server.ORM.db.ConfigServer.get({app_id:parameters.app_id, data:{ config_group:'SERVER', parameter:'HOST'}}).result??'')
                                .replaceAll('@{APP_CONFIGURATION}', server.ORM.db.ConfigServer.get({app_id:parameters.app_id, data:{ config_group:'METADATA', parameter:'CONFIGURATION'}}).result??'')
                                .replaceAll('@{APP_COPYRIGHT}',     server.ORM.db.App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].Copyright)
                        );
            
            //replace all found JSDoc comments with markdown formatted module functions
            return markdown.replace('@{MODULE_FUNCTION}', 
                                    await renderTablesFunctions({app_id:         parameters.app_id,                                                 
                                                            file:           await getFile(`${server.ORM.serverProcess.cwd()}${parameters.doc}.js`, true),
                                                            module:         parameters.module,
                                                            comment_with_filter:null
                                                        }));
        }
        case parameters.doc==MD_TEMPLATE_RESTAPI:{
            const roleOrder = ['app_id', 'app', 'app_access', 'app_access_verification', 'admin', 'app_external', 'app_access_external', 'iam', 'iam_signup', 'microservice', 'microservice_auth'];
            /**
             * Sort paths by defined role order
             * @param {*[]} paths
             * @returns []
             */
            const sortByRole = paths => paths.sort((a,b) => roleOrder.indexOf(a[0].split('/')[2]) - roleOrder.indexOf(b[0].split('/')[2]));

            /**
             * @description Renders OpenApi documentation
             *              Renders tables:
             *                  info
             *                  servers
             *                  paths
             *                  components
             * @param {{openApi:server['ORM']['Object']['ConfigRestApi']}} parameters
             * @returns 
             */
            const openApiMarkdown = parameters =>{

                        //Table 
                        //info, add keyvalue id in title to use CSS common_md_tab_key_value class
                return `|{#kv}OpenApi||\n`+
                        '|:---|:---|\n' +
                        `|**${Object.entries(parameters.openApi)[0][0]}**||\n`+
                        `|${Object.keys(Object.entries(parameters.openApi)[0][1])[0]}|${Object.values(Object.entries(parameters.openApi)[0][1])[0]}|\n` +
                        `|${Object.keys(Object.entries(parameters.openApi)[0][1])[1]}|${Object.values(Object.entries(parameters.openApi)[0][1])[1]}|\n` +
                        `|${Object.keys(Object.entries(parameters.openApi)[0][1])[2]}|${Object.values(Object.entries(parameters.openApi)[0][1])[2]}|\n` +
                        //servers
                        `|**${Object.entries(parameters.openApi)[1][0]}**||\n` +
                        `${Object.entries(parameters.openApi.servers).map(key => 
                            `|${Object.keys(key[1])[0]}|${Object.values(key[1])[0]}|\n`
                        ).join('')}\n` + 
                        //Table Paths 
                        //contains table for each path
                        `|{#kv}${Object.entries(parameters.openApi)[2][0]}||\n` +
                        '|:---|:---|\n\n' +
                        `${sortByRole(Object.entries(parameters.openApi.paths).sort((a,b)=>a[0]>b[0]?1:-1)).map((/**@type{*}*/path) =>
                            `${Object.entries(path[1]).map(method => 
                                //Table path
                                `|{#kv}${method[0].toUpperCase()}|${path[0]}|\n` +
                                '|:---|:---|\n' + 
                                `|**Summary**|${HTMLEntities(method[1].summary,true)}|\n` +
                                `|**operationId**|${method[1].operationId}|\n` +
                                `|**Parameters**||\n` +
                                `${method[1].parameters.map((/**@type{*}*/param) =>
                                    `|${param['$ref']?
                                            'ref$':
                                            param['name']?param.name:Object.keys(param)[0]}|${Object.keys(param)[0].startsWith('server')?
                                                                                                Object.values(param)[0]:
                                                                                                    `${HTMLEntities(JSON.stringify(param, undefined,2),true)}`}|\n`
                                ).join('')
                                }`+
                                `${method[1]?.requestBody?
                                    `|**Request body**||\n`+
                                    `|Description|${HTMLEntities(method[1]?.requestBody.description, true)}|\n`+
                                    `|Required|${method[1]?.requestBody.required}|\n`+
                                    `|Content|${HTMLEntities(JSON.stringify(method[1]?.requestBody.content, undefined,2),true)}|\n`
                                    :''
                                }` +
                                '|**Responses**||\n' +
                                `${Object.entries(method[1].responses).length>0?
                                        Object.entries(method[1].responses).map(([status, response]) =>
                                            `|${status}|${HTMLEntities(JSON.stringify(response, undefined,2),true)}|\n`
                                        ).join(''):
                                        '\n'
                                }\n`
                            ).join('')}\n`
                        ).join('')}\n` +
                        //Table components
                        `|{#kv}${Object.entries(parameters.openApi)[3][0]}||\n` +
                         '|:---|:---|\n' +
                         `${Object.entries(parameters.openApi.components).map(key => 
                             `|${key[0]}|${HTMLEntities(JSON.stringify(key[1], undefined,2),true)}|\n`
                          ).join('')}\n`;
            }
            const renderOpenApi = async () => {
                /**
                 * Return description tag for given operationId
                 * @param{string} operationId
                 * @returns {Promise.<{summary:string, response:string}>}
                 */
                const getJsDocMetadata = async operationId =>{
                        //read operationId what file to import and what function to execute
                        //syntax: [path].[filename].[functioname] or [path]_[path].[filename].[functioname]
                        const filePath = '/' + operationId.split('.')[0].replaceAll('_','/') + '/' +
                                            operationId.split('.')[1] + '.js';
                        const functionRESTAPI = operationId.split('.')[2];
                        const file = await fs.promises.readFile(`${server.ORM.serverProcess.cwd()}${filePath}`, 'utf8').then(file=>file.toString().replaceAll('\r\n','\n'))
                                            .catch(()=>null);
                        const regexp_module_function = /\/\*\*([\s\S]*?)\*\//g;
                        let match;
                        while ((match = regexp_module_function.exec(file ?? '')) !==null){
                            if ((match[1].indexOf(`@name ${functionRESTAPI}\n`)>-1 || match[1].indexOf(`@name ${functionRESTAPI} `)>-1) &&
                                match[1].indexOf('@function')>-1 &&
                                match[1].indexOf('@memberof ROUTE_REST_API')>-1)
                                return {summary:
                                            `***${match[1]
                                                .split('@')
                                                .filter(tag=>tag.startsWith('description'))[0]?.substring('description'.length)
                                                                                                .trimStart()
                                                                                                .split('\n')
                                                                                                .map(row=>row.trimStart()[0]=='*'?row.trimStart().substring(2).trimStart():row.trimStart())
                                                                                                .join('\n')
                                                }***`,
                                        response:
                                            `***${match[1]
                                                .split('@')
                                                .filter(tag=>tag.startsWith('returns'))[0]?.substring('returns'.length)
                                                .trimStart()
                                                .split('\n')
                                                .map(row=>
                                                    `${(row.trimStart()[0]=='*'?row.trimStart().substring(2).trimStart():row.trimStart())
                                                        .replaceAll('|','&vert;')
                                                        .replaceAll('[','&#91;')
                                                        .replaceAll(']','&#93;')
                                                        .replaceAll('<','&lt;')
                                                        .replaceAll('>','&gt;')
                                                        }`
                                                )
                                                .join('')
                                                }***`
                                        };
                        }
                        return {summary:'', response:''};
                };

                /**@type{server['ORM']['Object']['ConfigServer']['SERVER']} */
                const configServer = server.ORM.db.ConfigServer.get({app_id:parameters.app_id,data:{ config_group:'SERVER'}}).result;

                const HOST = configServer.filter(parameter=> 'HOST' in parameter)[0].HOST;
                const PORT = server.ORM.UtilNumberValue(configServer.filter(parameter=> 'HTTP_PORT' in parameter)[0].HTTP_PORT);
                const PORT_ADMIN = server.ORM.UtilNumberValue(configServer.filter(parameter=> 'HTTP_PORT_ADMIN' in parameter)[0].HTTP_PORT_ADMIN);
                
                        
                /**@type{server['ORM']['Object']['ConfigRestApi']} */
                const CONFIG_REST_API = server.ORM.db.ConfigRestApi.get({app_id:parameters.app_id}).result;
                //return object with 'servers key modified with list from configuration
                                            
                CONFIG_REST_API.servers = [
                                            {
                                            url:'http://' + HOST + ((PORT==80||PORT==443)?'':`/:${PORT}`)
                                            },
                                            {
                                                url:'http://' + HOST + ((PORT_ADMIN==80||PORT_ADMIN==443)?'':`/:${PORT_ADMIN}`)
                                            },
                                            ];
                for (const path of Object.entries(CONFIG_REST_API.paths))
                    for (const method of Object.entries(path[1])){
                        const JSDocResult = await getJsDocMetadata(method[1].operationId);
                        //Update summary with @description tag
                        method[1].summary = JSDocResult.summary;
                        //All paths starts with oneOf key followed by allOf key except SSE path
                        if (method[1].responses.oneOf)
                            //Update rows and properties with @returns tag
                            /**@ts-ignore */
                            for (const elementallOf of method[1].responses.oneOf.filter((/**@type{*}*/row)=>'allOf' in row)[0].allOf){
                                if (Object.keys(elementallOf)[0]=='oneOf' || Object.keys(elementallOf)[0]=='allOf' ){
                                    for (const elementArray of elementallOf[Object.keys(elementallOf)[0]]){
                                        if (Object.keys(elementArray)[0]=='oneOf' || Object.keys(elementArray)[0]=='allOf' ){
                                            for (const elementArraySub of elementArray[Object.keys(elementArray)[0]]){
                                                if ('properties' in elementArraySub || 'rows' in elementArraySub){
                                                    if ('properties' in elementArraySub)
                                                        elementArraySub.properties = JSDocResult.response;
                                                    if ('rows' in elementArraySub)
                                                        elementArraySub.rows = JSDocResult.response;
                                                }           
                                            }
                                        }
                                        else
                                            if ('properties' in elementArray || 'rows' in elementArray){
                                                if ('properties' in elementArray)
                                                    elementArray.properties = JSDocResult.response;
                                                if ('rows' in elementArray)
                                                    elementArray.rows = JSDocResult.response;
                                            } 
                                    }
                                }
                                else
                                    if ('properties' in elementallOf || 'rows' in elementallOf){
                                        if ('properties' in elementallOf)
                                            elementallOf.properties = JSDocResult.response;
                                        if ('rows' in elementallOf)
                                            elementallOf.rows = JSDocResult.response;
                                    }
                            }    
                    }
                    try {
                        return openApiMarkdown({openApi:CONFIG_REST_API});        
                    } catch (error) {
                        return '';
                    }
            };
            const openApi = await renderOpenApi();
            return await getFile(`${server.ORM.serverProcess.cwd()}${MD_PATH + MD_TEMPLATE_RESTAPI + MD_SUFFIX}`)
                            .then(markdown=>
                                    //remove all '\r' in '\r\n'
                                    markdown
                                    .replaceAll('\r\n','\n')
                                    .replace('@{CONFIG_REST_API}',openApi)
                                );
        }
        case parameters.doc==MD_TEMPLATE_APPROUTES:
        case parameters.doc==MD_TEMPLATE_RESTAPI_FUNCTIONS:{
            /**
             * @param {string} tag
             * @param {string} routePath
             * @param {string[]} routeDirectories
             * @param {string} file
             */
            const renderRouteFuntions = async (tag, routePath, routeDirectories, file) =>{
                const filePattern = /\.js$/;
                /**@type{string[]} */
                const membersof = [];
                //Get REST API function with @namespace tag
                membersof.push(await renderTablesFunctions({ app_id:             parameters.app_id, 
                                                        file:               await getFile(`${server.ORM.serverProcess.cwd()}${routePath}.js`),
                                                        module:             routePath,
                                                        comment_with_filter:`@namespace ${tag}`
                                                    }));
                //Get all REST API functions with @memberof tag
                for (const directory of routeDirectories)
                    for (const file of (await getFiles(`${server.ORM.serverProcess.cwd()}/${directory}`, filePattern)).map(row=>row.file)){
                        const file_functions = await renderTablesFunctions({ app_id:             parameters.app_id, 
                                                                        file:               await getFile(`${server.ORM.serverProcess.cwd()}${file}.js`),
                                                                        module:             file,
                                                                        comment_with_filter:`@memberof ${tag}`
                                                                    });
                        if (file_functions != '')
                            membersof.push(file_functions);
                    }
                return await getFile(`${server.ORM.serverProcess.cwd()}${MD_PATH + file + MD_SUFFIX}`)
                    .then(markdown=>
                            //remove all '\r' in '\r\n'
                            markdown
                            .replaceAll('\r\n','\n')
                            .replace('@{ROUTE_FUNCTIONS}',membersof.join('\n\n'))
                        );
            };
            if (parameters.doc==MD_TEMPLATE_APPROUTES)
                return await renderRouteFuntions('ROUTE_APP', '/server/bff', ['apps'], parameters.doc);
            else
                return await renderRouteFuntions('ROUTE_REST_API', '/server/server', ['apps', 'serviceregistry','server'], parameters.doc);
        }
        case parameters.type.toUpperCase()=='GUIDE':{
            return await getFile(`${server.ORM.serverProcess.cwd()}${MD_PATH + parameters.doc + MD_SUFFIX}`, true)
                        .then(markdown=>markdown.replaceAll('@{GIT_REPOSITORY_URL}',server.ORM.db.ConfigServer.get({app_id:parameters.app_id, data:{ config_group:'SERVER', parameter:'GIT_REPOSITORY_URL'}}).result));
        }
        default:{
            return '';
        }
    }
};
/**
 * @name menuRender
 * @description Renders the menu with APP, ROUTE, GUIDE and MODULE menu items
 * @function
 * @param {{app_id:number}} parameters
 * @returns {Promise.<string>}
 */
const menuRender = async parameters =>{

    /**@type{server['app']['commonDocumentMenu'][]} */
    const markdown_menu_docs = await getFile(`${server.ORM.serverProcess.cwd()}${MD_PATH}menu.json`).then((/**@type{string}*/result)=>JSON.parse(result));
    for (const menu of markdown_menu_docs){
        switch (true){
            case menu.type=='APP':{
                //return menu for app with updated id and app name
                menu.menu_sub = server.ORM.db.App.get({app_id:parameters.app_id, resource_id:null}).result
                                // sort common last
                                .sort((/**@type{server['ORM']['Object']['App']}*/a,/**@type{server['ORM']['Object']['App']}*/b)=>(a.Id==0&&b.Id==0)?0:a.Id==0?1:b.Id==0?-1:(a.Id??0)-(b.Id??0))
                                .map((/**@type{server['ORM']['Object']['App']}*/app)=>{
                    return { 
                            id:app.Id,
                            menu:app.Name,
                            doc:app.Id?.toString()
                            };
                    });
                break;
            }
            case menu.type=='GUIDE':{
                //return menu with updated first title from the documents
                for (const menu_sub of menu.menu_sub??[]){
                    await getFile(`${server.ORM.serverProcess.cwd()}${MD_PATH + menu_sub.doc + MD_SUFFIX}`, true)
                            .then(result=>{
                                try {
                                    menu_sub.menu =  result.replaceAll('\r\n', '\n').split('\n').filter(row=>row.indexOf('#')==0)[0].split('#')[1];
                                } catch (error) {
                                    menu_sub.menu = '';
                                }
                            })
                            .catch(()=>menu_sub.menu = '');
                }
                break;
            }
            case menu.type.startsWith('MODULE'):{
                //return all *.js files in /apps, /serviceregistry and /server directories
                const filePattern = /\.js$/;
                menu.menu_sub = (await getFiles(`${server.ORM.serverProcess.cwd()}/${menu.type.substring('MODULE'.length+1).toLowerCase()}`, filePattern))
                                .map(row=>{return {id:row.id, menu:row.file, doc:row.file};});
            }
        }
    }
    return JSON.stringify(markdown_menu_docs);
};
/**
 * @name appFunction
 * @description Get documentation menu, guide, app, routes, module or module code
 *              Returns different depending document type:
 *              MODULE_CODE         JS   - javascript source file
 *				MENU                JSON - renders menu with scanned files and apps from configuration
 *              MODULE_APPS         HTML - markdown converted with documentation of a file in /apps
 *              MODULE_SERVICEREGISTRY HTML - markdown converted with documentation of a file in /serviceregistry
 *              MODULE_SERVER       HTML - markdown converted with documentation of a file in /server
 *              MODULE_TEST         HTML - markdown converted with documentation of a file in /test
 *				GUIDE               HTML - markdown converted
 *              APP                 HTML - markdown converted, renders content from configuration
 *              ROUTE_APP           HTML - markdown converted, renders content scanning files
 *              ROUTE_REST_API      HTML - markdown converted, renders content scanning files
 * @function
 * @param {{app_id:number,
 *          data:{  documentType:server['app']['commonDocumentMenu']['type'],
 *                  data_app_id:number,
 *                  doc:string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:string}>}
 */
const appFunction = async parameters =>{
    //check if valid document request
    if (
        ((parameters.data.documentType.toUpperCase()=='GUIDE' ||parameters.data.documentType.toUpperCase()=='APP') && parameters.data?.doc == null) ||
        parameters.data?.doc && (parameters.data.doc.indexOf('\\')>-1||parameters.data.doc.indexOf('..')>-1 ||parameters.data.doc.indexOf(' ')>-1)){
            return {http:400,
                code:'DOC',
                text:server.iam.iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
    }
    else{
        switch (true){
            case parameters.data.documentType=='MENU':{
                return {result:await menuRender({app_id:parameters.app_id}), type:'JSON'};
            }
            case parameters.data.documentType=='MODULE_CODE' && 
            (parameters.data.doc.startsWith('/apps') || parameters.data.doc.startsWith('/serviceregistry')||parameters.data.doc.startsWith('/server')||parameters.data.doc.startsWith('/test')):{
                return {result:await getFile(`${server.ORM.serverProcess.cwd()}${parameters.data.doc}.js`, true), type:'HTML'};
            }
            case parameters.data.documentType=='GUIDE':
            case parameters.data.documentType=='APP' && server.ORM.db.App.get({app_id:parameters.app_id, resource_id:server.ORM.UtilNumberValue(parameters.data.doc)}).result?.length==1:
            case parameters.data.documentType.startsWith('MODULE') &&
                (parameters.data.doc.startsWith('/apps') || parameters.data.doc.startsWith('/serviceregistry')||parameters.data.doc.startsWith('/server')||parameters.data.doc.startsWith('/test')):{
                //guide documents in separate files, app and modules use templates
                return {result:await markdownRender({   app_id:parameters.app_id,
                                                        type:parameters.data.documentType,
                                                        doc:parameters.data.doc,
                                                        module:parameters.data.doc,
                                                        locale:parameters.locale}),
                        type:'HTML'};
            }
            default:{
                return {http:400,
                    code:'DOC',
                    text:server.iam.iamUtilMessageNotAuthorized(),
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'
                };
            }
        }
    }
};
export default appFunction;