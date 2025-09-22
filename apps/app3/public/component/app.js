/**
 * Displays app
 * @module apps/app3/component/app
 */
/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{title:string,
 *          app_menu:common['CommonAppMenu'][]}} props
 * @returns {string}
 */
const template = props =>`  <div id='app_menu'>
                                <div ${props.app_menu[0]?.menu_sub?`data-href='${props.app_menu[0].menu_sub[0].doc}'`:''} id='app_menu_title' class='common_link'>${props.title}</div>
                                <div id='app_menu_content'>
                                    ${props.app_menu.map(row=>
                                        `<div class='app_menu_data' data-id='${row.id}' data-type='${row.type}'>
                                            <div class='app_menu common_link'>${row.menu}</div>
                                            <div class='app_submenu'>
                                                ${row.menu_sub?.map(row_sub=>
                                                    `<div class='common_link' data-href='${row_sub.doc}'>${row_sub.menu}</div>`
                                                    ).join('')
                                                }
                                            </div>
                                        </div>
                                        `
                                    ).join('')}
                                </div>
                            </div>
                            <div id='app_content'></div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const menu = await props.methods.COMMON.commonFFB({path:'/app-common-module/COMMON_DOC', 
                                                method:'POST', 
                                                authorization_type:'APP_ID', 
                                                body:{type:'FUNCTION',documentType:'MENU', IAM_data_app_id:props.data.app_id}})
                .then(result=>JSON.parse(JSON.parse(result).rows))
                .catch(()=>null);
    const onMounted =()=>{
        //show first menu at start
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#app_menu_title').click();
    };
    return {
        lifecycle:  {onMounted},
        data:       null,
        methods:    null,
        template:   template({  title:props.methods.COMMON.COMMON_DOCUMENT.title,
                                app_menu:menu
        })
    };
};
export default component;