/**
 * Displays app details modules, parameters and secrets 
 * @module apps/admin/component/menu_apps_detail
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 * @typedef {CommonModuleCommon['commonComponentRender']} commonComponentRender
 */

/**
 * @param {{app_id:number,
 *          detail:'menu_apps_detail_parameter'|'menu_apps_detail_module'|'menu_apps_detail_secret',
 *          app_detail:*}} props
 */
const template = props => ` <div class='menu_apps_detail_row'>
                                    <div class='menu_apps_detail_col list_title' data-column='APP_ID'>APP_ID</div>
                                    ${props.detail=='menu_apps_detail_module'?
                                        `<div class='menu_apps_detail_col list_title' data-column='COMMON_TYPE'>TYPE</div>
                                        <div class='menu_apps_detail_col list_title' data-column='COMMON_NAME'>NAME</div>
                                        <div class='menu_apps_detail_col list_title' data-column='COMMON_ROLE'>ROLE</div>
                                        <div class='menu_apps_detail_col list_title' data-column='COMMON_PATH'>PATH</div>
                                        <div class='menu_apps_detail_col list_title' data-column='COMMON_DESCRIPTION'>DESCRIPTION</div>`:

                                        `<div class='menu_apps_detail_col list_title' data-column='NAME'>NAME</div>
                                        <div class='menu_apps_detail_col list_title' data-column='VALUE'>VALUE</div>`
                                    }
                                    ${props.detail=='menu_apps_detail_parameter'?
                                        '<div class=\'menu_apps_detail_col list_title\' data-column=\'COMMENT\'>COMMENT</div>':''
                                    }
                            </div>
                            ${props.detail=='menu_apps_detail_module'?
                                `${props.app_detail.map((/**@type{import('../../../common_types.js').CommonAppModulesRecord}*/row)=>
                                        `<div data-changed-record='0' class='menu_apps_detail_row common_row'>
                                            <div class='menu_apps_detail_col list_readonly' data-column='APP_ID'>${row.APP_ID}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='COMMON_TYPE'>${row.COMMON_TYPE}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='COMMON_NAME'>${row.COMMON_NAME}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='COMMON_ROLE'>${row.COMMON_ROLE}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='COMMON_PATH'>${row.COMMON_PATH}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='COMMON_DESCRIPTION'>${row.COMMON_DESCRIPTION}</div>
                                        </div>`).join('')
                                }`:
                                `${Object.entries(props.app_detail).map(row=>
                                    `<div data-changed-record='0' class='menu_apps_detail_row common_row' data-fk='${row[0]=='APP_ID'?1:0}'>
                                        <div class='menu_apps_detail_col list_readonly' data-column='APP_ID'>${props.app_id}</div>
                                        <div class='menu_apps_detail_col list_edit' data-column='NAME'>${row[0]}</div>
                                        ${props.detail=='menu_apps_detail_secret'?
                                            `<div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='VALUE'>${row[1]}</div>`:''
                                        }
                                        ${props.detail=='menu_apps_detail_parameter'?
                                            `<div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='VALUE'>${row[1].VALUE ?? row[1]}</div>
                                             <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='COMMENT'>${row[1].COMMENT ?? ''}</div>`:''
                                        }
                                    </div>`
                                    ).join('')
                                }`
                            }`;
/**
 * @param {{data:{      commonMountdiv:string,
 *                      app_id_data:number,
 *                      detail:'menu_apps_detail_parameter'|'menu_apps_detail_module'|'menu_apps_detail_secret'},
 *          methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonFFB:commonFFB}}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    let path = '';
    switch (props.data.detail){
        case 'menu_apps_detail_parameter':{
            path = `/app-common-app-parameter/${props.data.app_id_data}`;
            break;
        }
        case 'menu_apps_detail_module':{
            path = `/app-common-app-module/${props.data.app_id_data}`;
            break;
        }
        case 'menu_apps_detail_secret':{
            path = `/app-common-app-secret/${props.data.app_id_data}`;
            break;
        }
    }
    const app_detail = await props.methods.commonFFB({path:path, method:'GET', authorization_type:'ADMIN'})
                            .then((/**@type{string}*/result)=>JSON.parse(result));
    return {
       lifecycle:   null,
       data:        null,
       methods:     null,
       template: template({ app_id:props.data.app_id_data,
                            detail:props.data.detail,
                            app_detail:app_detail})
    };
};
export default component;