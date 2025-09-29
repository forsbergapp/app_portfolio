/**
 * Displays app details modules, parameters and secrets 
 * @module apps/app1/component/menu_apps_detail
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_id:number,
 *          detail:'menu_apps_detail_data'|'menu_apps_detail_module',
 *          app_detail:*}} props
 *
 * @returns {string}
 */
const template = props => ` <div class='menu_apps_detail_row'>
                                    <div class='menu_apps_detail_col list_title' data-column='app_id'>app_id</div>
                                    ${props.detail=='menu_apps_detail_module'?
                                        `<div class='menu_apps_detail_col list_title' data-column='ModuleType'>TYPE</div>
                                         <div class='menu_apps_detail_col list_title' data-column='ModuleName'>NAME</div>
                                         <div class='menu_apps_detail_col list_title' data-column='ModuleRole'>ROLE</div>
                                         <div class='menu_apps_detail_col list_title' data-column='ModulePath'>PATH</div>
                                         <div class='menu_apps_detail_col list_title' data-column='ModuleDescription'>DESCRIPTION</div>`:
                                            ''
                                    }
                                    ${props.detail=='menu_apps_detail_data'?
                                        `<div class='menu_apps_detail_col list_title' data-column='name'>NAME</div>
                                         <div class='menu_apps_detail_col list_title' data-column='value'>VALUE</div>
                                         <div class='menu_apps_detail_col list_title' data-column='display_data'>DISPLAY_DATA</div>
                                         <div class='menu_apps_detail_col list_title' data-column='data2'>DATA2</div>
                                         <div class='menu_apps_detail_col list_title' data-column='data3'>DATA3</div>
                                         <div class='menu_apps_detail_col list_title' data-column='data4'>DATA4</div>
                                         <div class='menu_apps_detail_col list_title' data-column='data5'>DATA5</div>`:
                                            ''
                                    }
                            </div>
                            ${props.detail=='menu_apps_detail_module'?
                                `${props.app_detail.map((/**@type{import('../../../common_types.js').CommonAppModulesRecord}*/row)=>
                                        `<div data-changed-record='0' class='menu_apps_detail_row common_row'>
                                            <div class='menu_apps_detail_col list_readonly' data-column='id'>${row.id}</div>
                                            <div class='menu_apps_detail_col list_readonly' data-column='app_id'>${row.app_id}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='ModuleType'>${row.ModuleType??''}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='ModuleName'>${row.ModuleName??''}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='ModuleRole'>${row.ModuleRole??''}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='ModulePath'>${row.ModulePath??''}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='ModuleDescription'>${row.ModuleDescription??''}</div>
                                        </div>`).join('')
                                }`:
                                    `${props.app_detail.map((/**@type{import('../../../common_types.js').CommonAppDataRecord}*/row)=>
                                            `<div data-changed-record='0' class='menu_apps_detail_row common_row'>
                                                <div class='menu_apps_detail_col list_readonly' data-column='id'>${row.id}</div>
                                                <div class='menu_apps_detail_col list_readonly' data-column='app_id'>${row.app_id}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='name'>${row.name??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='value'>${row.value??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='display_data'>${row.display_data??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='data2'>${row.data2??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='data3'>${row.data3??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='data4'>${row.data4??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='data5'>${row.data5??''}</div>
                                            </div>`).join('')
                                    }`
                            }`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:{      commonMountdiv:string,
 *                      app_id_data:number,
 *                      detail:'menu_apps_detail_data'|'menu_apps_detail_module'},
 *          methods:{   COMMON:common['CommonModuleCommon']}}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    let path = '';
    let query = '';
    switch (props.data.detail){
        case 'menu_apps_detail_data':{
            //AppData uses one record for all parameters for each app
            path = `/server-db/appdata/`;
            query = `data_app_id=${props.data.app_id_data}`;
            break;
        }
        case 'menu_apps_detail_module':{
            //AppModule saves records for each app
            path = '/server-db/appmodule/';
            query = `data_app_id=${props.data.app_id_data}`;
            break;
        }
    }
    const app_detail = await props.methods.COMMON.commonFFB({path:path, query:query, method:'GET', authorization_type:'ADMIN'})
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows);
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