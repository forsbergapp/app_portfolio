/**
 * @module apps/app2/component/profile_stat
 */

const template = () =>` <div id='profile_stat_app2'>
                        <div id='profile_stat_row2'>
                            <div id='profile_stat_row2_1' class='common_link common_icon'></div>
                            <div id='profile_stat_row2_2' class='common_link common_icon'></div>
                        </div>
                        </div>`;
/**
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
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
