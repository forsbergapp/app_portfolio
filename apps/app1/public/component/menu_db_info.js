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
 *          db:{database_name:string,
 *              version:string,
 *              hostname:string,
 *              connections:string,
 *              started:number},
 *          db_detail:[{    name:string,
 *                          type:string,
 *                          pk:[],
 *                          uk:[],
 *                          lock:number,
 *                          transaction_id:number|null,
 *                          rows:number|null,
 *                          size:number|null}]|[],
 *          function_seconds_to_time:CommonModuleCommon['commonMiscSecondsToTime'],
 *          function_roundOff:CommonModuleCommon['commonMiscRoundOff']}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_db_info_content_widget1' class='widget'>
                                <div id='menu_db_info1' >
                                    <div id='menu_db_info_name_title' class='common_icon'></div>              <div id='menu_db_info_name_data'>${props.db.database_name}</div>
                                    <div id='menu_db_info_version_title' class='common_icon'></div>           <div id='menu_db_info_version_data'>${props.db.version}</div>
                                    <div id='menu_db_info_host_title' class='common_icon'></div>              <div id='menu_db_info_host_data'>${props.db.hostname}</div>
                                    <div id='menu_db_info_connections_title' class='common_icon'></div>       <div id='menu_db_info_connections_data'>${props.db.connections}</div>
                                    <div id='menu_db_info_started_title' class='common_icon'></div>           <div id='menu_db_info_started_data'>${props.function_seconds_to_time(props.db.started)}</div>
                                </div>
                            </div>
                            <div id='menu_db_info_content_widget2' class='widget'>
                                <div id='menu_db_info_title' class='common_icon'></div>
                                <div id='menu_db_info_detail' class='common_list_scrollbar'>
                                    <div id='menu_db_info_detail_row_title' class='menu_db_info_detail_row'>
                                        <div class='menu_db_info_detail_col list_title'>NAME</div>
                                        <div class='menu_db_info_detail_col list_title'>TYPE</div>
                                        <div class='menu_db_info_detail_col list_title'>PK</div>
                                        <div class='menu_db_info_detail_col list_title'>UK</div>
                                        <div class='menu_db_info_detail_col list_title'>LOCK</div>
                                        <div class='menu_db_info_detail_col list_title'>TRANSACTION_ID</div>
                                        <div class='menu_db_info_detail_col menu_db_info_detail_col_number list_title'>ROWS</div>
                                        <div class='menu_db_info_detail_col menu_db_info_detail_col_number list_title'>SIZE ${props.size}</div>
                                    </div>
                                    ${props.db_detail.map(row=>
                                        `<div class='menu_db_info_detail_row' >
                                            <div class='menu_db_info_detail_col'>${row.name}</div>
                                            <div class='menu_db_info_detail_col'>${row.type}</div>
                                            <div class='menu_db_info_detail_col'>${row.pk==null?'':row.pk}</div>
                                            <div class='menu_db_info_detail_col'>${row.uk==null?'':row.uk.join(',')}</div>
                                            <div class='menu_db_info_detail_col'>${row.lock==null?'':row.lock}</div>
                                            <div class='menu_db_info_detail_col'>${row.transaction_id==null?'':row.transaction_id}</div>
                                            <div class='menu_db_info_detail_col menu_db_info_detail_col_number'>${row.rows==null?'':row.rows}</div>
                                            <div class='menu_db_info_detail_col menu_db_info_detail_col_number'>${row.size==null?'':props.function_roundOff(row.size/1024/1024)}</div>
                                            
                                        </div>`
                                    ).join('')}
                                    <div id='menu_db_info_detail_row_total' class='menu_db_info_detail_row' >
                                        <div id='menu_db_info_db_sum' class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col menu_db_info_detail_col_number'>${props.function_roundOff(props.db_detail.reduce((total_rows, row)=>total_rows += row.rows??0,0))}</div>
                                        <div class='menu_db_info_detail_col menu_db_info_detail_col_number'>${props.function_roundOff(props.db_detail.reduce((total_size, row)=>total_size += (row.size??0)/1024/1024,0))}</div>
                                    </div>
                                </div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{ data:{      commonMountdiv:string},
 *           methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonMiscSecondsToTime:CommonModuleCommon['commonMiscSecondsToTime'],
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
     * @type {{ database_name:string,
     *          version:string,
     *          hostname:string,
     *          connections:string,
     *          started:number}}
     */
    const db = await props.methods.commonFFB({path:'/server-db/database', method:'GET', authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result).rows[0]);
    const db_detail = await props.methods.commonFFB({path:'/server-db/database-objects', method:'GET', authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result).rows);

  return {
      lifecycle:    null,
      data:         null,
      methods:      null,
      template:     template({  size:size,
                                db:db,
                                db_detail:db_detail,
                                function_seconds_to_time:props.methods.commonMiscSecondsToTime,
                                function_roundOff:props.methods.commonMiscRoundOff
      })
  };
};
export default component;