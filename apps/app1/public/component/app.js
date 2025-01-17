/**
 * Displays app
 * @module apps/app3/component/app
 */
/**
 * @import {CommonAppMenu, COMMON_DOCUMENT,CommonModuleCommon,CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{title:string,
 *          app_menu:CommonAppMenu[]
 *          jsdoc_menu:string}} props
 * @returns {string}
 */
const template = props =>`  <div id='menu_open' class='common_icon'></div>
                            <div id='nav'>
                                <div ${props.app_menu[0]?.menu_sub?`href='${props.app_menu[0].menu_sub[0].doc}'`:''} id='title' class='common_link'>${props.title}</div>
                                <div id='menu_close' class='common_dialogue_button common_icon'></div>
                                <div id='nav_content_app'>
                                    ${props.app_menu.map(row=>
                                        `<div class='app_menu_data' data-id='${row.id}' data-type='${row.type}'>
                                            <div class='app_menu common_link'>${row.menu}</div>
                                            <div class='app_submenu'>
                                                ${row.menu_sub?.map(row_sub=>
                                                    `<div class='common_link' href='${row_sub.doc}'>${row_sub.menu}</div>`
                                                    ).join('')
                                                }
                                            </div>
                                        </div>
                                        `
                                    ).join('')}
                                </div>
                                <div id='nav_content_jsdoc'>
                                    <div class='app_menu_data' data-type='JSDOC'>
                                        <div class='app_menu common_link'>JSDOC</div>
                                        <div class='app_submenu'>
                                            ${props.jsdoc_menu}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id='content'></div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const menu = await props.methods.commonFFB({path:'/app-module-function/COMMON_DOC', 
                                                method:'POST', 
                                                authorization_type:'APP_ID', 
                                                body:{type:'MENU', data_app_id:props.data.app_id}})
                .then(result=>JSON.parse(JSON.parse(result).rows))
                .catch(()=>null);
    const menu_jsdoc = await props.methods.commonFFB({path:'/app-module-function/COMMON_DOC', 
                                    method:'POST', 
                                    authorization_type:'APP_ID', 
                                    body:{type:'JSDOC', data_app_id:props.data.app_id, doc:'nav.html'}})
                .catch(()=>null);
    const onMounted =()=>{
        //add common_link to JSDoc generated menu so they will get default hover effect
        Array.from(props.methods.COMMON_DOCUMENT.querySelectorAll('#nav_content_jsdoc .app_submenu .li a')).forEach(element=>element.classList.add('common_link'));
    };
    return {
        lifecycle:  {onMounted},
        data:       null,
        methods:    null,
        template:   template({  title:props.methods.COMMON_DOCUMENT.title,
                                app_menu:menu,
                                jsdoc_menu:menu_jsdoc
        })
    };
};
export default component;