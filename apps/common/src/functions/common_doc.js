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
    if (data?.doc && (data.doc.indexOf('/')>-1 ||data.doc.indexOf('\\')>-1||data.doc.indexOf('..')>-1 ||data.doc.indexOf(' ')>-1)){
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
                /**@type{import('../../../../server/db/fileModelAppParameter.js')} */
                const fileModelAppParameter = await import(`file://${process.cwd()}/server/db/fileModelAppParameter.js`);
                const {default:ComponentCreate} = await import('../component/common_markdown.js');
                
                return [await ComponentCreate({data:{   app:fileModelApp.get(app_id, data.app_id_doc, null)[0], 
                                                                    app_copyright: fileModelAppParameter.get(data.app_id_doc, null)[0].app_copyright.value, 
                                                                    //guide documents in separate files, all app use app template
                                                                    markdown:await getFile(`${process.cwd()}/apps/common/src/functions/documentation/` + 
                                                                                            (data.type.toUpperCase()=='GUIDE'?data.doc + '.md':'app.md'))},
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