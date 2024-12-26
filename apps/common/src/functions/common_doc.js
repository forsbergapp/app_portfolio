/**
 * @module apps/common/src/functions/common_doc
*/
/**
 * @import { server_server_res, serverDocumentType, serverDocumentMenu} from '../../../../server/types.js'
 */
/**
 * @name appFunction
 * @description Get documentation menu, guide, app or jsdoc documentation
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
    /**
     *  Get file and add given suffix to path
     * @param {string} path
     * @returns {Promise.<string>}
     */
    const getFile = async (path) =>{
        const fs = await import('node:fs');
        return fs.promises.readFile(path, 'utf8')
                .then(file=>file.toString())
                .catch(()=>{
                    res.statusCode = 400;
                    throw '⛔';
                });
    };
    //check if valid document request
    if (
        ((data.type.toUpperCase()=='GUIDE' ||data.type.toUpperCase()=='APP'||data.type.toUpperCase()=='JSDOC') && data?.doc == null) ||
        data?.doc && (data.doc.indexOf('\\')>-1||data.doc.indexOf('..')>-1 ||data.doc.indexOf(' ')>-1)){
        res.statusCode = 400;
        throw '⛔';
    }
    else{
        /**@type{import('../../../../server/db/fileModelApp.js')} */
        const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);
        switch (true){
            case data.type=='MENU':{
                /**@type{serverDocumentMenu[]} */
                const markdown_menu_docs = await getFile(`${process.cwd()}/apps/common/src/functions/documentation/menu.json`).then((/**@type{string}*/result)=>JSON.parse(result));
                for (const menu of markdown_menu_docs){
                    switch (true){
                        case menu.type=='APP':{
                            //return menu for app with updated id and app name
                            menu.menu_sub = fileModelApp.get(app_id, null, null).map(app=>{
                                return { 
                                        id:app.id,
                                        menu:app.name,
                                        doc:app.id.toString()
                                        };
                                });
                            break;
                        }
                        case menu.type=='GUIDE':{
                            //return menu with updated first title from the documents
                            for (const menu_sub of menu.menu_sub??[]){
                                await getFile(`${process.cwd()}/apps/common/src/functions/documentation/${menu_sub.doc}.md`)
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
                return [JSON.stringify(markdown_menu_docs)];
            }
            case data.type=='GUIDE':
            case data.type=='APP':{
                /**@type{import('../../../../server/db/fileModelAppTranslation.js')} */
                const fileModelAppTranslation = await import(`file://${process.cwd()}/server/db/fileModelAppTranslation.js`);
                const {default:ComponentCreate} = await import('../component/common_markdown.js');
                /**@type{import('../../../../server/server.js')} */
                const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
                return [await ComponentCreate({ data:{  app:                    data.type.toUpperCase()=='APP'?fileModelApp.get(app_id, serverUtilNumberValue(data.doc), null)[0]:null, 
                                                        app_translation:        data.type.toUpperCase()=='APP'?
                                                                                    fileModelAppTranslation.get(app_id,null, locale, 
                                                                                                            /**@ts-ignore */
                                                                                                            serverUtilNumberValue(data.doc), null)[0]:null,
                                                        
                                                        type:                   data.type,
                                                        //guide documents in separate files, all app use app template
                                                        markdown:               await getFile(`${process.cwd()}/apps/common/src/functions/documentation/` + 
                                                                                            (data.type.toUpperCase()=='GUIDE'?(data.doc + '.md'):'2.app.md')),
                                                        code:                   null,
                                                        module:                 null},
                                                methods:null})];
            }
            case data.type=='MODULE_CODE':
            case data.type.startsWith('MODULE'):{
                if (data.doc.startsWith('/apps') || data.doc.startsWith('/microservice')||data.doc.startsWith('/server')||data.doc.startsWith('/test'))
                    if (data.type=='MODULE_CODE')
                        return [await getFile(`${process.cwd()}${data.doc}.js`)];
                    else{
                        const {default:ComponentCreate} = await import('../component/common_markdown.js');
                        return [await ComponentCreate({ data:{app:              null, 
                                                        app_translation:        null,
                                                        type:                   data.type,
                                                        //guide documents in separate files, all app use app template
                                                        markdown:               await getFile(`${process.cwd()}/apps/common/src/functions/documentation/6.module.md`),
                                                        code:                   await getFile(`${process.cwd()}${data.doc}.js`),
                                                        module:                 data.doc},
                                                methods:null})];
                    }
                else{
                    res.statusCode = 400;
                    throw '⛔';
                }
            }
            case data.type=='JSDOC':{
                return [await getFile(`${process.cwd()}/apps/common/src/jsdoc/${data.doc}`)];   
            }
            default:{
                res.statusCode = 400;
                throw '⛔';
            }
        }
    }
};
export default appFunction;