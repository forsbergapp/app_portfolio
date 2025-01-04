/**
 * @module apps/common/src/functions/common_doc
*/
/**
 * @import { server_db_file_config_rest_api, server_server_res, serverDocumentType, serverDocumentMenu} from '../../../../server/types.js'
 */

/**
 *  Get file and add given suffix to path
 * @param {string} path
 * @param {server_server_res} res
 * @returns {Promise.<string>}
 */
const getFile = async (path, res) =>{
    /**@type{import('../../../../server/iam.service.js')} */
    const {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.service.js`);
    const fs = await import('node:fs');
    return fs.promises.readFile(path, 'utf8')
            .then(file=>file.toString())
            .catch(()=>{
                res.statusCode = 400;
                throw iamUtilMesssageNotAuthorized();
            });
};
/**
 * @name markdownRender
 * @description Renders markdown document from template APP
 * @function
 * @param {{app_id:number,
 *          type:serverDocumentType,
 *          doc:string,
 *          module:string,
 *          locale:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<string>}
 */
const markdownRender = async parameters =>{
    /**@type{import('../../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
    /**@type{import('../../../../server/db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    /**@type{import('../../../../server/db/fileModelApp.js')} */
    const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);
            
    /**
    * Return supported characters as HTML Entities for tables
    * @param {string} text
    * @returns {string}
    */
    const HTMLEntities = text => text
                                .replaceAll('|','&vert;')
                                .replaceAll('[','&#91;')
                                .replaceAll(']','&#93;')
                                .replaceAll('<','&lt;')
                                .replaceAll('>','&gt;');
    /**
    * Returns type of comment or null if comment not supported
    * @param {string} comment
    * @returns {string|null}
    */
    const commentType = comment =>  comment.indexOf('@module')>-1?'Module':
                                    comment.indexOf('@function')>-1?'Function':
                                    comment.indexOf('@constant')>-1?'Constant':
                                    comment.indexOf('@class')>-1?'Class':
                                    comment.indexOf('@method')>-1?'Method':null;

    switch (true){
        case parameters.type.toUpperCase()=='APP':{
            //replace variables for APP template
            /**@type{import('../../../../server/db/fileModelAppTranslation.js')} */
            const fileModelAppTranslation = await import(`file://${process.cwd()}/server/db/fileModelAppTranslation.js`);
            
            const app_translation = fileModelAppTranslation.get(parameters.app_id,null, parameters.locale, 
                                                                /**@ts-ignore */
                                                                serverUtilNumberValue(parameters.doc), null)[0];
            const app = fileModelApp.get({app_id:parameters.app_id, resource_id:serverUtilNumberValue(parameters.doc), res:null})[0];

            let markdown = await getFile(`${process.cwd()}/apps/common/src/functions/documentation/2.app.md`, parameters.res);
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
            //replace SOLUTION
            markdown = markdown.replaceAll('@{SOLUTION}', app_translation?app_translation.json_data.solution:'');
            //replace SCREENSHOT_END
            //images are saved in an array
            return markdown.replaceAll('@{SCREENSHOT_END}', app_translation?app_translation.json_data.screenshot_end.join('\n'):'');
        }
        case parameters.type.toUpperCase().startsWith('MODULE'):{
            //replace variables for MODULE_APPS, MODULE_MICRSOERVICE and MODULE_SERVER
            /**@type{import('../../../../server/db/fileModelAppParameter.js')} */
            const fileModelAppParameter = await import(`file://${process.cwd()}/server/db/fileModelAppParameter.js`);
            let markdown = await getFile(`${process.cwd()}/apps/common/src/functions/documentation/7.module.md`, parameters.res);
            markdown = markdown.replaceAll('@{MODULE_NAME}', parameters.module ?? '');
            markdown = markdown.replaceAll('@{MODULE}',parameters.module ??'');
            markdown = markdown.replaceAll('@{SOURCE_LINK}',parameters.module ??'');

            //metadata tags                            
            markdown = markdown.replaceAll('@{SERVER_HOST}',        fileModelConfig.get('CONFIG_SERVER', 'SERVER', 'HOST')??'');
            markdown = markdown.replaceAll('@{APP_CONFIGURATION}',  fileModelConfig.get('CONFIG_SERVER', 'METADATA', 'CONFIGURATION')??'');
            markdown = markdown.replaceAll('@{APP_COPYRIGHT}',      fileModelAppParameter.get({app_id:parameters.app_id, res:null})[0].app_copyright.value??'');

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

            let code = await getFile(`${process.cwd()}${parameters.doc}.js`, parameters.res);
            code = code?.replaceAll('\r\n','\n') ??'';
            while ((match_module_function = regexp_module_function.exec(code ?? '')) !==null){
                if (commentType(match_module_function[1])){
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
                                        //remove @name tag presented in title
                                        .filter(row=>row.indexOf('@name')<0)
                                        //remove tags presented in title
                                        .filter(row=>row.indexOf('@function')<0)
                                        .filter(row=>row.indexOf('@constant')<0)
                                        .filter(row=>row.indexOf('@class')<0)
                                        .join('\n');
                    //calculate source line: row match found + match row length
                    const source_line = (code?code.substring(0,code.indexOf(match_module_function[1])).split('\n').length:0)  + 
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
            return markdown.replace('@{MODULE_FUNCTION}', module_functions.join('\n'+'\n'));
        }
        case parameters.type.toUpperCase()=='REST_API':{
            const CONFIG_REST_API = fileModelConfig.get('CONFIG_REST_API');
            /**@type{server_db_file_config_rest_api} */
            
            /**
             * @param {'info'|'servers'|'paths'|'components'} type
             * @param {boolean} details
             */
            const tableRender = (type,details) =>{
                // module table with variables
                const HEADER            = '|@{TITLE}        |                                       |';
                const ALIGNMENT         = '|:---------------|:--------------------------------------|';
                const ROW               = '|@{KEY}          |@{VALUE}                               |';
                switch (type.toUpperCase()){
                    case 'SERVERS':{

                                const HTTPS_ENABLE = fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_ENABLE');
                                const HOST = fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST');
                                const PORT = serverUtilNumberValue(HTTPS_ENABLE=='1'?
                                                fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_PORT'):
                                                    fileModelConfig.get('CONFIG_SERVER','SERVER','HTTP_PORT'));
                        return  HEADER.replace('@{TITLE}',type) + '\n' +
                                ALIGNMENT + '\n' +
                                ROW.replace( ROW,
                                            fileModelApp.get({app_id:parameters.app_id, resource_id:null, res:null})
                                            .map(row=>{
                                                return ROW
                                                        /**@ts-ignore*/
                                                        .replace('@{KEY}','url')
                                                        /**@ts-ignore*/
                                                        .replace('@{VALUE}',(HTTPS_ENABLE? 'https://':'http://') + 
                                                                                            row.subdomain + '.' +
                                                                                            HOST +
                                                                                            ((PORT==80||PORT==443)?'':`/:${PORT}`));
                                            }).join('\n'));
                    }
                    case 'PATHS':{
                        const roleOrder = ['app_id', 'app_id_signup', 'app', 'app_access', 'admin', 'app_external', 'iam_user', 'iam_provider', 'iam_admin', 'socket'];
                        /**
                         * Sort paths by defined role order
                         * @param {*[]} paths
                         */
                        const sortByRole = paths => paths.sort((a,b) => roleOrder.indexOf(a[0].split('/')[2]) - roleOrder.indexOf(b[0].split('/')[2]));
                        return  HEADER.replace('@{TITLE}',type) + '\n' +
                                ALIGNMENT + '\n' +
                                ROW.replace( ROW,
                                sortByRole(Object.entries(CONFIG_REST_API[type]))
                                            .map(row=>{
                                                if (details)
                                                    return Object.keys(row[1]).map(method=>(ROW
                                                                                            .replace('@{KEY}',method.toUpperCase())
                                                                                            .replace('@{VALUE}',row[0])
                                                                                            + '\n') +
                                                                                            ROW
                                                                                            .replace('@{KEY}','')
                                                                                            .replace('@{VALUE}',JSON.stringify(row[1][method]))).join('\n');
                                                else{
                                                    return Object.keys(row[1]).map(method=>ROW
                                                                                            .replace('@{KEY}',method.toUpperCase())
                                                                                            .replace('@{VALUE}',row[0])).join('\n');
                                                }
                                            }).join('\n'));
                    }
                    default:{
                        return  HEADER.replace('@{TITLE}',type) + '\n' +
                                ALIGNMENT + '\n' +
                                ROW.replace( ROW,
                                Object.entries(CONFIG_REST_API[type])
                                            .map(row=>{
                                                return ROW
                                                        .replace('@{KEY}',row[0])
                                                        .replace('@{VALUE}',JSON.stringify(row[1]));
                                            }).join('\n'));
                    }
                }
            };            
            let markdown = await getFile(`${process.cwd()}/apps/common/src/functions/documentation/6.restapi.md`, parameters.res);
            //remove all '\r' in '\r\n'
            markdown = markdown.replaceAll('\r\n','\n');
            const details = false;
            //replace with info in config_rest_api.json

            markdown = markdown
                        .replace('@{CONFIG_REST_API}', 
                                    (tableRender('info',details) + '\n\n') + 
                                    (tableRender('servers', details) + '\n\n') + 
                                    (tableRender('paths', details) + '\n\n') +
                                    (details?(tableRender('components',details) + '\n\n'):''));
            
            return markdown;
        }
        default:{
            return '';
        }
    }
};
/**
 * @param {{app_id:number,
 *          res:server_server_res}} parameters
 * @returns {Promise.<string>}
 */
const menuRender = async parameters =>{
    /**@type{import('../../../../server/db/fileModelApp.js')} */
    const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);

    /**@type{serverDocumentMenu[]} */
    const markdown_menu_docs = await getFile(`${process.cwd()}/apps/common/src/functions/documentation/menu.json`, parameters.res).then((/**@type{string}*/result)=>JSON.parse(result));
    for (const menu of markdown_menu_docs){
        switch (true){
            case menu.type=='APP':{
                //return menu for app with updated id and app name
                menu.menu_sub = fileModelApp.get({app_id:parameters.app_id, resource_id:null, res:null}).map(app=>{
                    return { 
                            id:app.id,
                            menu:app.name,
                            doc:app.id.toString()
                            };
                    });
                break;
            }
            case menu.type=='REST_API':
            case menu.type=='GUIDE':{
                //return menu with updated first title from the documents
                for (const menu_sub of menu.menu_sub??[]){
                    await getFile(`${process.cwd()}/apps/common/src/functions/documentation/${menu_sub.doc}.md`, parameters.res)
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
                //return all *.js files in /apps, /microservices and /server directories
                //remove OS path info, .js suffix and replace \\ with /
                const fs = await import('node:fs');
                const path = await import('node:path');
                /**@type{serverDocumentMenu['menu_sub']} */
                const jsdoc_menu = [];
                const filePattern = /\.js$/;
                let index =0;
                /**
                 * @param {string} directory
                 * @param {RegExp} pattern
                 */
                const findFiles = async (directory, pattern) =>{
                    const files = await fs.promises.readdir(directory, { withFileTypes: true });
                    
                    for (const file of files){
                        const fullPath = path.join(directory, file.name);
                        if (file.isDirectory())
                            await findFiles(fullPath, pattern);
                        else 
                            if (file.isFile() && file.name.match(pattern)){
                                
                                jsdoc_menu.push({id: ++index,
                                                    menu:fullPath
                                                        .replace(process.cwd(),'')
                                                        .replace('.js','')
                                                        .replaceAll('\\','/'),
                                                    doc:fullPath
                                                        .replace(process.cwd(),'')
                                                        .replace('.js','')
                                                        .replaceAll('\\','/')});
                            }

                    }
                };
                await findFiles(`${process.cwd()}/${menu.type.substring('MODULE'.length+1).toLowerCase()}`, filePattern);
                menu.menu_sub = jsdoc_menu;
            }
        }
    }
    return JSON.stringify(markdown_menu_docs);
};
/**
 * @name appFunction
 * @description Get documentation menu, guide, app, module or jsdoc documentation
 * @function
 * @param {number} app_id
 * @param {{    type:serverDocumentType,
 *              data_app_id:number,
 *              doc:string}} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {server_server_res} res
 * @returns {Promise.<[string]>}
 */
const appFunction = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/iam.service.js')} */
    const {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.service.js`);
    
    //check if valid document request
    if (
        ((data.type.toUpperCase()=='GUIDE' ||data.type.toUpperCase()=='APP'||data.type.toUpperCase()=='JSDOC') && data?.doc == null) ||
        data?.doc && (data.doc.indexOf('\\')>-1||data.doc.indexOf('..')>-1 ||data.doc.indexOf(' ')>-1)){
        res.statusCode = 400;
        throw iamUtilMesssageNotAuthorized();
    }
    else{
        switch (true){
            case data.type=='MENU':{
                return [await menuRender({app_id:app_id, res:res})];
            }
            case data.type=='MODULE_CODE' && 
            (data.doc.startsWith('/apps') || data.doc.startsWith('/microservice')||data.doc.startsWith('/server')||data.doc.startsWith('/test')):{
                return [await getFile(`${process.cwd()}${data.doc}.js`, res)];
            }
            case data.type=='JSDOC':{
                return [await getFile(`${process.cwd()}/apps/common/src/jsdoc/${data.doc}`, res)];   
            }
            case data.type=='GUIDE':
            case data.type=='APP':
            case data.type=='REST_API':
            case data.type.startsWith('MODULE') &&
                (data.doc.startsWith('/apps') || data.doc.startsWith('/microservice')||data.doc.startsWith('/server')||data.doc.startsWith('/test')):{
                const {default:ComponentCreate} = await import('../component/common_markdown.js');      
                //guide documents in separate files, app and modules use templates
                return [await ComponentCreate({ data:{  
                                                        markdown: data.type.toUpperCase()=='GUIDE'?
                                                                    await getFile(`${process.cwd()}/apps/common/src/functions/documentation/${data.doc}.md`, res):
                                                                        await markdownRender({  app_id:app_id,
                                                                                                type:data.type,
                                                                                                doc:data.doc,
                                                                                                module:data.doc,
                                                                                                locale:locale,
                                                                                                res:res})},
                                                methods:null})];
            }
            default:{
                res.statusCode = 400;
                throw iamUtilMesssageNotAuthorized();
            }
        }
    }
};
export default appFunction;