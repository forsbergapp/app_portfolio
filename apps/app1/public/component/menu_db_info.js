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
 *          function_roundOff:common['CommonModuleCommon']['commonMiscRoundOff'],
 *          icons:{
 *                  database_title:string,
 *                  name_title:string,
 *                  version_title:string,
 *                  host_title:string,
 *                  connections_title:string,
 *                  started_title:string,
 *                  title:string,
 *                  db_sum:string
 *              }}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_db_info_content_widget1' class='widget'>
                                <div id='menu_db_info1' >
                                    <div id='menu_db_info_name_title' >         ${props.icons.name_title}</div>              <div id='menu_db_info_name_data'>${props.db.DatabaseName}</div>
                                    <div id='menu_db_info_version_title' >      ${props.icons.version_title}</div>           <div id='menu_db_info_version_data'>${props.db.Version}</div>
                                    <div id='menu_db_info_host_title' >         ${props.icons.host_title}</div>              <div id='menu_db_info_host_data'>${props.db.Hostname}</div>
                                    <div id='menu_db_info_connections_title'>   ${props.icons.connections_title}</div>       <div id='menu_db_info_connections_data'>${props.db.Connections}</div>
                                    <div id='menu_db_info_started_title' >      ${props.icons.started_title}</div>           <div id='menu_db_info_started_data'>${props.function_seconds_to_time(props.db.Started)}</div>
                                </div>
                            </div>
                            <div id='menu_db_info_content_widget2' class='widget'>
                                <div id='menu_db_info_title' >${props.icons.title}</div>
                                <div id='menu_db_info_detail' class='common_list_scrollbar'>
                                    <div id='menu_db_info_detail_row_title' class='menu_db_info_detail_row row_title'>
                                        <div class='menu_db_info_detail_col'>NAME</div>
                                        <div class='menu_db_info_detail_col'>TYPE</div>
                                        <div class='menu_db_info_detail_col'>IN MEMORY</div>
                                        <div class='menu_db_info_detail_col'>LOCK</div>
                                        <div class='menu_db_info_detail_col'>TRANSACTION ID</div>
                                        <div class='menu_db_info_detail_col menu_db_info_detail_col_number'>ROWS</div>
                                        <div class='menu_db_info_detail_col menu_db_info_detail_col_number'>SIZE ${props.size}</div>
                                        <div class='menu_db_info_detail_col'>PK</div>
                                        <div class='menu_db_info_detail_col'>UK</div>
                                        <div class='menu_db_info_detail_col'>FK (FK column, ref PK column, ref object)</div>
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
                                        <div id='menu_db_info_db_sum' class='menu_db_info_detail_col'>${props.icons.db_sum}</div>
                                        <div class='menu_db_info_detail_col'></div>
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
                                function_roundOff:props.methods.COMMON.commonMiscRoundOff,
                                icons:{
                                        database_title:props.methods.COMMON.commonGlobalGet('ICONS').database+props.methods.COMMON.commonGlobalGet('ICONS').regional_numbersystem,
                                        name_title:props.methods.COMMON.commonGlobalGet('ICONS').database,
                                        version_title:props.methods.COMMON.commonGlobalGet('ICONS').database+props.methods.COMMON.commonGlobalGet('ICONS').regional_numbersystem+props.methods.COMMON.commonGlobalGet('ICONS').info,
                                        host_title:props.methods.COMMON.commonGlobalGet('ICONS').server,
                                        connections_title:props.methods.COMMON.commonGlobalGet('ICONS').user_connections,
                                        started_title:props.methods.COMMON.commonGlobalGet('ICONS').database_started,
                                        title:props.methods.COMMON.commonGlobalGet('ICONS').database+props.methods.COMMON.commonGlobalGet('ICONS').database_stat,
                                        db_sum:props.methods.COMMON.commonGlobalGet('ICONS').sum
                                    }
                            })
  };
};
export default component;