/**
 * Profile stat
 * @module apps/app2/component/profile_stat
 */
/**
 * @import {COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @returns {string}
 */
const template = () =>` <div id='profile_stat_app2'>
                        <div id='profile_stat_row2'>
                            <div id='profile_stat_row2_1' class='common_link common_icon'></div>
                            <div id='profile_stat_row2_2' class='common_link common_icon'></div>
                        </div>
                        </div>`;
/**
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {
    props;
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default method;
