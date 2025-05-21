/**
 * @module apps/common/src/functions/common_doc
*/
/**
 * @import {server_server_response, 
 *          serverDocumentType, 
 *          serverDocumentMenu,
 *          server_db_table_App} from '../../../../server/types.js'
 */

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
    const {iamUtilMessageNotAuthorized} = await import('../../../../server/iam.js');
    const fs = await import('node:fs');
    return fs.promises.readFile(path, 'utf8')
            .then(file=>file.toString())
            .catch(error=>{
                if (fileRequest)
                    return iamUtilMessageNotAuthorized();
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
    const {serverProcess} = await import('../../../../server/server.js');
    const fs = await import('node:fs');
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
                                            .replace(serverProcess.cwd(),'')
                                            .replace('.js','')
                                            .replaceAll('\\','/')});
                }
        }
        return fileList;
    };
    return await findFiles(directory, filePattern);
};
/**
 * @name getFileFunctions
 * @description
 * @function
 * @param {{app_id:Number,
 *          file:string,
 *          module:string,
 *          comment_with_filter:string|null}} parameters
 * @returns {Promise.<string>}
 */
const getFileFunctions = async parameters =>{
    //replace variables for MODULE_APPS, MODULE_SERVICEREGISTRY and MODULE_SERVER

    //search all JSDoc comments
    const regexp_module_function = /\/\*\*([\s\S]*?)\*\//g;

    const module_functions =[];
    let match_module_function;

    // module table with variables
    const HEADER            = '|@{TYPE}         |@{FUNCTION_NAME}                       |';
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
 * @function
 * @param {string} text
 * @returns {string}
 */
const HTMLEntities = text => text
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
 * @description Renders markdown document and replaces variables:
 *              type APP
 *                  APP_NAME                App
 *                  SCREENSHOT_START        AppTranslation
 *                  DESCRIPTION             AppTranslation
 *                  REFERENCE               AppTranslation
 *                  TECHNOLOGY              AppTranslation
 *                  SECURITY                AppTranslation
 *                  PATTERN                 AppTranslation
 *                  COMPARISON              AppTranslation
 *                  SCREENSHOT_END (arrray) AppTranslation
 *              type MODULE*
 *                  MODULE_NAME
 *                  MODULE
 *                  SOURCE_LINK
 *                  SERVER_HOST             ConfigServer->SERVER->HOST
 *                  APP_CONFIGURATION       ConfigServer->METADATA->CONFIGURATION
 *                  COPYRIGHT               App
 *                  MODULE_FUNCTION replaced by all functions found in getFileFunctions()
 *              type ROUTE and template 7.restapi
 *                  CONFIG_REST_API variable is rendered directly to HTML using common_openapi.js component because of complexity
 *              type ROUTE and template 7.restapiFunctions
 *                  ROUTE_FUNCTIONS all functions with tag ROUTE_REST_API
 *              type ROUTE and template 7.appRoutes
 *                  ROUTE_FUNCTIONS with tag ROUTE_APP
 *              any file in menu of type GUIDE
 *                  GIT_REPOSITORY_URL replaces with GIT_REPOSITORY_URL parameter in ConfigServer if used in any document 
 * @function
 * @param {{app_id:number,
 *          type:serverDocumentType,
 *          doc:string,
 *          module:string,
 *          locale:string}} parameters
 * @returns {Promise.<string>}
 */
const markdownRender = async parameters =>{
    const {serverUtilNumberValue} = await import('../../../../server/server.js');
    const App = await import('../../../../server/db/App.js');
    const ConfigServer = await import('../../../../server/db/ConfigServer.js');
    const {serverProcess} = await import('../../../../server/server.js');

    switch (true){
        case parameters.type.toUpperCase()=='APP':{
            //replace variables for APP template
            const AppTranslation = await import('../../../../server/db/AppTranslation.js');
            
            const app_translation = AppTranslation.get(parameters.app_id,null, parameters.locale, 
                                                                /**@ts-ignore */
                                                                serverUtilNumberValue(parameters.doc)).result[0];
            const app = App.get({app_id:parameters.app_id, resource_id:serverUtilNumberValue(parameters.doc)}).result[0];

            let markdown = await getFile(`${serverProcess.cwd()}/apps/common/src/functions/documentation/2.app.md`);
            //remove all '\r' in '\r\n'
            markdown = markdown.replaceAll('\r\n','\n');
            //replace APP_NAME
            markdown = markdown.replaceAll('@{APP_NAME}', app.name);
            //replace SCREENSHOT_START
            markdown = markdown.replaceAll('@{SCREENSHOT_START}', app_translation?app_translation.json_data.screenshot_start:'');
            //replace DESCRIPTION
            markdown = markdown.replaceAll('@{DESCRIPTION}', app_translation?app_translation.json_data.description:'');
            //replace REFERENCE
            markdown = markdown.replaceAll('@{REFERENCE}', app_translation?app_translation.json_data.reference:'');
            //replace TECHNOLOGY
            markdown = markdown.replaceAll('@{TECHNOLOGY}', app_translation?app_translation.json_data.technology:'');
            //replace SECURITY
            markdown = markdown.replaceAll('@{SECURITY}', app_translation?app_translation.json_data.security:'');
            //replace PATTERN
            markdown = markdown.replaceAll('@{PATTERN}', app_translation?app_translation.json_data.pattern:'');
            //replace COMPARISON
            markdown = markdown.replaceAll('@{COMPARISON}', app_translation.json_data.comparison?.length==0?
                                                                '':
                                                                'Comparison' + '\n\n' + 
                                                                app_translation.json_data.comparison
                                                                .map((/**@type{[]}*/table)=>
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
            return markdown.replaceAll('@{SCREENSHOT_END}', app_translation?app_translation.json_data.screenshot_end.join('\n'):'');
        }
        case parameters.type.toUpperCase().startsWith('MODULE'):{
            //replace variables for MODULE_APPS, MODULE_SERVICEREGISTRY and MODULE_SERVER            
            const markdown = await getFile(`${serverProcess.cwd()}/apps/common/src/functions/documentation/8.module.md`)
                        .then(markdown=>
                                markdown
                                .replaceAll('@{MODULE_NAME}',       parameters.module ?? '')
                                .replaceAll('@{MODULE}',            parameters.module ??'')
                                .replaceAll('@{SOURCE_LINK}',       parameters.module ??'')
                                //metadata tags                            
                                .replaceAll('@{SERVER_HOST}',       ConfigServer.get({app_id:parameters.app_id, data:{ config_group:'SERVER', parameter:'HOST'}}).result??'')
                                .replaceAll('@{APP_CONFIGURATION}', ConfigServer.get({app_id:parameters.app_id, data:{ config_group:'METADATA', parameter:'CONFIGURATION'}}).result??'')
                                .replaceAll('@{APP_COPYRIGHT}',     App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0].copyright)
                        );
            
            //replace all found JSDoc comments with markdown formatted module functions
            return markdown.replace('@{MODULE_FUNCTION}', 
                                    await getFileFunctions({app_id:         parameters.app_id,                                                 
                                                            file:           await getFile(`${serverProcess.cwd()}${parameters.doc}.js`, true),
                                                            module:         parameters.module,
                                                            comment_with_filter:null
                                                        }));
        }
        case parameters.type.toUpperCase()=='ROUTE':{           
            if (parameters.doc=='7.restapi'){
                return await getFile(`${serverProcess.cwd()}/apps/common/src/functions/documentation/7.restapi.md`)
                            .then(markdown=>
                                    //remove all '\r' in '\r\n'
                                    markdown
                                    .replaceAll('\r\n','\n')
                                );
            }
            else{
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
                    membersof.push(await getFileFunctions({ app_id:             parameters.app_id, 
                                                            file:               await getFile(`${serverProcess.cwd()}${routePath}.js`),
                                                            module:             routePath,
                                                            comment_with_filter:`@namespace ${tag}`
                                                        }));
                    //Get all REST API functions with @memberof tag
                    for (const directory of routeDirectories)
                        for (const file of (await getFiles(`${serverProcess.cwd()}/${directory}`, filePattern)).map(row=>row.file)){
                            const file_functions = await getFileFunctions({ app_id:             parameters.app_id, 
                                                                            file:               await getFile(`${serverProcess.cwd()}${file}.js`),
                                                                            module:             file,
                                                                            comment_with_filter:`@memberof ${tag}`
                                                                        });
                            if (file_functions != '')
                                membersof.push(file_functions);
                        }
                    return await getFile(`${serverProcess.cwd()}/apps/common/src/functions/documentation/${file}.md`)
                        .then(markdown=>
                                //remove all '\r' in '\r\n'
                                markdown
                                .replaceAll('\r\n','\n')
                                .replace('@{ROUTE_FUNCTIONS}',membersof.join('\n\n'))
                            );
                };
                if (parameters.doc=='7.appRoutes')
                    return await renderRouteFuntions('ROUTE_APP', '/apps/common/src/common', ['apps'], parameters.doc);
                else
                    return await renderRouteFuntions('ROUTE_REST_API', '/server/server', ['apps', 'serviceregistry','server'], parameters.doc);
            }
        }
        case parameters.type.toUpperCase()=='GUIDE':{
            return await getFile(`${serverProcess.cwd()}/apps/common/src/functions/documentation/${parameters.doc}.md`, true)
                        .then(markdown=>markdown.replaceAll('@{GIT_REPOSITORY_URL}',ConfigServer.get({app_id:parameters.app_id, data:{ config_group:'SERVER', parameter:'GIT_REPOSITORY_URL'}}).result));
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
    const App = await import('../../../../server/db/App.js');
    const {serverProcess} = await import('../../../../server/server.js');

    /**@type{serverDocumentMenu[]} */
    const markdown_menu_docs = await getFile(`${serverProcess.cwd()}/apps/common/src/functions/documentation/menu.json`).then((/**@type{string}*/result)=>JSON.parse(result));
    for (const menu of markdown_menu_docs){
        switch (true){
            case menu.type=='APP':{
                //return menu for app with updated id and app name
                menu.menu_sub = App.get({app_id:parameters.app_id, resource_id:null}).result
                                // sort common last
                                .sort((/**@type{server_db_table_App}*/a,/**@type{server_db_table_App}*/b)=>(a.id==0&&b.id==0)?0:a.id==0?1:b.id==0?-1:a.id-b.id)
                                .map((/**@type{server_db_table_App}*/app)=>{
                    return { 
                            id:app.id,
                            menu:app.name,
                            doc:app.id.toString()
                            };
                    });
                break;
            }
            case menu.type=='ROUTE':
            case menu.type=='GUIDE':{
                //return menu with updated first title from the documents
                for (const menu_sub of menu.menu_sub??[]){
                    await getFile(`${serverProcess.cwd()}/apps/common/src/functions/documentation/${menu_sub.doc}.md`, true)
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
                menu.menu_sub = (await getFiles(`${serverProcess.cwd()}/${menu.type.substring('MODULE'.length+1).toLowerCase()}`, filePattern))
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
 *          data:{  documentType:serverDocumentType,
 *                  data_app_id:number,
 *                  doc:string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:string}>}
 */
const appFunction = async parameters =>{
    const {iamUtilMessageNotAuthorized} = await import('../../../../server/iam.js');
    const App = await import('../../../../server/db/App.js');
    const {serverUtilNumberValue} = await import('../../../../server/server.js');
    const {serverProcess} = await import('../../../../server/server.js');

    //check if valid document request
    if (
        ((parameters.data.documentType.toUpperCase()=='GUIDE' ||parameters.data.documentType.toUpperCase()=='APP') && parameters.data?.doc == null) ||
        parameters.data?.doc && (parameters.data.doc.indexOf('\\')>-1||parameters.data.doc.indexOf('..')>-1 ||parameters.data.doc.indexOf(' ')>-1)){
            return {http:400,
                code:'DOC',
                text:iamUtilMessageNotAuthorized(),
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
                return {result:await getFile(`${serverProcess.cwd()}${parameters.data.doc}.js`, true), type:'JS'};
            }
            case parameters.data.documentType=='GUIDE':
            case parameters.data.documentType=='APP' && App.get({app_id:parameters.app_id, resource_id:serverUtilNumberValue(parameters.data.doc)}).result?.length==1:
            case parameters.data.documentType=='ROUTE':
            case parameters.data.documentType.startsWith('MODULE') &&
                (parameters.data.doc.startsWith('/apps') || parameters.data.doc.startsWith('/serviceregistry')||parameters.data.doc.startsWith('/server')||parameters.data.doc.startsWith('/test')):{
                const {default:ComponentMarkdown} = await import('../component/common_markdown.js');
                const {default:ComponentOpenAPI} = await import('../component/common_openapi.js');
                const ConfigServer = await import('../../../../server/db/ConfigServer.js');
                const ConfigRestApi = await import('../../../../server/db/ConfigRestApi.js');
                //guide documents in separate files, app and modules use templates
                return {result:(await ComponentMarkdown({   data:{  markdown:await markdownRender({ app_id:parameters.app_id,
                                                                    type:parameters.data.documentType,
                                                                    doc:parameters.data.doc,
                                                                    module:parameters.data.doc,
                                                                    locale:parameters.locale})},
                                                            methods:null}))
                                        .replace(parameters.data.doc=='7.restapi'?'@{CONFIG_REST_API}':'',parameters.data.doc=='7.restapi'?
                                                await ComponentOpenAPI({data:   {  
                                                                                app_id: parameters.app_id
                                                                                },
                                                                        methods:{
                                                                                App:App,
                                                                                ConfigServer:ConfigServer,
                                                                                ConfigRestApi:ConfigRestApi,
                                                                                serverUtilNumberValue:serverUtilNumberValue
                                                                                }
                                                                        }):''),
                        type:'HTML'};
            }
            default:{
                return {http:400,
                    code:'DOC',
                    text:iamUtilMessageNotAuthorized(),
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'
                };
            }
        }
    }
};
export default appFunction;