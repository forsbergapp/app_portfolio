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
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          class:string,
 *          theme_id:string,
 *          type:'day'|'month'|'year',
 *          html:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {

    return {
        props:  {function_post:null},
        data:   null,
        template: template({class:props.class, theme_id:props.theme_id, type:props.type, html:props.html})
    };
};
export default method;
