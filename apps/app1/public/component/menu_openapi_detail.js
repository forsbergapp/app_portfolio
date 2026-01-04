/**
 * @module apps/app1/component/menu_openapi_detail
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{detail:'menu_openapi_detail_config'|'menu_openapi_detail_servers',
 *          openapi_config:common['server']['ORM']['Object']['OpenApi']['components']['parameters']['config'],
 *          openapi_servers:common['server']['ORM']['Object']['OpenApi']['servers']}} props
 *
 * @returns {string}
 */
const template = props => ` 
                            ${props.detail=='menu_openapi_detail_config'?
                                `<div id='menu_openapi_row_title' class='menu_openapi_detail_config_row row_title'>
                                    <div class='menu_openapi_col'>PARAMETER NAME</div>
                                    <div class='menu_openapi_col'>PARAMETER VALUE</div>
                                    <div class='menu_openapi_col'>DESCRIPTION</div>
                                </div>`:
                                    `<div id='menu_openapi_row_title' class='menu_openapi_detail_servers_row row_title'>
                                        <div >URL</div>
                                        <div >DESCRIPTION</div>
                                        <div >TYPE</div>
                                        <div >PROTOCOL</div>
                                        <div >HOST</div>
                                        <div >PORT</div>
                                        <div >BASEPATH</div>
                                    </div>`
                            }
                            ${props.detail=='menu_openapi_detail_config'?
                                `${  Object.entries(props.openapi_config).sort().map(row=>
                                        `<div data-changed-record='0' class='menu_openapi_detail_config_row common_row' >
                                            <div class='list_readonly' data-column='config_key'>${row[0]}</div>
                                            <div contentEditable='true' class='common_input list_edit' data-column='config_value'/>${row[1].default}</div>
                                            <div class='list_readonly'>${row[1].description}</div>
                                        </div>`
                                    ).join('')
                                }`:
                                    `${props.openapi_servers.map(row=>
                                            `<div data-changed-record='0' class='menu_openapi_detail_servers_row common_row'>
                                                <div class='list_readonly' data-column='url'>${row.url}</div>
                                                <div class='list_readonly' data-column='description'>${row.description}</div>
                                                <div class='list_readonly' data-column='x-type'>${row['x-type'].default??''}</div>
                                                <div class='list_readonly' data-column='protocol'>${row.variables.protocol.default??''}</div>
                                                <div class='common_input list_edit' contentEditable='true' data-column='host'>${row.variables.host.default??''}</div>
                                                ${row['x-type'].default!='NOHANGING_HTTPS'?
                                                    `<div class='common_input list_edit' contentEditable='true' data-column='port'>${row.variables.port.default??''}</div>`
                                                    :
                                                    `<div class='list_readonly' data-column='port'>${row.variables.port.default??''}</div>`
                                                }
                                                ${row['x-type'].default=='REST_API'?
                                                    `<div class='common_input list_edit' contentEditable='true' data-column='basePath'>${row.variables.basePath.default??''}</div>`
                                                    :
                                                    `<div class='list_readonly' data-column='basePath'>${row.variables.basePath.default??''}</div>`
                                                }
                                            </div>`).join('')
                                    }`
                            }`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:{      commonMountdiv:string,
 *                      detail:'menu_openapi_detail_config'|'menu_openapi_detail_servers'},
 *          methods:{   COMMON:common['CommonModuleCommon']}}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {

    let path = '';
    switch (props.data.detail){
        case 'menu_openapi_detail_config':{
            path = '/server-db/openapi/config';
            
            break;
        }
        case 'menu_openapi_detail_servers':{
            path = '/server-db/openapi/servers';
            break;
        }
    }
    const openapi = await props.methods.COMMON.commonFFB({   path:path, 
                                                                method:'GET', 
                                                                authorization_type:'ADMIN'})
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows ?? JSON.parse(result));
    return {
       lifecycle:   null,
       data:        null,
       methods:     null,
       template: template({ detail:props.data.detail,
                            openapi_config:props.data.detail=='menu_openapi_detail_config'?openapi:null,
                            openapi_servers:props.data.detail=='menu_openapi_detail_servers'?openapi:null})
    };
};
export default component;