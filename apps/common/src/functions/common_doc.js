/**
 * @module apps/common/src/functions/common_doc
*/
/**
 * @import { server_server_res} from '../../../../server/types.js'
 * @import { appMenu} from './types.js'
 */
/**
 * Get documentation menu or guide, app or jsdoc documentation
 * 
 * @param {number} app_id
 * @param {*} data
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
        data?.doc && (data.doc.indexOf('/')>-1 ||data.doc.indexOf('\\')>-1||data.doc.indexOf('..')>-1 ||data.doc.indexOf(' ')>-1)){
        res.statusCode = 400;
        throw '⛔';
    }
    else{
        /**@type{import('../../../../server/db/fileModelApp.js')} */
        const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);
        switch (data.type.toUpperCase()){
            case 'MENU':{
                //return menu with updated first title from the documents
                /**@type{appMenu[]} */
                const markdown_menu_docs = await getFile(`${process.cwd()}/apps/common/src/functions/documentation/menu.json`).then((/**@type{string}*/result)=>JSON.parse(result));
                for (const menu of markdown_menu_docs){
                    if (menu.type=='APP'){
                        //generate menu for app with updated id and app name
                        menu.menu_sub = fileModelApp.get(app_id, null, null).map(app=>{
                                            return { 
                                                    id:app.id,
                                                    menu:app.name,
                                                    doc:app.id.toString()
                                                    };
                                            });
                    }
                    else
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
                }
                return [JSON.stringify(markdown_menu_docs)];
            }
            case 'GUIDE':
            case 'APP':{                
                /**@type{import('../../../../server/db/fileModelAppTranslation.js')} */
                const fileModelAppTranslation = await import(`file://${process.cwd()}/server/db/fileModelAppTranslation.js`);
                const {default:ComponentCreate} = await import('../component/common_markdown.js');
                /**@type{import('../../../../server/server.js')} */
                const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
                return [await ComponentCreate({ data:{app:                    data.type.toUpperCase()=='APP'?fileModelApp.get(app_id, serverUtilNumberValue(data.doc), null)[0]:null, 
                                                        app_translation:        data.type.toUpperCase()=='APP'?
                                                                                    fileModelAppTranslation.get(app_id,null, locale, 
                                                                                                            /**@ts-ignore */
                                                                                                            serverUtilNumberValue(data.doc), null)[0]:null,
                                                        
                                                        type:                   data.type.toUpperCase(),
                                                        //guide documents in separate files, all app use app template
                                                        markdown:               await getFile(`${process.cwd()}/apps/common/src/functions/documentation/` + 
                                                                                            (data.type.toUpperCase()=='GUIDE'?(data.doc + '.md'):'2.app.md'))},
                                                methods:null})];
            }
            case 'JSDOC':{
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