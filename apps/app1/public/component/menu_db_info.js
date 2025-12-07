/**
 * Displays stat of users
 * @module apps/app1/component/menu_db_info
 */

/**
 * @import {common}  from '../../../common_types.js'
 */


/**
 * @name template
 * @description Template
 * @function
 * @param {{size:string,
 *          db:common['server']['ORM']['View']['ORMGetInfo'],
 *          db_detail:common['server']['ORM']['View']['ORMGetObjects'][],
 *          function_seconds_to_time:common['CommonModuleCommon']['commonMiscSecondsToTime'],
 *          function_roundOff:common['CommonModuleCommon']['commonMiscRoundOff']}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_db_info_content_widget1' class='widget'>
                                <div id='menu_db_info1' >
                                    <div id='menu_db_info_name_title' class='common_icon'></div>              <div id='menu_db_info_name_data'>${props.db.DatabaseName}</div>
                                    <div id='menu_db_info_version_title' class='common_icon'></div>           <div id='menu_db_info_version_data'>${props.db.Version}</div>
                                    <div id='menu_db_info_host_title' class='common_icon'></div>              <div id='menu_db_info_host_data'>${props.db.Hostname}</div>
                                    <div id='menu_db_info_connections_title' class='common_icon'></div>       <div id='menu_db_info_connections_data'>${props.db.Connections}</div>
                                    <div id='menu_db_info_started_title' class='common_icon'></div>           <div id='menu_db_info_started_data'>${props.function_seconds_to_time(props.db.Started)}</div>
                                </div>
                            </div>
                            <div id='menu_db_info_content_widget2' class='widget'>
                                <div id='menu_db_info_title' class='common_icon'></div>
                                <div id='menu_db_info_detail' class='common_list_scrollbar'>
                                    <div id='menu_db_info_detail_row_title' class='menu_db_info_detail_row'>
                                        <div class='menu_db_info_detail_col list_title'>NAME</div>
                                        <div class='menu_db_info_detail_col list_title'>TYPE</div>
                                        <div class='menu_db_info_detail_col list_title'>IN MEMORY</div>
                                        <div class='menu_db_info_detail_col list_title'>LOCK</div>
                                        <div class='menu_db_info_detail_col list_title'>TRANSACTION ID</div>
                                        <div class='menu_db_info_detail_col menu_db_info_detail_col_number list_title'>ROWS</div>
                                        <div class='menu_db_info_detail_col menu_db_info_detail_col_number list_title'>SIZE ${props.size}</div>
                                        <div class='menu_db_info_detail_col list_title'>PK</div>
                                        <div class='menu_db_info_detail_col list_title'>UK</div>
                                        <div class='menu_db_info_detail_col list_title'>FK (FK column, ref PK column, ref object)</div>
                                    </div>
                                    ${props.db_detail.map(row=>
                                        `<div class='menu_db_info_detail_row' >
                                            <div class='menu_db_info_detail_col'>${row.Name}</div>
                                            <div class='menu_db_info_detail_col'>${row.Type}</div>
                                            <div class='menu_db_info_detail_col'>${row.InMemory}</div>
                                            <div class='menu_db_info_detail_col'>${row.Lock==null?'':row.Lock}</div>
                                            <div class='menu_db_info_detail_col'>${row.TransactionId==null?'':row.TransactionId}</div>
                                            <div class='menu_db_info_detail_col menu_db_info_detail_col_number'>${row.Rows==null?'':row.Rows}</div>
                                            <div class='menu_db_info_detail_col menu_db_info_detail_col_number'>${row.Size==null?'':props.function_roundOff(row.Size/1024/1024)}</div>
                                            <div class='menu_db_info_detail_col'>${row.Pk==null?'':row.Pk}</div>
                                            <div class='menu_db_info_detail_col'>${row.Uk==null?'':row.Uk.join(', ')}</div>
                                            <div class='menu_db_info_detail_col'>${row.Fk==null?'':row.Fk.map(fk=>{ return `(${fk[0]},${fk[1]},${fk[2]})`;}).join('\n')}</div>
                                        </div>`
                                    ).join('')}
                                    <div id='menu_db_info_detail_row_total' class='menu_db_info_detail_row' >
                                        <div id='menu_db_info_db_sum' class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col menu_db_info_detail_col_number'>${props.function_roundOff(props.db_detail.reduce((total_rows, row)=>total_rows += row.Rows??0,0))}</div>
                                        <div class='menu_db_info_detail_col menu_db_info_detail_col_number'>${props.function_roundOff(props.db_detail.reduce((total_size, row)=>total_size += (row.Size??0)/1024/1024,0))}</div>
                                        <div class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col'></div>
                                        <div class='menu_db_info_detail_col'></div>
                                    </div>
                                </div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{ data:{      commonMountdiv:string},
 *           methods:{   COMMON:common['CommonModuleCommon']},
 *           lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const size = '(Mb)';
    /**
     * @type {common['server']['ORM']['View']['ORMGetInfo']}
     */
    const db = await props.methods.COMMON.commonFFB({path:'/server-db/ORM', method:'GET', authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result).rows[0]);
    /**
     * @type {common['server']['ORM']['View']['ORMGetObjects'][]}
     */
    const db_detail = await props.methods.COMMON.commonFFB({path:'/server-db/ORM-objects', method:'GET', authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result).rows);

  return {
      lifecycle:    null,
      data:         null,
      methods:      null,
      template:     template({  size:size,
                                db:db,
                                db_detail:db_detail,
                                function_seconds_to_time:props.methods.COMMON.commonMiscSecondsToTime,
                                function_roundOff:props.methods.COMMON.commonMiscRoundOff
      })
  };
};
export default component;