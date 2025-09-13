/**
 * Settings tab 3 thumbnail
 * @module apps/app4/component/settings_tab_nav_7
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @param {{class:string,
 *          theme_id:string
 *          type:'day'|'month'|'year',
 *          html:string}} props
 * @returns {string}
 */
const template = props => ` <div class='paper ${props.class}'>
                                ${props.html}
                            </div>`;
/**
 * @name component
 * @description Component
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      class:string,
 *                      theme_id:string,
 *                      type:'day'|'month'|'year',
 *                      html:string
 *                      },
 *          methods:    {COMMON:common['CommonModuleCommon']}}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {

    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({class:props.data.class, theme_id:props.data.theme_id, type:props.data.type, html:props.data.html})
    };
};
export default component;
