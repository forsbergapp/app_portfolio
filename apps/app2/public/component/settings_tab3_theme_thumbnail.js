/**
 * @module apps/app2/component/settings_tab_nav_7
 */
/**
 * @param {{avatar:string|null}} props
 */
/**
 * @param {{class:string,
 *          theme_id:string
 *          type:'day'|'month'|'year',
 *          html:string}} props
 */
//month position 2, day position 1 year position 1
const template = props => ` <div class='paper ${props.class}'>
                                ${props.html}
                            </div>`;
/**
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      class:string,
 *                      theme_id:string,
 *                      type:'day'|'month'|'year',
 *                      html:string
 *                      },
 *          methods:    {COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {

    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({class:props.data.class, theme_id:props.data.theme_id, type:props.data.type, html:props.data.html})
    };
};
export default method;
