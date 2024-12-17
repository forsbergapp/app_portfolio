/**
 * Displays app
 * @module apps/app3/component/app
 */
/**
 * @import {COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @import {appMenu}  from '../js/types.js'
 */
/**
 * @param {{app_menu:appMenu[]
 *          jsdoc_menu:string}} props
 * @returns {string}
 */
const template = props =>`  <div id='menu_open' class='common_icon'></div>
                            <div id='nav'>
                                <div ${props.app_menu[0]?.menu_sub?`href='${props.app_menu[0].menu_sub[0].menu_url}'`:''} id='title' >App Portfolio</div>
                                <div id='menu_close' class='common_icon'></div>
                                <div id='nav_content_app'>
                                    ${props.app_menu.map(row=>
                                        `<div>${row.menu}</div>
                                        ${row.menu_sub?.map(row_sub=>
                                            `<div class='common_link' href='${row_sub.menu_url}'>${row_sub.menu}</div>`
                                        ).join('')}
                                        `
                                    ).join('')}
                                </div>
                                <div id='nav_content_jsdoc'>${props.jsdoc_menu}</div>
                            </div>
                            <div id='content'></div>`;
/**
 * 
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    /**@type{appMenu[]} */
    const markdown_menu_docs = await fetch('/js/menu.json').then(result=>result.json());
    try {
        for (const menu of markdown_menu_docs){
            for (const menu_sub of menu.menu_sub??[]){
                const response = await fetch(menu_sub.menu_url);    
                if (response.ok){
                    try {
                        menu_sub.menu =  (await response.text().then(result=>result.replaceAll('\r\n', '\n').split('\n').filter(row=>row.indexOf('#')==0)[0])).split('#')[1];
                    } catch (error) {
                        null;
                    }
                }
                else
                    menu_sub.menu = '';
            }
        }
        
    } catch (error) {
        null;
    }
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({  app_menu:markdown_menu_docs,
                                jsdoc_menu:await fetch('/info/doc/nav.html').then(result=>result.text())
        })
    };
};
export default component;