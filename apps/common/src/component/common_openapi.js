/**
 * Displays openAPI from JSON source
 *         
 * @module apps/common/component/common_openapi
 */
/**
 * @import {server_db_file_config_rest_api}  from '../../../../server/types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{openapi :server_db_file_config_rest_api,
 *          sortByRole:function
 *          }} props
 * @returns {string}
 */
const template = props =>`
                            <div class='common_markdown_table common_markdown_table_no_odd_event'>
                                <div class='common_markdown_table_row common_markdown_table_row_title'>
                                    <div class='common_markdown_table_col'>${Object.entries(props.openapi)[0][0]}</div> 
                                    <div class='common_markdown_table_col'></div> 
                                </div>
                                <div class='common_markdown_table_row '>
                                    <div class='common_markdown_table_col'>${Object.keys(Object.entries(props.openapi)[0][1])[0]}</div> 
                                    <div class='common_markdown_table_col'>${Object.values(Object.entries(props.openapi)[0][1])[0]}</div> 
                                </div> 
                                <div class='common_markdown_table_row '>
                                    <div class='common_markdown_table_col'>${Object.keys(Object.entries(props.openapi)[0][1])[1]}</div> 
                                    <div class='common_markdown_table_col'>${Object.values(Object.entries(props.openapi)[0][1])[1]}</div> 
                                </div> 
                                <div class='common_markdown_table_row '>
                                    <div class='common_markdown_table_col'>${Object.keys(Object.entries(props.openapi)[0][1])[2]}</div> 
                                    <div class='common_markdown_table_col'>${Object.values(Object.entries(props.openapi)[0][1])[2]}</div> 
                                </div>
                                <div class='common_markdown_table_row'>
                                    <div class='common_markdown_table_col'></div> 
                                    <div class='common_markdown_table_col'></div> 
                                </div>
                                <div class='common_markdown_table_row common_markdown_table_row_title'>
                                    <div class='common_markdown_table_col'>${Object.entries(props.openapi)[1][0]}</div> 
                                    <div class='common_markdown_table_col'></div> 
                                </div> 
                                ${Object.entries(props.openapi.servers).map(key => `
                                    <div class='common_markdown_table_row'>
                                        <div class='common_markdown_table_col'>${Object.keys(key[1])[0]}</div> 
                                        <div class='common_markdown_table_col'>${Object.values(key[1])[0]}</div> 
                                    </div> 
                                `).join('')}
                                <div class='common_markdown_table_row'>
                                    <div class='common_markdown_table_col'></div> 
                                    <div class='common_markdown_table_col'></div> 
                                </div>
                                <div class='common_markdown_table_row common_markdown_table_row_title'>
                                    <div class='common_markdown_table_col'>${Object.entries(props.openapi)[2][0]}</div> 
                                    <div class='common_markdown_table_col'></div> 
                                </div> 
                                ${props.sortByRole(Object.entries(props.openapi.paths)).map((/**@type{*}*/path) => `
                                    ${Object.entries(path[1]).map(method => `
                                        <div class='common_markdown_table_row'>
                                            <div class='common_markdown_table_row_master common_markdown_table_row_title'>
                                                <div class='common_markdown_table_row_master_method common_markdown_table_col'>${method[0].toUpperCase()}</div><div class='common_markdown_table_row_master_path common_markdown_table_col'>${path[0]}</div>
                                            </div>
                                            <div class='common_markdown_table_row_detail_master'>
                                                <div class='common_markdown_table_row_detail'>
                                                    <div class='common_markdown_table_col common_markdown_table_col1'>Summary</div>
                                                    <div class='common_markdown_table_col common_markdown_table_col2 common_markdown_table_content_preserve'>${method[1].summary}</div>
                                                </div>
                                                <div class='common_markdown_table_row_detail'>
                                                    <div class='common_markdown_table_col common_markdown_table_col1'>operationId</div>
                                                    <div class='common_markdown_table_col common_markdown_table_col2'>${method[1].operationId}</div>
                                                </div>
                                                <div class='common_markdown_table_row_detail'>
                                                    <div class='common_markdown_table_col common_markdown_table_col1 common_markdown_title_h3'>Parameters</div>
                                                    <div class='common_markdown_table_col common_markdown_table_col2'></div>
                                                </div>
                                                ${method[1].parameters.map((/**@type{*}*/param) => `
                                                    <div class='common_markdown_table_row_detail'>
                                                        <div class='common_markdown_table_col common_markdown_table_col1'>${param['$ref']?'ref$':param['name']?param.name:Object.keys(param)[0]}</div>
                                                        <div class='common_markdown_table_col common_markdown_table_col2 common_markdown_table_content_preserve'>${Object.keys(param)[0].startsWith('server')?Object.values(param)[0]:JSON.stringify(param, undefined,2)}</div>
                                                    </div>
                                                `).join('')
                                                }
                                                ${method[1]?.requestBody?
                                                    `<div class='common_markdown_table_row_detail'>
                                                        <div class='common_markdown_table_col common_markdown_table_col1 common_markdown_title_h3'>Request body</div>
                                                        <div class='common_markdown_table_col common_markdown_table_col2'></div>
                                                    </div>
                                                    <div class='common_markdown_table_row_detail'>
                                                        <div class='common_markdown_table_col common_markdown_table_col1'>Description</div>
                                                        <div class='common_markdown_table_col common_markdown_table_col2 common_markdown_table_content_preserve'>${method[1]?.requestBody.description}</div>
                                                    </div>
                                                    <div class='common_markdown_table_row_detail'>
                                                        <div class='common_markdown_table_col common_markdown_table_col1'>Required</div>
                                                        <div class='common_markdown_table_col common_markdown_table_col2'>${method[1]?.requestBody.required}</div>
                                                    </div>
                                                    <div class='common_markdown_table_row_detail'>
                                                        <div class='common_markdown_table_col common_markdown_table_col1'>Content</div>
                                                        <div class='common_markdown_table_col common_markdown_table_col2 common_markdown_table_content_preserve'>${JSON.stringify(method[1]?.requestBody.content, undefined,2)}</div>
                                                    </div>`:''
                                                }
                                                <div class='common_markdown_table_row_detail'>
                                                    <div class='common_markdown_table_col common_markdown_table_col1 common_markdown_title_h3'>Responses</div>
                                                    <div class='common_markdown_table_col common_markdown_table_col2'></div>
                                                </div>
                                                ${Object.entries(method[1].responses).map(([status, response]) => `
                                                    <div class='common_markdown_table_row_detail'>
                                                        <div class='common_markdown_table_col common_markdown_table_col1'>${status}</div>
                                                        <div class='common_markdown_table_col common_markdown_table_col2 common_markdown_table_content_preserve'>${JSON.stringify(response, undefined,2)}</div>
                                                    </div>
                                                `).join('')
                                                }
                                            </div>
                                        </div>
                                    `).join('')}
                                `).join('')}
                                <div class='common_markdown_table_row'>
                                    <div class='common_markdown_table_col'></div> 
                                    <div class='common_markdown_table_col'></div> 
                                </div>
                                <div class='common_markdown_table_row common_markdown_table_row_title'>
                                    <div class='common_markdown_table_col'>${Object.entries(props.openapi)[3][0]}</div> 
                                    <div class='common_markdown_table_col'></div> 
                                </div> 
                                ${Object.entries(props.openapi.components).map(key => `
                                    <div class='common_markdown_table_row '>
                                        <div class='common_markdown_table_col'>${key[0]}</div> 
                                        <div class='common_markdown_table_col common_markdown_table_content_preserve'>${JSON.stringify(key[1], undefined,2)}</div> 
                                    </div> 
                                `).join('')}
                            </div>
                           `;
