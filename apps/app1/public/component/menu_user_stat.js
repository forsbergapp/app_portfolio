/**
 * Displays stat of users
 * @module apps/app1/component/menu_user_stat
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{records_user_stat:[{count_users:number, count_connected:number}]|[],
 *          count_not_connected:number}} props
 * @returns {string}
 */
const template = props => `<div id='menu_user_stat_content_widget1' class='widget'>
                                <div id='menu_user_stat_row_title' class='menu_user_stat_row'>
                                    <div id='menu_user_stat_col_title1' class='menu_user_stat_col common_icon'></div>
                                    <div id='menu_user_stat_col_title2' class='menu_user_stat_col common_icon'></div>
                                    <div id='menu_user_stat_col_title3' class='menu_user_stat_col common_icon'></div>
                                    <div id='menu_user_stat_col_title4' class='menu_user_stat_col common_icon'></div>
                                </div>
                                <div id='menu_user_stat' class='common_list_scrollbar'>
                                    ${props.records_user_stat.map(record=>
                                        `<div class='menu_user_stat_row'>
                                            <div class='menu_user_stat_col'></div>
                                            <div class='menu_user_stat_col'>
                                                <div class='menu_user_stat_common_logo'></div>
                                            </div>
                                            <div class='menu_user_stat_col'>${record.count_users}</div>
                                            <div class='menu_user_stat_col'>${record.count_connected}</div>
                                        </div>`).join('')
                                    }
                                    <div id='menu_user_stat_row_not_connected' class='menu_user_stat_row'>
                                        <div class='menu_user_stat_col'></div>
                                        <div class='menu_user_stat_col'>
                                            <div id='menu_user_stat_not_connected_icon' class='common_icon'></div>
                                        </div>
                                        <div class='menu_user_stat_col'></div>
                                        <div class='menu_user_stat_col'>${props.count_not_connected}</div>
                                    </div>
                                </div>
                            </div>` ;
/**
 * @name component
 * @description Component
 * @function
 * @param {{ data:{      commonMountdiv:string},
 *           methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonFFB:CommonModuleCommon['commonFFB']},
 *           lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    /**
     * Count users if logged in or not
     * @param {number} logged_in 
     * @returns{Promise.<{count_connected:number}>}
     */
    const get_count = async (logged_in) => {
        return props.methods.commonFFB({path:'/server-socket/socket-stat', query:`logged_in=${logged_in}`, method:'GET', authorization_type:'ADMIN'})
                .then((/**@type{string}*/result)=>JSON.parse(result).rows);
    };
    /**@type{[{count_users:number, count_connected:number}]} */
    const user_stat = await props.methods.commonFFB({path:'/server-db/iamuser-stat', method:'GET', authorization_type:'ADMIN'})
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows);
    //add count stat
    for (const row of user_stat)
    row.count_connected = await get_count(1).then(result=>result.count_connected);

    const count_not_connected = await get_count(0).then(result=>result.count_connected);

    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({  records_user_stat:user_stat,
                                count_not_connected:count_not_connected
        })
    };
};
export default component;