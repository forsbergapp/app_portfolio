/**
 * Profile stat
 * @module apps/app4/component/profile_stat
 */
/**
 * @import {COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () =>` <div id='profile_stat_app2'>
                        <div id='profile_stat_row2'>
                            <div id='profile_stat_row2_1' class='common_link common_icon'></div>
                            <div id='profile_stat_row2_2' class='common_link common_icon'></div>
                        </div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
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
        template:   template()
    };
};
export default component;
