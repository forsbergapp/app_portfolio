/**
 * Displays app details modules, parameters and secrets 
 * @module apps/app1/component/menu_apps_detail
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_id:number,
 *          detail:'menu_apps_detail_parameter'|'menu_apps_detail_module'|'menu_apps_detail_secret',
 *          app_detail:*}} props
 *
 * @returns {string}
 */
const template = props => ` <div class='menu_apps_detail_row'>
                                    <div class='menu_apps_detail_col list_title' data-column='app_id'>app_id</div>
                                    ${props.detail=='menu_apps_detail_module'?
                                        `<div class='menu_apps_detail_col list_title' data-column='common_type'>TYPE</div>
                                        <div class='menu_apps_detail_col list_title' data-column='common_name'>NAME</div>
                                        <div class='menu_apps_detail_col list_title' data-column='common_role'>ROLE</div>
                                        <div class='menu_apps_detail_col list_title' data-column='common_path'>PATH</div>
                                        <div class='menu_apps_detail_col list_title' data-column='common_description'>DESCRIPTION</div>`:

                                        `<div class='menu_apps_detail_col list_title' data-column='name'>NAME</div>
                                        <div class='menu_apps_detail_col list_title' data-column='value'>VALUE</div>`
                                    }
                                    ${props.detail=='menu_apps_detail_parameter'?
                                        '<div class=\'menu_apps_detail_col list_title\' data-column=\'comment\'>COMMENT</div>':''
                                    }
                            </div>
                            ${props.detail=='menu_apps_detail_module'?
                                `${props.app_detail.map((/**@type{import('../../../common_types.js').CommonAppModulesRecord}*/row)=>
                                        `<div data-changed-record='0' class='menu_apps_detail_row common_row'>
                                            <div class='menu_apps_detail_col list_readonly' data-column='id'>${row.id}</div>
                                            <div class='menu_apps_detail_col list_readonly' data-column='app_id'>${row.app_id}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='common_type'>${row.common_type}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='common_name'>${row.common_name}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='common_role'>${row.common_role}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='common_path'>${row.common_path}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='common_description'>${row.common_description}</div>
                                        </div>`).join('')
                                }`:
                                `${Object.entries(props.app_detail).map(row=>
                                    `<div data-changed-record='0' class='menu_apps_detail_row common_row' data-fk='${row[0]=='app_id'?1:0}'>
                                        <div class='menu_apps_detail_col list_readonly' data-column='app_id'>${props.app_id}</div>
                                        <div class='menu_apps_detail_col list_edit' data-column='name'>${row[0]}</div>
                                        ${props.detail=='menu_apps_detail_secret'?
                                            `<div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='value'>${row[1]}</div>`:''
                                        }
                                        ${props.detail=='menu_apps_detail_parameter'?
                                            `<div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='value'>${row[1].value ?? row[1]}</div>
                                             <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='comment'>${row[1].comment ?? ''}</div>`:''
                                        }
                                    </div>`
                                    ).join('')
                                }`
                            }`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:{      commonMountdiv:string,
 *                      app_id_data:number,
 *                      detail:'menu_apps_detail_parameter'|'menu_apps_detail_module'|'menu_apps_detail_secret'},
 *          methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonFFB:CommonModuleCommon['commonFFB']}}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    let path = '';
    let query = '';
    switch (props.data.detail){
        case 'menu_apps_detail_parameter':{
            //APP_PARAMETER uses one record for all parameters for each app
            path = `/app-common-appparameter/${props.data.app_id_data}`;
            break;
        }
        case 'menu_apps_detail_module':{
            //APP_MODULE saves records for each app
            path = '/app-common-appmodule/';
            query = `data_app_id=${props.data.app_id_data}`;
            break;
        }
        case 'menu_apps_detail_secret':{
            //APP_SECRET uses one record for all secrets for each app
            path = `/app-common-appsecret/${props.data.app_id_data}`;
            break;
        }
    }
    const app_detail = await props.methods.commonFFB({path:path, query:query, method:'GET', authorization_type:'ADMIN'})
                            .then((/**@type{string}*/result)=>props.data.detail=='menu_apps_detail_module'?JSON.parse(result).rows:JSON.parse(result)[0]);
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