/**
* @name component
* @description Component
* @function
* @param {{data:        {app_id:number},
*          methods:     {
*                       fileModelApp:import('../../../../server/db/fileModelApp.js'),
*                       fileModelConfig:import('../../../../server/db/fileModelConfig.js'),
*                       serverUtilNumberValue:import('../../../../server/server.js')['serverUtilNumberValue']
*                       }}} props
* @returns {Promise.<string>}
*/
const component = async props => {
    const fs = await import('node:fs');
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
            const file = await fs.promises.readFile(`${process.cwd()}${filePath}`, 'utf8').then(file=>file.toString().replaceAll('\r\n','\n'))
                                .catch(()=>null);
            const regexp_module_function = /\/\*\*([\s\S]*?)\*\//g;
            let match;
            while ((match = regexp_module_function.exec(file ?? '')) !==null){
                if ((match[1].indexOf(`@name ${functionRESTAPI}\n`)>-1 || match[1].indexOf(`@name ${functionRESTAPI} `)>-1) &&
                    match[1].indexOf('@function')>-1 &&
                    match[1].indexOf('@memberof ROUTE_REST_API')>-1)
                    return {summary:
                            '<div class=\'common_markdown_jsdoc_tag\'>'+
                            match[1]
                            .split('@')
                            .filter(tag=>tag.startsWith('description'))[0]?.substring('description'.length)
                                                                            .trimStart()
                                                                            .split('\n')
                                                                            .map(row=>row.trimStart()[0]=='*'?row.trimStart().substring(2).trimStart():row.trimStart())
                                                                            .join('\n')
                            +
                            '</div>',
                            response:
                            '<div class=\'common_markdown_jsdoc_tag\'>'+
                            match[1]
                            .split('@')
                            .filter(tag=>tag.startsWith('returns'))[0]?.substring('returns'.length)
                            .trimStart()
                            .split('\n')
                            .map(row=>
                                '<div>' +
                                (row.trimStart()[0]=='*'?row.trimStart().substring(2).trimStart():row.trimStart())
                                .replaceAll('|','&vert;')
                                .replaceAll('[','&#91;')
                                .replaceAll(']','&#93;')
                                .replaceAll('<','&lt;')
                                .replaceAll('>','&gt;')
                                +
                                '</div>'
                            )
                            .join('')
                            +
                            '</div>'
                            };
            }
            return {summary:'', response:''};
            
    };

    const HTTPS_ENABLE = props.methods.fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_ENABLE');
    const HOST = props.methods.fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST');
    const PORT = props.methods.serverUtilNumberValue(HTTPS_ENABLE=='1'?
                    props.methods.fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_PORT'):
                        props.methods.fileModelConfig.get('CONFIG_SERVER','SERVER','HTTP_PORT'));

    const roleOrder = ['app_id', 'app_id_signup', 'app', 'app_access', 'app_access_verification', 'admin', 'app_external', 'iam_user', 'iam_provider', 'iam_admin', 'socket'];
    /**
     * Sort paths by defined role order
     * @param {*[]} paths
     * @returns []
     */
    const sortByRole = paths => paths.sort((a,b) => roleOrder.indexOf(a[0].split('/')[2]) - roleOrder.indexOf(b[0].split('/')[2]));
    const CONFIG_REST_API = props.methods.fileModelConfig.get('CONFIG_REST_API');
    //return object with 'servers key modified with list from configuration
    CONFIG_REST_API.servers = props.methods.fileModelApp.get({app_id:props.data.app_id, resource_id:null}).result
                        .map((/**@type{server_db_file_app}*/row)=>{
                            return {url:(HTTPS_ENABLE? 'https://':'http://') + 
                                                                        row.subdomain + '.' +
                                                                        HOST +
                                                                        ((PORT==80||PORT==443)?'':`/:${PORT}`)
                                    };
                        });
    for (const path of Object.entries(CONFIG_REST_API.paths))
        for (const method of Object.entries(path[1])){
            const JSDocResult = await getJsDocMetadata(method[1].operationId);
            //Update summary with @description tag
            method[1].summary = JSDocResult.summary;
            //All paths starts with oneOf key followed by allOf key except SSE path
            if (method[1].responses.oneOf)
                //Update rows and properties with @returns tag
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

    return template({   openapi:CONFIG_REST_API,
                        sortByRole:sortByRole
                   });
};
export default component;