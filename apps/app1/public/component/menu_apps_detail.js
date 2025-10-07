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
                                    <div class='menu_apps_detail_col list_title' data-column='AppId'>AppId</div>
                                    ${props.detail=='menu_apps_detail_module'?
                                        `<div class='menu_apps_detail_col list_title' data-column='ModuleType'>TYPE</div>
                                         <div class='menu_apps_detail_col list_title' data-column='ModuleName'>NAME</div>
                                         <div class='menu_apps_detail_col list_title' data-column='ModuleRole'>ROLE</div>
                                         <div class='menu_apps_detail_col list_title' data-column='ModulePath'>PATH</div>
                                         <div class='menu_apps_detail_col list_title' data-column='ModuleDescription'>DESCRIPTION</div>`:
                                            ''
                                    }
                                    ${props.detail=='menu_apps_detail_data'?
                                        `<div class='menu_apps_detail_col list_title' data-column='Name'>NAME</div>
                                         <div class='menu_apps_detail_col list_title' data-column='Value'>VALUE</div>
                                         <div class='menu_apps_detail_col list_title' data-column='DisplayData'>DISPLAY_DATA</div>
                                         <div class='menu_apps_detail_col list_title' data-column='Data2'>DATA2</div>
                                         <div class='menu_apps_detail_col list_title' data-column='Data3'>DATA3</div>
                                         <div class='menu_apps_detail_col list_title' data-column='Data4'>DATA4</div>
                                         <div class='menu_apps_detail_col list_title' data-column='Data5'>DATA5</div>`:
                                            ''
                                    }
                            </div>
                            ${props.detail=='menu_apps_detail_module'?
                                `${props.app_detail.map((/**@type{common['server']['ORM']['Object']['AppModule']}*/row)=>
                                        `<div data-changed-record='0' class='menu_apps_detail_row common_row'>
                                            <div class='menu_apps_detail_col list_readonly' data-column='Id'>${row.Id}</div>
                                            <div class='menu_apps_detail_col list_readonly' data-column='AppId'>${row.AppId}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='ModuleType'>${row.ModuleType??''}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='ModuleName'>${row.ModuleName??''}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='ModuleRole'>${row.ModuleRole??''}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='ModulePath'>${row.ModulePath??''}</div>
                                            <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='ModuleDescription'>${row.ModuleDescription??''}</div>
                                        </div>`).join('')
                                }`:
                                    `${props.app_detail.map((/**@type{common['server']['ORM']['Object']['AppData']}*/row)=>
                                            `<div data-changed-record='0' class='menu_apps_detail_row common_row'>
                                                <div class='menu_apps_detail_col list_readonly' data-column='Id'>${row.Id}</div>
                                                <div class='menu_apps_detail_col list_readonly' data-column='AppId'>${row.AppId}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='Name'>${row.Name??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='Value'>${row.Value??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='DisplayData'>${row.DisplayData??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='Data2'>${row.Data2??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='Data3'>${row.Data3??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='Data4'>${row.Data4??''}</div>
                                                <div class='menu_apps_detail_col common_input list_edit' contentEditable='true' data-column='Data5'>${row.Data5??''}</div>
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