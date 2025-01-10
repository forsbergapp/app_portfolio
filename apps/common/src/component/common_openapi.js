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
 *          sortByRole:function,
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
                                                    <div class='common_markdown_table_col'>Summary</div>
                                                    <div class='common_markdown_table_col'>${method[1].summary}</div>
                                                </div>
                                                <div class='common_markdown_table_row_detail'>
                                                    <div class='common_markdown_table_col'>operationId</div>
                                                    <div class='common_markdown_table_col'>${method[1].operationId}</div>
                                                </div>
                                                <div class='common_markdown_table_row_detail'>
                                                    <div class='common_markdown_table_col common_markdown_title_h3'>Parameters</div>
                                                    <div class='common_markdown_table_col'></div>
                                                </div>
                                                ${method[1].parameters.map((/**@type{*}*/param) => `
                                                    <div class='common_markdown_table_row_detail'>
                                                        <div class='common_markdown_table_col'>${param['$ref']?'ref$':param['name']?param.name:Object.keys(param)[0]}</div>
                                                        <div class='common_markdown_table_col common_markdown_table_content_json'>${Object.keys(param)[0].startsWith('server')?Object.values(param)[0]:JSON.stringify(param, undefined,2)}</div>
                                                    </div>
                                                `).join('')}
                                                <div class='common_markdown_table_row_detail'>
                                                    <div class='common_markdown_table_col common_markdown_title_h3'>Responses</div>
                                                    <div class='common_markdown_table_col'></div>
                                                </div>
                                                ${Object.entries(method[1].responses).map(([status, response]) => `
                                                    <div class='common_markdown_table_row_detail'>
                                                        <div class='common_markdown_table_col'>${status}</div>
                                                        <div class='common_markdown_table_col'>${JSON.stringify(response, undefined,2)}</div>
                                                    </div>
                                                `).join('')}
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
                                        <div class='common_markdown_table_col common_markdown_table_content_json'>${JSON.stringify(key[1], undefined,2)}</div> 
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
    const HTTPS_ENABLE = props.methods.fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_ENABLE');
    const HOST = props.methods.fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST');
    const PORT = props.methods.serverUtilNumberValue(HTTPS_ENABLE=='1'?
                    props.methods.fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_PORT'):
                        props.methods.fileModelConfig.get('CONFIG_SERVER','SERVER','HTTP_PORT'));

    const roleOrder = ['app_id', 'app_id_signup', 'app', 'app_access', 'admin', 'app_external', 'iam_user', 'iam_provider', 'iam_admin', 'socket'];
    /**
     * Sort paths by defined role order
     * @param {*[]} paths
     * @returns []
     */
    const sortByRole = paths => paths.sort((a,b) => roleOrder.indexOf(a[0].split('/')[2]) - roleOrder.indexOf(b[0].split('/')[2]));
    const CONFIG_REST_API = props.methods.fileModelConfig.get('CONFIG_REST_API');
    //return object with 'servers key modified with list from configuration
    CONFIG_REST_API.servers = props.methods.fileModelApp.get({app_id:props.data.app_id, resource_id:null, res:null})
                        .map(row=>{
                            return {url:(HTTPS_ENABLE? 'https://':'http://') + 
                                                                        row.subdomain + '.' +
                                                                        HOST +
                                                                        ((PORT==80||PORT==443)?'':`/:${PORT}`)
                                    };
                        });
    return template({   openapi:CONFIG_REST_API,
                        sortByRole:sortByRole
                   });
};
export default component;