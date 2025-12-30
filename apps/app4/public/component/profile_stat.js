/**
 * Profile stat
 * @module apps/app4/component/profile_stat
 */
/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{icons:{ like:string,
 *                  view:string,
 *                  day:string,
 *                  month:string,
 *                  year:string}}} props
 * @returns {string}
 */
const template = props =>` <div id='profile_stat_app2'>
                        <div id='profile_stat_row2'>
                            <div id='profile_stat_row2_1' class='common_link'>${props.icons.like + props.icons.day+ props.icons.month+ props.icons.year}</div>
                            <div id='profile_stat_row2_2' class='common_link'>${props.icons.view + props.icons.day+ props.icons.month+ props.icons.year}</div>
                        </div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON:common['CommonModuleCommon']}}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({icons:{   like:props.methods.COMMON.commonGlobalGet('ICONS')['user_like'],
                                        view:props.methods.COMMON.commonGlobalGet('ICONS')['user_views'],
                                        day:props.methods.COMMON.commonGlobalGet('ICONS')['regional_day'],
                                        month:props.methods.COMMON.commonGlobalGet('ICONS')['regional_month'],
                                        year:props.methods.COMMON.commonGlobalGet('ICONS')['regional_year']}
        })
    };
};
export default component;
