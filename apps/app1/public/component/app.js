/**
 * Displays app
 * @module apps/app3/component/app
 */
/**
 * @import {CommonAppMenu, COMMON_DOCUMENT,CommonModuleCommon,CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 */
/**
 * @param {{title:string,
 *          app_menu:CommonAppMenu[]
 *          jsdoc_menu:string}} props
 * @returns {string}
 */
const template = props =>`  <div id='menu_open' class='common_icon'></div>
                            <div id='nav'>
                                <div ${props.app_menu[0]?.menu_sub?`href='${props.app_menu[0].menu_sub[0].doc}'`:''} id='title' >${props.title}</div>
                                <div id='menu_close' class='common_dialogue_button common_icon'></div>
                                <div id='nav_content_app'>
                                    ${props.app_menu.map(row=>
                                        `<div data-id='${row.id}' data-type='${row.type}'>
                                            <div >${row.menu}</div>
                                            ${row.menu_sub?.map(row_sub=>
                                                `<div class='common_link' href='${row_sub.doc}'>${row_sub.menu}</div>`
                                                ).join('')}
                                        </div>

                                        `
                                    ).join('')}
                                </div>
                                <div id='nav_content_jsdoc'>
                                    <div id>JSDoc</div>
                                    ${props.jsdoc_menu}
                                </div>
                            </div>
                            <div id='content'></div>`;
/**
 * 
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonFFB:commonFFB
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const menu = await props.methods.commonFFB({path:'/app-module-function/COMMON_DOC', 
                                                method:'POST', 
                                                authorization_type:'APP_DATA', 
                                                body:{type:'MENU', data_app_id:props.data.app_id}})
                .then(result=>JSON.parse(JSON.parse(result).rows))
                .catch(()=>null);
    const menu_jsdoc = await props.methods.commonFFB({path:'/app-module-function/COMMON_DOC', 
                                    method:'POST', 
                                    authorization_type:'APP_DATA', 
                                    body:{type:'JSDOC', data_app_id:props.data.app_id, doc:'nav.html'}})
                .then(result=>JSON.parse(result).rows[0])
                .catch(()=>null);
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({  title:props.methods.COMMON_DOCUMENT.title,
                                app_menu:menu,
                                jsdoc_menu:menu_jsdoc
        })
    };
};
export default component;