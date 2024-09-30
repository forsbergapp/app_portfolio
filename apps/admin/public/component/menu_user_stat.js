/**
 * @module apps/admin/component/menu_user_stat
 */
/**
 * Displays stat of users
 * @param {{spinner:string,
 *          records_user_stat:[{identity_provider_id:string, provider_name:string, count_users:number, count_connected:number}]|[],
 *          count_not_connected:number}} props
 */
const template = props => `<div id='menu_2_content_widget1' class='widget'>
                                <div id='list_user_stat_row_title' class='list_user_stat_row'>
                                    <div id='list_user_stat_col_title1' class='list_user_stat_col common_icon'></div>
                                    <div id='list_user_stat_col_title2' class='list_user_stat_col common_icon'></div>
                                    <div id='list_user_stat_col_title3' class='list_user_stat_col common_icon'></div>
                                    <div id='list_user_stat_col_title4' class='list_user_stat_col common_icon'></div>
                                </div>
                                <div id='list_user_stat' class='common_list_scrollbar ${props.spinner}'>
                                    ${props.records_user_stat.map(record=>
                                    `<div class='list_user_stat_row'>
                                        <div class='list_user_stat_col'>${record.identity_provider_id ?? ''}</div>
                                        <div class='list_user_stat_col'>
                                            <div class='${record.provider_name==null?'list_user_start_common_logo':''}'>${record.provider_name==null?'':record.provider_name}</div>
                                        </div>
                                        <div class='list_user_stat_col'>${record.count_users}</div>
                                        <div class='list_user_stat_col'>${record.count_connected}</div>
                                    </div>`).join('')}
                                    <div id='list_user_stat_row_not_connected' class='list_user_stat_row'>
                                        <div class='list_user_stat_col'></div>
                                        <div class='list_user_stat_col'>
                                            <div id='list_user_stat_not_connected_icon' class='common_icon'></div>
                                        </div>
                                        <div class='list_user_stat_col'></div>
                                        <div class='list_user_stat_col'>${props.count_not_connected}</div>
                                    </div>
                                </div>
                            </div>` ;
/**
 * 
 * @param {{ data:{      common_mountdiv:string},
 *           methods:{   common_document:import('../../../common_types.js').CommonAppDocument,
 *                       FFB:import('../../../common_types.js').CommonModuleCommon['FFB']},
 *           lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    /**
     * Count users for given provider and if logged in or not
     * @param {string|null} identity_provider_id 
     * @param {number} logged_in 
     * @returns{Promise.<{count_connected:number}>}
     */
    const get_count = async (identity_provider_id, logged_in) => {
        return props.methods.FFB('/server-socket/socket-stat', 
                                `identity_provider_id=${identity_provider_id}&logged_in=${logged_in}`, 'GET', 'APP_ACCESS', null)
        .then((/**@type{string}*/result)=>JSON.parse(result));
    };
    const onMounted = async () =>{
        /**@type{[{identity_provider_id:string, provider_name:String, count_users:number, count_connected:number}]} */
        const user_stat = await props.methods.FFB('/server-db_admin/user_account-stat', null, 'GET', 'APP_ACCESS', null)
                                .then((/**@type{string}*/result)=>JSON.parse(result).rows);
        //add count stat
        for (const row of user_stat)
            row.count_connected = await get_count(row.identity_provider_id ?? '',1).then(result=>result.count_connected);

        const count_not_connected = await get_count('',0).then(result=>result.count_connected);
        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template({ spinner:'',
                                                                                                records_user_stat:user_stat,
                                                                                                count_not_connected:count_not_connected
                                                                                            });
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({spinner:'css_spinner',
                            records_user_stat:[],
                            count_not_connected:0
        })
    };
};
export default component;