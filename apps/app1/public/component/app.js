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
                                <div ${props.app_menu[0]?.menu_sub?`href='${props.app_menu[0].menu_sub[0].menu_url}'`:''} id='title' class='title_h1'>App Portfolio</div>
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
                                <link type="text/css" rel="stylesheet" href="/common/modules/jsdoc/prettify-tomorrow.css">
                                <link type="text/css" rel="stylesheet" href="/common/modules/jsdoc/jsdoc-default.css">
                                <div id='nav_content_jsdoc'>${props.jsdoc_menu}</div>
                            </div>
                            <div id='content_title'></div>
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
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({  app_menu:await fetch('/js/menu.json').then(result=>result.json()),
                                jsdoc_menu:await fetch('/info/doc/nav.html').then(result=>result.text())
        })
    };
};
export default component;