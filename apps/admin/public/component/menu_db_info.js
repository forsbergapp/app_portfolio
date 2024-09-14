/**
 * @module apps/admin/component/menu_db_info
 */
/**
 * Displays stat of users
 * @param {{spinner:string,
 *          size:string,
 *          db:{database_use:string, 
 *              database_name:string,
 *              version:string,
 *              database_schema:string,
 *              hostname:string,
 *              connections:string,
 *              started:string},
 *          db_detail:[{table_name:string,
 *                      total_size: number,
 *                      data_used:string,
 *                      data_free:string,
 *                      pct_used:string}]|[],
 *          db_detail_sum:{ table_name:string,
 *                          total_size: number,
 *                          data_used:string,
 *                          data_free:string,
 *                          pct_used:string},
 *          function_roundOff:function}} props
 */
const template = props => ` <div id='menu_8_content_widget1' class='widget'>
                                <div id='menu_8_db_info1' class='${props.spinner}'>
                                    ${props.spinner?'':
                                        `<div id='menu_8_db_info_database_title' class='common_icon'></div>          <div id='menu_8_db_info_database_data'>${props.db.database_use}</div>
                                        <div id='menu_8_db_info_name_title' class='common_icon'></div>              <div id='menu_8_db_info_name_data'>${props.db.database_name}</div>
                                        <div id='menu_8_db_info_version_title' class='common_icon'></div>           <div id='menu_8_db_info_version_data'>${props.db.version}</div>
                                        <div id='menu_8_db_info_database_schema_title' class='common_icon'></div>   <div id='menu_8_db_info_database_schema_data'>${props.db.database_schema}</div>
                                        <div id='menu_8_db_info_host_title' class='common_icon'></div>              <div id='menu_8_db_info_host_data'>${props.db.hostname}</div>
                                        <div id='menu_8_db_info_connections_title' class='common_icon'></div>       <div id='menu_8_db_info_connections_data'>${props.db.connections}</div>
                                        <div id='menu_8_db_info_started_title' class='common_icon'></div>           <div id='menu_8_db_info_started_data'>${props.db.started}</div>`
                                    }
                                </div>
                            </div>
                            <div id='menu_8_content_widget2' class='widget'>
                                <div id='menu_8_db_info_space_title' class='common_icon'></div>
                                <div id='menu_8_db_info_space_detail' class='common_list_scrollbar ${props.spinner}'>
                                    <div id='menu_8_db_info_space_detail_row_title' class='menu_8_db_info_space_detail_row'>
                                        <div id='menu_8_db_info_space_detail_col_title1' class='menu_8_db_info_space_detail_col list_title'>TABLE NAME</div>
                                        <div id='menu_8_db_info_space_detail_col_title2' class='menu_8_db_info_space_detail_col list_title'>SIZE ${props.size}</div>
                                        <div id='menu_8_db_info_space_detail_col_title3' class='menu_8_db_info_space_detail_col list_title'>DATA USED ${props.size}</div>
                                        <div id='menu_8_db_info_space_detail_col_title4' class='menu_8_db_info_space_detail_col list_title'>DATA FREE ${props.size}</div>
                                        <div id='menu_8_db_info_space_detail_col_title5' class='menu_8_db_info_space_detail_col list_title'>% USED</div>
                                    </div>
                                    ${props.db_detail.map(row=>
                                        `<div class='menu_8_db_info_space_detail_row' >
                                            <div class='menu_8_db_info_space_detail_col'>${row.table_name}</div>
                                            <div class='menu_8_db_info_space_detail_col'>${props.function_roundOff(row.total_size)}</div>
                                            <div class='menu_8_db_info_space_detail_col'>${props.function_roundOff(row.data_used)}</div>
                                            <div class='menu_8_db_info_space_detail_col'>${props.function_roundOff(row.data_free)}</div>
                                            <div class='menu_8_db_info_space_detail_col'>${props.function_roundOff(row.pct_used)}</div>
                                        </div>`
                                    ).join('')}
                                    <div id='menu_8_db_info_space_detail_row_total' class='menu_8_db_info_space_detail_row' >
                                        <div id='menu_8_info_space_db_sum' class='menu_8_db_info_space_detail_col'></div>
                                        <div class='menu_8_db_info_space_detail_col'>${props.function_roundOff(props.db_detail_sum.total_size)}</div>
                                        <div class='menu_8_db_info_space_detail_col'>${props.function_roundOff(props.db_detail_sum.data_used)}</div>
                                        <div class='menu_8_db_info_space_detail_col'>${props.function_roundOff(props.db_detail_sum.data_free)}</div>
                                        <div class='menu_8_db_info_space_detail_col'>${props.function_roundOff(props.db_detail_sum.pct_used)}</div>
                                    </div>
                                </div>
                            </div>`;
