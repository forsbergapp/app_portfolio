/**
 * Displays stat of users
 * @module apps/app1/component/menu_db_info
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */


/**
 * @name template
 * @description Template
 * @function
 * @param {{size:string,
 *          db:{database_use:string, 
 *              database_name:string,
 *              version:string,
 *              database_schema:string,
 *              hostname:string,
 *              connections:string,
 *              started:string},
 *          db_detail:[{table_name:string,
 *                      total_size: number,
 *                      data_used:number,
 *                      data_free:number,
 *                      pct_used:number}]|[],
 *          db_detail_sum:{ table_name:string,
 *                          total_size: number,
 *                          data_used:number,
 *                          data_free:number,
 *                          pct_used:number},
 *          function_roundOff:CommonModuleCommon['commonMiscRoundOff']}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_db_info_content_widget1' class='widget'>
                                <div id='menu_db_info1' >
                                    <div id='menu_db_info_database_title' class='common_icon'></div>          <div id='menu_db_info_database_data'>${props.db.database_use}</div>
                                    <div id='menu_db_info_name_title' class='common_icon'></div>              <div id='menu_db_info_name_data'>${props.db.database_name}</div>
                                    <div id='menu_db_info_version_title' class='common_icon'></div>           <div id='menu_db_info_version_data'>${props.db.version}</div>
                                    <div id='menu_db_info_database_schema_title' class='common_icon'></div>   <div id='menu_db_info_database_schema_data'>${props.db.database_schema}</div>
                                    <div id='menu_db_info_host_title' class='common_icon'></div>              <div id='menu_db_info_host_data'>${props.db.hostname}</div>
                                    <div id='menu_db_info_connections_title' class='common_icon'></div>       <div id='menu_db_info_connections_data'>${props.db.connections}</div>
                                    <div id='menu_db_info_started_title' class='common_icon'></div>           <div id='menu_db_info_started_data'>${props.db.started}</div>
                                </div>
                            </div>
                            <div id='menu_db_info_content_widget2' class='widget'>
                                <div id='menu_db_info_space_title' class='common_icon'></div>
                                <div id='menu_db_info_space_detail' class='common_list_scrollbar'>
                                    <div id='menu_db_info_space_detail_row_title' class='menu_db_info_space_detail_row'>
                                        <div id='menu_db_info_space_detail_col_title1' class='menu_db_info_space_detail_col list_title'>TABLE NAME</div>
                                        <div id='menu_db_info_space_detail_col_title2' class='menu_db_info_space_detail_col list_title'>SIZE ${props.size}</div>
                                        <div id='menu_db_info_space_detail_col_title3' class='menu_db_info_space_detail_col list_title'>DATA USED ${props.size}</div>
                                        <div id='menu_db_info_space_detail_col_title4' class='menu_db_info_space_detail_col list_title'>DATA FREE ${props.size}</div>
                                        <div id='menu_db_info_space_detail_col_title5' class='menu_db_info_space_detail_col list_title'>% USED</div>
                                    </div>
                                    ${props.db_detail.map(row=>
                                        `<div class='menu_db_info_space_detail_row' >
                                            <div class='menu_db_info_space_detail_col'>${row.table_name}</div>
                                            <div class='menu_db_info_space_detail_col'>${props.function_roundOff(row.total_size)}</div>
                                            <div class='menu_db_info_space_detail_col'>${props.function_roundOff(row.data_used)}</div>
                                            <div class='menu_db_info_space_detail_col'>${props.function_roundOff(row.data_free)}</div>
                                            <div class='menu_db_info_space_detail_col'>${props.function_roundOff(row.pct_used)}</div>
                                        </div>`
                                    ).join('')}
                                    <div id='menu_db_info_space_detail_row_total' class='menu_db_info_space_detail_row' >
                                        <div id='menu_8_info_space_db_sum' class='menu_db_info_space_detail_col'></div>
                                        <div class='menu_db_info_space_detail_col'>${props.function_roundOff(props.db_detail_sum.total_size)}</div>
                                        <div class='menu_db_info_space_detail_col'>${props.function_roundOff(props.db_detail_sum.data_used)}</div>
                                        <div class='menu_db_info_space_detail_col'>${props.function_roundOff(props.db_detail_sum.data_free)}</div>
                                        <div class='menu_db_info_space_detail_col'>${props.function_roundOff(props.db_detail_sum.pct_used)}</div>
                                    </div>
                                </div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{ data:{      commonMountdiv:string},
 *           methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonMiscRoundOff:CommonModuleCommon['commonMiscRoundOff'],
 *                       commonFFB:CommonModuleCommon['commonFFB']},
 *           lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const size = '(Mb)';
    /**
     * @type {{ database_use:string,
     *          database_name:string,
     *          version:string,
     *          database_schema:string,
     *          hostname:string,
     *          connections:string,
     *          started:string}}
     */
    const db = await props.methods.commonFFB({path:'/server-db_admin/database', method:'GET', authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result).rows[0]);
    const db_detail = await props.methods.commonFFB({path:'/server-db_admin/database-space', method:'GET', authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result).rows);
    const db_detail_sum = await props.methods.commonFFB({path:'/server-db_admin/database-spacesum', method:'GET', authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result).rows[0]);

  return {
      lifecycle:    null,
      data:         null,
      methods:      null,
      template:     template({  size:size,
                                db:db,
                                db_detail:db_detail,
                                db_detail_sum:db_detail_sum,
                                function_roundOff:props.methods.commonMiscRoundOff
      })
  };
};
export default component;