/**
* 
* @param {{common_document:import('../../../common_types.js').CommonAppDocument,
*          common_mountdiv:string,
*          function_roundOff:function,
*          function_FFB:function}} props 
* @returns {Promise.<{ props:{function_post:function}, 
*                      data:null, 
*                      template:string}>}
*/
const component = async props => {
    const size = '(Mb)';
    const post_component = async () =>{
        /**
         * @type {{ database_use:string,
         *          database_name:string,
         *          version:string,
         *          database_schema:string,
         *          hostname:string,
         *          connections:string,
         *          started:string}}
         */
        const db = await props.function_FFB('/server-db_admin/database', null, 'GET', 'SYSTEMADMIN', null).then((/**@type{string}*/result)=>JSON.parse(result)[0]);
        const db_detail = await props.function_FFB('/server-db_admin/database-space', null, 'GET', 'SYSTEMADMIN', null).then((/**@type{string}*/result)=>JSON.parse(result).rows);
        const db_detail_sum = await props.function_FFB('/server-db_admin/database-spacesum', null, 'GET', 'SYSTEMADMIN', null).then((/**@type{string}*/result)=>JSON.parse(result)[0]);
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({  spinner:'',
                                                                                                        size:size,
                                                                                                        db:db,
                                                                                                        db_detail:db_detail,
                                                                                                        db_detail_sum:db_detail_sum,
                                                                                                        function_roundOff:props.function_roundOff
                                                                                                    });
  };
  /**
   * @param {{spinner:string,
   *          size:string,
   *          db:{  database_use:string,
   *                database_name:string,
   *                version:string,
   *                database_schema:string,
   *                hostname:string,
   *                connections:string,
   *                started:string},
   *          db_detail:[{table_name:string,
   *                      total_size: number,
   *                      data_used:string,
   *                      data_free:string,
   *                      pct_used:string}]|[],
   *          db_detail_sum:{ table_name:string,
   *                          total_size: number,
   *                          data_used:string,
   *                          data_free:string,
   *                          pct_used:string},
   *          function_roundOff:function}} template_props
   */
  const render_template = template_props =>{
      return template({   spinner:template_props.spinner,
                          size:template_props.size,
                          db:template_props.db,
                          db_detail:template_props.db_detail,
                          db_detail_sum:template_props.db_detail_sum,
                          function_roundOff:props.function_roundOff
      });
  };
  return {
      props:  {function_post:post_component},
      data:   null,
      template: render_template({ spinner:'css_spinner',
                                  size:size,
                                  db:{  database_use:'',
                                        database_name:'',
                                        version:'',
                                        database_schema:'',
                                        hostname:'',
                                        connections:'',
                                        started:''},
                                  db_detail:[],
                                  db_detail_sum:{   table_name:'',
                                                    total_size: 0,
                                                    data_used:'',
                                                    data_free:'',
                                                    pct_used:''},
                                  function_roundOff:props.function_roundOff
      })
  };
};
export default component;